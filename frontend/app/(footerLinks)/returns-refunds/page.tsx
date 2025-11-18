import ReturnsContent from "./components/ReturnsContent";
import ReturnsHeader from "./components/ReturnsHeader";
import ReturnsHero from "./components/ReturnsHero";

export const metadata = {
  title: "Returns & Refunds - Codart Shop",
  description:
    "Learn about our 30-day return policy and refund process at Codart Shop.",
};

export default function ReturnsRefundsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <ReturnsHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ReturnsHero />
        <ReturnsContent />
      </div>
    </div>
  );
}
