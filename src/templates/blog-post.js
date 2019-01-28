import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import { rhythm, scale } from '../utils/typography';

const LANG_MAP = {
  en: 'English',
  th: 'ภาษาไทย',
};

export default function BlogPostTemplate(props) {
  const post = props.data.markdownRemark;
  const siteTitle = props.data.site.siteMetadata.title;
  const { previous, next } = props.pageContext;
  const lang = post.frontmatter.lang || 'en';
  const langs =
    (post.frontmatter.langs &&
      post.frontmatter.langs.filter(l => l !== lang)) ||
    [];

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.excerpt} />

      <h1 style={{ color: '#B71C1C' }}>{post.frontmatter.title}</h1>

      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.frontmatter.date}
      </p>

      {langs.length > 0 && (
        <p>
          <i>
            This article is available in&nbsp;
            {langs.map(l => {
              let url = post.fields.slug;
              if (lang === 'en') {
                url += l + '/';
              } else {
                url = url.match(/^\/.*?\//).pop();
              }
              return (
                <a key={l} href={url}>
                  {LANG_MAP[l]}
                </a>
              );
            })}
            {'.'}
          </i>
        </p>
      )}

      <div dangerouslySetInnerHTML={{ __html: post.html }} />

      <div className="share-buttons">
        <span>Share</span>

        <TwitterShareButton
          title={post.frontmatter.title}
          url={props.location.href}
        >
          <TwitterIcon size={30} round />
        </TwitterShareButton>

        <FacebookShareButton
          quote={post.frontmatter.title}
          url={props.location.href}
        >
          <FacebookIcon size={30} round />
        </FacebookShareButton>
      </div>

      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />

      <Bio />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  );
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      fields {
        slug
      }
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        lang
        langs
      }
    }
  }
`;
