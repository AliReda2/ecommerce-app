import Link from "next/link";

const PageHeader = () => {
  return (
    <div className="bg-card text-card-foreground py-6 mb-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
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
            <span>Back</span>
          </Link>
          <h4 className="mb-0 text-foreground font-bold">Contact Us</h4>
          <div style={{ width: "100px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
