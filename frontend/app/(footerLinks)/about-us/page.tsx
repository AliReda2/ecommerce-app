import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f7fa] to-[#eef1f3]">
      <header className="bg-white shadow-sm py-6 mb-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#4A9EFF] font-medium"
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
            <span>Back to Home</span>
          </Link>
          <h4 className="text-[#222] m-0">About Us</h4>
          <div className="w-[100px]"></div>
        </div>
      </header>
      <div className="container mx-auto px-4 max-w-[1000px] py-10">
        <div className="text-center mb-12">
          <h1 className="font-nunito font-bold text-[#222] text-5xl mb-3">
            About Codart Shop
          </h1>
          <p className=" text-lg">Your trusted source for tech accessories</p>
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-12 mb-8 transition-transform hover:-translate-y-1">
          <h3 className="text-[#4A9EFF] font-bold text-2xl flex items-center gap-3 mb-6">
            <i className="fa fa-book text-xl"></i>
            Our Story
          </h3>
          <p className="text-[#555] leading-8 text-lg">
            Codart Shop is Lebanon&apos;s premier destination for high-quality
            tech accessories. We specialize in providing modern and innovative
            products for your devices.
          </p>
          <p className="text-[#555] leading-8 text-lg mt-4">
            We focus on premium quality, competitive pricing, and excellent
            customer service, ensuring you always find the right accessory for
            your needs.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-12 mb-8 transition-transform hover:-translate-y-1">
          <h3 className="text-[#4A9EFF] font-bold text-2xl flex items-center gap-3 mb-6">
            <i className="fa fa-bullseye text-xl"></i>
            Our Mission
          </h3>
          <p className="text-[#555] leading-8 text-lg">
            Our mission is to make quality technology accessible for everyone.
            We believe in accessible, reliable, and well-designed accessories
            that improve everyday digital life.
          </p>
          <p className="text-[#555] leading-8 text-lg mt-4">
            We prioritize fast delivery, customer satisfaction, and a seamless
            shopping experience.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-12 mb-8 transition-transform hover:-translate-y-1">
          <h3 className="text-[#4A9EFF] font-bold text-2xl flex items-center gap-3 mb-10">
            <i className="fa fa-star text-xl"></i>
            Why Choose Us?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-[#E6F2FF] to-[#eef1f3] rounded-xl p-8 border-l-4 border-[#4A9EFF]">
              <i className="fa fa-check-circle text-3xl text-[#4A9EFF] mb-3"></i>
              <h5 className="font-bold text-[#222] mb-2">Quality Products</h5>
              <p className="text-[#555]">
                Only the best quality items from trusted suppliers.
              </p>
            </div>

            <div className="bg-linear-to-br from-[#E6F2FF] to-[#eef1f3] rounded-xl p-8 border-l-4 border-[#4A9EFF]">
              <i className="fa fa-dollar text-3xl text-[#4A9EFF] mb-3"></i>
              <h5 className="font-bold text-[#222] mb-2">Competitive Prices</h5>
              <p className="text-[#555]">
                Top value without compromising quality.
              </p>
            </div>

            <div className="bg-linear-to-br from-[#E6F2FF] to-[#eef1f3] rounded-xl p-8 border-l-4 border-[#4A9EFF]">
              <i className="fa fa-truck text-3xl text-[#4A9EFF] mb-3"></i>
              <h5 className="font-bold text-[#222] mb-2">Fast Delivery</h5>
              <p className="text-[#555]">Reliable shipping across Lebanon.</p>
            </div>

            <div className="bg-linear-to-br from-[#E6F2FF] to-[#eef1f3] rounded-xl p-8 border-l-4 border-[#4A9EFF]">
              <i className="fa fa-headphones text-3xl text-[#4A9EFF] mb-3"></i>
              <h5 className="font-bold text-[#222] mb-2">Customer Support</h5>
              <p className="text-[#555]">A dedicated team ready to assist.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <div className="bg-linear-to-br from-[#4A9EFF] to-[#6995B1] text-white p-10 rounded-xl text-center shadow-lg">
            <h3 className="text-4xl font-bold mb-2">1000+</h3>
            <p>Happy Customers</p>
          </div>

          <div className="bg-linear-to-br from-[#4A9EFF] to-[#6995B1] text-white p-10 rounded-xl text-center shadow-lg">
            <h3 className="text-4xl font-bold mb-2">500+</h3>
            <p>Products</p>
          </div>

          <div className="bg-linear-to-br from-[#4A9EFF] to-[#6995B1] text-white p-10 rounded-xl text-center shadow-lg">
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p>Support</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-12 mt-12 transition-transform hover:-translate-y-1">
          <h3 className="text-[#4A9EFF] font-bold text-2xl flex items-center gap-3 mb-10">
            <i className="fa fa-envelope text-xl"></i>
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-[#222] mb-1">Phone:</p>
              <a
                href="tel:+96170031455"
                className="text-[#4A9EFF] font-semibold text-lg"
              >
                +961 70031455
              </a>
            </div>

            <div>
              <p className="font-semibold text-[#222] mb-1">Email:</p>
              <a
                href="mailto:info@codart.com"
                className="text-[#4A9EFF] font-semibold text-lg"
              >
                info@codart.com
              </a>
            </div>

            <div>
              <p className="font-semibold text-[#222] mb-1">Support Hours:</p>
              <p className="text-[#555]">Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>

            <div>
              <p className="font-semibold text-[#222] mb-1">Location:</p>
              <p className="text-[#555]">Lebanon</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="#"
              className="btn btn-primary px-8 py-3 text-lg border-2 rounded-2xl bg-blue-500 text-white hover:bg-blue-400"
            >
              <i className="fa fa-envelope mr-2"></i>
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
