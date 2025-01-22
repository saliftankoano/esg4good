import {
  AlertTriangleIcon,
  CircleDollarSign,
  FactoryIcon,
  GemIcon,
  LeafIcon,
  MapPin,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';

import { OrbitingCircles } from '../ui/orbiting-circles';

export default function Problem() {
  return (
    <section id='problem' className='bg-neutral-50 py-24 text-black'>
      <div className='container mx-auto flex flex-col items-center justify-center px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-4xl font-bold'>
            Challenges at Inception & Funding
          </h2>
          <p className='text-lg text-neutral-600'>
            Understanding the landscape of renewable energy, it&apos;s risks,
            and its impact is complex.
          </p>
        </div>
        <div className='relative flex h-[500px] w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg'>
          <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-green-800 to-green-500 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-black'>
            ESG
          </span>

          <OrbitingCircles iconSize={40} radius={220}>
            <div className='flex items-center gap-2'>
              <SearchIcon className='h-4 w-4 text-red-500' />
              <span className='text-sm font-bold text-red-500'>
                Due Diligence
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <GemIcon className='h-4 w-4 text-blue-500' />
              <span className='text-sm font-bold text-blue-500'>
                Spot Opportunities
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-red-500' />
              <span className='text-sm font-bold text-red-500'>Location</span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUpIcon className='h-4 w-4 text-red-500' />
              <span className='text-sm font-bold text-red-500'>
                Competitors
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <AlertTriangleIcon className='h-4 w-4 text-red-500' />
              <span className='text-sm font-bold text-red-500'>Risks</span>
            </div>
          </OrbitingCircles>
          <OrbitingCircles iconSize={30} radius={120} reverse speed={2}>
            <div className='flex items-center gap-2'>
              <LeafIcon className='h-4 w-4 text-green-700' />
              <span className='text-sm font-bold text-green-700'>
                Environmental Impact
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <UsersIcon className='h-4 w-4 text-green-700' />
              <span className='text-sm font-bold text-green-700'>
                Social Impact
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <CircleDollarSign className='h-4 w-4 text-green-700' />
              <span className='text-sm font-bold text-green-700'>ROI</span>
            </div>
            <div className='flex items-center gap-2'>
              <FactoryIcon className='h-4 w-4 text-green-700' />
              <span className='text-sm font-bold text-green-700'>
                Infrastructure
              </span>
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}
