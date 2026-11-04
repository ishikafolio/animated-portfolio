import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";
import SiteExperience from "@/components/studio/SiteExperience";
import CustomCursor from "@/components/shared/CustomCursor";

const cubao = localFont({
  src: [
    {
      path: "../../public/fonts/cubao-free.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/cubao-free.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cubao",
  display: "swap",
});

const poppins = localFont({
  src: [
    {
      path: "../../public/fonts/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ishika Shrivastav — UI/UX & Graphic Designer",
  description:
    "Editorial portfolio of Ishika Shrivastav. Specializing in UI/UX design, brand identity systems, and tactile packaging craft.",
  keywords: [
    "Ishika Shrivastav",
    "UI/UX Designer",
    "Graphic Designer",
    "Brand Identity",
    "Packaging Design",
    "Portfolio",
    "Next.js",
  ],
  authors: [{ name: "Ishika Shrivastav" }],
  openGraph: {
    title: "Ishika Shrivastav — UI/UX & Graphic Designer",
    description:
      "Award-level editorial portfolio of Ishika Shrivastav. Specializing in UI/UX design, brand identity systems, and tactile packaging craft.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cubao.variable} ${poppins.variable} scroll-smooth`}>
      <body className="bg-[#F3F3E7] text-[#24121B] font-body antialiased selection:bg-[#890149] selection:text-[#F3F3E7]">
        <SiteExperience>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CustomCursor />
        <HeaderNav />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <Footer />
        </SiteExperience>
      </body>
    </html>
  );
}
