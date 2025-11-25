import ContactCards from "./componenets/ContactCards";
import ContactForm from "./componenets/ContactForm";
import PageHeader from "./componenets/PageHeader";

export const metadata = {
  title: "Contact Us - Codart Shop",
  description:
    "Get in touch with Codart Shop. We're here to help with any questions about our products and services.",
};
const page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <PageHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 font-nunito font-bold text-gray-900 text-4xl md:text-5xl">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            We&apos;re here to help! Reach out to us through any of these
            channels.
          </p>
        </div>

        <ContactCards />
        <ContactForm />
      </div>
    </div>
  );
};

export default page;
