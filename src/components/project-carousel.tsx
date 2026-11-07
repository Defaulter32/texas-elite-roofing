import { ScrollStack, type ScrollStackItem } from "@/components/ui/scroll-stack";
import { getAsset } from "@/lib/utils";

const projects: ScrollStackItem[] = [
  {
    eyebrow: "Cottage in Texas / 01",
    title: "A roof with a quieter presence.",
    body: "Charcoal standing-seam metal gives this cottage a clean silhouette and a finish made to weather beautifully.",
    image: getAsset("assets/roofing-generated/project-cottage.png"),
    alt: "Cottage in Texas with a charcoal metal roof",
    accent: "#d4896b",
  },
  {
    eyebrow: "Roof Installation / 02",
    title: "Built carefully from the first seam.",
    body: "A disciplined installation process protects the structure, the schedule, and the details that make the finished roof feel inevitable.",
    image: getAsset("assets/roofing-generated/service-installation.png"),
    alt: "Roof installation in progress",
    accent: "#c99b79",
  },
  {
    eyebrow: "Residential House / 03",
    title: "Made to sit beautifully.",
    body: "Proportions, drainage, flashing, and finish come together in a roof that respects the architecture beneath it.",
    image: getAsset("assets/roofing-generated/project-modern-home.png"),
    alt: "Modern residential home with a metal roof",
    accent: "#e0b08b",
  },
  {
    eyebrow: "Roof Restoration / 04",
    title: "Ready for the next twenty years.",
    body: "Restoration is a conversation between what is already there and what the home still needs to become.",
    image: getAsset("assets/roofing-generated/project-mountain-home.png"),
    alt: "Modern mountain home with a restored metal roof",
    accent: "#b97158",
  },
];

export function ProjectCarousel() {
  return <ScrollStack items={projects} variant="stack" scrollLength={0.82} peek={26} scaleStep={0.055} blur={1.5} dim={0.22} depth={3} showProgress showCounter />;
}
