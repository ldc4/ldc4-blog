import React from 'react'
import { Link, graphql } from 'gatsby'
import _ from 'lodash'
import dayjs from 'dayjs'
import qs from 'qs'
import commonUtils from '../utils/common'

import Layout from '../components/Layout/Layout'
import Pagination from '../components/Pagination'
import { Row, Col } from '../components/Grids'
import SEO from '../components/SEO/seo'
import './index.less'

class BlogIndex extends React.Component {
  render() {
    const { data = {}, location = {} } = this.props;

    const { site = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '', search = '' } = location;

    const { siteMetadata } = site;
    const { edges: posts = [] } = allMarkdownRemark;
    const { edges: navs = [] } = allNavigationJson;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    // 计算出真实渲染的文章
    const publishPosts = _.filter(posts, p => !_.get(p, "node.frontmatter.draft"));
    const renderPosts = process.env.NODE_ENV !== 'production' ? posts : publishPosts;

    // 获取分页信息
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    const currentPage = !isNaN(query.page) ? Number(query.page) : 1;
    const pageLimit = 10; // 默认10篇一页，暂不允许自定义设置
    const pageCount = renderPosts.length;
    const pageNum = Math.ceil(pageCount / pageLimit);
    const renderPagePosts = renderPosts.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="fragment-list page-content">
          {renderPagePosts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug;
            const date = dayjs(node.frontmatter.date).format('YYYY-MM-DD');
            const tags = node.frontmatter.tags || [];
            const category = node.frontmatter.category;
            return (
              <div className="fragment" key={node.fields.slug}>
                <div className="title">
                  <Link to={`/pages/${commonUtils.getHash(node.fields.slug)}`}>
                    {title}
                  </Link>
                  {node.frontmatter.draft && <span>(草稿)</span>}
                </div>
                <div className="content">
                  <Row>
                    <Col span={4}>
                      <div className="date-and-category">
                        <div className="date">{date}</div>
                        <div className="category">
                          <Link to={`/cats/${category ? commonUtils.getHash(category) : 'uncat'}/`}>{category || '未分类'}</Link>
                        </div>
                      </div>
                    </Col>
                    <Col span={14}>
                      <div className="excerpt" dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                    </Col>
                    <Col span={6}>
                      <div className="tags">
                        {tags.map((tag, index) => {
                          return (
                            <div className="tag-item" key={`${tag}-${index}`}>
                              <Link to={`/tags/${commonUtils.getHash(tag)}/`}>{tag}</Link>
                            </div>
                          )
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )
          })}
          <Pagination
            currentPage={currentPage}
            pageNum={pageNum}
            prevLink={`/?page=${currentPage - 1}`}
            nextLink={`/?page=${currentPage + 1}`}
          />
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(format: HTML)
          fields {
            slug
          }
          frontmatter {
            date
            title
            tags
            category
            draft
          }
        }
      }
    }
    allNavigationJson {
      edges {
        node {
          name
          link
        }
      }
    }
  }
`
