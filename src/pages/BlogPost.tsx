import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { blogPosts } from '../data/blogPosts';

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const { t } = useTranslation();

  if (!post) {
    return (
      <ContentLayout
        title="Post Not Found | BattleGuess"
        description="The requested blog post could not be found."
        canonical="https://battleguess.app/blog"
      >
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">
            {t('pages.blog.postNotFound')}
          </h1>
          <p className="text-slate-500 mb-6">
            {t('pages.blog.postNotFoundDesc')}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            &larr; {t('pages.blog.backToBlog')}
          </Link>
        </div>
      </ContentLayout>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BattleGuess',
      url: 'https://battleguess.app',
    },
  };

  return (
    <ContentLayout
      title={`${post.title} | BattleGuess`}
      description={post.description}
      canonical={`https://battleguess.app/blog/${post.slug}`}
      jsonLd={jsonLd}
    >
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-primary-600 text-sm font-medium transition-colors"
        >
          &larr; {t('pages.blog.backToBlog')}
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm">
          <span>{formattedDate}</span>
          <span className="text-slate-300">&middot;</span>
          <span>{post.author}</span>
          <span className="text-slate-300">&middot;</span>
          <span>{post.readTime}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.header>

      {/* Article Content */}
      <article className="space-y-8">
        {post.sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-3">
              {section.heading}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {section.content}
            </p>
          </motion.section>
        ))}
      </article>
    </ContentLayout>
  );
}

export default BlogPost;
