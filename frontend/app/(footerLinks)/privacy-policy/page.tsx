import PolicyContent from "./components/PolicyContent";
import PolicyHeader from "./components/PolicyHeader";
import PolicyHero from "./components/PolicyHero";

export const metadata = {
  title: "Privacy Policy - Codart Shop",
  description:
    "Learn how Codart Shop collects, uses, and protects your personal information in our Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <PolicyHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PolicyHero />
        <PolicyContent />
      </div>
    </div>
  );
}
