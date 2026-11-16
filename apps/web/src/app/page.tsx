import { ScrollProgressBar } from '@psicoiris/motion';
import { AboutSection } from '@/components/organisms/AboutSection';
import { ArticlesPreview } from '@/components/organisms/ArticlesPreview';
import { ContactForm } from '@/components/organisms/ContactForm';
import { CtaBanner } from '@/components/organisms/CtaBanner';
import { Footer } from '@/components/organisms/Footer';
import { HeroSection } from '@/components/organisms/HeroSection';
import { Navbar } from '@/components/organisms/Navbar';
import { ProcessSection } from '@/components/organisms/ProcessSection';
import { ServicesSection } from '@/components/organisms/ServicesSection';
import { TrustPillars } from '@/components/organisms/TrustPillars';
import { fetchPublishedPostsSafe, fetchSiteProfileSafe } from '@/lib/queries';

export const revalidate = 3600;

export default async function HomePage() {
  const [profile, posts] = await Promise.all([
    fetchSiteProfileSafe(),
    fetchPublishedPostsSafe(3),
  ]);

  return (
    <>
      <ScrollProgressBar />
      <Navbar
        brandName={profile.brand_name}
        clinicianTitle={profile.clinician_title}
      />
      <main className="w-full bg-surface">
        <HeroSection profile={profile} />
        <TrustPillars />
        <ServicesSection services={profile.services} />
        <AboutSection profile={profile} />
        <ProcessSection steps={profile.process_steps} />
        <CtaBanner />
        <ArticlesPreview posts={posts} />
        <ContactForm profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
