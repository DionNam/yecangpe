import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { EmployerBenefits } from "@/app/components/EmployerBenefits";
import { JobSeekerBenefits } from "@/app/components/JobSeekerBenefits";
import { HowItWorks } from "@/app/components/HowItWorks";
import { LatestJobs } from "@/app/components/LatestJobs";
import { TrustSection } from "@/app/components/TrustSection";
import { Footer } from "@/app/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <EmployerBenefits />
        <JobSeekerBenefits />
        <HowItWorks />
        <LatestJobs />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
