import { motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollStackItem {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  accent?: string;
}

interface ScrollStackCardProps {
  item: ScrollStackItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  activeIndex: number;
  peek: number;
  scaleStep: number;
  blur: number;
  dim: number;
  depth: number;
}

function ScrollStackCard({ item, index, total, progress, activeIndex, peek, scaleStep, blur, dim, depth }: ScrollStackCardProps) {
  const reduced = useReducedMotion();
  const translateY = useTransform(progress, (value) => {
    const distance = index - value;
    if (distance >= 0) return distance * peek;
    return Math.max(distance * (reduced ? 0 : 38), -84);
  });
  const scale = useTransform(progress, (value) => {
    const distance = Math.min(Math.abs(index - value), depth);
    return reduced ? 1 : 1 - distance * scaleStep;
  });
  const opacity = useTransform(progress, (value) => {
    const distance = index - value;
    if (distance < -1) return 0;
    if (distance >= 0) return Math.max(0.2, 1 - distance * dim);
    return Math.max(0.08, 1 + distance * dim * 2.2);
  });
  const blurValue = useTransform(progress, (value) => {
    const distance = Math.max(0, index - value);
    return reduced ? "blur(0px)" : `blur(${Math.min(distance, depth) * blur}px)`;
  });
  const transform = useMotionTemplate`translate3d(0, ${translateY}px, 0) scale(${scale})`;

  return (
    <motion.article
      className="scroll-stack__card"
      style={{ transform, opacity, filter: blurValue, zIndex: index === activeIndex ? 100 : 100 - Math.abs(index - activeIndex) }}
      aria-label={item.title}
    >
      <div className="scroll-stack__card-image"><img src={item.image} alt={item.alt} loading={index === 0 ? "eager" : "lazy"} /></div>
      <div className="scroll-stack__card-scrim" />
      <div className="scroll-stack__card-content">
        <span className="scroll-stack__eyebrow" style={{ color: item.accent ?? "var(--accent)" }}>{item.eyebrow}</span>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <span className="scroll-stack__card-number">0{index + 1} / 0{total}</span>
      </div>
    </motion.article>
  );
}

interface ScrollStackProps {
  items: ScrollStackItem[];
  variant?: "stack" | "fade";
  scrollLength?: number;
  peek?: number;
  scaleStep?: number;
  blur?: number;
  dim?: number;
  depth?: number;
  cardWidth?: number;
  cardHeight?: number;
  borderRadius?: number;
  showProgress?: boolean;
  showCounter?: boolean;
  className?: string;
}

export function ScrollStack({
  items,
  variant = "stack",
  scrollLength = 0.82,
  peek = 24,
  scaleStep = 0.055,
  blur = 2,
  dim = 0.24,
  depth = 3,
  cardWidth = 1180,
  cardHeight = 0.64,
  borderRadius = 24,
  showProgress = true,
  showCounter = true,
  className,
}: ScrollStackProps) {
  const stackRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const cardProgress = useTransform(scrollYProgress, (value) => value * Math.max(items.length - 1, 1));

  useMotionValueEvent(cardProgress, "change", (value) => {
    const nextIndex = Math.min(items.length - 1, Math.max(0, Math.round(value)));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  if (!items.length) return null;

  const stackHeight = `${Math.max(1, (items.length - 1) * scrollLength + 1) * 100}vh`;

  return (
    <section
      ref={stackRef}
      className={cn("scroll-stack", `scroll-stack--${variant}`, className)}
      style={{ height: stackHeight, ["--scroll-stack-card-width" as string]: `${cardWidth}px`, ["--scroll-stack-card-height" as string]: `${cardHeight * 100}svh`, ["--scroll-stack-radius" as string]: `${borderRadius}px` }}
      aria-label="Selected roofing projects"
    >
      <div className="scroll-stack__sticky">
        <div className="scroll-stack__cards">
          {items.map((item, index) => (
            <ScrollStackCard
              key={item.title}
              item={item}
              index={index}
              total={items.length}
              progress={cardProgress}
              activeIndex={activeIndex}
              peek={peek}
              scaleStep={scaleStep}
              blur={blur}
              dim={dim}
              depth={depth}
            />
          ))}
        </div>
        {(showProgress || showCounter) && (
          <div className="scroll-stack__meta">
            {showProgress && <div className="scroll-stack__progress" aria-hidden="true"><motion.span style={{ scaleX: scrollYProgress }} /></div>}
            {showCounter && <span className="scroll-stack__counter">0{activeIndex + 1} / 0{items.length}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
