"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import ClearFilters from "./ClearFilters";
import ColorsDropdown from "./ColorsDropdown";
import RadixSlider from "./RadixSlider";
import SizeDropdown from "./SizeDropdown";

import {
  FourSquaresIcon,
  SidebarToggleIcon,
  TwoSquaresIcon,
} from "@/assets/icons";
import SingleListItem from "../Shop/SingleListItem";
import ProductsEmptyState from "./ProductsEmptyState";
import TopBar from "./TopBar";
import { Product } from "@/types/product";
import { Category } from "@prisma/client";
import usePagination from "@/hooks/usePagination";
import Pagination from "../Common/Pagination";
import ProductItem from "../Common/ProductItem";

type PropsType = {
  data: {
    allProducts: Product[];
    products: Product[];
    categories: (Category & { productCount: number })[];
    allProductsCount: number;
    highestPrice: number;
  };
};

const ShopWithSidebar = ({ data }: PropsType) => {
  const { allProducts, products, categories, allProductsCount } = data;
  const { currentItems, handlePageClick, pageCount } = usePagination(
    products,
    9
  );
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const availableSizes = useMemo(() => {
    const sizes = allProducts.flatMap(
      (product) => product.productVariants.map((item) => item.size) || []
    );
    return [...new Set(sizes.filter((size) => size.trim() !== ""))];
  }, [allProducts]);

  const availableColors = useMemo(() => {
    const colors = allProducts.flatMap(
      (product) => product.productVariants.map((item) => item.color) || []
    );
    return [...new Set(colors)];
  }, [allProducts]);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event: any) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  return (
    <>
      <section className="relative pb-20 overflow-hidden bg-gray-2">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-8 xl:px-0">
          <div className="grid gap-6 xl:grid-cols-12">
            {/* Sidebar Start */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static  xl:col-span-3 w-full ease-out duration-200 ${
                productSidebar ? "translate-x-0 bg-white" : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-13 sm:right-8 rounded-lg border border-gray-3 bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <span className="flex items-center justify-center rounded-md size-10">
                  <SidebarToggleIcon />
                </span>
              </button>

              <div className="flex flex-col gap-6 overflow-y-auto max-xl:h-screen max-xl:p-5">
                {/* filter box */}
                <ClearFilters />

                <Suspense>
                  <CategoryDropdown categories={categories} />
                </Suspense>

                {/* gender box */}
                {/* <GenderDropdown genders={genders} /> */}

                <Suspense>
                  <SizeDropdown availableSizes={availableSizes} />
                </Suspense>

                {/* color box */}
                <ColorsDropdown availableColors={availableColors} />

                {/*  price range box */}
                <RadixSlider highestPrice={data.highestPrice} />
              </div>
            </div>
            {/* Sidebar End */}

            {/* Content Start */}
            <div className="w-full xl:col-span-9">
              <div className="rounded-xl bg-white pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* top bar left */}
                  <TopBar
                    allProductsCount={allProductsCount}
                    showingProductsCount={currentItems.length}
                  />

                  {/* top bar right */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10 h-10 rounded-lg border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <FourSquaresIcon />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10 h-10 rounded-lg border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <TwoSquaresIcon />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid Tab Content Start */}
              {currentItems.length ? (
                <div
                  className={
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {currentItems.map((product) => {
                    return productStyle === "grid" ? (
                      <ProductItem
                        key={product.id}
                        item={product}
                        bgClr="white"
                      />
                    ) : (
                      <SingleListItem key={product.id} item={product} />
                    );
                  })}
                </div>
              ) : (
                <ProductsEmptyState />
              )}

              {/* pagination start */}
              <div className="mt-14">
                <Pagination
                  handlePageClick={handlePageClick}
                  pageCount={pageCount}
                />
              </div>
              {/* pagination end */}
            </div>

            {/* Content End */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
