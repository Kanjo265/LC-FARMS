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
  ChevronDown,
  Youtube,
  Facebook,
  Instagram,
  Search,
  Clock
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { db, auth } from "./firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc,
  deleteDoc
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";

// --- Types & Utilities ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Constants & Assets ---
const IMAGES = {
  LOGO: "https://lh3.googleusercontent.com/d/1eQrdiO9GSM_cUJ44kX3FIWMwgyBxG9ax",
  TRAY: "https://lh3.googleusercontent.com/d/1uconozyYNUpTfQWf8e5S2FIJj9oeGDHX",
  SHADE: "https://lh3.googleusercontent.com/d/1QE8M4N0hLKxkJuGRTxiconWnLxsR2DgC",
  BAGS: "https://lh3.googleusercontent.com/d/1ITpcFGvoAN_m5q6TATcA89wSyfvCe8Mn",
  DRIED: "https://lh3.googleusercontent.com/d/1VBBuvwtsTl5NVwGY-ISPZcTXYCF1USVe",
};

const WHATSAPP_NUMBER = "+265991890948";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20LC%20FARMS,%20I'm%20interested%20in%20your%20mushrooms!`;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  interest: z.string().min(1, "Please select an interest"),
});

const agentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  location: z.string().min(2, "Please enter your location"),
  experience: z.string().optional(),
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
    { name: "Agent Portal", href: "#agent-portal" },
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
          <Button nativeButton={false} className="bg-primary hover:bg-primary/90" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
            Order Now
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger 
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }), 
                isScrolled ? "text-foreground" : "text-white"
              )}
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                    {link.name}
                  </a>
                ))}
                <Button nativeButton={false} className="w-full" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
                  Order Now
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
              <Button nativeButton={false} size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button nativeButton={false} size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-6 h-auto" render={<a href="#agent-portal" />}>
                Become an Agent
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
                  <Button nativeButton={false} className="w-full py-6 text-lg" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
                    {product.cta}
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
          <Button nativeButton={false} size="lg" className="bg-primary hover:bg-primary/90 px-10 py-6 h-auto text-lg" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
            Partner With Us
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

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, "leads"), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again.");
    }
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

