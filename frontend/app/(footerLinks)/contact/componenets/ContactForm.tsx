"use client";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    // submit logic
  };

  return (
    <div className="rounded-2xl p-8 bg-card text-card-foreground shadow-md bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-foreground font-bold text-3xl mb-2">
          Send us a Message
        </h3>
        <p className="text-muted-foreground text-sm">
          Fill out the form below and we’ll respond as soon as possible.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is this regarding?"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          ></textarea>
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            name="sendMessage"
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-8 py-3 text-white font-semibold text-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-8 h-8 text-white" />
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
