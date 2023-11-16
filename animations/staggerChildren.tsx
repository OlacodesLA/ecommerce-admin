import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
};

export const parentVariants = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const StaggerChildren = ({ children }: Props) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="initial"
      variants={parentVariants}
      className="flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
};

export default StaggerChildren;
