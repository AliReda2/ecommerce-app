import Link from "next/link";

export default function PolicyContent() {
  const sections = [
    {
      icon: "fa-info-circle",
      title: "Information We Collect",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Personal Information:</strong> Name, email address, and
                contact information
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Location Data:</strong> Delivery address and GPS
                coordinates for accurate delivery
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Payment Information:</strong> Processed securely through
                our payment partners (we don&apos;t store full card details)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Order History:</strong> Your purchase history and
                preferences to improve your shopping experience
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Account Information:</strong> Profile information and
                account settings
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: "fa-cog",
      title: "How We Use Your Information",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Process and fulfill your orders efficiently</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Communicate with you about your orders, account, and updates
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Improve our services and customer experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Send you marketing communications (only with your consent)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Prevent fraud and ensure security</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Comply with legal obligations</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: "fa-share-alt",
      title: "Information Sharing",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your
            information with:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Service Providers:</strong> Companies that assist in our
                operations (payment processing, shipping)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Delivery Partners:</strong> To fulfill your orders and
                ensure accurate delivery
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Legal Authorities:</strong> When required by law or to
                protect our rights
              </span>
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            All third parties are contractually obligated to protect your
            information.
          </p>
        </>
      ),
    },
    {
      icon: "fa-lock",
      title: "Data Security",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal
            information, including:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Encryption of sensitive data</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Secure payment processing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Regular security audits</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Access controls and authentication</span>
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            However, no method of transmission over the internet is 100% secure.
            While we strive to protect your data, we cannot guarantee absolute
            security.
          </p>
        </>
      ),
    },
    {
      icon: "fa-user",
      title: "Your Rights",
      content: (
        <>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Access:</strong> Request a copy of your personal
                information
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Update:</strong> Correct or update your information at
                any time
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Delete:</strong> Request deletion of your account and
                data
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Opt-out:</strong> Unsubscribe from marketing
                communications
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong>Portability:</strong> Request your data in a portable
                format
              </span>
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at{" "}
            <Link
              href="mailto:privacy@codart.com"
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
            >
              privacy@codart.com
            </Link>
          </p>
        </>
      ),
    },
    {
      icon: "fa-envelope",
      title: "Contact Us",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <div className="text-gray-700 space-y-2">
            <p className="flex items-center gap-2">
              <strong>Email:</strong>
              <Link
                href="mailto:privacy@codart.com"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                privacy@codart.com
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <strong>Phone:</strong>
              <Link
                href="tel:+96170031455"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                +961 70031455
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <strong>Address:</strong>
              <span>Codart Shop, Lebanon</span>
            </p>
          </div>
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
          <div className="text-gray-700 leading-relaxed">{section.content}</div>
        </div>
      ))}
    </div>
  );
}
