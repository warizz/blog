const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve(`./src/templates/blog-post.js`);
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
                    lang
                  }
                }
              }
            }
          }
        `,
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach((post, index) => {
          let previous = null;
          let prevPostIndex = index + 1;
          if (!posts.length - 1 && prevPostIndex !== posts.length) {
            while (!previous) {
              const _post = posts[prevPostIndex].node;
              if (
                !_post.frontmatter
                  .lang /* empty means default, only default lang display on listing page */
              ) {
                previous = _post;
              } else {
                prevPostIndex += 1;
              }
            }
          }

          let next = null;
          let nextPostIndex = index - 1;
          if (index !== 0) {
            while (!next) {
              const _post = posts[nextPostIndex].node;
              if (
                !_post.frontmatter
                  .lang /* empty means default, only default lang display on listing page */
              ) {
                next = _post;
              } else {
                nextPostIndex -= 1;
              }
            }
          }

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          });
        });
      }),
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
