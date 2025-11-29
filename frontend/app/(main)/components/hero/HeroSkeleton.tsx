
const HeroSkeleton = () => {
  return (
    <div className="w-full min-h-screen lg:min-h-0 flex justify-center py-6 sm:py-8 md:py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 2xl:max-w-[95%] 2xl:grid-cols-5 2xl:grid-rows-2 xl:max-w-[90%] xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-5 lg:grid-rows-2 lg:h-fit md:grid-cols-2 md:grid-rows-3 sm:grid-cols-1 sm:grid-rows-4 grid-cols-1 grid-rows-[auto_auto_auto]">
        {/* Main Hero Swiper Skeleton */}
        <div className="relative rounded-xl shadow-lg overflow-hidden 2xl:col-span-3 2xl:row-span-2 xl:col-span-3 xl:row-span-2 lg:col-span-3 lg:row-span-2 md:col-span-2 md:row-span-2 sm:row-span-2 bg-gray-200 animate-pulse">
          <div className="grid h-full grid-cols-1 sm:grid-cols-2 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 gap-6">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-gray-300 rounded"></div>
              <div className="h-4 sm:h-5 md:h-6 lg:h-7 bg-gray-300 rounded"></div>
              <div className="w-32 h-10 bg-gray-300 rounded mt-4"></div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] aspect-square bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Secondary Cards Skeleton */}
        {[0, 1].map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center px-6 sm:px-8 py-8 rounded-xl shadow-lg 2xl:col-span-2 xl:col-span-2 lg:col-span-2 h-fit bg-gray-200 animate-pulse"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
                <div className="h-3 w-8 bg-gray-300 rounded"></div>
              </div>
              <hr className="border-gray-300 w-16" />
              <div className="h-6 sm:h-8 md:h-10 w-32 bg-gray-300 rounded"></div>
              <div className="w-24 h-10 bg-gray-300 rounded mt-4"></div>
            </div>
            <div className="flex">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSkeleton;
