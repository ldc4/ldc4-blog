import React from 'react';
import { Link } from 'gatsby'
import './index.less';

class Pagination extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { currentPage, pageNum, prevLink, nextLink } = this.props;
    return (
      <div className="pagination">
        <div>
          {currentPage - 1 > 0 && (
            <Link
              to={prevLink}
              rel="prev"
            >
              上一页
            </Link>
          )}
        </div>
        <div>
          {currentPage + 1 <= pageNum && (
            <Link
              to={nextLink}
              rel="next"
            >
              下一页
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default Pagination;
