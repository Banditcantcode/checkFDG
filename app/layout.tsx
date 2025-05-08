import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inventory Value Calculator',
  description: 'Calculate the total value of your inventory items instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-dark-800`}>
        <main className="container mx-auto px-4 py-4 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 