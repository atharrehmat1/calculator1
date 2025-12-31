import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthLayout } from '@/components/auth-layout';
import { AuthProvider } from '@/contexts/auth-context';
import { TranslationProvider } from '@/contexts/translation-context';
import { PageTranslationWrapper } from '@/components/page-translation-wrapper';
import { LanguageLinkInterceptor } from '@/components/language-link-interceptor';

export const metadata: Metadata = {
  title: 'Calculator1.org',
  description: 'Over 3,700 free calculators in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <LanguageLinkInterceptor>
              <PageTranslationWrapper>
                <AuthProvider>
                  <AuthLayout>
                    <main className="flex-grow">{children}</main>
                  </AuthLayout>
                  <Toaster />
                </AuthProvider>
              </PageTranslationWrapper>
            </LanguageLinkInterceptor>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
