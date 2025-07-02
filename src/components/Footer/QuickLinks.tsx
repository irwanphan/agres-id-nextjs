import Link from "next/link";

const quickLinks = [
  {
    id: 1,
    label: "Kebijakan Privasi",
    href: "/privacy-policy",
  },
  {
    id: 2,
    label: "Kebijakan Pengembalian",
    href: "/terms-condition",
  },
  {
    id: 3,
    label: "Syarat dan Ketentuan Penggunaan",
    href: "/terms-condition",
  },
  {
    id: 4,
    label: "FAQ's",
    href: "#",
  },
  {
    id: 5,
    label: "Kontak",
    href: "/contact",
  },
];

export default function QuickLinks() {
  return (
    <div className="w-full sm:w-auto">
      <h2 className="mb-7.5 text-xl font-semibold text-dark">Tautan Cepat</h2>

      <ul className="flex flex-col gap-3">
        {quickLinks.map((link) => (
          <li key={link.id}>
            <Link
              className="text-base duration-200 ease-out hover:text-blue"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
