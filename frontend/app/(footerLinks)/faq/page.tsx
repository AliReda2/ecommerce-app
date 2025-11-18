import FAQAccordion from "./components/FAQAccordion";
import FAQHeader from "./components/FAQHeader";
import FAQHero from "./components/FAQHero";
import HelpSection from "./components/HelpSection";

export const metadata = {
  title: "FAQ - Codart Shop",
  description:
    "Find answers to common questions about our products, shipping, and services at Codart Shop.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <FAQHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FAQHero />
        <FAQAccordion />
        <HelpSection />
      </div>
    </div>
  );
}
