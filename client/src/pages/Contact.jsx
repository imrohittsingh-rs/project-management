import { createElement, useState } from "react";
import { motion as Motion } from "motion/react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";
import { BsArrowReturnRight } from "react-icons/bs";

const initialForm = { name: "", email: "", subject: "", message: "" };

const validateField = (name, value) => {
  const trimmedValue = value.trim();

  if (name === "name") {
    if (!trimmedValue) return "Please enter your name.";
    if (trimmedValue.length < 2) return "Name must be at least 2 characters.";
  }

  if (name === "email") {
    if (!trimmedValue) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return "Enter a valid email address.";
    }
  }

  if (name === "subject" && !trimmedValue) {
    return "Please select a topic.";
  }

  if (name === "message") {
    if (!trimmedValue) return "Please enter a message.";
    if (trimmedValue.length < 10) {
      return "Message must be at least 10 characters.";
    }
  }

  return "";
};

const fieldClassName = (hasError) =>
  `w-full rounded-[6px] border bg-white px-3 text-sm text-[#171717] transition-all focus:outline-none focus:ring-2 ${
    hasError
      ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
      : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
  }`;

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries(form).map(([name, value]) => [
        name,
        validateField(name, value),
      ]),
    );
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setStatus("");
      return;
    }

    setStatus(
      "Contact form submission isn't configured yet. Please check back soon.",
    );
  };

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    if (errors[event.target.name]) {
      setErrors((current) => ({
        ...current,
        [event.target.name]: validateField(
          event.target.name,
          event.target.value,
        ),
      }));
    }
    setStatus("");
  };

  const validateOnBlur = (event) => {
    const { name, value } = event.target;
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const actions = [
    {
      title: "Plans and pricing",
      subtitle: "Questions about choosing a plan for your team?",
      icon: <FiBriefcase className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Teams and projects",
      subtitle: "Need help getting your workspace organized?",
      icon: <FiUsers className="text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Something else",
      subtitle: "Share feedback, a question, or an idea.",
      icon: <FiMessageCircle className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <Motion.header
        className="mx-auto max-w-2xl pt-8 pb-12 text-center sm:pb-16"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <Motion.h1
          className="text-4xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          Contact us
        </Motion.h1>
        <Motion.p
          className="mx-auto mt-3 max-w-xl text-base leading-6 text-[#4d4d4d]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
        >
          Have a question about Projectub? Tell us what you're working on.
        </Motion.p>
      </Motion.header>

      <main className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Motion.section
          aria-labelledby="contact-intro-title"
          className="lg:pt-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
        >
          <h2
            id="contact-intro-title"
            className="mt-3 max-w-md text-2xl md:text-3xl font-semibold leading-tight tracking-[-0.8px]"
          >
            Need more information? <br /> Get in touch with us
          </h2>
          <p className="mt-4 max-w-md text-xs md:text-sm leading-6 text-[#4d4d4d]">
            From organizing your first project to finding the right plan, send
            us a note and tell us how we can help.
          </p>

          <div className="mt-8 space-y-3">
            {actions.map(({ title, subtitle, icon, bg }, index) => (
              <Motion.div
                key={title}
                className="flex min-w-0 items-start gap-4 rounded-3xl border border-[#ebebeb] bg-white px-4 py-3 sm:px-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{
                  duration: 0.25,
                  delay: 0.16 + index * 0.07,
                  ease: "easeOut",
                }}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0 border border-gray-200/50`}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="flex min-w-0 items-center gap-2 text-base font-medium text-[#171717]">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full bg-[#00c853]"
                    />
                    <span className="truncate">{title}</span>
                  </h3>
                  <p className="flex items-start gap-2 text-sm leading-5 text-[#8f8f8f]">
                    <BsArrowReturnRight
                      aria-hidden="true"
                      className="shrink-0 text-black"
                    />
                    <span className="min-w-0 break-words">{subtitle}</span>
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </Motion.section>

        <Motion.section
          aria-labelledby="contact-form-title"
          className="rounded-xl border border-[#ebebeb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
        >
          <div className="mb-6">
            <h2
              id="contact-form-title"
              className="text-2xl font-semibold tracking-[-0.4px]"
            >
              Send a message
            </h2>
            <p className="mt-2 text-sm leading-5 text-[#8f8f8f]">
              Fill in the form and let us know how we can help.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm font-medium tracking-[-0.28px]"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  onBlur={validateOnBlur}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  placeholder="Your name"
                  className={`h-10 ${fieldClassName(Boolean(errors.name))} placeholder:text-[#a1a1a1]`}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-1 text-xs text-[#ee0000]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium tracking-[-0.28px]"
                >
                  Work email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  onBlur={validateOnBlur}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  placeholder="you@company.com"
                  className={`h-10 ${fieldClassName(Boolean(errors.email))} placeholder:text-[#a1a1a1]`}
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-1 text-xs text-[#ee0000]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block text-sm font-medium tracking-[-0.28px]"
              >
                What can we help with?
              </label>
              <select
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={updateField}
                onBlur={validateOnBlur}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "contact-subject-error" : undefined
                }
                className={`h-10 ${fieldClassName(Boolean(errors.subject))}`}
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option>Plans and pricing</option>
                <option>Teams and projects</option>
                <option>Account support</option>
                <option>Feedback or something else</option>
              </select>
              {errors.subject && (
                <p
                  id="contact-subject-error"
                  role="alert"
                  className="mt-1 text-xs text-[#ee0000]"
                >
                  {errors.subject}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium tracking-[-0.28px]"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={updateField}
                onBlur={validateOnBlur}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                rows={6}
                placeholder="Tell us a little about what you need…"
                className={`${fieldClassName(Boolean(errors.message))} resize-y py-2.5 text-sm leading-5 placeholder:text-[#a1a1a1]`}
              />
              {errors.message && (
                <p
                  id="contact-message-error"
                  role="alert"
                  className="mt-1 text-xs text-[#ee0000]"
                >
                  {errors.message}
                </p>
              )}
            </div>
            {status && (
              <p
                role="status"
                className="flex items-start gap-2 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-3 py-2.5 text-sm text-[#4d4d4d]"
              >
                <FiCheckCircle
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#8f8f8f]"
                />
                {status}
              </p>
            )}
            <Motion.button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 sm:w-auto"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Send message{" "}
              <FiArrowRight aria-hidden="true" className="h-4 w-4" />
            </Motion.button>
          </form>
        </Motion.section>
      </main>
    </div>
  );
};

export default Contact;
