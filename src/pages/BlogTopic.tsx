import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { blogPosts, blogCategories } from '../data/blogPosts';
import type { BlogCategory } from '../data/blogPosts';

function BlogTopic() {
  const { topicId } = useParams<{ topicId: string }>();
  const { t } = useTranslation();

  const category = blogCategories.find(c => c.id === topicId);

  const posts = useMemo(() => {
    if (!topicId) return [];
    return blogPosts.filter(p => p.category === (topicId as BlogCategory));
  }, [topicId]);

  if (!category || posts.length === 0) {
    return (
      <ContentLayout
        title="Topic Not Found | BattleGuess"
        description="The requested blog topic could not be found."
        canonical="https://battleguess.app/blog"
      >
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Topic Not Found</h1>
          <p className="text-slate-500 mb-6">
            The blog topic you are looking for does not exist.
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.title} | BattleGuess Blog`,
    description: category.description,
    url: `https://battleguess.app/blog/topics/${topicId}`,
    hasPart: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://battleguess.app/blog/${post.slug}`,
    })),
  };

  // Other categories for cross-linking
  const otherCategories = blogCategories.filter(c => c.id !== topicId);

  return (
    <ContentLayout
      title={`${category.title} | BattleGuess Blog`}
      description={category.description}
      canonical={`https://battleguess.app/blog/topics/${topicId}`}
      jsonLd={jsonLd}
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-2 text-sm"
      >
        <Link
          to="/blog"
          className="text-slate-500 hover:text-primary-600 font-medium transition-colors"
        >
          {t('pages.blog.backToBlog')}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">{category.title}</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
              {category.title}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {posts.length} articles
            </p>
          </div>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
          {category.description}
        </p>
      </motion.div>

      {/* Posts */}
      <div className="space-y-4 max-w-3xl">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
            >
              {post.image && (
                <div className="hidden sm:block flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors mb-1 leading-snug">
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{post.readTime}</span>
                  <span>&middot;</span>
                  <span>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Other Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4">Explore More Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {otherCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/blog/topics/${cat.id}`}
              className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors text-sm">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-xs">
                  {blogPosts.filter(p => p.category === cat.id).length} articles
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-10"
      >
        <div className="bg-gradient-to-br from-primary-50 to-emerald-100/50 rounded-2xl p-8 border border-primary-200/50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Ready to test your knowledge?
          </h2>
          <p className="text-slate-600 mb-5">
            Identify famous battles from AI-generated artwork across 8 historical eras.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary-200 hover:shadow-lg hover:shadow-primary-200 transition-all duration-200"
          >
            Play BattleGuess
          </Link>
        </div>
      </motion.div>
    </ContentLayout>
  );
}

export default BlogTopic;
