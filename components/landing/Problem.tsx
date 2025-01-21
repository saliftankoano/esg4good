// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  AlertTriangleIcon,
  BanknoteIcon,
  ClockIcon,
  FactoryIcon,
  LandmarkIcon,
  PackageIcon,
  PowerIcon,
  ScaleIcon,
  TrendingUpIcon,
} from 'lucide-react';

import { OrbitingCircles } from '../ui/orbiting-circles';

export default function Problem() {
  return (
    <section id='problem' className='bg-neutral-50 py-24 text-black'>
      <div className='container mx-auto flex flex-col items-center justify-center px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-4xl font-bold'>
            The Challenge in ESG Reporting
          </h2>
          <p className='text-lg text-neutral-600'>
            Companies struggle with complex reporting requirements, data
            collection, and measuring real impact.
          </p>
        </div>
        <div className='relative flex h-[500px] w-1/2 flex-col items-center justify-center overflow-hidden rounded-lg'>
          <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-black'>
            ESG
          </span>

          <OrbitingCircles iconSize={40}>
            <div className='flex items-center gap-2'>
              <BanknoteIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>High Capital Costs</span>
            </div>
            <div className='flex items-center gap-2'>
              <ScaleIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Regulatory Hurdles</span>
            </div>
            <div className='flex items-center gap-2'>
              <PowerIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Grid Integration</span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUpIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Market Volatility</span>
            </div>
            <div className='flex items-center gap-2'>
              <AlertTriangleIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Tech Risks</span>
            </div>
          </OrbitingCircles>
          <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
            <div className='flex items-center gap-2'>
              <LandmarkIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Policy Changes</span>
            </div>
            <div className='flex items-center gap-2'>
              <ClockIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Long ROI</span>
            </div>
            <div className='flex items-center gap-2'>
              <PackageIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Supply Chain</span>
            </div>
            <div className='flex items-center gap-2'>
              <FactoryIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>Infrastructure</span>
            </div>
          </OrbitingCircles>
        </div>
      </div>
    </section>
  );
}
