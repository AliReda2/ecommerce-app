"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch } from "@/lib/hooks";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "@/lib/features/productSlice";
import { Category } from "@/lib/types";

const getOptimalSlides = (count: number) => ({
  320: { slidesPerView: Math.min(2, count) },
  640: { slidesPerView: Math.min(3, count) },
  768: { slidesPerView: Math.min(4, count) },
  1024: { slidesPerView: Math.min(4, count) },
  1280: { slidesPerView: Math.min(4, count) },
  1536: { slidesPerView: Math.min(6, count) },
});

export default function CategoryCarouselClient({
  categories,
}: {
  categories: Category[];
}) {
  const dispatch = useAppDispatch();

  const handleCategoryClick = (categoryId: string) => {
    dispatch(fetchProductsByCategory(categoryId))
      .unwrap()
      .catch((err) => toast.error(err));
  };

  const handleFetchAll = () => {
    dispatch(fetchProducts())
      .unwrap()
      .catch((err) => toast.error(err));
  };

  if (!categories || categories.length === 0)
    return (
      <Swiper modules={[Navigation]} spaceBetween={10} className="py-6 h-72">
        {Array.from({ length: 6 }, (_, i) => (
          <SwiperSlide key={i} className="pt-8 w-auto">
            <div className="flex flex-col items-center justify-between bg-white border rounded-xl w-36 h-40 lg:w-44 lg:h-44 p-5 shadow-sm animate-pulse">
              <Skeleton className="w-20 h-20 rounded-lg mb-3" />
              <Skeleton className="w-16 h-4 mt-2" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      spaceBetween={10}
      breakpoints={getOptimalSlides(categories.length)}
      className="py-6 h-72"
    >
      <SwiperSlide className="pt-8 w-auto">
        <div
          onClick={handleFetchAll}
          className="flex flex-col items-center justify-between bg-white border rounded-xl
          w-36 h-40 lg:w-44 lg:h-44 p-5 shadow-sm cursor-pointer transition-all duration-300 group
          hover:-translate-y-2 hover:shadow-[0px_8px_22px_rgba(0,0,0,0.18)] border-none"
        >
          <div className="relative w-28 h-28 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/codart.png"
              alt="all"
              fill
              className="object-contain p-3"
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-blue-700 text-center">
            All
          </span>
        </div>
      </SwiperSlide>

      {categories.map((item) => (
        <SwiperSlide key={item.id} className="pt-8 w-auto">
          <div
            onClick={() => handleCategoryClick(item.id)}
            className="flex flex-col items-center justify-between bg-white border rounded-xl
              w-36 h-40 lg:w-44 lg:h-44 p-5 shadow-sm cursor-pointer transition-all duration-300 group
              hover:-translate-y-2 hover:shadow-[0px_8px_22px_rgba(0,0,0,0.18)] border-none"
          >
            <div className="relative w-28 h-28 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={item.imageUrl || "/images/codart.png"}
                alt={item.name}
                fill
                className="object-contain p-3"
              />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-blue-700 text-center">
              {item.name}
            </span>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
