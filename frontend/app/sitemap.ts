import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shopcodartlb.vercel.app";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/returns-refunds`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shipping-info`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/admin-auth`,
      lastModified: new Date(),
    },
    // {
    //   url: `${baseUrl}/admin`,
    //   lastModified: new Date(),
    // },
  ];
}
