import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, Workflow, Brain, Globe, ChevronDown, MapPin, Phone, Mail } from "lucide-react";

const logoUrl = "/logo-icon.png";

// --- Scroll reveal hook ---
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function RevealBlock({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// --- Nav ---
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Services", "How It Works", "About", "Contact"];
  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase().replace(/ /g, "-"))?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(6,30,36,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(180,210,220,0.07)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={logoUrl} alt="Sixteen Oaks Workflow Solutions" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm tracking-wide transition-colors duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8d0da" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D1793B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b8d0da")}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => scrollTo("Contact")}
            className="px-5 py-2.5 text-sm font-medium rounded-sm transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "#D1793B", color: "#061e24", letterSpacing: "0.04em" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e08b4e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#D1793B"; }}
          >
            Get Started
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden" style={{ color: "#f0ebe0" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? "320px" : "0", background: "rgba(6,30,36,0.98)" }}
      >
        <div className="px-6 pt-4 pb-8 flex flex-col gap-5">
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} className="text-left text-base"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8d0da" }}>
              {l}
            </button>
          ))}
          <button onClick={() => scrollTo("Contact")} className="px-5 py-3 text-sm font-medium rounded-sm text-center"
            style={{ background: "#D1793B", color: "#061e24", fontFamily: "'DM Sans', sans-serif" }}>
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

