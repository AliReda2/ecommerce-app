export default function OrderProcessing() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
      <h3 className="text-blue-500 font-bold text-2xl mb-6 flex items-center gap-3">
        <i className="fa fa-list-ol text-xl"></i>
        Order Processing
      </h3>
      <p className="text-gray-700 leading-relaxed mb-8">
        Here&apos;s what happens after you place your order:
      </p>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex items-start bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold mr-4 shrink-0">
            1
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-lg mb-2">
              Order Confirmation
            </h5>
            <p className="text-gray-700">
              We&apos;ll send you an order confirmation email with all order
              details
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold mr-4 shrink-0">
            2
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-lg mb-2">Processing</h5>
            <p className="text-gray-700">
              Your order will be processed within 1-2 business days
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold mr-4 shrink-0">
            3
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-lg mb-2">
              Shipping Notification
            </h5>
            <p className="text-gray-700">
              You&apos;ll receive a shipping notification with tracking
              information
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold mr-4 shrink-0">
            4
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-lg mb-2">Delivery</h5>
            <p className="text-gray-700">
              Your order will be delivered to your specified address
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
