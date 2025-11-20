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
    <div className="w-full sm:h-[85vh] h-[90vh] flex justify-center py-5">
      {/* Centered container */}
      <div
        className="grid 
      2xl:max-w-[95%] 2xl:grid-cols-5 2xl:grid-rows-2
      xl:max-w-[90%] xl:grid-cols-5 xl:grid-rows-2
      lg:max-w-full lg:grid-cols-5 lg:grid-rows-2 lg:gap-4
      md:w-full md:grid-cols-1 md:grid-rows-4
      sm:w-full sm:grid-cols-1 sm:grid-rows-4
      w-full grid-cols-1 grid-rows-4 gap-2 mx-auto px-5"
      >
        {/* Hero Card */}
        <div
          id="card-carousel"
          className="relative
          2xl:col-span-3 2xl:row-span-2
          xl:col-span-3 xl:row-span-2 
          lg:col-span-3 lg:row-span-2
          md:col-span-1 md:row-span-2 
          sm:col-span-1 sm:row-span-2
          row-span-2 pt-0"
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
                <section
                  className="bg-blue-100 grid pt-0 items-center h-full overflow-hidden
                  2xl:grid-rows-[92%_auto] 2xl:px-10 2xl:gap-0 
                  xl:grid-rows-[92%_auto] xl:px-6
                  lg:grid-rows-[92%_auto] lg:px-4 lg:py-8
                  md:grid-cols-2 md:grid-rows-[95%_5%] md:py-0
                  sm:grid-cols-2 sm:grid-rows-[95%_5%] sm:py-0
                  grid-cols-2 grid-rows-[85%_15%] py-0
                  "
                >
                  {/* Text Content */}
                  <div
                    className="flex flex-col justify-center space-y-4 
                  2xl:pl-10
                  lg:w-9/12 
                  md:space-y-6 md:w-10/12 
                  px-2
                  "
                  >
                    <span
                      className="text-blue-700 font-semibold uppercase tracking-wide text-sm 
                    md:text-base
                    "
                    >
                      {card.subtitle}
                    </span>
                    <h1
                      className=" 
                    font-extrabold text-gray-900 leading-tight transition-all duration-300
                    lg:text-6xl 
                    md:text-5xl 
                    sm:text-3xl
                    text-xs
                    "
                    >
                      {card.title}
                    </h1>
                    <p className="text-gray-700 text-base md:text-lg sm:block hidden">
                      {card.description}
                    </p>
                    <Button className="mt-4 md:mt-6 px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:scale-105">
                      {card.buttonText}
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="mt-8 md:mt-0 flex justify-center md:justify-end 2xl:pr-10">
                    <div className="relative 2xl:w-96 2xl:h-96 xl:w-96 xl:h-96 lg:w-64 lg:h-64 md:w-96 md:h-96 sm:w-50 sm:h-50 w-50 h-50">
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
        <section
          className="bg-green-100 flex
        justify-evenly items-center py-6 px-8 rounded-xl shadow-lg overflow-hidden 
        2xl:col-span-2 
        xl:col-span-2 
        lg:col-span-2
        "
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <span
                className="
              font-semibold text-gray-900
              sm:text-2xl
              text-xs 
              "
              >
                20% Off
              </span>
              <span className="text-xs tracking-wider text-gray-500 uppercase">
                Sale
              </span>
            </div>
            <hr className="border-gray-300 w-16" />
            <h1
              className="
            font-bold text-gray-900
            md:text-4xl 
            sm:text-3xl
            text-xs 
            "
            >
              Wireless Audio
            </h1>
            <Button
              className="
            sm:mt-4 sm:px-6 sm:py-3
            md:mt-6 
            bg-gray-900 text-white rounded-lg font-medium
            hover:bg-gray-800 transition duration-200
            "
            >
              Shop Collection
            </Button>
          </div>

          <div className="flex">
            <div
              className="relative 
            lg:w-56 lg:h-56 
            md:w-50 md:h-50 
            sm:w-44 sm:h-44
            w-32 h-32 
            "
            >
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
        <section
          className="bg-orange-100 flex
        justify-evenly items-center py-6 px-8 rounded-xl shadow-lg overflow-hidden 
        2xl:col-span-2 
        xl:col-span-2 
        lg:col-span-2
        "
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <span
                className="
              font-semibold text-gray-900
              sm:text-2xl
              text-xs 
              "
              >
                20% Off
              </span>
              <span className="text-xs tracking-wider text-gray-500 uppercase">
                Sale
              </span>
            </div>
            <hr className="border-gray-300 w-16" />

            <h1
              className="
            font-bold text-gray-900
            md:text-4xl 
            sm:text-3xl
            text-xs 
            "
            >
              Power & Charging
            </h1>
            <Button
              className="
            sm:mt-4 sm:font-medium sm:px-6 sm:py-3
            md:mt-6 
            bg-gray-900 text-white rounded-lg font-light
            hover:bg-gray-800 transition duration-200
            "
            >
              Shop Collection
            </Button>
          </div>

          <div className="flex">
            <div
              className="relative 
            lg:w-56 lg:h-56 
            md:w-50 md:h-50 
            sm:w-44 sm:h-44
            w-32 h-32 
            "
            >
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
