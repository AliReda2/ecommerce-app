"use client";

import { useEffect, useState } from "react";

interface ProductView {
  productId: string;
  views: number;
}

interface AnalyticsPageviews {
  count: number;
}

interface AnalyticsRevenue {
  totalRevenue: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminDashboard() {
  const [pageviews, setPageviews] = useState(0);
  const [topProducts, setTopProducts] = useState<ProductView[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // PAGEVIEWS
        console.log("Fetching pageviews...");
        const pageviewsRes = await fetch(`${BASE_URL}/analytics/pageviews`);
        if (!pageviewsRes.ok)
          throw new Error(`Pageviews fetch failed: ${pageviewsRes.status}`);
        const pageviewsData: AnalyticsPageviews = await pageviewsRes.json();
        console.log("Pageviews data:", pageviewsData);
        setPageviews(pageviewsData.count);

        // // TOP PRODUCTS
        // console.log("Fetching top products...");
        // const topProductsRes = await fetch(
        //   `${BASE_URL}/analytics/top-products`
        // );
        // if (!topProductsRes.ok)
        //   throw new Error(
        //     `Top products fetch failed: ${topProductsRes.status}`
        //   );
        // const topProductsData: ProductView[] = await topProductsRes.json();
        // console.log("Top products data:", topProductsData);
        // setTopProducts(topProductsData);

        // // REVENUE
        // console.log("Fetching revenue...");
        // const revenueRes = await fetch(`${BASE_URL}/analytics/revenue`);
        // if (!revenueRes.ok)
        //   throw new Error(`Revenue fetch failed: ${revenueRes.status}`);
        // const revenueData: AnalyticsRevenue = await revenueRes.json();
        // console.log("Revenue data:", revenueData);
        // setRevenue(revenueData.totalRevenue);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="text-lg font-semibold">Admin Dashboard</div>

      <div className="bg-white p-4 rounded shadow">
        <div className="font-medium">Pageviews</div>
        <div className="text-2xl">{pageviews}</div>
      </div>

      {/* <div className="bg-white p-4 rounded shadow">
        <div className="font-medium">Revenue</div>
        <div className="text-2xl">${revenue}</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="font-medium">Top Products</div>
        <ul className="list-disc list-inside">
          {topProducts.map((p) => (
            <li key={p.productId}>
              Product ID: {p.productId} — Views: {p.views}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
