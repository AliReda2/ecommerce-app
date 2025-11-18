import DeliveryAddress from "./components/DeliveryAddress";
import OrderProcessing from "./components/OrderProcessing";
import ShippingAreas from "./components/ShippingAreas";
import ShippingHeader from "./components/ShippingHeader";
import ShippingOptions from "./components/ShippingOptions";

export const metadata = {
  title: "Shipping Information - Codart Shop",
  description:
    "Learn about our delivery options, shipping areas, and order processing at Codart Shop.",
};

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <ShippingHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 font-nunito font-bold text-gray-900 text-4xl md:text-5xl">
            Shipping Information
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Everything you need to know about our delivery options
          </p>
        </div>

        <ShippingOptions />
        <ShippingAreas />
        <OrderProcessing />
        <DeliveryAddress />
      </div>
    </div>
  );
}
