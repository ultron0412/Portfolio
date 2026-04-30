import { motion } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";

type MotionSectionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function MotionSection({ id, className, children, delay = 0 }: MotionSectionProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <motion.section
      id={id}
      className={className}
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 10 : 32,
        scale: shouldReduceMotion ? 1 : 0.985,
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: shouldReduceMotion ? 0.28 : 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.section>
  );
}
