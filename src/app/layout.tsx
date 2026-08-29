import { Geist, Geist_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import Script from 'next/script';
import '@/styles/globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const locale = await getLocale();
  const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang={locale}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
        {analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${analyticsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
};

export default RootLayout;
