"use client";

import { signOut, useSession } from "next-auth/react";
import { IconMoodWink } from "@tabler/icons-react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="p-6 bg-white rounded-lg shadow-1">
      <p className="text-dark text-sm">
        <span className="font-bold text-xl mr-3">
          Hello {session?.user?.name}
        </span>
        <span className="font-normal">
          (bukan {session?.user?.name} ?
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="pl-1 duration-200 ease-out text-red hover:underline"
        >
          Log Out
        </button>
        )
      </p>

      <div className="flex items-center gap-2 mt-4">
        <IconMoodWink className="w-14 h-14" stroke={1.5} />
        <p className="text-custom-sm">
          Dari dashboard akun Anda, Anda dapat melihat pesanan terbaru Anda,
          mengelola alamat pengiriman dan pembayaran Anda, serta mengubah kata
          sandi dan detail akun Anda.
        </p>
      </div>
    </div>
  );
}
