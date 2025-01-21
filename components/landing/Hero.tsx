'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ChevronRight, Map, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id='hero' className='relative min-h-[800px]'>
      {/* Enhanced Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-50'>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]'></div>
      </div>

      {/* Enhanced Floating Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className='absolute inset-0'>
        <div className='absolute left-10 top-20 h-32 w-32 animate-pulse rounded-full bg-green-400 opacity-20 blur-[100px]'></div>
        <div className='absolute right-20 top-40 h-48 w-48 animate-pulse rounded-full bg-blue-400 opacity-20 blur-[120px] delay-700'></div>
        <div className='absolute bottom-20 left-1/3 h-40 w-40 animate-pulse rounded-full bg-yellow-400 opacity-20 blur-[90px] delay-1000'></div>
      </motion.div>

      <div className='container relative mx-auto px-4 pt-28'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-6'>
            {/* Enhanced Badge */}
            <motion.div
              className='mb-8'
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <span className='inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-md backdrop-blur-sm'>
                <Sparkles className='mr-2 h-4 w-4 text-green-600' />
                Empowering New York&apos;s Green Future
                <ChevronRight className='ml-1 h-4 w-4 text-green-600' />
              </span>
            </motion.div>

            <h1 className='text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-7xl'>
              Accelerating{' '}
              <span className='relative inline-block'>
                <span className='bg-size-200 relative z-10 animate-gradient bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent'>
                  Renewable Energy
                </span>
                <svg
                  className='absolute -bottom-2 left-0 h-3 w-full animate-pulse text-green-200'
                  viewBox='0 0 300 12'
                  fill='currentColor'>
                  <path
                    d='M1 5.5Q75 3 150 6.5T300 5.5'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    fill='none'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
              <br />
              <span className='bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                With Insights
              </span>
            </h1>
            <p className='text-xl font-light leading-relaxed text-gray-600'>
              Simplifying environmental, social, and governance reporting while
              making real impact on our planet.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='/map'
                className='group inline-flex transform items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30'>
                Explore Interactive Map
                <Map className='ml-2 h-5 w-5 transition-transform group-hover:rotate-12' />
              </Link>
              <button className='rounded-xl border border-gray-800 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-800 hover:shadow-lg hover:shadow-gray-200/50'>
                Watch Demo
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex h-[500px] items-center justify-center rounded-2xl border border-gray-100 bg-white/50 shadow-xl shadow-gray-200/50 backdrop-blur-sm'>
            <Image
              src='/images/map.png'
              alt='Map'
              width={500}
              height={500}
              className='h-full w-full rounded-2xl object-cover object-right'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
