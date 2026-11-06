import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface PillNavProps {
  items: NavItem[];
  className?: string;
}

export function PillNav({ items, className }: PillNavProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "");
  const [surfaceTheme, setSurfaceTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const targets = items
      .map((item) => document.querySelector(item.url))
      .filter((target): target is Element => Boolean(target));

    const updateActive = (id: string) => {
      const match = items.find((item) => item.url === `#${id}`);
      if (match) setActiveTab(match.name);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) updateActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    targets.forEach((target) => observer.observe(target));
    const onHashChange = () => updateActive(window.location.hash.slice(1) || "top");
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);

    const surfaceSections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]"));
    let frame = 0;
    const updateSurfaceTheme = () => {
      frame = 0;
      const navLine = 48;
      const current = surfaceSections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= navLine && bounds.bottom > navLine;
      });
      if (current) setSurfaceTheme(current.dataset.navTheme === "light" ? "light" : "dark");
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSurfaceTheme);
    };
    updateSurfaceTheme();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className={cn("pill-nav", `pill-nav--${surfaceTheme}`, className)} aria-label="Primary navigation">
      <div className="pill-nav__inner">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <a
              key={item.name}
              href={item.url}
              aria-current={isActive ? "page" : undefined}
              className={cn("pill-nav__item", isActive && "is-active")}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const target = document.querySelector<HTMLElement>(item.url);
                if (!target) return;
                event.preventDefault();
                setActiveTab(item.name);
                window.history.pushState({}, "", item.url);
                const targetTop = target.getBoundingClientRect().top + window.scrollY - 76;
                window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
              }}
            >
              <span className="pill-nav__label">{item.name}</span>
              <span className="pill-nav__icon" aria-hidden="true"><Icon size={16} strokeWidth={2} /></span>
              {isActive && (
                <motion.span
                  layoutId="roofing-lamp"
                  className="pill-nav__active-fill"
                  transition={{ type: "spring", stiffness: 340, damping: 30 }}
                />
              )}
              {isActive && <span className="pill-nav__lamp" aria-hidden="true" />}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
