"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

const CategoryCarousel = () => {
  return (

      <div className="max-w-[76%] mb-20">
        <h1 className="text-4xl font-mono font-semibold">Categories</h1>

        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          slidesPerView={6}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="py-6 h-72"
        >
          {[
            { label: "Phone Chargers", img: "/images/charger.png" },
            { label: "Phone Cases", img: "/images/case.png" },
            { label: "Phone Accessories", img: "/images/phoneAccesories.png" },
            { label: "Smart Watches", img: "/images/watch.png" },
            { label: "Car Accessories", img: "/images/carAccessories.png" },
            { label: "Earphones", img: "/images/earphones.png" },
            { label: "Headphones", img: "/images/headset.png" },
            { label: "Laptops", img: "/images/laptop.png" },
            { label: "Keyboards", img: "/images/keyboard.png" },
          ].map((item, index) => (
            <SwiperSlide key={index} className="pt-8">
              <div
                className="flex flex-col items-center justify-between bg-white border rounded-xl
                w-44 h-44 p-5 shadow-sm cursor-pointer transition-all duration-300 group
                hover:-translate-y-2 hover:shadow-[0px_8px_22px_rgba(0,0,0,0.18)]"
              >
                <div
                  className="relative w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center
                  transition-transform duration-300 group-hover:scale-105"
                >
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300 text-center">
                  {item.label}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
  );
};

export default CategoryCarousel;
