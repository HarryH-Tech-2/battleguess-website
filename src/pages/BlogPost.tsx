import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentLayout } from '../components/layout/ContentLayout';
import { blogPosts, blogCategories } from '../data/blogPosts';
import type { BlogSection } from '../data/blogPosts';

function renderContent(content: string) {
  // Split on double newlines for paragraphs
  const paragraphs = content.split('\n\n');
  if (paragraphs.length <= 1) {
    return (
      <p className="text-slate-600 leading-relaxed">{content}</p>
    );
  }
  return paragraphs.map((p, i) => (
    <p key={i} className="text-slate-600 leading-relaxed mb-3 last:mb-0">
      {p}
    </p>
  ));
}

function SectionBlock({ section, index }: { section: BlogSection; index: number }) {
  return (
    <motion.section
      key={index}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
        {section.heading}
      </h2>
      {renderContent(section.content)}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-3 space-y-2">
          {section.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-600 leading-relaxed">
              <span className="text-primary-500 mt-1.5 flex-shrink-0">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const { t } = useTranslation();

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(p => p.slug !== post.slug && p.category === post.category)
      .slice(0, 3);
  }, [post]);

  const category = post
    ? blogCategories.find(c => c.id === post.category)
    : undefined;

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
    ...(post.image && { image: `https://battleguess.app${post.image}` }),
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
      {/* Back link + Category breadcrumb */}
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
        {category && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              to={`/blog/topics/${post.category}`}
              className="text-slate-500 hover:text-primary-600 font-medium transition-colors"
            >
              {category.icon} {category.title}
            </Link>
          </>
        )}
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
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

      {/* Hero Image */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10"
        >
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              loading="eager"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      )}

      {/* Article Content */}
      <article className="space-y-8 max-w-none">
        {post.sections.map((section, index) => (
          <SectionBlock key={index} section={section} index={index} />
        ))}
      </article>

      {/* Play BattleGuess CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <div className="bg-gradient-to-br from-primary-50 to-emerald-100/50 rounded-2xl p-8 border border-primary-200/50 text-center">
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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map(related => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all duration-200 group block"
              >
                {related.image && (
                  <div className="rounded-xl overflow-hidden mb-3 aspect-[16/9]">
                    <img
                      src={related.image}
                      alt={related.imageAlt || related.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors text-sm leading-snug">
                  {related.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">{related.readTime}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </ContentLayout>
  );
}

export default BlogPost;
