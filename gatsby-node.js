const path = require('path')
const _ = require('lodash')
const md5 = require('crypto-js/md5')

const { createFilePath } = require('gatsby-source-filesystem')

const getHash = (str) => {
  return md5(str);
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogList = path.resolve('./src/templates/blog-list.js');
  const blogPost = path.resolve('./src/templates/blog-post.js');
  const tagsTemplate = path.resolve('./src/templates/tags.js');
  const catsTemplate = path.resolve('./src/templates/cats.js');

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
                category
                draft
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    console.log(result.errors);
    reject(result.errors);
  }

  // 获取所有文章
  const posts = result.data.allMarkdownRemark.edges;
  // 过滤掉草稿文章
  const publishPosts = _.filter(posts, p => !_.get(p, "node.frontmatter.draft"));
  // 真正渲染的文章（开发环境需要用来预览草稿）
  const renderPosts = process.env.NODE_ENV !== 'production' ? posts : publishPosts;

  // 创建博客列表页面（进行分页）
  const pageLimit = 10; // 只能预设，无法动态改变
  const pageNum = Math.ceil(renderPosts.length / pageLimit);
  Array.from({ length: pageNum }).forEach((_, index) => {
    createPage({
      path: `/list/${index + 1}`,
      component: blogList,
      context: {
        currentPage: index + 1,
        pageNum,
        limit: pageLimit,
        skip: index * pageLimit,
      },
    });
  });

  // 创建博客文章页面
  renderPosts.forEach((post, index) => {
    const previous = index === renderPosts.length - 1 ? null : renderPosts[index + 1].node;
    const next = index === 0 ? null : renderPosts[index - 1].node;
    createPage({
      path: `/pages/${getHash(post.node.fields.slug)}`,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });

  // 创建Tags页面
  let tags = [];
  renderPosts.forEach(edge => {
    if (_.get(edge, "node.frontmatter.tags")) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  tags = _.uniq(tags);
  tags.forEach(tag => {
    createPage({
      path: `/tags/${getHash(tag)}/`,
      component: tagsTemplate,
      context: {
        tag,
      },
    })
  });
  // 创建未标记的页面
  createPage({
    path: `/tags/untag/`,
    component: tagsTemplate,
    context: {
      tag: '',
    },
  })

  // 创建Cats页面
  let cats = [];
  renderPosts.forEach(edge => {
    if (_.get(edge, "node.frontmatter.category")) {
      cats.push(edge.node.frontmatter.category);
    }
  });
  cats = _.uniq(cats);
  cats.forEach(cat => {
    createPage({
      path: `/cats/${getHash(cat)}/`,
      component: catsTemplate,
      context: {
        cat,
      },
    })
  });
  // 创建未分类的页面
  createPage({
    path: `/cats/uncat/`,
    component: catsTemplate,
    context: {
      cat: '',
    },
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
