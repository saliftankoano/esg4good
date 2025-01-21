import Cta from '@/components/landing/Cta';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Testimonials from '@/components/landing/Testimonials';
import Solution from '@/components/Solution';

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
