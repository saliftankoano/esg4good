import Cta from '@/components/landing/Cta';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Solution from '@/components/landing/Solution';
import Testimonials from '@/components/landing/Testimonials';

export default function Land() {
  return (
    <>
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Testimonials />
      <Cta />
      <Footer />
    </>
  );
}
