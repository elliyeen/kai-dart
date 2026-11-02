"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Linkedin } from "lucide-react";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "demo",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [humanChecked, setHumanChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanChecked) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(
        `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.errors?.[0]?.message ?? "Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div className="landing-sans min-h-screen bg-white text-black">

      <Nav />

      <main id="main">
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[-0.02em] leading-[1.05] mb-6">Let&apos;s talk.</h1>
          <p className="text-xl text-black max-w-xl leading-relaxed font-light">
            Whether you&apos;re a city, transit authority, or enterprise, we&apos;re ready to show you what KAI can do in your environment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

            {/* Form */}
            <div>
              {!submitted ? (
                <>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-black mb-10 uppercase">Send a Message</p>
                  <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10">

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="name" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-black/60"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-black/60"
                          placeholder="jane@city.gov"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="company" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-black/60"
                          placeholder="City of Dallas"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent placeholder:text-black/60"
                          placeholder="(214) 555-0100"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="inquiryType" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                        I&apos;m interested in *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent appearance-none cursor-pointer"
                      >
                        <option value="demo">Platform demo</option>
                        <option value="pilot">Pilot program</option>
                        <option value="rfp">RFP response</option>
                        <option value="consultation">Strategic consultation</option>
                        <option value="general">General inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-[11px] font-medium tracking-[0.25em] text-black mb-4 uppercase">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border-b border-black/30 py-3 text-lg font-light focus:border-black outline-none transition-colors duration-200 bg-transparent resize-none placeholder:text-black/60"
                        placeholder="Tell us about your environment and timeline..."
                      />
                    </div>

                    {/* Human check */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={humanChecked}
                          onChange={(e) => setHumanChecked(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border border-black/40 peer-checked:border-black peer-checked:bg-black transition-all duration-200" />
                        {humanChecked && (
                          <svg className="absolute inset-0 w-5 h-5 text-white p-0.5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-light text-black group-hover:text-black transition-colors duration-200">
                        I am a human
                      </span>
                    </label>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={sending || !humanChecked}
                        className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-black/80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {sending ? "Sending…" : "Send message"}
                      </button>
                      {error && (
                        <p className="text-[12px] text-black font-medium text-center mt-4">{error}</p>
                      )}
                      <p className="text-[12px] text-black text-center mt-5">
                        By submitting you agree to our privacy policy.
                      </p>
                    </div>

                  </form>
                </>
              ) : (
                <div className="py-20 space-y-6">
                  <div className="text-5xl font-thin text-black leading-none">✓</div>
                  <h3 className="text-4xl font-thin tracking-[-0.02em]">Message received.</h3>
                  <p className="text-black leading-relaxed font-light">
                    We respond within 24 hours.<br />In the meantime, explore the platform.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/platform"
                      className="inline-flex items-center justify-center text-sm font-medium border border-black px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-300 gap-2"
                    >
                      Explore Platform <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm font-light text-black hover:text-black transition-colors duration-200"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-10 sm:space-y-16 lg:pt-14">

              {/* Contact info */}
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-black mb-8 uppercase">Contact</p>
                <div className="space-y-0">
                  {[
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: "Dallas, Texas", href: null },
                    { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", value: "linkedin.com/in/abbasabdullah", href: "https://www.linkedin.com/in/abbasabdullah/" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-black/15 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-black">{item.icon}</span>
                        <span className="text-[11px] font-medium text-black tracking-[0.2em] uppercase">{item.label}</span>
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-light text-black hover:text-black transition-colors duration-200 border-b border-transparent hover:border-black"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-light text-black">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-black mb-8 uppercase">What Happens Next</p>
                <div className="space-y-0">
                  {[
                    { step: "01", title: "Initial response",   desc: "We reach out within 24 hours to understand your environment and goals." },
                    { step: "02", title: "Live platform demo", desc: "A short interactive walkthrough of the station demo." },
                    { step: "03", title: "Custom proposal",    desc: "A tailored implementation plan built around your infrastructure and timeline." },
                    { step: "04", title: "Go live",            desc: "Scope, timing and pricing are agreed with your team. Pricing is pending an approved quote." },
                  ].map((item) => (
                    <div key={item.step} className="grid grid-cols-[48px_1fr] gap-4 border-b border-black/15 py-6">
                      <span className="text-[11px] font-medium text-black tracking-[0.2em] pt-0.5">{item.step}</span>
                      <div>
                        <div className="text-sm font-medium mb-1.5">{item.title}</div>
                        <div className="text-sm font-light text-black leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      </main>

      <SiteFooter />

    </div>
  );
}
