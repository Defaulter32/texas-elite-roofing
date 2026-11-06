import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollFloatProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}

export function ScrollFloat({ children, className, distance = 42 }: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} className={cn(className)} style={reduced ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
