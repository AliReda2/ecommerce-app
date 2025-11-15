"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white">
      {/* Image Section */}
      <CardHeader className="flex items-center justify-center p-5 bg-gray-50 rounded-t-2xl relative">
        <Skeleton className="w-40 h-40" />
      </CardHeader>

      {/* Details Section */}
      <CardContent className="flex flex-col grow justify-between px-5 pb-6 space-y-3">
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-5" /> {/* Product name */}
          <Skeleton className="w-full h-4" /> {/* Description line 1 */}
          <Skeleton className="w-5/6 h-4" /> {/* Description line 2 */}
          <Skeleton className="w-1/2 h-3 mt-2" /> {/* Category */}
        </div>

        <div className="flex justify-between items-center mt-2">
          <Skeleton className="w-16 h-6" /> {/* Price */}
        </div>

        {/* Quantity & Button Section */}
        <div className="flex items-center justify-between mt-5 space-x-3">
          <Skeleton className="w-24 h-8" /> {/* Quantity selector */}
          <Skeleton className="w-20 h-8" /> {/* Add to cart button */}
        </div>
      </CardContent>
    </Card>
  );
}
