import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/app/globals.css';

config.autoAddCss = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ESG For Good',
  description: 'ESG For Good',
  icons: {
    icon: [
      {
        url: '/images/icon-green.png',
        href: '/images/icon-green.png',
      },
    ],
    shortcut: '/images/icon-green.png',
    apple: '/images/icon-green.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/images/icon-green.png' />
        <link rel='shortcut icon' href='/images/icon-green.png' />
        {/* TODO: Remove this once new maps page is complete */}
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
