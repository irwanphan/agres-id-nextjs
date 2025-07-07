import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";
import { getSiteName } from "@/get-api-data/seo-setting";
import Breadcrumb from "@/components/Common/Breadcrumb";


export const generateMetadata = async (): Promise<Metadata> => {
  const site_name = await getSiteName();
  return {
    title: `Signin Page | ${site_name}`,
    description: `This is Signin Page for ${site_name}`,
  };
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Signin",
            href: "/signin",
          },
        ]}
        seoHeading={true}
      />
      <Signin />
    </>
  );
};

export default SigninPage;
