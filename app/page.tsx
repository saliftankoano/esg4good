'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Map,
  Sun,
  Battery,
  ArrowRight,
  LineChart,
  Shield,
  Globe,
  ChevronRight,
  Sparkles,
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
          className='absolute inset-0'
        >
          <div className='absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full blur-[100px] opacity-20 animate-pulse'></div>
          <div className='absolute top-40 right-20 w-48 h-48 bg-blue-400 rounded-full blur-[120px] opacity-20 animate-pulse delay-700'></div>
          <div className='absolute bottom-20 left-1/3 w-40 h-40 bg-yellow-400 rounded-full blur-[90px] opacity-20 animate-pulse delay-1000'></div>
        </motion.div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center'
          >
            {/* Enhanced Badge */}
            <motion.div
              className='flex items-center justify-center mb-8'
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className='px-5 py-2.5 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 text-sm font-semibold inline-flex items-center shadow-sm'>
                <Sparkles className='w-4 h-4 mr-2 text-green-600' />
                Empowering New York&apos;s Green Future
                <ChevronRight className='w-4 h-4 ml-1 text-green-600' />
              </span>
            </motion.div>

            {/* Enhanced Heading */}
            <h1 className='text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight'>
              Visualize New York&apos;s{' '}
              <span className='relative inline-block'>
                <span className='relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-size-200 animate-gradient'>
                  Clean Energy
                </span>
                <svg
                  className='absolute -bottom-2 left-0 w-full h-3 text-green-200 animate-pulse'
                  viewBox='0 0 300 12'
                  fill='currentColor'
                >
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
            <p className='text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light'>
              Experience an immersive journey through New York&apos;s renewable
              energy landscape. Explore interactive maps, track real-time
              progress, and visualize our path to a sustainable future.
            </p>

            {/* Enhanced CTA Button */}
            <div className='flex justify-center'>
              <Link
                href='/map'
                className='group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5'
              >
                Explore Interactive Map
                <Map className='ml-2 h-5 w-5 group-hover:rotate-12 transition-transform' />
              </Link>
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-white/90 backdrop-blur-lg rounded-xl p-6 lg:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-green-200 transition-all duration-300 flex flex-col items-center justify-center text-center'
              >
                <div className='text-3xl lg:text-4xl font-bold mb-1 lg:mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <div className='text-sm lg:text-base text-gray-600 font-medium'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Grid with enhanced styling */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white p-6 lg:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-green-200 hover:shadow-green-100/50 transition-all duration-300'
            >
              <div
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4 lg:mb-6 ${feature.iconBg}`}
              >
                <feature.icon
                  className={`h-6 w-6 lg:h-7 lg:w-7 ${feature.iconColor}`}
                />
              </div>
              <h3 className='text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4'>
                {feature.title}
              </h3>
              <p className='text-sm lg:text-base text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className='relative bg-gradient-to-r from-green-600 to-blue-600 py-20'>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            <h2 className='text-4xl font-bold text-white mb-6'>
              Ready to Make an Impact?
            </h2>
            <p className='text-xl text-green-100 mb-8 max-w-2xl mx-auto'>
              Join us in visualizing and tracking New York&apos;s journey
              towards a sustainable energy future.
            </p>
            <Link
              href='/map'
              className='inline-flex items-center px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:shadow-lg hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-0.5'
            >
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
