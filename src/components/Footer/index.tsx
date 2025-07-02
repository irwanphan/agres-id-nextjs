import { CallIcon, MapIcon } from "@/assets/icons";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/assets/icons/social";
import Link from "next/link";
import AccountLinks from "./AccountLinks";
import FooterBottom from "./FooterBottom";
import { AppStoreIcon, GooglePlayIcon } from "./icons";
import QuickLinks from "./QuickLinks";
import { IconBrandInstagram } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-gray-3">
      <div className="px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
        {/* <!-- footer menu start --> */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-20">
          <div className="max-w-[330px] w-full">
            <h2 className="mb-7.5 text-xl font-semibold text-dark">
              Help & Support
            </h2>

            <ul className="flex flex-col gap-3">
              <li className="flex gap-4.5 text-base">
                <span className="shrink-0">
                  <MapIcon className="fill-blue" width={24} height={24} />
                </span>
                JL. Gunung Sahari Raya 1, Mangga Dua Square Blok A No. 8, Jakarta Utara
              </li>

              <li>
                <Link
                  href="https://wa.me/6281297009800"
                  className="flex items-center gap-4.5 text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CallIcon className="fill-blue" width={24} height={24} />
                  (+62) 812-9700-9800
                </Link>
              </li>

              <li>
                <Link
                  href="https://www.instagram.com/agres.id/"
                  className="flex items-center gap-4.5 text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandInstagram className="text-blue" stroke={1.5} width={24} height={24} />
                  agres.id
                </Link>
              </li>
            </ul>

            {/* <!-- Social Links start --> */}
            <div className="flex items-center gap-4 mt-7.5">
              <Link
                href="https://www.facebook.com/agres.id"
                className="flex duration-200 ease-out hover:text-blue"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Facebook link</span>
                <FacebookIcon />
              </Link>

              <Link
                href="https://x.com/agres_id"
                className="flex duration-200 ease-out hover:text-blue"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Twitter link</span>
                <TwitterIcon />
              </Link>

              <Link
                href="https://www.instagram.com/agres.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex duration-200 ease-out hover:text-blue"
              >
                <span className="sr-only">Instagram link</span>
                <InstagramIcon />
              </Link>

              <Link
                href="https://www.linkedin.com/company/agres-id"
                aria-label="Linkedin Social Link"
                className="flex duration-200 ease-out hover:text-blue"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn link</span>
                <LinkedInIcon />
              </Link>
            </div>
            {/* <!-- Social Links end --> */}
          </div>

          <AccountLinks />

          <QuickLinks />

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-xl font-semibold text-dark lg:text-right">
              Download App
            </h2>

            <p className="mb-4 lg:text-right text-custom-sm">
              Get started in seconds – it&apos;s fast, free, and easy!
            </p>

            <ul className="flex flex-col gap-3 lg:items-end">
              <li>
                <Link
                  className="inline-flex items-center gap-3 py-[9px] pl-4 pr-7.5 hover:bg-gray-3 text-white rounded-lg border border-gray-3  ease-out duration-200 hover:bg-opacity-95"
                  href="#"
                >
                  <AppStoreIcon />

                  <div>
                    <span className="block text-custom-xs text-dark-3">
                      Download on the
                    </span>
                    <p className="font-semibold text-dark">App Store</p>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  className="inline-flex items-center gap-3 py-[9px] pl-4 pr-8.5 text-white hover:bg-gray-3 rounded-lg border border-gray-3 ease-out duration-200 hover:bg-opacity-95"
                  href="#"
                >
                  <GooglePlayIcon />

                  <div>
                    <span className="block text-custom-xs text-dark-3">
                      {" "}
                      Get in On{" "}
                    </span>
                    <p className="font-semibold text-dark">Google Play</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* <!-- footer menu end --> */}
      </div>

      <FooterBottom />
    </footer>
  );
};

export default Footer;