const AgentPortal = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(agentFormSchema)
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const path = 'agentRegistrations';
    try {
      await addDoc(collection(db, path), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="agent-portal" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Partner Program</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the LC FARMS Family</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are looking for passionate agents and partners to help us bring premium mushrooms to every corner of Malawi. Grow your business with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Premium Quality", desc: "Access to the best organic mushrooms in Malawi." },
              { title: "Marketing Support", desc: "We provide branding materials and lead generation." },
              { title: "Scalable Growth", desc: "Competitive pricing and reliable bulk supply." }
            ].map((benefit, i) => (
              <div key={i} className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <h4 className="font-bold text-xl mb-2 text-primary">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-secondary p-10 text-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6">Agent Application</h3>
                <p className="text-white/70 mb-8">
                  Fill out the form to start your journey as an LC FARMS partner. Our team will review your application and contact you within 48 hours.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm">Exclusive territory rights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm">Training & resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-sm">Flexible partnership models</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 p-10">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                    <p className="text-muted-foreground mb-8">Thank you for your interest in partnering with LC FARMS. We'll be in touch soon.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Submit another application</Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Full Name</Label>
                        <Input id="agent-name" placeholder="Your Name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-email">Email Address</Label>
                        <Input id="agent-email" type="email" placeholder="email@example.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="agent-phone">Phone Number</Label>
                        <Input id="agent-phone" placeholder="+265..." {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agent-location">Location / Area</Label>
                        <Input id="agent-location" placeholder="City, District" {...register("location")} className={errors.location ? "border-destructive" : ""} />
                        {errors.location && <p className="text-xs text-destructive">{errors.location.message as string}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-experience">Business Experience (Optional)</Label>
                      <textarea 
                        id="agent-experience" 
                        {...register("experience")}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us a bit about your business background..."
                      />
                    </div>
                    <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                      {loading ? "Submitting..." : "Apply to Partner"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'leads'>('agents');
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const collectionName = activeTab === 'agents' ? "agentRegistrations" : "leads";
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError("You do not have permission to view this data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const updateStatus = async (id: string, status: string) => {
    const collectionName = activeTab === 'agents' ? "agentRegistrations" : "leads";
    try {
      await updateDoc(doc(db, collectionName, id), { status });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    const collectionName = activeTab === 'agents' ? "agentRegistrations" : "leads";
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry");
    }
  };

  const deleteAll = async () => {
    if (data.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ALL ${data.length} entries in this view? This cannot be undone.`)) return;
    
    const collectionName = activeTab === 'agents' ? "agentRegistrations" : "leads";
    setLoading(true);
    try {
      // Note: Firestore doesn't have a "delete collection" in client SDK, so we delete one by one
      // For a real app, this should be a cloud function
      const promises = data.map(item => deleteDoc(doc(db, collectionName, item.id)));
      await Promise.all(promises);
      alert("All entries deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete some entries.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.interest?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && data.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Management View</h1>
            <p className="text-muted-foreground">Manage your business growth and customer inquiries</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border">
            <div className="text-right hidden sm:block px-2">
              <p className="text-sm font-bold text-primary">{user.displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout} className="border-destructive/20 text-destructive hover:bg-destructive/5">
              Logout
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="p-12 text-center border-destructive/20 bg-destructive/5">
            <X className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={onLogout}>Try Different Account</Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border w-fit">
              <Button 
                variant={activeTab === 'agents' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('agents')}
                className="rounded-xl"
              >
                <Users className="mr-2 h-4 w-4" /> Agent Applications
              </Button>
              <Button 
                variant={activeTab === 'leads' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('leads')}
                className="rounded-xl"
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Customer Inquiries
              </Button>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-none shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    {activeTab === 'agents' ? <Users className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total {activeTab === 'agents' ? 'Applications' : 'Inquiries'}</p>
                    <p className="text-3xl font-bold">{data.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-none shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Pending Action</p>
                    <p className="text-3xl font-bold">
                      {data.filter(a => a.status === 'pending' || a.status === 'new').length}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 border-none shadow-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{activeTab === 'agents' ? 'Approved Partners' : 'Resolved'}</p>
                    <p className="text-3xl font-bold">
                      {data.filter(a => a.status === 'approved' || a.status === 'resolved').length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="p-6 border-b bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search entries..." 
                      className="pl-10 bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={deleteAll}
                    className="text-destructive hover:bg-destructive/5 border-destructive/20 w-full sm:w-auto"
                  >
                    Delete All Entries
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredData.length} of {data.length} {activeTab === 'agents' ? 'applications' : 'inquiries'}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Details</th>
                      <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">{activeTab === 'agents' ? 'Location' : 'Interest'}</th>
                      {activeTab === 'agents' && <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Experience</th>}
                      <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={activeTab === 'agents' ? 6 : 5} className="p-20 text-center">
                          <div className="max-w-xs mx-auto">
                            <Search className="h-12 w-12 text-muted/30 mx-auto mb-4" />
                            <p className="text-lg font-bold text-muted-foreground">No entries found</p>
                            <p className="text-sm text-muted-foreground/60">Try adjusting your search or check back later.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                          <td className="p-4 text-sm whitespace-nowrap align-top">
                            <div className="font-medium">{item.createdAt?.toDate().toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">{item.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </td>
                          <td className="p-4 align-top">
                            <p className="font-bold text-sm text-secondary">{item.name}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              {item.email && (
                                <a href={`mailto:${item.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {item.email}
                                </a>
                              )}
                              <a href={`tel:${item.phone}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {item.phone}
                              </a>
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="flex items-center gap-1 text-sm capitalize">
                              {activeTab === 'agents' ? (
                                <><MapPin className="h-3 w-3 text-muted-foreground" /> {item.location}</>
                              ) : (
                                <><Utensils className="h-3 w-3 text-muted-foreground" /> {item.interest}</>
                              )}
                            </div>
                          </td>
                          {activeTab === 'agents' && (
                            <td className="p-4 align-top max-w-xs">
                              <p className="text-xs text-muted-foreground line-clamp-3 italic">
                                {item.experience || "No experience notes provided."}
                              </p>
                            </td>
                          )}
                          <td className="p-4 align-top">
                            <Badge className={cn(
                              "capitalize px-3 py-1 text-[10px] font-bold",
                              (item.status === 'pending' || item.status === 'new') && "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
                              (item.status === 'approved' || item.status === 'resolved') && "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
                              item.status === 'rejected' && "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
                              item.status === 'reviewed' && "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                            )}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right align-top">
                            <div className="flex flex-col items-end gap-2">
                              <select 
                                className="text-xs border rounded-lg p-1.5 bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={item.status}
                                onChange={(e) => updateStatus(item.id, e.target.value)}
                              >
                                {activeTab === 'agents' ? (
                                  <>
                                    <option value="pending">Mark as Pending</option>
                                    <option value="reviewed">Mark as Reviewed</option>
                                    <option value="approved">Approve Partner</option>
                                    <option value="rejected">Reject Application</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="new">New Inquiry</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="resolved">Mark Resolved</option>
                                  </>
                                )}
                              </select>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon-xs" 
                                  className="text-primary hover:bg-primary/10"
                                  title="Contact via WhatsApp"
                                  onClick={() => window.open(`https://wa.me/${item.phone.replace(/\D/g, '')}`, '_blank')}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon-xs" 
                                  className="text-destructive hover:bg-destructive/10"
                                  title="Delete Entry"
                                  onClick={() => deleteEntry(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
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
                  <p className="text-muted-foreground">+265 885 627 133 / +265 991 890 948</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-muted-foreground">lcfarmsmw@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">Location</p>
                  <p className="text-muted-foreground">Salima, Malawi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Connect on WhatsApp</h3>
            <p className="text-muted-foreground mb-8">
              The fastest way to get a response and place your order is through WhatsApp. Our team is ready to assist you.
            </p>
            <Button nativeButton={false} size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-8 text-xl h-auto" render={<a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" />}>
              <MessageCircle className="mr-3 h-7 w-7" /> Chat on WhatsApp
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
  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "http://www.youtube.com/@LC_FARMS", icon: Youtube },
  ];

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
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-5 w-5" />
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
              <li><button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="hover:text-primary transition-colors cursor-pointer">Admin Portal</button></li>
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
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email?.toLowerCase() === "lenardkanjo2@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setShowDashboard(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((err) => {
      if (err.code === 'auth/popup-blocked') {
        alert("The login popup was blocked by your browser. Please allow popups for this site and try again.");
      } else {
        console.error(err);
        alert("Login failed: " + err.message);
      }
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDashboard(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (showDashboard && user && isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <AdminDashboard user={user} onLogout={handleLogout} />
        <Footer />
      </div>
    );
  }

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
        <AgentPortal />
        <LeadForm />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsApp />
      
      {/* Admin Toggle */}
      <div className="fixed bottom-6 left-6 z-50">
        {user ? (
          isAdmin ? (
            <Button 
              onClick={() => setShowDashboard(!showDashboard)}
              className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto"
            >
              <Users className="mr-2 h-5 w-5" /> {showDashboard ? "Back to Website" : "Open Admin Dashboard"}
            </Button>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-destructive border-destructive/20">
                Not an Admin: {user.email}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/80 backdrop-blur-sm shadow-md">
                Logout & Switch Account
              </Button>
            </div>
          )
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogin}
            className="bg-white/50 backdrop-blur-sm border-primary/20 text-primary/60 hover:text-primary hover:bg-white transition-all shadow-sm"
          >
            Admin Login
          </Button>
        )}
      </div>
    </div>
  );
}
