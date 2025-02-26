import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { DataProvider } from "@/contexts/data-context"

export const metadata: Metadata = {
  title: 'Data Alchemy - AI-Powered Synthetic Data Generation',
  description: 'Advanced synthetic data generation using VAEs, GANs, and Copula-based synthesis',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <DataProvider>
          <Providers>{children}</Providers>
        </DataProvider>
      </body>
    </html>
  );
}