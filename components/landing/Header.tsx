'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get header height to offset scroll position
      const header = document.getElementById('header');
      const headerHeight = header?.offsetHeight || 0;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      id='header'
      className='fixed z-50 w-full border-b border-neutral-200 bg-white'>
      <nav className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div
            onClick={() => scrollToSection('hero')}
            className='group flex cursor-pointer items-center space-x-2 transition-transform duration-300 hover:scale-105'>
            <i className='fa-solid fa-leaf text-2xl text-neutral-700 transition-colors duration-300 group-hover:text-emerald-400'></i>
            <span className='text-xl font-semibold text-black transition-colors duration-300 group-hover:text-emerald-400'>
              ESG for Good
            </span>
          </div>
          <div className='flex items-center space-x-8'>
            <button
              onClick={() => scrollToSection('hero')}
              className='text-neutral-600 transition-colors duration-300 hover:text-emerald-600'>
              Home
            </button>
            <button
              onClick={() => scrollToSection('problem')}
              className='text-neutral-600 transition-colors duration-300 hover:text-emerald-600'>
              Problem
            </button>
            <button
              onClick={() => scrollToSection('solution')}
              className='text-neutral-600 transition-colors duration-300 hover:text-emerald-600'>
              Solution
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className='text-neutral-600 transition-colors duration-300 hover:text-emerald-600'>
              Testimonials
            </button>
            <button
              className='rounded-lg bg-neutral-900 px-6 py-2 text-white transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20'
              onClick={() => router.push('/map')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
