import React from 'react'

import SEO from '../components/SEO/seo'

class NotFoundPage extends React.Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <SEO title="404: Not Found" />
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    )
  }
}

export default NotFoundPage