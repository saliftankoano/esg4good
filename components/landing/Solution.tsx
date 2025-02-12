'use client';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { CarIcon, RatIcon, ZapIcon } from 'lucide-react';

import { ScrollAnimation } from '@/components/ui/scroll-animation';

const features = [
  {
    icon: ZapIcon,
    title: 'Power Outage Heatmap',
    description: 'A heatmap of power outages across NYC',
  },
  {
    icon: RatIcon,
    title: 'Rats Heatmap',
    description: 'A heatmap of rats across NYC',
  },
  {
    icon: CarIcon,
    title: 'EV Charging Stations',
    description: 'A list of EV charging stations across NYC',
  },
];

export default function Solution() {
  return (
    <section id='solution' className='py-24'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-2 items-center gap-12'>
          <ScrollAnimation>
            <motion.div
              className='flex h-[600px] items-center justify-center rounded-2xl bg-neutral-100'
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <Image
                src='/images/outage.png'
                alt='outages'
                width={500}
                height={600}
                className='h-full w-full rounded-2xl object-cover object-left-top'
              />
            </motion.div>
          </ScrollAnimation>

          <div className='space-y-8'>
            <ScrollAnimation>
              <h2 className='text-4xl font-bold'>Features</h2>
            </ScrollAnimation>

            <div className='space-y-6'>
              {features.map((feature) => (
                <ScrollAnimation key={feature.title}>
                  <motion.div
                    className='flex items-start space-x-4'
                    whileHover={{ x: 10 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 17,
                    }}>
                    <feature.icon className='h-8 w-8 text-emerald-600' />
                    <div>
                      <h3 className='mb-2 text-xl font-semibold'>
                        {feature.title}
                      </h3>
                      <p className='text-neutral-600'>{feature.description}</p>
                    </div>
                  </motion.div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
