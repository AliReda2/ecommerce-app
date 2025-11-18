import TermsContent from "./components/TermsContent";
import TermsHeader from "./components/TermsHeader";
import TermsHero from "./components/TermsHero";

export const metadata = {
  title: "Terms & Conditions - Codart Shop",
  description:
    "Read the terms and conditions for using Codart Shop, including account registration, orders, payments, and more.",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <TermsHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <TermsHero />
        <TermsContent />
      </div>
    </div>
  );
}
