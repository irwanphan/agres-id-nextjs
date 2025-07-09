"use client";

import AddressModal from "@/components/MyAccount/AddressModal";
import { SquarePencilIcon } from "@/components/MyAccount/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddressType } from "@/get-api-data/address";
import { IconMail, IconMailbox, IconMap2, IconMapPin, IconMapRoute, IconPhone, IconUser } from "@tabler/icons-react";

type PropsType = {
  userId?: string;
};

export function BillingAddress({ userId }: PropsType) {
  const [data, setData] = useState<AddressType>();

  const [addressModal, setAddressModal] = useState(false);

  const openAddressModal = () => {
    setAddressModal(true);
  };

  const closeAddressModal = () => {
    setAddressModal(false);
  };

  function fetchAddress() {
    if (!userId) return;

    axios
      .get(`/api/user/${userId}/address?type=BILLING`)
      .then(({ data }) => setData(data))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      <div className="w-full bg-white shadow-1 rounded-xl">
        <div className="flex items-center justify-between py-5 px-4 sm:pl-7.5 sm:pr-6 border-b border-gray-3">
          <p className="text-base font-medium text-dark">Billing Address</p>

          <button
            className="duration-200 ease-out text-dark hover:text-blue"
            onClick={openAddressModal}
          >
            <span className="sr-only">Open edit info modal</span>
            <SquarePencilIcon />
          </button>
        </div>

        <div className="p-4 sm:p-7.5">
          {data ? (
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconUser stroke={1.2} />
                Name: <span className="font-medium text-dark">{data?.name}</span>
              </p>

              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconMail stroke={1.2} />
                Email: <span className="font-medium text-dark">{data?.email}</span>
              </p>

              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconPhone stroke={1.2} />
                Phone: <span className="font-medium text-dark">{data?.phone}</span>
              </p>

              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconMap2 stroke={1.2} />
                Province: <span className="font-medium text-dark">{data?.province}</span>
              </p>

              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconMapRoute stroke={1.2} />
                City: <span className="font-medium text-dark">{data?.city}</span>
              </p>

              <p className="flex items-center gap-2.5 text-custom-sm">
                <IconMailbox stroke={1.2} />
                Zip Code: <span className="font-medium text-dark">{data?.zipCode}</span>
              </p>

              <p className="flex gap-2.5 text-custom-sm">
                <IconMapPin stroke={1.2} />
                Address: <span className="font-medium text-dark">{data?.address.address1}
                {data?.address.address2 && `, ${data?.address.address2}`}</span>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-dark-4">No address set yet</p>
              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white duration-200 ease-out rounded-lg bg-dark hover:bg-blue"
                onClick={openAddressModal}
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>

      <AddressModal
        isOpen={addressModal}
        closeModal={closeAddressModal}
        onSubmitSuccess={fetchAddress}
        addressType="BILLING"
        data={data}
        userId={userId}
        key={data?.id}
      />
    </>
  );
}
