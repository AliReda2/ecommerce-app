import {
  faClock,
  faMailBulk,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ContactCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Email Support */}
      <div className="bg-white rounded-2xl p-6 shadow-md transition-transform hover:-translate-y-1">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
          <FontAwesomeIcon icon={faMailBulk} className=" text-white text-2xl" />
        </div>

        <h4 className="text-blue-500 font-bold text-xl mb-3">Email Support</h4>
        <p className="text-gray-600 mb-4">
          Send us an email and we’ll get back to you within 24 hours.
        </p>

        <p className="text-gray-800 font-semibold mb-1">Email:</p>
        <a
          href="mailto:support@codart.com"
          className="text-blue-500 font-semibold text-lg no-underline"
        >
          support@codart.com
        </a>

        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-600 text-sm">
            Response within 24 hours
          </span>
        </div>
      </div>

      {/* Phone Support */}
      <div className="bg-white rounded-2xl p-6 shadow-md transition-transform hover:-translate-y-1">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 mb-6">
          <FontAwesomeIcon icon={faPhone} className="text-2xl text-white" />
        </div>

        <h4 className="text-blue-500 font-bold text-xl mb-3">Phone Support</h4>
        <p className="text-gray-600 mb-4">
          Call us directly for immediate assistance.
        </p>

        <p className="text-gray-800 font-semibold mb-1">Phone:</p>
        <a
          href="tel:+96170031455"
          className="text-blue-500 font-semibold text-lg no-underline"
        >
          +961 70031455
        </a>

        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-600 text-sm">
            Monday - Friday: 9:00 AM - 6:00 PM
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactCards;
