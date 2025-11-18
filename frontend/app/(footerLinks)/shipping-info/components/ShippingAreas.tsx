import Link from "next/link";

export default function ShippingAreas() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <h3 className="text-blue-500 font-bold text-2xl mb-6 flex items-center gap-3">
        <i className="fa fa-globe text-xl"></i>
        Shipping Areas
      </h3>
      <p className="text-gray-700 leading-relaxed text-lg mb-6">
        We currently ship throughout{" "}
        <strong className="text-gray-900">Lebanon</strong>. Please ensure your
        delivery address is accurate and complete to avoid delays.
      </p>

      <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
        <p className="text-gray-900 font-semibold mb-3">
          📍 Delivery Requirements:
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Set your delivery address in your profile before checkout
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Include GPS location for accurate delivery
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Provide a contact number for delivery coordination
          </li>
        </ul>
      </div>

      <p className="text-gray-700">
        International shipping may be available for select items. Please{" "}
        <Link
          href="/contact"
          className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
        >
          contact us
        </Link>{" "}
        for more information.
      </p>
    </div>
  );
}
