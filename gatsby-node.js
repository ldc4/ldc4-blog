const path = require('path')
const _ = require('lodash')
const sha256 = require('crypto-js/sha256')

const { createFilePath } = require('gatsby-source-filesystem')

const getHash = (str) => {
  return sha256(str);
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {

    const blogPost = path.resolve('./src/templates/blog-post.js');
    const tagsTemplate = path.resolve('./src/templates/tags.js');
    const catsTemplate = path.resolve('./src/templates/cats.js');

    resolve(
      graphql(
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
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // 创建博客文章页面
        const posts = result.data.allMarkdownRemark.edges;
        posts.forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;
          const isDraft = _.get(post, "node.frontmatter.draft") ? post.node.frontmatter.draft : false;
          if (process.env.NODE_ENV !== 'production' || !isDraft) {
            createPage({
              path: `/pages/${getHash(post.node.fields.slug)}`,
              component: blogPost,
              context: {
                slug: post.node.fields.slug,
                previous,
                next,
              },
            });
          }
        });

        // 创建Tags页面
        let tags = [];
        posts.forEach(edge => {
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
        posts.forEach(edge => {
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

      })
    )
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
