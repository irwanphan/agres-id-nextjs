"use client";

import {
  BasketIcon,
  DashboardIcon,
  DownloadsIcon,
  HomeIcon,
  LogOutIcon,
  UserIcon,
} from "@/components/MyAccount/icons";
import { IconUserCircle } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="w-full col-span-12 md:col-span-3 ">
      <div className="flex bg-white md:flex-col rounded-xl shadow-1">
        <div className="flex items-center gap-3 p-4 border-b border-gray-3">
          <div className="overflow-hidden rounded-full bg-red-light-5">
            {/* <Image
              src={session?.user?.image || "/images/avatar.jpeg"}
              alt="user"
              width={48}
              height={48}
              className="rounded-full"
            /> */}
            <IconUserCircle className="w-10 h-10" stroke={1.5} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-dark mb-0">
              {session?.user?.name}
            </p>
            {/* TODO: Tambahkan tanggal pembuatan akun */}
            <p className="text-custom-xs">Bergabung sejak {new Date(session?.user?.createdAt || "").toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="
            flex w-full flex-row gap-1 md:flex-nowrap md:flex-col
            fixed bottom-0 left-0 right-0 p-2 bg-white
            md:relative md:w-full md:flex-col md:gap-4 md:p-0 md:bg-transparent
            border-t border-gray-3 md:border-t-0
            justify-center md:justify-start
          ">
            <Link href="/my-account">
              <DashboardIcon />
              <span className="hidden md:block">
                Dashboard
              </span>
            </Link>

            <Link href="/my-account/orders">
              <BasketIcon />
              <span className="hidden md:block">
                Orders
              </span>
            </Link>

            <Link href="/my-account/downloads">
              <DownloadsIcon />
              <span className="hidden md:block">
                Downloads
              </span>
            </Link>

            <Link href="/my-account/addresses">
              <HomeIcon />
              <span className="hidden md:block">
                Addresses
              </span>
            </Link>

            <Link href="/my-account/account-details">
              <UserIcon />
              <span className="hidden md:block">
                Account Details
              </span>
            </Link>

            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/signin",
                })
              }
              className="flex items-center rounded-md gap-2.5 py-3 px-4.5 ease-out duration-200 hover:bg-blue hover:text-white text-dark-2 bg-gray-1"
            >
              <LogOutIcon />
              <span className="hidden md:block">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ children, href }: { children: React.ReactNode; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NextLink
      href={href}
      className="flex items-center rounded-lg gap-2.5 py-3 px-4 text-sm ease-out duration-200 hover:bg-blue-light-5 hover:text-blue text-dark-2 bg-gray-1 data-[active=true]:bg-blue-light-5 data-[active=true]:text-blue"
      data-active={isActive}
    >
      {children}
    </NextLink>
  );
}
