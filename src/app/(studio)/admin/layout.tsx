import { Metadata } from "next";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import NextTopLoader from "nextjs-toploader";
import DashboardWrapper from "./_components/DashboardWrapper";
import { getSeoSettings, getSiteName } from "@/get-api-data/seo-setting";

// export const generateMetadata = async (): Promise<Metadata> => {
//   const site_name = await getSiteName();
//   return {
//     title: `Admin Dashboard | ${site_name}`,
//     description: `This is Admin Dashboard for ${site_name}`,
//   };
// };

export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await getSeoSettings();
  const site_name = await getSiteName();
  return {
    title: `${seoSettings?.siteTitle || "Admin Dashboard"} | ${site_name}`,
    description: seoSettings?.metadescription || "Cozy-commerce is a next.js e-commerce boilerplate built with nextjs, typescript, tailwindcss, and prisma.",
    keywords: seoSettings?.metaKeywords || "e-commerce, online store",
    openGraph: {
      images: seoSettings?.metaImage ? [seoSettings.metaImage] : [],
    },
    icons: {
      icon: seoSettings?.favicon || "/favicon.ico",
      shortcut: seoSettings?.favicon || "/favicon.ico",
      apple: seoSettings?.favicon || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PreLoader />
      <>
        <Providers>
          <NextTopLoader
            color="#3C50E0"
            crawlSpeed={300}
            showSpinner={false}
            shadow="none"
          />
          <Toaster position="top-center" reverseOrder={false} />
          <DashboardWrapper>{children}</DashboardWrapper>
        </Providers>
        <ScrollToTop />
      </>
    </div>
  );
}
