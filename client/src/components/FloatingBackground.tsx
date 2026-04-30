import { motion } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const orbVariants = {
  one: {
    scale: [1, 1.12, 0.98, 1],
    x: [0, 20, -16, 0],
    y: [0, -16, 14, 0],
  },
  two: {
    scale: [1, 0.9, 1.08, 1],
    x: [0, -28, 18, 0],
    y: [0, 20, -12, 0],
  },
  three: {
    scale: [1, 1.07, 0.93, 1],
    x: [0, 16, -14, 0],
    y: [0, -14, 12, 0],
  },
};

export function FloatingBackground() {
  const { shouldReduceMotion } = useMotionPreference();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="large-block" aria-hidden="true">
      <div id="particles-js" className="floating-background">
        <motion.span
          className="floating-orb orb-a"
          animate={orbVariants.one}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.span
          className="floating-orb orb-b"
          animate={orbVariants.two}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        />
        <motion.span
          className="floating-orb orb-c"
          animate={orbVariants.three}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
