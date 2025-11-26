import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faTruck } from "@fortawesome/free-solid-svg-icons";

export default function ShippingOptions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Standard Delivery */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
          <FontAwesomeIcon
            icon={faTruck}
            className="w-8 h-8 text-white text-2xl"
          />
        </div>
        <h4 className="text-blue-500 font-bold text-xl mb-4">
          Standard Delivery
        </h4>
        <p className="text-blue-500 font-semibold text-lg mb-2">
          3-5 business days
        </p>
        <p className="text-gray-600 mb-4">
          Free shipping on all orders. Your order will be delivered to the
          address you provide during checkout.
        </p>
        <ul className="text-gray-600 space-y-1 list-disc list-inside">
          <li>Tracking information provided</li>
          <li>Signature required upon delivery</li>
          <li>Available nationwide</li>
        </ul>
      </div>

      {/* Express Delivery */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
          <FontAwesomeIcon
            icon={faRocket}
            className="w-8 h-8 text-white text-2xl"
          />
        </div>
        <h4 className="text-blue-500 font-bold text-xl mb-4">
          Express Delivery
        </h4>
        <p className="text-blue-500 font-semibold text-lg mb-2">
          1-2 business days
        </p>
        <p className="text-gray-600 mb-4">
          Available at checkout for an additional fee. Get your order delivered
          faster with our express shipping option.
        </p>
        <ul className="text-gray-600 space-y-1 list-disc list-inside">
          <li>Priority processing</li>
          <li>Express delivery service</li>
          <li>Real-time tracking</li>
        </ul>
      </div>
    </div>
  );
}
