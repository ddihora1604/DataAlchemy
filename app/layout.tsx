import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { DataProvider } from "@/contexts/data-context"

export const metadata: Metadata = {
  title: 'DataAlchemy - Synthetic Numerical Data Generator',
  description: 'Advanced synthetic numerical data generation using Gaussian Mixture Model, incorporating robust statistical tests, measures, and comprehensive numerical analysis and actionable data insights.',
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