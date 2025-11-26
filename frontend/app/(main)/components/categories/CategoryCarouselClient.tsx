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
import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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

  const handlePrev = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.isBeginning) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.isEnd) {
      swiperRef.current.slideNext();
    }
  }, []);

  const onSwiper = useCallback((swiper: any) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const onSlideChange = useCallback((swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  if (!categories || categories.length === 0)
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-lg" />
          </div>
        </div>
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
      </div>
    );

  return (
    <div>
      {/* Navigation Arrows at Top */}
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={isBeginning}
            className={`
      p-2 rounded-lg transition-all duration-200
      ${
        isBeginning
          ? "text-gray-400 cursor-not-allowed bg-gray-100"
          : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
      }
    `}
            aria-label="Previous categories"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={isEnd}
            className={`
      p-2 rounded-lg transition-all duration-200
      ${
        isEnd
          ? "text-gray-400 cursor-not-allowed bg-gray-100"
          : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
      }
    `}
            aria-label="Next categories"
          >
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={5}
        breakpoints={getOptimalSlides(categories.length)}
        className="py-6 h-72"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
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
                src="/images/codart.webp"
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
                  src={item.imageUrl || "/images/codart.webp"}
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
    </div>
  );
}
