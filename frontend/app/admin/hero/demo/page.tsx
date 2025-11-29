"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { fetchHeroes } from "@/lib/features/heroSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import type { Hero } from "@/lib/types";

const Hero = () => {
  const dispatch = useAppDispatch();
  const heroesFromStore = useAppSelector((s) => s.hero?.heroes ?? []) as Hero[];
  const swiperRef = useRef<SwiperType | null>(null);

  const slides: Hero[] = heroesFromStore.slice(0, 3);
  const secondary1 = heroesFromStore[3];
  const secondary2 = heroesFromStore[4];

  useEffect(() => {
    dispatch(fetchHeroes());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen lg:min-h-0 flex justify-center py-6 sm:py-8 md:py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 2xl:max-w-[95%] 2xl:grid-cols-5 2xl:grid-rows-2 xl:max-w-[90%] xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-5 lg:grid-rows-2 lg:h-fit md:grid-cols-2 md:grid-rows-3 sm:grid-cols-1 sm:grid-rows-4 grid-cols-1 grid-rows-[auto_auto_auto]">
        {/* Main Hero Swiper */}
        <div className="relative rounded-xl shadow-lg overflow-hidden 2xl:col-span-3 2xl:row-span-2 xl:col-span-3 xl:row-span-2 lg:col-span-3 lg:row-span-2 md:col-span-2 md:row-span-2 sm:row-span-2 bg-white hero-swiper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="h-full rounded-xl"
          >
            {slides.map((card) => (
              <SwiperSlide key={card.id}>
                <section
                  className={`grid h-full items-center grid-cols-1 sm:grid-cols-2 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 gap-6 ${
                    card.backgroundColor
                      ? `[background-color:${card.backgroundColor}]`
                      : "bg-blue-100"
                  }`}
                >
                  <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
                    <span
                      className={`uppercase tracking-wide text-sm sm:text-base lg:text-xl ${
                        card.subtitleColor
                          ? `[color:${card.subtitleColor}]`
                          : "text-blue-700"
                      }`}
                    >
                      {card.subtitle}
                    </span>
                    <h1
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold ${
                        card.titleColor
                          ? `[color:${card.titleColor}]`
                          : "text-black"
                      }`}
                    >
                      {card.title}
                    </h1>
                    <p
                      className={`text-sm sm:text-base md:text-lg lg:text-xl ${
                        card.descriptionColor
                          ? `[color:${card.descriptionColor}]`
                          : "text-gray-700"
                      }`}
                    >
                      {card.description}
                    </p>
                    <Button
                      className={`w-fit mt-4 px-6 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                        card.buttonColor
                          ? `[background-color:${card.buttonColor}] text-white`
                          : "bg-blue-700 text-white"
                      }`}
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                  <div className="flex justify-center sm:justify-end">
                    <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] aspect-square">
                      <Image
                        src={card.imageUrl || "/images/codart.webp"}
                        alt={card.imageAlt || "hero"}
                        fill
                        className="object-contain"
                        priority
                        draggable={false}
                      />
                    </div>
                  </div>
                </section>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Scoped pagination styles */}
          <style jsx>{`
            .hero-swiper :global(.swiper-pagination-bullet) {
              background: #d1d5db !important;
              width: 12px !important;
              height: 12px !important;
              opacity: 1 !important;
              transition: transform 0.3s ease, background 0.3s ease;
            }
            .hero-swiper :global(.swiper-pagination-bullet-active) {
              background: #1d4ed8 !important;
              transform: scale(1.3);
            }
            .hero-swiper :global(.swiper-pagination) {
              bottom: 18px !important;
            }
          `}</style>
        </div>

        {/* Secondary Cards */}
        {[secondary1, secondary2].map(
          (card) =>
            card && (
              <section
                key={card.id}
                className={`flex justify-between items-center px-6 sm:px-8 py-8 rounded-xl shadow-lg 2xl:col-span-2 xl:col-span-2 lg:col-span-2 h-fit ${
                  card.backgroundColor
                    ? `[background-color:${card.backgroundColor}]`
                    : "bg-green-100"
                }`}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`${
                        card.subtitleColor
                          ? `[color:${card.subtitleColor}]`
                          : "text-gray-900"
                      } text-xl sm:text-2xl`}
                    >
                      {card.subtitle}
                    </span>
                    <span
                      className={`${
                        card.descriptionColor
                          ? `[color:${card.descriptionColor}]`
                          : "text-gray-500"
                      } text-xs tracking-wider uppercase`}
                    >
                      Sale
                    </span>
                  </div>
                  <hr className="border-gray-300 w-16" />
                  <h1
                    className={`${
                      card.titleColor
                        ? `[color:${card.titleColor}]`
                        : "text-gray-900"
                    } text-2xl sm:text-3xl md:text-4xl`}
                  >
                    {card.title}
                  </h1>
                  <Button
                    className={`w-fit mt-4 px-4 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                      card.buttonColor
                        ? `[background-color:${card.buttonColor}] text-white`
                        : "bg-blue-700 text-white"
                    }`}
                  >
                    {card.buttonText}
                  </Button>
                </div>
                <div className="flex">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60">
                    <Image
                      src={card.imageUrl || "/images/codart.webp"}
                      alt={card.imageAlt || "secondary-hero"}
                      fill
                      className="object-contain"
                      priority
                      draggable={false}
                    />
                  </div>
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
};

export default Hero;
