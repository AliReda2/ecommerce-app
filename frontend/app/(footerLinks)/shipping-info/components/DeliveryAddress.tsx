import Link from "next/link";

export default function DeliveryAddress() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-blue-500 font-bold text-2xl mb-6 flex items-center gap-3">
        <i className="fa fa-map-marker text-xl"></i>
        Delivery Address
      </h3>

      <p className="text-gray-700 leading-relaxed text-lg mb-6">
        Make sure to set your delivery address in your profile before checkout.
        You can update your address at any time from your account settings.
      </p>

      <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 mb-6 border-l-4 border-blue-500">
        <p className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
          <i className="fa fa-info-circle text-blue-500"></i>
          Important:
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Your address must include GPS coordinates for accurate delivery
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            You can mark your location on the map in your profile
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Ensure your contact number is up to date
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Link
          href="/contact"
          className="bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 inline-flex items-center gap-2"
        >
          <i className="fa fa-question-circle"></i>
          Questions About Shipping?
        </Link>
      </div>
    </div>
  );
}
