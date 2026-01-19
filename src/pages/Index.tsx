import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  ChevronDown,
  Menu,
  X,
  Globe,
  Code,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ThreeScene from "@/components/ThreeScene";
import { validateContactForm, sanitizeInput } from "@/utils/formSecurity";
import { sendContactEmail } from "@/utils/emailService";
import { analytics } from "@/utils/analytics";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "", // Hidden field for spam protection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const lastSubmissionTime = useRef<number>(0);
  const { toast } = useToast();

  // Track page view on component mount
  useEffect(() => {
    analytics.trackEvent('page_view', { page: 'home' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting - prevent more than 3 submissions per 5 minutes
    const now = Date.now();
    if (submissionCount >= 3 && now - lastSubmissionTime.current < 300000) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before submitting another message.",
        variant: "destructive",
      });
      return;
    }

    // Honeypot check for spam protection
    if (formData.honeypot) {
      toast({
        title: "Spam Detected",
        description: "Your submission was flagged as spam.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      };

      // Log security event (in production, this would go to a monitoring service)
      console.log("Form submission attempt:", {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sanitizedData,
      });

      // Send actual email using EmailJS
      await sendContactEmail(sanitizedData);

      // Track successful form submission
      analytics.trackEvent('contact_form_submit', { 
        success: true,
        name: sanitizedData.name,
        email: sanitizedData.email
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });

      // Reset form and update rate limiting
      setFormData({ name: "", email: "", message: "", honeypot: "" });
      setSubmissionCount((prev) => prev + 1);
      lastSubmissionTime.current = now;
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    analytics.trackEvent('navigation_click', { section: id });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const techStack = [
    { 
      name: "Playwright", 
      category: "Automation", 
      icon: () => <img src="/images/playwright-logo-alt.svg" alt="Playwright testing framework logo" className="w-8 h-8" loading="lazy" width="32" height="32" />
    },
    { 
      name: "Postman", 
      category: "API Testing", 
      icon: () => <img src="/images/postman-logo.svg" alt="Postman API testing tool logo" className="w-8 h-8" loading="lazy" width="32" height="32" />
    },
    { 
      name: "JavaScript", 
      category: "Programming", 
      icon: () => <img src="/images/javascript-logo.svg" alt="JavaScript programming language logo" className="w-8 h-8" loading="lazy" width="32" height="32" />
    },
    { 
      name: "Charles Proxy", 
      category: "Network Analysis", 
      icon: () => <img src="/images/charles-proxy-official.jpg" alt="Charles Proxy network debugging tool logo" className="w-8 h-8" loading="lazy" width="32" height="32" />
    },
  ];

  const services = [
    {
      title: "Web Application Testing",
      description:
        "Comprehensive testing of web applications across different browsers and devices, ensuring optimal user experience.",
      features: [
        "Cross-browser testing",
        "Responsive design validation",
        "Performance testing",
        "Accessibility testing",
      ],
    },
    {
      title: "Mobile App Testing",
      description:
        "Testing mobile applications on iOS and Android platforms, including app store deployment validation.",
      features: [
        "iOS/Android testing",
        "Device compatibility",
        "App store guidelines",
        "Performance optimization",
      ],
    },
    {
      title: "API Testing",
      description:
        "Thorough testing of REST APIs using Postman and automated testing frameworks.",
      features: [
        "REST API validation",
        "Postman collections",
        "Response validation",
        "Load testing",
      ],
    },
    {
      title: "Test Automation",
      description:
        "Creating robust automation frameworks using Playwright and other modern testing tools.",
      features: [
        "Playwright automation",
        "CI/CD integration",
        "Test reporting",
        "Maintenance",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AnalyticsDashboard />
      {/* Navigation - Enhanced for mobile */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-lg sm:text-xl font-bold text-cyan-400 truncate">
              Mark Anthony Alvarez
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("tech-stack")}
                className="hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Tech Stack
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Contact
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-slate-700">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left hover:text-cyan-400 transition-colors py-3 px-2 text-base"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left hover:text-cyan-400 transition-colors py-3 px-2 text-base"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("tech-stack")}
                className="block w-full text-left hover:text-cyan-400 transition-colors py-3 px-2 text-base"
              >
                Tech Stack
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left hover:text-cyan-400 transition-colors py-3 px-2 text-base"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left hover:text-cyan-400 transition-colors py-3 px-2 text-base"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with 3D Background - Enhanced responsive */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 w-full h-full">
          <ThreeScene />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
            Mark Anthony Alvarez
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-slate-300 px-2">
            QA Engineer & Test Automation Specialist
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            Passionate about ensuring quality through comprehensive testing of
            web apps, mobile apps, and APIs. I love investigating issues and
            tracking down bugs to deliver exceptional user experiences.
          </p>
          <Button
            onClick={() => scrollToSection("contact")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto max-w-xs"
          >
            Get In Touch
          </Button>
        </div>
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button
            variant="ghost"
            className="bg-transparent p-0 hover:bg-transparent focus:ring-0"
            onClick={() => scrollToSection("about")}>
          <ChevronDown size={24} className="text-cyan-400 sm:w-8 sm:h-8" />
          </Button>
        </div>

      </section>

      {/* About Section - Enhanced responsive */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-400">
              About Me
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
  <h3 className="text-xl sm:text-2xl font-semibold mb-4">
  QA That Keeps Things Moving
</h3>
<p className="text-slate-300 text-base sm:text-lg leading-relaxed">
  I make sure things work the way they should. If something’s off, I’ll catch it. I keep the process clean, focus on what matters, and help teams build solid, reliable software.
</p>
<p className="text-slate-300 text-base sm:text-lg leading-relaxed">
  Web, mobile, APIs — I’m comfortable across the board. Manual when it calls for it, automated when it saves time. I look for real issues, not busywork. It’s about helping the product hold up under pressure.
</p>
<p className="text-slate-300 text-base sm:text-lg leading-relaxed">
  Outside work, I stay active — hiking with friends, boxing, a bit of gaming here and there. It keeps things balanced.
</p>


            </div>

            <div className="flex justify-center order-1 lg:order-2">
              <div>
                <div className="text-center">
                <picture>
                  <source srcSet="./images/alvarez.webp" type="image/webp" />
                  <img
                    src="./images/alvarez.jpg"
                    alt="Mark Anthony Alvarez - QA Engineer profile picture"
                    className="w-64 h-64 sm:w-80 sm:h-80 bg-slate-700 rounded-full flex items-center justify-center border-4 border-cyan-400"
                    loading="lazy"
                    width="320"
                    height="320"
                  />
                </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section - Enhanced responsive */}
      <section id="tech-stack" className="py-12 sm:py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-400">
              Tech Stack
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Tools and technologies I use to deliver comprehensive testing
              solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card
                  key={index}
                  className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <IconComponent />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                      {tech.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-cyan-400">
                      {tech.category}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced responsive */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-400">
              Services
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Comprehensive testing services to ensure your applications meet
              the highest quality standards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-slate-900 border-slate-700 hover:border-cyan-400 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-cyan-400">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-sm sm:text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-slate-300 text-sm sm:text-base"
                      >
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Enhanced responsive */}
      {/* 
      <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-400">
              Projects
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Featured projects showcasing my testing expertise and technical skills
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-cyan-400">
                  Project 1 Title
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm sm:text-base">
                  Description of your first project and the testing methodologies used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 1
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 2
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 3
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 4
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-cyan-400">
                  Project 2 Title
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm sm:text-base">
                  Description of your second project and the testing approaches implemented.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 1
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 2
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 3
                  </li>
                  <li className="flex items-center text-slate-300 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
                    Feature 4
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      */}

      {/* Contact Section - Enhanced responsive */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-400">
              Get In Touch
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg px-2">
              Ready to discuss your testing needs? Let's connect and ensure your
              applications deliver exceptional quality.
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) =>
                    setFormData({ ...formData, honeypot: e.target.value })
                  }
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400 text-base"
                      required
                      maxLength={100}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400 text-base"
                      required
                      maxLength={100}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400 text-base resize-none"
                    required
                    maxLength={1000}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {formData.message.length}/1000 characters
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-base sm:text-lg rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer - Enhanced responsive */}
      <footer className="bg-slate-800 py-6 sm:py-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            © 2026 Mark Anthony Alvarez. QA Engineer passionate about quality
            and excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
