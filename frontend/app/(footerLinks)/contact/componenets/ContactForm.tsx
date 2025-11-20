"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Add your form submission logic (API call, etc.)
  };

  return (
    <div className="rounded-2xl p-6 bg-card text-card-foreground shadow-md">
      <div className="text-center mb-4">
        <h3 className="mb-2 text-foreground font-bold text-2xl">
          Send us a Message
        </h3>
        <p className="text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </div>

      <form id="contact-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-foreground"
            >
              Your Name
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-border bg-input text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground"
            >
              Email Address
            </label>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-border bg-input text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-foreground"
          >
            Subject
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-border bg-input text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
            id="subject"
            placeholder="What is this regarding?"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-foreground"
          >
            Message
          </label>
          <textarea
            className="mt-2 w-full rounded-xl border border-border bg-input text-foreground px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
            id="message"
            rows={6}
            placeholder="Tell us how we can help you..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 text-lg rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold shadow-sm hover:shadow-md transition-transform active:translate-y-0.5"
          >
            <i className="fa fa-paper-plane mr-2" aria-hidden="true"></i>
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
