import Image from 'next/image';

import { CarIcon, RatIcon, ZapIcon } from 'lucide-react';

export default function Solution() {
  return (
    <section id='solution' className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-2 items-center gap-12'>
          <div className='flex h-[600px] items-center justify-center rounded-2xl bg-neutral-100'>
            <Image
              src='/images/outage.png'
              alt='outages'
              width={500}
              height={600}
              className='h-full w-full rounded-2xl object-cover object-left-top'
            />
          </div>
          <div className='space-y-8'>
            <h2 className='text-4xl font-bold'>Features</h2>
            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
                <ZapIcon className='h-8 w-8 text-neutral-700' />
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>
                    Power Outage Heatmap
                  </h3>
                  <p className='text-neutral-600'>
                    A heatmap of power outages across NYC
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <RatIcon className='h-8 w-8 text-neutral-700' />
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>Rats Heatmap</h3>
                  <p className='text-neutral-600'>
                    A heatmap of rats across NYC
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <CarIcon className='h-8 w-8 text-neutral-700' />
                <div>
                  <h3 className='mb-2 text-xl font-semibold'>
                    EV Charging Stations
                  </h3>
                  <p className='text-neutral-600'>
                    A list of EV charging stations across NYC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
