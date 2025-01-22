import Image from 'next/image';

import { Marquee } from '@/components/ui/marquee';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Sustainability Director',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456',
    quote:
      "ESG for Good has revolutionized our approach to sustainability reporting. The platform's intuitive analytics have helped us identify opportunities we would have otherwise missed.",
  },
  {
    name: 'Bryce Young',
    role: 'ESG Investment Analyst',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=bryce',
    quote:
      "The automated data collection and AI-driven insights have transformed our due diligence process. We're making more informed investment decisions in half the time.",
  },
  {
    name: 'Emily Davis',
    role: 'Chief Impact Officer',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=Emily',
    quote:
      'Real-time analytics and comprehensive ESG metrics have enabled us to make data-driven decisions that align with both our sustainability goals and financial targets.',
  },
  {
    name: 'Mark Duvall',
    role: 'Renewable Energy Developer',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=mark',
    quote:
      "The platform's location intelligence has been invaluable for our site selection process. We've optimized our renewable energy projects with unprecedented precision.",
  },
  {
    name: 'Rachel Torres',
    role: 'VP of Sustainability',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=morgan',
    quote:
      "ESG for Good's risk assessment tools have helped us anticipate and mitigate environmental risks before they impact our operations. It's become an essential part of our strategy.",
  },
  {
    name: 'Megan Parker',
    role: 'Climate Tech Investor',
    image: 'https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=david',
    quote:
      "The platform's comprehensive market analysis and competitive intelligence have given us a significant edge in identifying promising climate tech investments.",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const TestimonialCard = ({
  name,
  role,
  image,
  quote,
}: (typeof testimonials)[0]) => {
  return (
    <div className='mx-4 w-[400px] rounded-xl border border-gray-700 bg-gray-800/50 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'>
      <div className='mb-6 flex items-center space-x-4'>
        <Image
          src={image}
          className='h-12 w-12 rounded-full'
          width={48}
          height={48}
          alt={`${name}'s avatar`}
        />
        <div>
          <h4 className='font-semibold text-emerald-400'>{name}</h4>
          <p className='text-sm text-gray-300'>{role}</p>
        </div>
      </div>
      <p className='text-gray-300'>&quot;{quote}&quot;</p>
    </div>
  );
};

export default function Testimonials() {
  return (
    <section
      id='testimonials'
      className='bg-gradient-to-b from-gray-900 to-green-950 py-24 text-white'>
      <h2 className='mb-16 text-center text-4xl font-bold'>
        Trusted by Industry Leaders
      </h2>
      <div className='relative w-full overflow-hidden py-8'>
        <Marquee className='mb-8 [--duration:40s]'>
          {firstRow.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>
        <Marquee reverse className='[--duration:40s]'>
          {secondRow.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>
        <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-900 via-gray-900/10 to-transparent'></div>
        <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-900 via-gray-900/10 to-transparent'></div>
      </div>
    </section>
  );
}
