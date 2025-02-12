'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoOverlayProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoOverlay({ videoId, isOpen, onClose }: VideoOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20'>
            <X className='h-6 w-6' />
          </button>
          <div className='relative aspect-video w-full max-w-6xl px-4'>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='h-full w-full rounded-lg'
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
