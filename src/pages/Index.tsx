
import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Github, Linkedin, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ThreeScene from '@/components/ThreeScene';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const techStack = [
    { name: 'Playwright', category: 'Automation' },
    { name: 'Postman', category: 'API Testing' },
    { name: 'Selenium', category: 'Automation' },
    { name: 'Jest', category: 'Unit Testing' },
    { name: 'Cypress', category: 'E2E Testing' },
    { name: 'TestRail', category: 'Test Management' },
    { name: 'JIRA', category: 'Bug Tracking' },
    { name: 'JavaScript', category: 'Programming' },
    { name: 'Python', category: 'Programming' },
    { name: 'SQL', category: 'Database' },
    { name: 'Git', category: 'Version Control' },
    { name: 'Docker', category: 'DevOps' }
  ];

  const services = [
    {
      title: 'Web Application Testing',
      description: 'Comprehensive testing of web applications across different browsers and devices, ensuring optimal user experience.',
      features: ['Cross-browser testing', 'Responsive design validation', 'Performance testing', 'Accessibility testing']
    },
    {
      title: 'Mobile App Testing',
      description: 'Testing mobile applications on iOS and Android platforms, including app store deployment validation.',
      features: ['iOS/Android testing', 'Device compatibility', 'App store guidelines', 'Performance optimization']
    },
    {
      title: 'API Testing',
      description: 'Thorough testing of REST APIs using Postman and automated testing frameworks.',
      features: ['REST API validation', 'Postman collections', 'Response validation', 'Load testing']
    },
    {
      title: 'Test Automation',
      description: 'Creating robust automation frameworks using Playwright and other modern testing tools.',
      features: ['Playwright automation', 'CI/CD integration', 'Test reporting', 'Maintenance']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-cyan-400">Mark Anthony Alvarez</div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="hover:text-cyan-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('tech-stack')} className="hover:text-cyan-400 transition-colors">Tech Stack</button>
              <button onClick={() => scrollToSection('services')} className="hover:text-cyan-400 transition-colors">Services</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-cyan-400 transition-colors">Contact</button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left hover:text-cyan-400 transition-colors py-2">Home</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left hover:text-cyan-400 transition-colors py-2">About</button>
              <button onClick={() => scrollToSection('tech-stack')} className="block w-full text-left hover:text-cyan-400 transition-colors py-2">Tech Stack</button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left hover:text-cyan-400 transition-colors py-2">Services</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left hover:text-cyan-400 transition-colors py-2">Contact</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with 3D Background */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Mark Anthony Alvarez
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-slate-300">
            QA Engineer & Test Automation Specialist
          </h2>
          <p className="text-lg md:text-xl mb-12 text-slate-400 max-w-2xl mx-auto">
            Passionate about ensuring quality through comprehensive testing of web apps, mobile apps, and APIs. 
            I love investigating issues and tracking down bugs to deliver exceptional user experiences.
          </p>
          <Button 
            onClick={() => scrollToSection('contact')} 
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get In Touch
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-cyan-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">About Me</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">QA Engineer with a Passion for Quality</h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                I'm a dedicated QA Engineer who thrives on ensuring software quality through meticulous testing 
                and automation. My expertise spans across web applications, mobile apps, and API testing using 
                modern tools and methodologies.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                I specialize in both manual and automated testing, with a particular love for front-end and 
                end-to-end testing. There's nothing more satisfying than diving deep into complex issues, 
                tracking down elusive bugs, and ensuring users have seamless experiences.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                When I'm not testing applications, you'll find me exploring the outdoors through hiking and 
                climbing, staying fit with endurance sports, or unwinding with video games. I believe in 
                maintaining a healthy work-life balance while staying passionate about technology.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-80 h-80 bg-slate-700 rounded-full flex items-center justify-center border-4 border-cyan-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍💻</div>
                  <p className="text-slate-400">Your photo will go here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">Tech Stack</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Tools and technologies I use to deliver comprehensive testing solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-sm text-cyan-400">{tech.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">Services</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Comprehensive testing services to ensure your applications meet the highest quality standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-slate-900 border-slate-700 hover:border-cyan-400 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-cyan-400">{service.title}</CardTitle>
                  <CardDescription className="text-slate-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-cyan-400">Get In Touch</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
            <p className="text-slate-300 text-lg">
              Ready to discuss your testing needs? Let's connect and ensure your applications deliver exceptional quality.
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white focus:border-cyan-400"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg rounded-lg transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 py-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © 2024 Mark Anthony Alvarez. QA Engineer passionate about quality and excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
