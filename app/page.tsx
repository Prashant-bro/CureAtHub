import {
  Navigation,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  WellnessSection,
  RoadmapSection,
  Footer,
} from "@/features/landing"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WellnessSection />
      <RoadmapSection />
      <Footer />
    </main>
  )
}