// --- Hero ---
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 120); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: "#061e24" }}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1764690900862-5581446fc499?w=1800&h=1100&fit=crop&auto=format&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "kenBurns 28s ease-in-out infinite alternate",
            transformOrigin: "55% 45%",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(6,30,36,0.78) 0%, rgba(6,30,36,0.55) 40%, rgba(6,30,36,0.82) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(6,30,36,0.6) 100%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-8" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>
            <div className="w-8 h-px" style={{ background: "#D1793B" }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>Monroe, Wisconsin</span>
          </div>

          <h1 className="mb-6 leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.6rem, 5.5vw, 5rem)", fontWeight: 500, color: "#f0ebe0", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s" }}>
            AI That Works<br />
            <em style={{ color: "#D1793B" }}>For Your Business.</em>
          </h1>

          <p className="text-lg mb-10 max-w-xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#9ab8c8", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s" }}>
            Practical AI workflows designed for main street businesses. We help you automate the repetitive, reclaim your time, and grow smarter — without the enterprise price tag.
          </p>

          <div className="flex flex-wrap gap-4" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.9s ease 0.65s, transform 0.9s ease 0.65s" }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="group flex items-center gap-2 px-7 py-3.5 rounded-sm font-medium transition-all duration-200" style={{ background: "#D1793B", color: "#061e24", fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e08b4e"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#D1793B"; }}>
              Book a Free Consultation
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="px-7 py-3.5 rounded-sm font-medium border transition-colors duration-200" style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8d0da", borderColor: "rgba(180,210,220,0.22)", background: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(209,121,59,0.5)"; e.currentTarget.style.color = "#D1793B"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(180,210,220,0.22)"; e.currentTarget.style.color = "#b8d0da"; }}>
              See Our Services
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:flex flex-col gap-4">
          {[
            { num: "40+", label: "Hours saved monthly, on average" },
            { num: "3×", label: "Faster response to customer inquiries" },
            { num: "100%", label: "Tailored to your specific business" },
          ].map((stat, i) => (
            <div key={stat.num} className="rounded-sm p-6 border flex gap-5 items-center" style={{ background: "rgba(10,46,60,0.55)", borderColor: "rgba(180,210,220,0.1)", backdropFilter: "blur(10px)", opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(24px)", transition: `opacity 0.9s ease ${0.5 + i * 0.15}s, transform 0.9s ease ${0.5 + i * 0.15}s` }}>
              <span className="text-3xl font-semibold shrink-0" style={{ fontFamily: "'Playfair Display', serif", color: "#D1793B" }}>{stat.num}</span>
              <span className="text-sm leading-snug" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: loaded ? 0.5 : 0, transition: "opacity 1s ease 1.2s" }}>
        <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Scroll</span>
        <ChevronDown size={16} style={{ color: "#6a9aaa" }} className="animate-bounce" />
      </div>

      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          100% { transform: scale(1.12) translate(-2%, -1.5%); }
        }
      `}</style>
    </section>
  );
}

// --- Services ---
const services = [
  { icon: <Brain size={28} />, title: "AI Workflow Design", body: "We map your current processes and identify where AI can eliminate repetitive tasks — from appointment scheduling to invoice follow-ups. You get a custom blueprint, not a generic template." },
  { icon: <Workflow size={28} />, title: "Automation Build-Out", body: "We connect your existing tools — email, calendar, CRM, POS — into smart workflows that run without you watching. Zapier, Make.com, or custom integrations, built to your business logic." },
  { icon: <Globe size={28} />, title: "Website & Digital Presence", body: "A fast, professional website that represents your business 24/7. We build sites that convert, with AI-powered chat, booking widgets, and lead capture baked in from the start." },
  { icon: <Mail size={28} />, title: "Customer Communication Systems", body: "Automated follow-ups, review requests, appointment reminders, and newsletters — all running in the background while you focus on serving customers in person." },
];

function Services() {
  return (
    <section id="services" className="py-28" style={{ background: "#061e24" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <RevealBlock className="mb-4 flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "#D1793B" }} />
          <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>What We Do</span>
        </RevealBlock>
        <RevealBlock delay={0.1} className="mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 500, color: "#f0ebe0", maxWidth: "600px", lineHeight: 1.15 }}>Tools that work as hard as you do.</h2>
        </RevealBlock>
        <div className="grid md:grid-cols-2 gap-px" style={{ background: "rgba(180,210,220,0.07)" }}>
          {services.map((svc, i) => (
            <RevealBlock key={svc.title} delay={i * 0.1} className="p-10 cursor-default" style={{ background: "#061e24" }}>
              <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-6" style={{ background: "rgba(209,121,59,0.12)", color: "#D1793B" }}>{svc.icon}</div>
              <h3 className="text-xl mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#f0ebe0" }}>{svc.title}</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa", fontWeight: 300 }}>{svc.body}</p>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- How It Works ---
const steps = [
  { num: "01", title: "Free Discovery Call", body: "We spend 30 minutes learning your business — what's working, what's eating your time, and where the biggest wins are hiding." },
  { num: "02", title: "Custom Workflow Audit", body: "We document your current processes and build a prioritized roadmap of AI automations specific to your industry and team size." },
  { num: "03", title: "Build & Deploy", body: "We build the integrations, test everything, and hand it off with clear documentation. No IT department required on your end." },
  { num: "04", title: "Ongoing Support", body: "Monthly check-ins, tune-ups, and new automation ideas as your business evolves. We grow with you, not away from you." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28" style={{ background: "#071f2b" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <RevealBlock className="mb-4 flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "#D1793B" }} />
          <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>The Process</span>
        </RevealBlock>
        <RevealBlock delay={0.1} className="mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 500, color: "#f0ebe0", maxWidth: "540px", lineHeight: 1.15 }}>Simple start. Real results.</h2>
        </RevealBlock>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <RevealBlock key={step.num} delay={i * 0.12}>
              <div className="flex flex-col h-full">
                <span className="text-5xl font-semibold mb-5 block" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(209,121,59,0.18)", lineHeight: 1 }}>{step.num}</span>
                <div className="w-full h-px mb-5" style={{ background: "rgba(180,210,220,0.1)" }} />
                <h3 className="text-lg mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#f0ebe0" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa", fontWeight: 300 }}>{step.body}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Testimonials ---
const testimonials = [
  { quote: "Before Sixteen Oaks, I was spending Sunday nights writing follow-up emails. Now it's all automatic. I actually had a full weekend for the first time in years.", name: "Karen Brandt", biz: "Owner, Brandt's Green House & Gifts — Monroe, WI" },
  { quote: "They built us a booking system and automated our reminder texts. No-shows dropped by half in the first month. It paid for itself immediately.", name: "Derek Olson", biz: "Olson's Family Barbershop — Monroe, WI" },
  { quote: "I was skeptical — I'm not a tech person. But they explained everything in plain English and built something I actually understand how to use.", name: "Patty Schlueter", biz: "Patty's Bookkeeping & Tax — Green County, WI" },
];

function Testimonials() {
  return (
    <section className="py-28" style={{ background: "#061e24" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <RevealBlock className="mb-4 flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "#D1793B" }} />
          <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>What Our Clients Say</span>
        </RevealBlock>
        <RevealBlock delay={0.1} className="mb-16">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 500, color: "#f0ebe0", lineHeight: 1.15 }}>Real businesses. Real results.</h2>
        </RevealBlock>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <RevealBlock key={t.name} delay={i * 0.12}>
              <div className="flex flex-col h-full p-8 rounded-sm border" style={{ background: "#0a2e3c", borderColor: "rgba(180,210,220,0.08)" }}>
                <p className="text-base leading-relaxed flex-1 mb-8" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#b8d0da", fontSize: "1.05rem" }}>"{t.quote}"</p>
                <div>
                  <div className="w-8 h-px mb-4" style={{ background: "#D1793B" }} />
                  <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "#f0ebe0" }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa" }}>{t.biz}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- About ---
function About() {
  return (
    <section id="about" className="py-28 overflow-hidden" style={{ background: "#071f2b" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-6">
          <RevealBlock className="mb-4 flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: "#D1793B" }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>About Us</span>
          </RevealBlock>
          <RevealBlock delay={0.1} className="mb-6">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, color: "#f0ebe0", lineHeight: 1.15 }}>
              Rooted in Monroe.<br /><em>Built for Main Street.</em>
            </h2>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <p className="text-base leading-relaxed mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#9ab8c8" }}>Sixteen Oaks Workflow Solutions was founded on a simple belief: the same AI tools reshaping Fortune 500 companies are accessible to every small business owner — they just need someone to translate the technology into plain language and practical results.</p>
            <p className="text-base leading-relaxed mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#9ab8c8" }}>We work with florists, barbers, bookkeepers, contractors, and retailers across Green County. We know the rhythms of a small town business — the morning rush, the seasonal swings, the loyalty that takes years to earn. Our job is to protect your time so you can protect that loyalty.</p>
            <p className="text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#9ab8c8" }}>We are not a remote firm that drops in a template and disappears. We are your neighbors, and we are invested in the businesses that make Monroe worth living in.</p>
          </RevealBlock>
        </div>
        <RevealBlock delay={0.3} className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-sm border" style={{ borderColor: "rgba(209,121,59,0.18)" }} />
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=700&fit=crop&auto=format" alt="Small business owner working at their desk with technology" className="relative w-full rounded-sm object-cover" style={{ height: "420px" }} />
            <div className="absolute inset-0 rounded-sm" style={{ background: "linear-gradient(135deg, rgba(6,30,36,0.3) 0%, transparent 60%)" }} />
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}

// --- CTA Band ---
function CtaBand() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3340 0%, #071f2b 50%, #061e24 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(209,121,59,0.08) 0%, transparent 70%)" }} />
      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <RevealBlock className="mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 500, color: "#f0ebe0", lineHeight: 1.2 }}>
            The best time to start was last year.<br />
            <em style={{ color: "#D1793B" }}>The second best time is today.</em>
          </h2>
        </RevealBlock>
        <RevealBlock delay={0.15} className="mb-10">
          <p className="text-base max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#6a9aaa" }}>A free 30-minute discovery call costs you nothing and could change how you work forever.</p>
        </RevealBlock>
        <RevealBlock delay={0.25}>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="group inline-flex items-center gap-2 px-8 py-4 rounded-sm font-medium transition-all duration-200" style={{ background: "#D1793B", color: "#061e24", fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e08b4e"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#D1793B"; }}>
            Schedule Your Free Call
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </RevealBlock>
      </div>
    </section>
  );
}

// --- Contact ---
function Contact() {
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  const inputStyle: React.CSSProperties = { background: "#071f2b", border: "1px solid rgba(180,210,220,0.12)", color: "#f0ebe0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", padding: "12px 16px", borderRadius: "2px", width: "100%", outline: "none", transition: "border-color 0.2s" };

  return (
    <section id="contact" className="py-28" style={{ background: "#061e24" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <RevealBlock className="mb-4 flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: "#D1793B" }} />
            <span className="text-xs tracking-[0.22em] uppercase" style={{ color: "#D1793B", fontFamily: "'DM Mono', monospace" }}>Get In Touch</span>
          </RevealBlock>
          <RevealBlock delay={0.1} className="mb-6">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 500, color: "#f0ebe0", lineHeight: 1.2 }}>
              Let us talk about<br /><em style={{ color: "#D1793B" }}>your business.</em>
            </h2>
          </RevealBlock>
          <RevealBlock delay={0.2} className="space-y-5">
            {[
              { icon: <MapPin size={18} />, label: "Location", val: "Monroe, Wisconsin — serving all of Green County and surrounding areas" },
              { icon: <Phone size={18} />, label: "Phone", val: "(608) 558-5639" },
              { icon: <Mail size={18} />, label: "Email", val: "hello@sixtenoaks.io" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span style={{ color: "#D1793B", marginTop: "2px", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "#f0ebe0" }}>{item.label}</p>
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa" }}>{item.val}</p>
                </div>
              </div>
            ))}
          </RevealBlock>
        </div>
        <RevealBlock delay={0.2} className="lg:col-span-7">
          {sent ? (
            <div className="h-full min-h-80 flex flex-col items-center justify-center text-center rounded-sm border p-12" style={{ background: "#0a2e3c", borderColor: "rgba(180,210,220,0.08)" }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(209,121,59,0.15)" }}>
                <ArrowRight size={24} style={{ color: "#D1793B" }} />
              </div>
              <h3 className="text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ebe0" }}>Message Received</h3>
              <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#6a9aaa" }}>We will be in touch within one business day to schedule your free discovery call.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-sm border p-8 lg:p-10" style={{ background: "#0a2e3c", borderColor: "rgba(180,210,220,0.08)" }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs mb-2 tracking-wide" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Your Name</label>
                  <input style={inputStyle} required value={form.name} placeholder="Jane Smith" onChange={(e) => setForm({ ...form, name: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(209,121,59,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,210,220,0.12)")} />
                </div>
                <div>
                  <label className="block text-xs mb-2 tracking-wide" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Business Name</label>
                  <input style={inputStyle} value={form.business} placeholder="Smith's Hardware" onChange={(e) => setForm({ ...form, business: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(209,121,59,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,210,220,0.12)")} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs mb-2 tracking-wide" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Email</label>
                  <input type="email" style={inputStyle} required value={form.email} placeholder="jane@business.com" onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(209,121,59,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,210,220,0.12)")} />
                </div>
                <div>
                  <label className="block text-xs mb-2 tracking-wide" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Phone (optional)</label>
                  <input type="tel" style={inputStyle} value={form.phone} placeholder="(608) 555-0100" onChange={(e) => setForm({ ...form, phone: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(209,121,59,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,210,220,0.12)")} />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs mb-2 tracking-wide" style={{ fontFamily: "'DM Mono', monospace", color: "#6a9aaa" }}>Tell Us About Your Business</label>
                <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.message} placeholder="What type of business do you run? What's eating the most of your time right now?" onChange={(e) => setForm({ ...form, message: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "rgba(209,121,59,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,210,220,0.12)")} />
              </div>
              <button type="submit" className="w-full group flex items-center justify-center gap-2 py-3.5 rounded-sm font-medium transition-all duration-200" style={{ background: "#D1793B", color: "#061e24", fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e08b4e"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#D1793B"; }}>
                Send Message
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          )}
        </RevealBlock>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="py-12 border-t" style={{ background: "#040f14", borderColor: "rgba(180,210,220,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-lg font-semibold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#f0ebe0" }}>Sixteen Oaks Workflow Solutions</p>
          <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "#2a5a6a" }}>Monroe, Wisconsin · AI Workflows · Websites · Automation</p>
        </div>
        <p className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#1a4a5a" }}>© {new Date().getFullYear()} Sixteen Oaks Workflow Solutions</p>
      </div>
    </footer>
  );
}

// --- App ---
export default function App() {
  return (
    <div style={{ background: "#061e24" }}>
      <Nav />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <About />
      <CtaBand />
      <Contact />
      <Footer />
    </div>
  );
}
