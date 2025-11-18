import Link from "next/link";

export default function ShippingHeader() {
  return (
    <div className="bg-white shadow-sm py-6 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-500 font-medium hover:text-blue-600 transition-colors inline-flex items-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M9 12l6-6-1.41-1.41L6 12l7.59 7.59L15 18l-6-6z"
              />
            </svg>
            <span>Back</span>
          </Link>
          <h4 className="text-gray-900 font-semibold text-lg">Shipping Info</h4>
          <div className="w-24"></div>
        </div>
      </div>
    </div>
  );
}
