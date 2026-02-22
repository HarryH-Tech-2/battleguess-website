import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ContentLayout } from '../components/layout/ContentLayout';
import { blogPosts } from '../data/blogPosts';

function Blog() {
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
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
          Blog
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          History insights and game guides
        </p>
      </motion.div>

      {/* Post List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h2>
                <span className="flex-shrink-0 text-slate-400 text-sm whitespace-nowrap">
                  {post.readTime}
                </span>
              </div>

              <p className="text-slate-500 text-sm mb-3 leading-relaxed">
                {post.description}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 text-xs">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-slate-300">&middot;</span>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </ContentLayout>
  );
}

export default Blog;
