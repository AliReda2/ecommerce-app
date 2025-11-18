const ContactCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="mb-4">
        <div className="h-full rounded-2xl p-6 bg-card text-card-foreground shadow-md transition-transform transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full inline-flex items-center justify-center mb-4 bg-primary shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
          </div>
          <h4 className="mb-3 text-primary font-bold">Email Support</h4>
          <p className="mb-3 text-muted-foreground">
            Send us an email and we&apos;ll get back to you within 24 hours.
          </p>
          <p className="mb-2">
            <strong className="text-foreground font-semibold">Email:</strong>
          </p>
          <p className="mb-3">
            <a
              href="mailto:support@codart.com"
              className="text-primary font-semibold text-lg no-underline"
            >
              support@codart.com
            </a>
          </p>
          <p className="text-muted-foreground text-sm mb-0">
            <i className="fa fa-clock-o"></i> Response within 24 hours
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-full rounded-2xl p-6 bg-card text-card-foreground shadow-md transition-transform transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full inline-flex items-center justify-center mb-4 bg-primary shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              />
            </svg>
          </div>
          <h4 className="mb-3 text-primary font-bold">Phone Support</h4>
          <p className="mb-3 text-muted-foreground">
            Call us directly for immediate assistance.
          </p>
          <p className="mb-2">
            <strong className="text-foreground font-semibold">Phone:</strong>
          </p>
          <p className="mb-3">
            <a
              href="tel:+96170031455"
              className="text-primary font-semibold text-lg no-underline"
            >
              +961 70031455
            </a>
          </p>
          <p className="text-muted-foreground text-sm mb-0">
            <i className="fa fa-clock-o"></i> Monday - Friday: 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactCards;
