import CategoryCarousel from "./components/categories/CategoryCarousel";
import Hero from "./components/Hero";
import Products from "./components/products/Products";


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
