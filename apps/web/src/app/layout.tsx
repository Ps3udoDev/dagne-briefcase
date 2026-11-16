import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Psicoiris · Psicología Clínica & Acompañamiento Terapéutico',
    template: '%s · Psicoiris',
  },
  description:
    'Acompañamiento psicológico individual para adultos en un entorno seguro, confidencial y humano. Modalidad presencial y telepsicología.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${jakarta.variable} scroll-smooth`}
    >
      <body className="min-h-dvh bg-surface font-sans text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
