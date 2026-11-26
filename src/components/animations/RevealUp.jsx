import { motion } from 'framer-motion';

export default function RevealUp({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay,
      }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
