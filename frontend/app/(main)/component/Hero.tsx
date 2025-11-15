"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

const cards = [
  {
    title: "Essential Tech Solutions",
    subtitle: "Fast Charging",
    description:
      "Premium tech accessories for your daily needs. Quality products designed to power up your devices.",
    buttonText: "Shop Now",
    image: "/images/headset.png",
  },
  {
    title: "Wireless Audio",
    subtitle: "20% off",
    description: "High-quality wireless audio for music lovers.",
    buttonText: "Shop Collection",
    image: "/images/powerbank.png",
  },
  {
    title: "Power & Charging",
    subtitle: "Fast Charging",
    description: "Reliable chargers and accessories for all your devices.",
    buttonText: "Shop Now",
    image: "/images/wireless.png",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const handleSlideTo = (idx: number) => {
    setPrevIndex(activeIndex);
    setActiveIndex(idx);
  };

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(activeIndex);

      setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 3000); // 5 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const getTransform = (idx: number) => {
    if (idx === activeIndex) return "translate-x-0 z-20";

    const forward =
      activeIndex > prevIndex ||
      (activeIndex === 0 && prevIndex === cards.length - 1);

    if (forward) {
      return idx < activeIndex
        ? "-translate-x-full z-10"
        : "translate-x-full z-10";
    } else {
      return idx > activeIndex
        ? "translate-x-full z-10"
        : "-translate-x-full z-10";
    }
  };

  return (
    <div className="w-full flex justify-center py-5">
      {/* Centered container */}
      <div className="grid 2xl:max-w-[76%] xl:max-w-[90%] lg:max-w-full md:w-full sm:w-full w-full  2xl:grid-cols-5 2xl:grid-rows-2 xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-5 lg:grid-rows-2 md:grid-cols-1 md:grid-rows-4 sm:grid-cols-1 sm:grid-rows-4 grid-cols-1 grid-rows-3 gap-2 lg:gap-4 mx-auto px-5">
        {/* Hero Card */}
        <div
          id="card-carousel"
          className="relative 2xl:col-span-3 2xl:row-span-2 xl:col-span-3 xl:row-span-2 lg:col-span-3 lg:row-span-2 md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2 row-span-2 pt-0 "
          data-carousel="slide"
        >
          {/* Carousel wrapper */}
          <div className="relative h-full overflow-hidden rounded-xl shadow-lg">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${getTransform(
                  idx
                )}`}
                data-carousel-item
              >
                <section className="bg-blue-100 grid grid-cols-1 md:grid-cols-2 2xl:grid-rows-[92%_auto] xl:grid-rows-[92%_auto] lg:grid-rows-[92%_auto] items-center py-8 md:py-0 sm:py-0 lg:px-4 px-6 h-full overflow-hidden sm:grid-cols-1 sm:grid-rows-[47%_47%_5%] grid-rows-[49%_49%_2%] md:grid-rows-[95%_5%] pt-0">
                  {/* Text Content */}
                  <div className="flex flex-col justify-center space-y-4 md:space-y-6 md:w-10/12 lg:w-9/12">
                    <span className="text-blue-700 font-semibold uppercase tracking-wide text-sm md:text-base">
                      {card.subtitle}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight transition-all duration-300">
                      {card.title}
                    </h1>
                    <p className="text-gray-700 text-base md:text-lg">
                      {card.description}
                    </p>
                    <Button className="mt-4 md:mt-6 px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:scale-105">
                      {card.buttonText}
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="mt-8 md:mt-0 flex justify-center md:justify-end">
                    <div className="relative xl:w-96 xl:h-96 lg:w-64 lg:h-64 md:w-96 md:h-96 sm:w-100 sm:h-100 w-100 h-100">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain transition-transform duration-500 ease-in-out"
                        priority
                      />
                    </div>
                  </div>
                </section>
              </div>
            ))}
            {/* Pagination indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "bg-blue-700 scale-125"
                      : "bg-gray-300 hover:scale-110"
                  }`}
                  aria-current={idx === activeIndex}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => handleSlideTo(idx)}
                  data-carousel-slide-to={idx}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* SECOND section */}
        <section className="bg-green-100 flex flex-col md:flex-row justify-between items-center py-6 px-8 rounded-xl shadow-lg overflow-hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-semibold text-gray-900">
                20% Off
              </span>
              <span className="text-xs tracking-wider text-gray-500 uppercase">
                Sale
              </span>
            </div>
            <hr className="border-gray-300 w-16" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Wireless Audio
            </h1>
            <Button className="mt-4 md:mt-6 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-200">
              Shop Collection
            </Button>
          </div>

          <div className="mt-6 md:mt-0 flex justify-end">
            <div className="relative w-56 lg:w-56 h-56 lg:h-56 md:w-70 md:h-70 sm:w-70 sm:h-70">
              <Image
                src="/images/powerbank.png"
                alt="Powerbank"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* THIRD section */}
        <section className="bg-orange-100 flex flex-col md:flex-row justify-between items-center py-6 px-8 rounded-xl shadow-lg overflow-hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-semibold text-gray-900">
                20% Off
              </span>
              <span className="text-xs tracking-wider text-gray-500 uppercase">
                Sale
              </span>
            </div>
            <hr className="border-gray-300 w-16" />

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Power & Charging
            </h1>
            <Button className="mt-4 md:mt-6 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition duration-200">
              Shop Collection
            </Button>
          </div>

          <div className="mt-6 md:mt-0 flex justify-end">
            <div className="relative lg:w-56 lg:h-56 md:w-70 md:h-70 sm:w-70 sm:h-70 w-70 h-70">
              <Image
                src="/images/wireless.png"
                alt="Wireless"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
