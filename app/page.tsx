'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Battery,
  ChevronRight,
  Globe,
  LineChart,
  Map,
  Shield,
  Sparkles,
  Sun,
} from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
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

        <div className='relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center'>
            {/* Enhanced Badge */}
            <motion.div
              className='mb-8 flex items-center justify-center'
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <span className='inline-flex items-center rounded-full bg-gradient-to-r from-green-100 to-blue-100 px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm'>
                <Sparkles className='mr-2 h-4 w-4 text-green-600' />
                Empowering New York&apos;s Green Future
                <ChevronRight className='ml-1 h-4 w-4 text-green-600' />
              </span>
            </motion.div>

            {/* Enhanced Heading */}
            <h1 className='mb-6 text-6xl font-bold leading-tight tracking-tight text-gray-900 md:text-7xl'>
              Visualize New York&apos;s{' '}
              <span className='relative inline-block'>
                <span className='bg-size-200 relative z-10 animate-gradient bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent'>
                  Clean Energy
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
              <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                Transformation
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className='mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed text-gray-600'>
              Experience an immersive journey through New York&apos;s renewable
              energy landscape. Explore interactive maps, track real-time
              progress, and visualize our path to a sustainable future.
            </p>

            {/* Enhanced CTA Button */}
            <div className='flex justify-center'>
              <Link
                href='/map'
                className='group inline-flex transform items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30'>
                Explore Interactive Map
                <Map className='ml-2 h-5 w-5 transition-transform group-hover:rotate-12' />
              </Link>
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6'>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white/90 p-6 text-center shadow-xl shadow-gray-200/50 backdrop-blur-lg transition-all duration-300 hover:border-green-200 lg:p-8'>
                <div className='mb-1 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent lg:mb-2 lg:text-4xl'>
                  {stat.value}
                </div>
                <div className='text-sm font-medium text-gray-600 lg:text-base'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Grid with enhanced styling */}
      <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:border-green-200 hover:shadow-green-100/50 lg:p-8'>
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl lg:mb-6 lg:h-14 lg:w-14 ${feature.iconBg}`}>
                <feature.icon
                  className={`h-6 w-6 lg:h-7 lg:w-7 ${feature.iconColor}`}
                />
              </div>
              <h3 className='mb-3 text-lg font-semibold text-gray-900 lg:mb-4 lg:text-xl'>
                {feature.title}
              </h3>
              <p className='text-sm leading-relaxed text-gray-600 lg:text-base'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className='relative bg-gradient-to-r from-green-600 to-blue-600 py-20'>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'>
            <h2 className='mb-6 text-4xl font-bold text-white'>
              Ready to Make an Impact?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-green-100'>
              Join us in visualizing and tracking New York&apos;s journey
              towards a sustainable energy future.
            </p>
            <Link
              href='/map'
              className='inline-flex transform items-center rounded-xl bg-white px-8 py-4 font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20'>
              Get Started Now
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Interactive Map Visualization',
    description:
      'Explore renewable energy projects across New York State with our interactive map featuring detailed project information and real-time updates.',
    icon: Map,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Project Analytics',
    description:
      'Access comprehensive analytics and insights for each renewable energy project, including environmental impact and social benefits.',
    icon: LineChart,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Solar Energy Tracking',
    description:
      'Monitor solar installations and their performance metrics across different regions of New York State.',
    icon: Sun,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Environmental Impact',
    description:
      'Measure and visualize the environmental benefits of renewable energy projects, including CO2 reduction and sustainability metrics.',
    icon: Shield,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Energy Storage Systems',
    description:
      'Track battery storage installations and their contribution to grid stability and renewable energy integration.',
    icon: Battery,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    title: 'Real-time Monitoring',
    description:
      'Stay updated with real-time performance data and status updates from renewable energy installations across the state.',
    icon: Globe,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
];

const stats = [
  {
    value: '1,000+',
    label: 'Active Projects',
  },
  {
    value: '7.5 GW',
    label: 'Clean Energy',
  },
  {
    value: '3M+',
    label: 'Homes Powered',
  },
  {
    value: '40%',
    label: 'CO₂ Reduction',
  },
];
