import Link from "next/link";

export default function HelpSection() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center mt-12 border border-gray-100">
      <i className="fa fa-life-ring text-5xl text-blue-500 mb-6"></i>
      <h3 className="text-gray-900 font-bold text-2xl md:text-3xl mb-4">
        Still have questions?
      </h3>
      <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
        Our support team is ready to help you with any questions or concerns.
      </p>
      <Link
        href="/contact"
        className="bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 inline-flex items-center gap-2 text-lg"
      >
        <i className="fa fa-envelope"></i>
        Contact Us
      </Link>
    </div>
  );
}
