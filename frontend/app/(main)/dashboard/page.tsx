import CategoryCarousel from "../component/CategoryCarousel";
import Hero from "../component/Hero";
import Products from "../component/Products";

const page = () => {
  return (
    <>
      <Hero />
      <div className="w-full flex flex-col items-center justify-center pt-20 bg-white mx-auto">
        <CategoryCarousel />
        <Products />
      </div>
    </>
  );
};

export default page;
