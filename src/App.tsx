import { useCallback, useState } from "react";
import { ArrowDownRight, ArrowRight, Check, Instagram, Phone, Play, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { PillNav, type NavItem } from "@/components/ui/pill-nav";
import { ScrollFloat } from "@/components/ui/scroll-float";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { Preloader } from "@/components/ui/preloader";
import { ProjectCarousel } from "@/components/project-carousel";
import { getAsset } from "@/lib/utils";

const navItems: NavItem[] = [
  { name: "Home", url: "#top", icon: Play },
  { name: "Services", url: "#services", icon: Check },
  { name: "Projects", url: "#portfolio", icon: ArrowRight },
  { name: "About", url: "#about", icon: Check },
  { name: "Reviews", url: "#reviews", icon: Check },
  { name: "Contact", url: "#contact", icon: Phone },
];

const reviews = [
  {
    name: "Bryan S",
    location: "Texas, 1234 Elm Street, Austin, TX 78701",
    quote: "Robert did a good job handling all the details of getting a new roof. He was a good advocate in dealing with the insurance company and knew the best way to get the best results for a new roof. Solid job!",
    image: getAsset("assets/roofing-generated/project-cottage.png"),
  },
  {
    name: "Megan R",
    location: "Fort Worth, TX",
    quote: "The team showed up prepared, explained every step, and left the property cleaner than they found it. The finished roof looks exceptional.",
    image: getAsset("assets/roofing-generated/service-installation.png"),
  },
  {
    name: "Chris T",
    location: "Burleson, TX",
    quote: "From inspection to installation, the process was clear and professional. We always knew what was happening and why.",
    image: getAsset("assets/roofing-generated/service-inspection.png"),
  },
  {
    name: "Lauren M",
    location: "Arlington, TX",
    quote: "A thoughtful crew, precise work, and a roof that feels built for the next twenty years. We would recommend them without hesitation.",
    image: getAsset("assets/roofing-generated/project-mountain-home.png"),
  },
];

function SectionMarker({ children }: { children: string }) {
  return <span className="section-marker"><span />{children}</span>;
}

export default function App() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [introReady, setIntroReady] = useState(true);
  const review = reviews[reviewIndex];
  const handleIntroReady = useCallback(() => setIntroReady(true), []);
  const moveReview = (direction: number) => setReviewIndex((current) => (current + direction + reviews.length) % reviews.length);

  return (
    <div className="site-shell">
      <Preloader onComplete={handleIntroReady} />
      <PillNav items={navItems} />
      <header className="brand-header">
        <a className="brand-mark-lockup" href="#top" aria-label="Texas Elite Roofing home">
          <svg viewBox="0 0 32 20" aria-hidden="true"><path d="M1 17 12 3l7 8 4-5 8 11H1Z" fill="currentColor" /><path d="m9 17 10-10 7 10H9Z" fill="var(--paper)" /></svg>
          <span>TEXAS ELITE</span>
        </a>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hero-v2" id="top" data-nav-theme="dark" aria-labelledby="hero-title">
          <GrainOverlay />
          <motion.div
            className="hero-v2__copy"
            initial={{ opacity: 0, transform: "translate3d(0, 18px, 0)" }}
            animate={introReady ? { opacity: 1, transform: "translate3d(0, 0, 0)" } : { opacity: 0, transform: "translate3d(0, 18px, 0)" }}
            transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
          >
            <ScrollReveal className="hero-v2__meta">
              <span>Texas Elite Roofing<br />and Construction</span>
              <span>Roof Inspections<br />and Repair</span>
            </ScrollReveal>
            <div className="hero-v2__title-wrap">
              <span className="hero-v2__eyebrow">Built for the long run</span>
              <h1 id="hero-title">Premium<br /><em>roofing</em></h1>
            </div>
            <ScrollReveal className="hero-v2__footer" delay={0.16}>
              <p>Thoughtful roof repair, replacement, and construction for the homes that matter.</p>
              <a className="button button-accent" href="#contact">Get a Quote <ArrowRight size={15} /></a>
            </ScrollReveal>
          </motion.div>
          <motion.div
            className="hero-v2__media"
            aria-label="Roofer working on a timber-framed home"
            initial={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            animate={introReady ? { opacity: 1, clipPath: "inset(0 0 0 0%)" } : { opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.82, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
          >
              <div className="hero-v2__media-frame">
                <img className="hero-v2__image" src={getAsset("assets/roofing-generated/hero-roofer.png")} alt="Roofer standing on the timber frame of a home" />
                <div className="hero-v2__image-caption">01 / FIELD NOTES<br /><span>Burleson, Texas</span></div>
              </div>
          </motion.div>
        </section>

        <section className="intro-v2 section-wrap" id="services" data-nav-theme="light" aria-labelledby="services-title">
          <ScrollReveal className="intro-v2__heading">
            <SectionMarker>01 — The work</SectionMarker>
            <h2 id="services-title">Complete roofing and<br /><em>home restoration.</em></h2>
          </ScrollReveal>
          <div className="intro-v2__grid">
            <ScrollReveal className="image-tile image-tile--large" delay={0.08}><div className="image-tile__frame"><img src={getAsset("assets/roofing-generated/service-installation.png")} alt="Roof installation in progress" loading="lazy" /></div><span>Metal roof installation / 01</span></ScrollReveal>
            <ScrollReveal className="intro-v2__copy" delay={0.16}>
              <p className="body-copy">Texas Elite Roofing brings clear communication, careful work, and durable materials to every project.</p>
              <div className="intro-v2__details"><span>Burleson, Fort Worth,<br />Arlington, Colleyville,<br />Keller, TX</span><span>Repair<br />Replacement<br />Restoration</span></div>
            </ScrollReveal>
            <ScrollReveal className="image-tile image-tile--small" delay={0.24}><div className="image-tile__frame"><img src={getAsset("assets/roofing-generated/about-metal-roof-detail.png")} alt="Close view of charcoal standing-seam metal roofing" loading="lazy" /></div><span>Material study / 02</span></ScrollReveal>
          </div>
        </section>

        <section className="services-band" data-nav-theme="dark" aria-labelledby="services-band-title">
          <div className="section-wrap services-band__top">
            <ScrollReveal><SectionMarker>02 — Capabilities</SectionMarker></ScrollReveal>
            <ScrollFloat distance={35}><h2 id="services-band-title">Roofing services with<br /><em>discipline built in.</em></h2></ScrollFloat>
          </div>
          <div className="services-marquee" aria-label="Service categories">
            {["Repairs", "Installation", "Inspections", "Restoration"].map((service, index) => (
              <div className="services-marquee__item" key={service}>
                <img src={[
                  getAsset("assets/roofing-generated/service-repair.png"),
                  getAsset("assets/roofing-generated/service-installation.png"),
                  getAsset("assets/roofing-generated/service-inspection.png"),
                  getAsset("assets/roofing-generated/project-cottage.png"),
                ][index]} alt="" loading="lazy" />
                <strong>{service}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="portfolio-v2 section-wrap" id="portfolio" data-nav-theme="light" aria-labelledby="portfolio-title">
          <ScrollReveal className="portfolio-v2__intro">
            <SectionMarker>03 — Selected work</SectionMarker>
            <h2 id="portfolio-title">Made to sit<br /><em>beautifully.</em></h2>
            <p className="body-copy">We build roofs that respect the architecture beneath them and the life happening inside.</p>
          </ScrollReveal>
          <div className="portfolio-v2__gallery"><ProjectCarousel /></div>
        </section>

        <section className="about-v2 section-wrap" id="about" data-nav-theme="light" aria-labelledby="about-title">
          <ScrollReveal className="about-v2__title"><SectionMarker>04 — The better way</SectionMarker><h2 id="about-title">Good work starts<br />with <em>respect.</em></h2></ScrollReveal>
          <div className="about-v2__grid">
            <ScrollReveal className="about-v2__copy" delay={0.1}><p className="body-copy">We believe homeowners have a right to information, a right to respect, and a right to be part of the solution. That is how we approach every roof, every room, and every neighbor we serve.</p><a className="text-link" href="#contact">Talk through your project <ArrowDownRight size={16} /></a></ScrollReveal>
            <ScrollReveal className="image-tile about-v2__image" delay={0.2}><img src={getAsset("assets/roofing-generated/project-mountain-home.png")} alt="Contemporary mountain home with a dramatic metal roof" loading="lazy" /></ScrollReveal>
          </div>
        </section>

        <section className="reviews-v2 section-wrap" id="reviews" data-nav-theme="light" aria-labelledby="reviews-title">
          <ScrollReveal className="reviews-v2__person"><SectionMarker>05 — Field notes</SectionMarker><img src={review.image} alt="" /><h2 id="reviews-title">{review.name}</h2><p>{review.location}</p><span className="review-count">0{reviewIndex + 1} / 0{reviews.length}</span></ScrollReveal>
          <ScrollReveal className="reviews-v2__quote" delay={0.1}><blockquote>“{review.quote}”</blockquote><div className="reviews-v2__controls"><button type="button" onClick={() => moveReview(-1)} aria-label="Previous review">←</button><div className="review-dots">{reviews.map((item, index) => <button key={item.name} className={index === reviewIndex ? "is-active" : ""} type="button" aria-label={`Show review ${index + 1}`} onClick={() => setReviewIndex(index)} />)}</div><button type="button" onClick={() => moveReview(1)} aria-label="Next review">→</button></div></ScrollReveal>
        </section>
      </main>

      <footer className="site-footer-v2" id="contact" data-nav-theme="dark">
        <div className="section-wrap footer-v2__top"><SectionMarker>06 — Start here</SectionMarker><h2>Let's make a roof<br /><em>worth coming home to.</em></h2><a className="button button-accent" href="tel:9999999">Call 9999999 <ArrowRight size={15} /></a></div>
        <div className="section-wrap footer-v2__grid"><div><span className="footer-label">Texas Elite</span><p>Roofing and Construction<br />Burleson, Texas</p></div><div><span className="footer-label">Services</span><a href="#services">Metal Roofing</a><a href="#services">Roof Repair</a><a href="#services">Restoration</a></div><div><span className="footer-label">Follow</span><a href="#contact"><Instagram size={14} /> Instagram</a><a href="#contact"><Youtube size={14} /> YouTube</a></div><div><span className="footer-label">Availability</span><p>Serving Burleson, Fort Worth, Arlington, Colleyville, Keller, TX, and the surrounding areas.</p></div></div>
        <div className="section-wrap footer-v2__bottom"><span>© 2024 Texas Elite Roofing and Construction</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
