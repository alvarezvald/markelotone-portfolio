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
  Palette,
  Layers,
  Zap,
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
import ParallaxMountain from "@/components/ParallaxMountain";
import { validateContactForm, sanitizeInput } from "@/utils/formSecurity";
import { sendContactEmail } from "@/utils/emailService";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const techStack = [
    { name: "Figma", category: "Design", icon: Palette },
    { name: "Adobe XD", category: "Prototyping", icon: Layers },
    { name: "React", category: "Development", icon: Code },
    { name: "Three.js", category: "3D Graphics", icon: Zap },
  ];

  const services = [
    {
      title: "UI/UX Design",
      description:
        "Creating intuitive and visually stunning user interfaces that provide exceptional user experiences across all platforms.",
      features: [
        "User research & analysis",
        "Wireframing & prototyping",
        "Visual design systems",
        "Usability testing",
      ],
    },
    {
      title: "Interactive Experiences",
      description:
        "Developing immersive digital experiences using modern web technologies and 3D graphics to engage users.",
      features: [
        "3D web experiences",
        "Motion design & animations",
        "Interactive prototypes",
        "WebGL implementations",
      ],
    },
    {
      title: "Frontend Development",
      description:
        "Building responsive, performant web applications with modern frameworks and cutting-edge technologies.",
      features: [
        "React & TypeScript",
        "Responsive design",
        "Performance optimization",
        "Modern CSS techniques",
      ],
    },
    {
      title: "Design Systems",
      description:
        "Creating comprehensive design systems that ensure consistency and scalability across digital products.",
      features: [
        "Component libraries",
        "Style guides",
        "Documentation",
        "Brand consistency",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-x-hidden">
      <ParallaxMountain />
      
      {/* Navigation - Enhanced for mobile */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
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

      {/* Hero Section with Parallax Mountain Background */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <div 
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`,
              opacity: Math.max(0, 1 - scrollY * 0.002)
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-500 bg-clip-text text-transparent leading-tight">
              Mark Anthony Alvarez
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8 text-slate-200 px-2">
              UI/UX Designer & Interactive Developer
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-slate-300 max-w-2xl mx-auto leading-relaxed px-2">
              Creating immersive digital experiences through innovative design and cutting-edge web technologies. 
              Specializing in 3D web experiences, motion design, and user-centered interfaces.
            </p>
          </div>
          
          <div 
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.001)
            }}
          >
            <Button
              onClick={() => scrollToSection("services")}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto max-w-xs shadow-lg"
            >
              Explore My Work
            </Button>
          </div>
        </div>

        <div 
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{
            opacity: Math.max(0, 1 - scrollY * 0.01)
          }}
        >
          <ChevronDown size={24} className="text-cyan-400 sm:w-8 sm:h-8" />
        </div>

        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600 z-50 origin-left transform transition-transform duration-150"
             style={{ transform: `scaleX(${Math.min(1, scrollY / (document.body.scrollHeight - window.innerHeight))})` }}>
        </div>
      </section>

      {/* Services Section with Scroll Animations */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 relative z-20 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Design Services
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Transforming ideas into engaging digital experiences through innovative design and development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/10"
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - 800) * 0.1 - index * 20)}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 600) / 400))
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
                        <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full mr-3 flex-shrink-0"></span>
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

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-slate-800/80 backdrop-blur-sm relative z-20">
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
                QA Engineer with a Passion for Quality
              </h3>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                I'm a dedicated QA Engineer who thrives on ensuring software
                quality through meticulous testing and automation. My expertise
                spans across web applications, mobile apps, and API testing
                using modern tools and methodologies.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                I specialize in both manual and automated testing, with a
                particular love for front-end and end-to-end testing. There's
                nothing more satisfying than diving deep into complex issues,
                tracking down elusive bugs, and ensuring users have seamless
                experiences.
              </p>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When I'm not testing applications, you'll find me exploring the
                outdoors through hiking and climbing, staying fit with endurance
                sports, or unwinding with video games. I believe in maintaining
                a healthy work-life balance while staying passionate about
                technology.
              </p>
            </div>

            <div className="flex justify-center order-1 lg:order-2">
              <div>
                <div className="text-center">
                  <img
                    src="./images/alvarez.jpg"
                    alt=""
                    className="w-64 h-64 sm:w-80 sm:h-80 bg-slate-700 rounded-full flex items-center justify-center border-4 border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-12 sm:py-16 lg:py-20 bg-slate-900/90 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Design Tools
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mb-6"></div>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto px-2">
              Tools and technologies I use to create exceptional digital experiences
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card
                  key={index}
                  className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/10"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <IconComponent size={32} className="text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                      {tech.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-400">
                      {tech.category}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
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

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-slate-900/90 backdrop-blur-sm relative z-20">
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

      {/* Footer */}
      <footer className="bg-slate-800/80 backdrop-blur-sm py-6 sm:py-8 border-t border-slate-700/50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm sm:text-base">
            © 2024 Mark Anthony Alvarez. UI/UX Designer creating immersive digital experiences.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
