// components/FadeWrapper.jsx
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function FadeWrapper({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}