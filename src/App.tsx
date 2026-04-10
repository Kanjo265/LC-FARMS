/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Utensils, 
  ShoppingCart, 
  ArrowRight,
  Star,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- Constants & Assets ---
const IMAGES = {
  LOGO: "https://lh3.googleusercontent.com/d/1NK4nI660Ocr88BQEuaite2uR2UKtjVu6",
  TRAY: "https://lh3.googleusercontent.com/d/1uconozyYNUpTfQWf8e5S2FIJj9oeGDHX",
  SHADE: "https://lh3.googleusercontent.com/d/1QE8M4N0hLKxkJuGRTxiconWnLxsR2DgC",
  BAGS: "https://lh3.googleusercontent.com/d/1ITpcFGvoAN_m5q6TATcA89wSyfvCe8Mn",
  DRIED: "https://lh3.googleusercontent.com/d/1VBBuvwtsTl5NVwGY-ISPZcTXYCF1USVe",
};

const WHATSAPP_NUMBER = "+265XXXXXXXXX"; // Placeholder Malawian number
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20LC%20FARMS,%20I'm%20interested%20in%20your%20mushrooms!`;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  interest: z.string().min(1, "Please select an interest"),
});

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Products", href: "#products" },
    { name: "Process", href: "#process" },
    { name: "Why Us", href: "#why-us" },
    { name: "Partners", href: "#partners" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={IMAGES.LOGO} alt="LC FARMS Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
          <span className={`font-heading font-bold text-xl ${isScrolled ? "text-primary" : "text-white"}`}>LC FARMS</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? "text-foreground" : "text-white/90"}`}
            >
              {link.name}
            </a>
          ))}
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Order Now</a>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? "text-foreground" : "text-white"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                    {link.name}
                  </a>
                ))}
                <Button asChild className="w-full">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Order Now</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES.SHADE} 
          alt="Mushroom Shade" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-sm px-4 py-1 text-sm">
              Malawi's Premium Mushroom Farm
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
              Fresh. Organic. <br />
              <span className="text-primary">Locally Grown</span> <br />
              Mushrooms You Can Trust.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              From farm to table — premium mushrooms grown sustainably in Malawi. Healthy, nutritious, and delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto" asChild>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-6 h-auto" asChild>
                <a href="#partners">Become a Distributor</a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6">
              {[
                { icon: Leaf, text: "Locally Grown" },
                { icon: ShieldCheck, text: "Chemical-Free" },
                { icon: Star, text: "High Quality" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/90">
                  <div className="bg-primary/20 p-1.5 rounded-full">
                    <badge.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hidden md:block"
      >
        <ChevronDown className="h-8 w-8" />
      </motion.div>
    </section>
  );
};

const Products = () => {
  const products = [
    {
      title: "Fresh Mushrooms",
      image: IMAGES.TRAY,
      description: "Fresh oyster mushrooms harvested daily for maximum flavor and nutrition.",
      benefits: ["Rich in protein", "Boosts immunity", "100% organic"],
      cta: "Order Fresh Mushrooms",
      badge: "Best Seller"
    },
    {
      title: "Dried Mushrooms",
      image: IMAGES.DRIED,
      description: "Long-lasting, nutrient-packed dried mushrooms perfect for soups and stews.",
      benefits: ["Long shelf life", "Easy storage", "Intense flavor"],
      cta: "Buy Dried Mushrooms",
      badge: "New Arrival"
    }
  ];

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Products</h2>
          <p className="text-muted-foreground">We specialize in high-quality oyster mushrooms, grown with care to ensure the best taste and health benefits.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-none shadow-xl bg-muted/30">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary">{product.badge}</Badge>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{product.title}</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  <ul className="space-y-3 mb-8">
                    {product.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full py-6 text-lg" asChild>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">{product.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      title: "Substrate Preparation",
      desc: "We use high-quality organic materials like sawdust and lime to create the perfect growing medium."
    },
    {
      title: "Controlled Environment",
      desc: "Our mushrooms grow in climate-controlled shades to ensure consistent quality and yield."
    },
    {
      title: "Hygienic Harvesting",
      desc: "Every mushroom is hand-picked at its peak freshness following strict hygiene standards."
    }
  ];

  return (
    <section id="process" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={IMAGES.BAGS} 
                alt="Mushroom Bags" 
                className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                referrerPolicy="no-referrer"
              />
              <img 
                src={IMAGES.SHADE} 
                alt="Growing Shade" 
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-2xl shadow-2xl hidden md:block max-w-[240px]">
              <p className="text-2xl font-bold mb-1">100%</p>
              <p className="text-sm opacity-90">Organic & Sustainable Farming Practices</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Grown with Care, <br /><span className="text-primary">Backed by Science</span></h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Our growing process is designed to mimic nature while maintaining the highest standards of cleanliness and efficiency.
            </p>
            
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: MapPin,
      title: "Locally Produced",
      desc: "Proudly grown in Malawi, supporting local agriculture and economy."
    },
    {
      icon: Leaf,
      title: "Sustainable Farming",
      desc: "We use eco-friendly practices that protect our environment."
    },
    {
      icon: ShieldCheck,
      title: "Quality Control",
      desc: "Rigorous testing and standards to ensure premium quality every time."
    },
    {
      icon: TrendingUp,
      title: "Reliable Supply",
      desc: "Consistent production to meet the needs of businesses and households."
    },
    {
      icon: Users,
      title: "Youth-Led Innovation",
      desc: "Driven by a passionate team of young Malawian agribusiness innovators."
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LC FARMS?</h2>
          <p className="text-muted-foreground">We are more than just a farm; we are a commitment to quality and sustainability in Malawi.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <Card key={i} className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 p-8 bg-muted/20">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
                <reason.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const TargetCustomers = () => {
  const targets = [
    { icon: Users, title: "Households", desc: "Nutritious daily consumption for families." },
    { icon: Utensils, title: "Restaurants & Hotels", desc: "Premium ingredients for gourmet dishes." },
    { icon: ShoppingCart, title: "Supermarkets", desc: "Reliable retail supply for your shelves." },
    { icon: TrendingUp, title: "Bulk Buyers", desc: "Scalable solutions for distributors." }
  ];

  return (
    <section id="partners" className="py-24 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Serve</h2>
          <p className="text-white/70">From individual kitchens to large-scale distributors, we provide the best mushrooms in the region.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {targets.map((target, i) => (
            <div key={i} className="text-center p-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <target.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{target.title}</h3>
              <p className="text-white/60 text-sm">{target.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 py-6 h-auto text-lg" asChild>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Partner With Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Chifundo Banda",
      role: "Restaurant Owner",
      text: "The quality of oyster mushrooms from LC FARMS is unmatched. Our customers love the freshness and flavor they bring to our signature dishes.",
      rating: 5
    },
    {
      name: "Grace Phiri",
      role: "Household Customer",
      text: "I've been buying fresh mushrooms for my family for months. They are always clean, well-packed, and taste amazing. Highly recommended!",
      rating: 5
    },
    {
      name: "Samuel Mwale",
      role: "Retail Buyer",
      text: "As a distributor, reliability is key. LC FARMS has consistently delivered high-quality dried mushrooms on time, every time.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground">Don't just take our word for it — hear from the people who trust our products.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-8 border-none shadow-lg bg-muted/30 relative">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="italic text-muted-foreground mb-6">"{t.text}"</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-primary font-medium">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const LeadForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    setSubmitted(true);
    // In a real app, you'd send this to a backend
  };

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
          <div className="p-10 md:p-16 bg-primary text-white flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Premium Mushrooms?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Whether you're looking for a healthy addition to your meals or a reliable business partner, we're here to help.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6" />
                <span>Fast response on WhatsApp</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6" />
                <span>Quality guaranteed</span>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">We've received your inquiry and will get back to you shortly.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send another inquiry</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" {...register("name")} className={errors.name ? "border-destructive" : ""} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+265..." {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">I'm interested in...</Label>
                  <select 
                    id="interest" 
                    {...register("interest")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select an option</option>
                    <option value="fresh">Fresh Mushrooms</option>
                    <option value="dried">Dried Mushrooms</option>
                    <option value="distributor">Becoming a Distributor</option>
                    <option value="bulk">Bulk Purchase</option>
                  </select>
                  {errors.interest && <p className="text-xs text-destructive">{errors.interest.message as string}</p>}
                </div>
                <Button type="submit" className="w-full py-6 text-lg">Send Inquiry</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "How long do fresh mushrooms last?",
      a: "Our fresh oyster mushrooms typically last 5-7 days when stored properly in a refrigerator in a paper bag or breathable container."
    },
    {
      q: "Do you deliver across Malawi?",
      a: "Yes, we offer delivery services to major cities and towns. Contact us via WhatsApp for specific delivery schedules and rates for your location."
    },
    {
      q: "How should I store dried mushrooms?",
      a: "Dried mushrooms should be stored in an airtight container in a cool, dark, and dry place. They can last up to 12 months while maintaining their flavor."
    },
    {
      q: "Are your mushrooms chemical-free?",
      a: "Absolutely. We use 100% organic growing methods and do not use any synthetic pesticides or chemicals in our production process."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our mushrooms and services.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-bold text-lg">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Have questions or want to place a bulk order? Reach out to us through any of these channels.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-muted-foreground">+265 88X XXX XXX / +265 99X XXX XXX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-muted-foreground">info@lcfarms.mw</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-muted-foreground">Lilongwe, Malawi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Connect on WhatsApp</h3>
            <p className="text-muted-foreground mb-8">
              The fastest way to get a response and place your order is through WhatsApp. Our team is ready to assist you.
            </p>
            <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-8 text-xl h-auto" asChild>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-3 h-7 w-7" /> Chat on WhatsApp
              </a>
            </Button>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Available Monday - Saturday, 8:00 AM - 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src={IMAGES.LOGO} alt="LC FARMS" className="h-10 w-auto" referrerPolicy="no-referrer" />
              <span className="font-heading font-bold text-2xl">LC FARMS</span>
            </div>
            <p className="text-white/60 max-w-md mb-8">
              Malawi's leading agribusiness specializing in premium organic mushrooms. We are committed to sustainability, health, and empowering our local community.
            </p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              {["Facebook", "Instagram", "LinkedIn"].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-white/20 rounded-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#products" className="hover:text-primary transition-colors">Products</a></li>
              <li><a href="#process" className="hover:text-primary transition-colors">Our Process</a></li>
              <li><a href="#why-us" className="hover:text-primary transition-colors">Why Choose Us</a></li>
              <li><a href="#partners" className="hover:text-primary transition-colors">Partnerships</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Delivery Info</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} LC FARMS. All rights reserved. Locally Grown in Malawi.</p>
        </div>
      </div>
    </footer>
  );
};

const StickyWhatsApp = () => {
  return (
    <motion.a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold whitespace-nowrap">
        Order on WhatsApp
      </span>
    </motion.a>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Process />
        <WhyChooseUs />
        <TargetCustomers />
        <Testimonials />
        <LeadForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
