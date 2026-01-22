import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-6 text-center"
    >
      <p className="text-sm text-primary-400">
        Images generated with AI. Built with React & Framer Motion.
      </p>
    </motion.footer>
  );
}
