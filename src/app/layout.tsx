import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "../components/seo/JsonLd";
import { generateOrganizationSchema, generateWebSiteSchema } from "../lib/seo/json-ld";
import { getSiteUrl } from "../lib/seo/site-url";
import { CRITICAL_CSS } from "../styles/critical-css";
import { SiteShell } from "../components/layout/SiteShell";

/**
 * Métadonnées par défaut — serveur uniquement.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Pluton OTT — Panel Grossiste IPTV B2B",
    template: "%s | Pluton OTT",
  },
  description: "Panel B2B francophone pour revendeurs et grossistes IPTV. Gérez vos lignes, générez des accès multi-serveurs et développez votre activité de revendeur IPTV.",
};

const systemFontStack = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  '"Noto Sans"',
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
].join(", ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html lang="fr">
      <head>
        {/* Injection du CSS Critique pour un LCP rapide sans CLS */}
        <style data-critical-css dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3D9LFMSMGW" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3D9LFMSMGW');
          `}
        </Script>
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xeuv6u60ng");
          `}
        </Script>
      </head>
      <body style={{ fontFamily: systemFontStack }}>
        <JsonLd data={[orgSchema, webSiteSchema]} />
        <SiteShell sourcePath="/">
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
