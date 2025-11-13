import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

const Products = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response = await res.json();
  const products: Product[] = response.data;

  if (!products || products.length === 0) {
    return (
      <h1 className="text-center mt-10 text-lg">No Products To Display</h1>
    );
  }

  return (
    <div className="px-6 py-10 max-w-[76%] mb-20">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
