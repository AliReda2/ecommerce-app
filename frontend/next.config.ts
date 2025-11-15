import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jeobmgaazjoevrncujqn.storage.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack(config: {module: {rules: Array<{test?: {test?: (s: string) => boolean}; issuer?: unknown; resourceQuery?: unknown; exclude?: RegExp; use?: string[]}>}}) {
    const fileLoaderRule = config.module.rules.find(
      (rule: {test?: {test?: (s: string) => boolean}}) => rule.test?.test?.("test.svg")
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default withFlowbiteReact(nextConfig);