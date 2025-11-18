import Link from "next/link";

export default function TermsContent() {
  const sections = [
    {
      icon: "fa-check-circle",
      title: "Acceptance of Terms",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            By accessing and using Codart Shop, you accept and agree to be bound
            by these Terms & Conditions. If you do not agree with any part of
            these terms, you may not use our service.
          </p>
          <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-900 mb-0">
              <strong className="flex items-center gap-2">
                <i className="fa fa-info-circle text-blue-500"></i>
                Note:
              </strong>
              <span className="text-gray-700 mt-1 block">
                These terms apply to all users of our website, including
                browsers, vendors, customers, and contributors of content.
              </span>
            </p>
          </div>
        </>
      ),
    },
    {
      icon: "fa-user",
      title: "Account Registration",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            To make a purchase, you must create an account and provide accurate,
            complete information. You are responsible for:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Maintaining the confidentiality of your account credentials
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>All activities that occur under your account</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Ensuring your account information is kept up to date</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Setting your delivery address and location before checkout
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: "fa-shopping-cart",
      title: "Orders and Payment",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            All orders are subject to product availability and acceptance. We
            reserve the right to refuse or cancel any order for any reason,
            including:
          </p>
          <ul className="text-gray-700 space-y-3 mb-4">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Product availability limitations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Errors in pricing or product information</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Fraudulent or illegal activity</span>
            </li>
          </ul>
          <p className="text-gray-700">
            Prices are subject to change without notice. Payment must be
            received before order processing begins.
          </p>
        </>
      ),
    },
    {
      icon: "fa-info",
      title: "Product Information",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We strive to provide accurate product descriptions and images.
            However, we do not warrant that product descriptions or other
            content on our site is accurate, complete, or current. Product
            colors may vary slightly from what is displayed on your screen.
          </p>
          <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-900 mb-0">
              <strong className="flex items-center gap-2">
                <i className="fa fa-exclamation-triangle text-blue-500"></i>
                Important:
              </strong>
              <span className="text-gray-700 mt-1 block">
                If you receive a product that doesn&apos;t match its
                description, please contact us immediately for a resolution.
              </span>
            </p>
          </div>
        </>
      ),
    },
    {
      icon: "fa-undo",
      title: "Returns and Refunds",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            Please refer to our{" "}
            <Link
              href="/returns-refunds"
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              Returns & Refunds Policy
            </Link>{" "}
            for detailed information about returning items and receiving
            refunds.
          </p>
          <p className="text-gray-700">
            All returns must comply with our return policy, including the 30-day
            return window and original packaging requirements.
          </p>
        </>
      ),
    },
    {
      icon: "fa-shield",
      title: "Limitation of Liability",
      content: (
        <p className="text-gray-700">
          Codart Shop shall not be liable for any indirect, incidental, special,
          or consequential damages arising from your use of our service or
          products. Our total liability shall not exceed the amount you paid for
          the product.
        </p>
      ),
    },
    {
      icon: "fa-copyright",
      title: "Intellectual Property",
      content: (
        <p className="text-gray-700">
          All content on this website, including text, graphics, logos, images,
          and software, is the property of Codart Shop and is protected by
          copyright and trademark laws. You may not reproduce, distribute, or
          use any content without our written permission.
        </p>
      ),
    },
    {
      icon: "fa-edit",
      title: "Changes to Terms",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Continued
            use of our service after changes constitutes acceptance of the new
            terms. We will notify users of significant changes via email or
            website notice.
          </p>
          <p className="text-gray-700">
            If you have questions about these terms, please{" "}
            <Link
              href="/contact"
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              contact us
            </Link>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12 border border-gray-100">
      {sections.map((section, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <h3 className="text-blue-500 font-bold text-xl md:text-2xl mb-4 pb-4 border-b border-gray-200 flex items-center gap-3">
            <i className={`fa ${section.icon} text-lg md:text-xl`}></i>
            {section.title}
          </h3>
          <div className="text-gray-700 leading-relaxed text-base md:text-lg">
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
}
