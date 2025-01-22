import Image from 'next/image';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'motion/react';

export function SideBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.aside
          layout
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 250,
            mass: 1,
          }}
          className='absolute left-0 top-0 z-50 h-[100vh] w-[400px] overflow-y-auto bg-neutral-900 shadow-lg'
          role='complementary'
          aria-label='Sidebar'>
          <div>
            <div className='relative'>
              <Image
                src='https://placehold.co/600x400'
                alt='placeholder'
                width={600}
                height={400}
                priority
              />
              <button
                onClick={onClose}
                className='absolute right-2 top-1.5 rounded-full bg-neutral-900 px-3.5 py-2 transition-all hover:bg-neutral-800 active:scale-95'
                aria-label='Close sidebar'>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <h1 className='text-4xl font-bold'>Sidebar</h1>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
