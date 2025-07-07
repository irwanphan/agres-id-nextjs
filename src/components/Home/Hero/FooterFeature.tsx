import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Pengiriman Cepat",
    description: "Tim siap mengirimkan pesanan Anda",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Pengembalian Barang",
    description: "Barang tidak sesuai bisa dikembalikan",
  },
  // {
  //   img: "/images/icons/icon-03.svg",
  //   title: "Pembayaran Aman",
  //   description: "Pembayaran via partner terpercaya",
  // },
  {
    img: "/images/icons/icon-04.svg",
    title: "Dukungan 24/7",
    description: "Bisa melalui WhatsApp, Telegram, atau Email",
  },
];

const FooterFeature = () => {
  return (
    <section className="pb-[60px]">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-8 xl:px-0 ">
        <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5">
          {featureData.map((item, key) => (
            <div className="flex items-center justify-center gap-4" key={key}>
              <Image src={item.img} alt="icons" width={40} height={41} />

              <div>
                <h3 className="text-lg font-semibold text-dark">
                  {item.title}
                </h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterFeature;
