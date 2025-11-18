import Link from "next/link";

export default function ReturnsContent() {
  const sections = [
    {
      icon: "fa-undo",
      title: "Return Policy",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            We offer a{" "}
            <strong className="text-gray-900">30-day return policy</strong> for
            most items. To be eligible for a return:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Item must be <strong className="text-gray-900">unused</strong>{" "}
                and in{" "}
                <strong className="text-gray-900">original packaging</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Item must be in the same condition as when received</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Return request must be made within{" "}
                <strong className="text-gray-900">30 days</strong> of delivery
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>Original receipt or proof of purchase is required</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>All accessories and documentation must be included</span>
            </li>
          </ul>
          <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 my-6 border-l-4 border-blue-500">
            <p className="text-gray-900 mb-0">
              <strong className="flex items-center gap-2">
                <i className="fa fa-info-circle text-blue-500"></i>
                Important:
              </strong>
              <span className="text-gray-700 mt-1 block">
                Please inspect your items upon delivery. Report any damage or
                defects within 48 hours for a faster resolution.
              </span>
            </p>
          </div>
        </>
      ),
    },
    {
      icon: "fa-list-ol",
      title: "How to Return an Item",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            Follow these simple steps to return an item:
          </p>
          <ol className="text-gray-700 space-y-4">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                1
              </span>
              <span>
                <strong className="text-gray-900">Contact Us:</strong> Reach out
                to our customer service team via phone or email to initiate a
                return
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                2
              </span>
              <span>
                <strong className="text-gray-900">Provide Details:</strong>{" "}
                Share your order number and reason for return
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                3
              </span>
              <span>
                <strong className="text-gray-900">Pack Securely:</strong> Pack
                the item securely in its original packaging with all accessories
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                4
              </span>
              <span>
                <strong className="text-gray-900">Get Label:</strong> We&apos;ll
                provide you with a return shipping label
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                5
              </span>
              <span>
                <strong className="text-gray-900">Ship Back:</strong> Send the
                package using the provided label
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                6
              </span>
              <span>
                <strong className="text-gray-900">Get Refund:</strong> Once we
                receive and inspect the item, we&apos;ll process your refund
              </span>
            </li>
          </ol>
        </>
      ),
    },
    {
      icon: "fa-money",
      title: "Refund Process",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            Refunds will be processed to your original payment method within{" "}
            <strong className="text-gray-900">5-10 business days</strong> after
            we receive and verify the returned item.
          </p>
          <ul className="text-gray-700 space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                You will receive an{" "}
                <strong className="text-gray-900">email confirmation</strong>{" "}
                once the refund is processed
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Refund amount will include the product price (excluding shipping
                fees unless item was defective)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Processing time may vary depending on your payment method
              </span>
            </li>
          </ul>
          <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-900 mb-0">
              <i className="fa fa-clock-o text-blue-500 mr-2"></i>
              <strong>Note:</strong>
              <span className="text-gray-700 ml-2">
                It may take additional time for your bank or credit card company
                to process and post the refund to your account.
              </span>
            </p>
          </div>
        </>
      ),
    },
    {
      icon: "fa-ban",
      title: "Non-Returnable Items",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            The following items cannot be returned:
          </p>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Items that have been{" "}
                <strong className="text-gray-900">
                  used, damaged, or modified
                </strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Items without{" "}
                <strong className="text-gray-900">original packaging</strong> or
                tags
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                <strong className="text-gray-900">
                  Personalized or custom-made
                </strong>{" "}
                items
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Items purchased{" "}
                <strong className="text-gray-900">more than 30 days ago</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-semibold mr-2">•</span>
              <span>
                Items that are{" "}
                <strong className="text-gray-900">hygienic</strong> in nature
                (e.g., opened consumables)
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: "fa-question-circle",
      title: "Need Help?",
      content: (
        <>
          <p className="text-gray-700 mb-4">
            If you have questions about returns or refunds, our customer service
            team is here to help:
          </p>
          <div className="text-gray-700 space-y-2">
            <p className="flex items-center gap-2">
              <strong>Phone:</strong>
              <Link
                href="tel:+96170031455"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                +961 70031455
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <strong>Email:</strong>
              <Link
                href="mailto:support@codart.com"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                support@codart.com
              </Link>
            </p>
            <p className="flex items-center gap-2">
              <span>Or</span>
              <Link
                href="/contact"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                contact us
              </Link>
              <span>through our contact form.</span>
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
