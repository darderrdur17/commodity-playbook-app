import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Commodity Playbook — Build Your Career in Commodity Trading",
    template: "%s | Commodity Playbook",
  },
  description:
    "The definitive career and sales guide for commodity trading. Starter, Pro, and Elite resources for anyone building a desk, breaking in, or selling into trading firms.",
  keywords: [
    "commodity trading",
    "career guide",
    "playbook",
    "energy trading",
    "metals trading",
    "agriculture trading",
    "desk analyst",
  ],
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://commodityplaybook.com",
    siteName: "Commodity Playbook",
    title: "Commodity Playbook — Build Your Career in Commodity Trading",
    description:
      "The definitive career guide for commodity trading. From first desk to senior coverage.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Commodity Playbook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commodity Playbook",
    description: "The definitive career guide for commodity trading.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/brand/logo-mark.png",
    apple: "/brand/logo-mark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0830a0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-800 min-h-screen flex flex-col overflow-x-hidden">
        <SessionProvider>
          <Nav />
          <main className="flex-1 pt-[calc(80px+env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
