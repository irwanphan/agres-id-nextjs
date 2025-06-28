"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import { menuData } from "./menuData";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";
import GlobalSearchModal from "../Common/GlobalSearch";
import { HeaderSetting } from "@prisma/client";
import { useAppSelector } from "@/redux/store";
import { IconBrandWhatsappFilled } from "@tabler/icons-react";

type IProps = {
  headerData?: HeaderSetting | null;
};

const MainHeader = ({ headerData }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const { data: session } = useSession();
  const { handleCartClick, cartCount, totalPrice } = useShoppingCart();
  const wishlistCount = useAppSelector((state) => state.wishlistReducer).items
    ?.length;

  const handleOpenCartModal = () => {
    handleCartClick();
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setNavigationOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-50 bg-white transition-all ease-in-out duration-300 ${
          stickyMenu && "shadow-sm"
        }`}
      >
        {/* Topbar */}
        <div className={`bg-[#3c0366] transition-all ease-in-out duration-300 ${stickyMenu ? "h-0 py-0" : "h-10 py-2"} overflow-hidden`}>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-0">
            <div className="flex justify-between">
              <div className="hidden lg:flex flex-row gap-3 items-center">
                <div className="text-sm font-medium text-white">
                  {headerData?.headerText ||
                    "Get free delivery on orders over $100"}
                </div>
                <div>|</div>
                <div className="flex flex-row gap-4 items-center">
                  <Link href="https://agreskomputer.com" className="text-sm font-semibold text-white">Agres Komputer</Link>
                  <Link href="https://agrescare.com" className="text-sm font-semibold text-white">Agres Care</Link>
                  <Link href="https://starlink.com" className="text-sm font-semibold text-white">
                    <Image src="/images/brands/starlink-text.svg" alt="Starlink" width={120} height={16} 
                      className="w-auto h-[1rem]"/>
                  </Link>
                  <Link href="https://digitalalliance.co.id/" className="text-sm font-semibold text-white">
                    <Image src="/images/brands/DA-Black.svg" alt="DA" width={148} height={24}
                      className="w-auto h-[1rem]"/>
                  </Link>
                </div>
              </div>
              <div className="flex divide-x divide-white/20">
                {session?.user ? (
                  <p className="pr-3 text-sm font-medium text-white transition cursor-pointer hover:text-blue-300">
                    {headerData?.headerTextTwo || "Welcome Back"}{" "}
                    {session?.user.name?.split(" ")[0]}
                  </p>
                ) : (
                  <Link
                    href="/signup"
                    className="pr-3 text-sm font-medium text-white transition hover:text-blue-300"
                  >
                    Create an account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Header */}
        <div className={` 
                          mx-auto max-w-7xl 
                          px-4 sm:px-6 xl:px-0 
                          flex flex-col sm:flex-row
                          justify-between items-start sm:items-center
                          transition-all ease-in-out duration-300
                          ${stickyMenu ? "py-0 sm:py-2" : "py-2 sm:py-4"}
                        `}>
          {/* Logo */}
          <div className="flex w-full justify-between items-center border-b border-gray-3 sm:border-b-0">
            <Link className="block py-3 sm:py-2 shrink-0" href="/">
              <Image
                src={headerData?.headerLogo || "/images/logo/logo.svg"}
                alt="Logo"
                width={148}
                height={36}
                priority
              />
            </Link>
            {/* <span className="ml-2 font-bold text-2xl">NextMerce</span> */}

            {/* Mobile Menu Toggle */}
            <button
              className="transition xl:hidden focus:outline-none"
              onClick={() => setNavigationOpen(!navigationOpen)}
              aria-label={navigationOpen ? "Close menu" : "Open menu"}
            >
              {navigationOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Search Bar */}
          {/* <div className="flex-1 mx-8">
            <SearchBarComponent />
          </div> */}

          {/* Support, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-6 py-3 sm:py-0">
            <Link 
              href="https://wa.me/6281297009800" 
              className="flex items-center gap-1 sm:gap-2 transition hover:text-blue focus:outline-none" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <IconBrandWhatsappFilled color="#25D366" />
              <div>
                <div className="hidden sm:block text-xs text-gray-400">24/7 SUPPORT</div>
                <div className="text-base hidden sm:block whitespace-nowrap">(+62) 812-9700-9800</div>
                <div className="text-sm sm:hidden font-semibold whitespace-nowrap">Support</div>
              </div>
            </Link>
            <div>
              <Link
                href={
                  session?.user?.role === "ADMIN"
                    ? "/admin/dashboard"
                    : session?.user?.role === "USER"
                    ? "/my-account"
                    : "/signin"
                }
                className="transition hover:text-blue focus:outline-none flex items-center gap-1 sm:gap-2"
                aria-label="Account"
              >
                <UserIcon />
                <div>
                  <div className="hidden sm:block text-xs text-gray-400">ACCOUNT</div>
                  <div className="text-sm sm:text-base font-semibold whitespace-nowrap">{session?.user.name?.split(" ")[0] || "Sign In"}</div>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 sm:gap-2 text-gray-700 transition hover:text-blue focus:outline-none"
                onClick={handleOpenCartModal}
                aria-label="Cart"
              >
                <div className="relative">
                  <CartIcon />
                  <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-white bg-red-600 text-[10px] font-normal rounded-full inline-flex items-center justify-center">
                    {cartCount || 0}
                  </span>
                </div>
                <div>
                  <div className="hidden sm:block text-xs text-gray-400 text-left">CART</div>
                  <span className="text-sm sm:text-base font-semibold whitespace-nowrap">Rp 1800</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <hr className="border-slate-50 border-b border-[0.5px] block opacity-10"/>

        {/* Navigation Header */}
        <div className={`px-4 mx-auto max-w-7xl sm:px-6 xl:px-0 transition-all ease-in-out duration-300 ${stickyMenu ? "py-0" : "py-2"}`}>
          <div className="flex items-center justify-between">
            

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden xl:block">
              <DesktopMenu menuData={menuData} stickyMenu={stickyMenu} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                className="transition hover:text-blue focus:outline-none"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              <Link
                href="/wishlist"
                className="relative text-gray-700 transition hover:text-blue focus:outline-none"
                aria-label="Wishlist"
              >
                <HeartIcon />
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] text-white bg-red-600 text-[10px] font-normal rounded-full inline-flex items-center justify-center">
                  {wishlistCount}
                </span>
              </Link>

              
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Offcanvas */}

      <MobileMenu
        headerLogo={headerData?.headerLogo || null}
        isOpen={navigationOpen}
        onClose={() => setNavigationOpen(false)}
        menuData={menuData}
      />

      {/* Search Modal Placeholder */}
      {searchModalOpen && (
        <GlobalSearchModal
          searchModalOpen={searchModalOpen}
          setSearchModalOpen={setSearchModalOpen}
        />
      )}
    </>
  );
};

export default MainHeader;
