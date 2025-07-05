import { Metadata } from "next";
import MailSuccess from "@/components/MailSuccess";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";


export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `Mail Success Page | ${site_name}`,
    description: `This is Mail Success Page for ${site_name}`,
  };
};

const MailSuccessPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Mail Success",
            href: "/mail-success",
          },
        ]}
      />
      <MailSuccess />
    </>
  );
};

export default MailSuccessPage;
