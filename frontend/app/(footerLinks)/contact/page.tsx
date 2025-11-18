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
    <>
      <PageHeader />

      <div className="flex justify-center py-5">
        <div style={{ maxWidth: "1000px", width: "100%" }}>
          <div className="text-center mb-5">
            <h1
              className="mb-3"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: "700",
                color: "#222",
              }}
            >
              Get in Touch
            </h1>
            <p className="text-muted fs-5">
              We&apos;re here to help! Reach out to us through any of these
              channels.
            </p>
          </div>

          <ContactCards />
          <ContactForm />
        </div>
      </div>
    </>
  );
};

export default page;
