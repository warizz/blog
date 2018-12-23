import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import SEO from '../components/seo';

export default function NotFoundPage(props) {
  return (
    <Layout location={props.location}>
      <SEO title="404: Not Found" />
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
}

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};
