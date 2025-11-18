"use client";

import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

export default function FAQAccordion() {
  const faqItems = [
    {
      id: "faq1",
      icon: "fa-question-circle",
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to be logged in and have your delivery address set up. Make sure to set your location in your profile before checkout!",
      isOpen: true,
    },
    {
      id: "faq2",
      icon: "fa-credit-card",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards and cash on delivery. Payment is processed securely at checkout. Your payment information is encrypted and protected.",
    },
    {
      id: "faq3",
      icon: "fa-truck",
      question: "How long does shipping take?",
      answer:
        "Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery. You will receive tracking information once your order ships.",
    },
    {
      id: "faq4",
      icon: "fa-undo",
      question: "Can I return or exchange a product?",
      answer: (
        <>
          Yes! We offer a 30-day return policy for unused items in their
          original packaging. Please see our{" "}
          <Link
            href="/returns-refunds"
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            Returns & Refunds
          </Link>{" "}
          page for more details.
        </>
      ),
    },
    {
      id: "faq5",
      icon: "fa-globe",
      question: "Do you ship internationally?",
      answer: (
        <>
          Currently, we ship within Lebanon. International shipping options may
          be available - please{" "}
          <Link
            href="/contact"
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            contact us
          </Link>
          for more information.
        </>
      ),
    },
    {
      id: "faq6",
      icon: "fa-map-marker",
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking number via email. You can also track your order from your account dashboard.",
    },
  ];

  return (
    <div className="space-y-4">
      {faqItems.map((item) => (
        <Disclosure key={item.id} defaultOpen={item.isOpen}>
          {({ open }) => (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <DisclosureButton className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <i className={`fa ${item.icon} text-blue-500 text-lg`}></i>
                  <span className="font-semibold text-gray-900 text-lg">
                    {item.question}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DisclosureButton>
              <DisclosurePanel className="px-6 py-5 bg-gray-50 border-t border-gray-200 text-gray-700 leading-relaxed">
                {item.answer}
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
