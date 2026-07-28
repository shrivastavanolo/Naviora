import { HeroSection } from "@/components/home/hero-section";
import { PurposeSection } from "@/components/home/purpose-section";
import { GoalsSection } from "@/components/home/goals-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      <PurposeSection />
      <GoalsSection />
    </div>
  );
}
