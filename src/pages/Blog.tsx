import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { blogPosts, blogCategories } from '../data/blogPosts';

function Blog() {
  const { t } = useTranslation();

  return (
    <ContentLayout
      title="Blog | BattleGuess"
      description="History insights, game guides, and behind-the-scenes articles from the BattleGuess team."
      canonical="https://battleguess.app/blog"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          {t('pages.blog.title')}
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          {t('pages.blog.subtitle')}
        </p>
      </motion.div>

      {/* Topic Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        {blogCategories.map(cat => (
          <Link
            key={cat.id}
            to={`/blog/topics/${cat.id}`}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700 border border-slate-200 transition-all duration-200"
          >
            {cat.icon} {cat.title}
          </Link>
        ))}
      </motion.div>

      {/* Post List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.04 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
            >
              {post.image && (
                <div className="hidden sm:block flex-shrink-0 w-36 h-24 rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <h2 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <span className="flex-shrink-0 text-slate-400 text-sm whitespace-nowrap">
                    {post.readTime}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mb-2 leading-relaxed line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-xs">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-slate-300">&middot;</span>
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </ContentLayout>
  );
}

export default Blog;
