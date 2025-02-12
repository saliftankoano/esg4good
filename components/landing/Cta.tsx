'use client';

import { useRouter } from 'next/navigation';

export default function Cta() {
  const router = useRouter();

  return (
    <section id='cta' className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='rounded-2xl bg-neutral-900 p-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold text-white'>
            Ready to Transform How You Research & Invest?
          </h2>
          <p className='mb-8 text-xl text-neutral-300'>
            Join thousands of investors and founders making a real impact with
            ESG for Good
          </p>
          <button
            onClick={() => router.push('/map')}
            className='rounded-lg bg-white px-8 py-3 font-semibold text-neutral-900 transition-all duration-300 hover:translate-y-[-2px] hover:bg-emerald-400 hover:text-white hover:shadow-lg hover:shadow-emerald-400/20'>
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}
