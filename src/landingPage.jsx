import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  CloudUpload, 
  Users, 
  Bot, 
  FileText, 
  CheckSquare, 
  Smartphone, 
  TrendingUp, 
  Menu, 
  X, 
  Play, 
  FileCheck,
  ChevronRight,
  Database,
  Lock,
  ArrowRight,
  Star
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { 
      title: "AI-Powered Assistant", 
      desc: "Get intelligent stock predictions, expiry alerts, and automated customer queries handled by our 24/7 AI bot.", 
      icon: <Bot className="w-10 h-10" />,
      color: "bg-teal-50" 
    },
    { 
      title: "Auto-Invoice Stocking", 
      desc: "Simply upload a photo or PDF of your invoice. Medicude's OCR technology automatically updates your inventory.", 
      icon: <FileCheck className="w-10 h-10" />,
      color: "bg-cyan-50" 
    },
    { 
      title: "FinTrack Analysis", 
      desc: "Monitor your pharmacy's financial health with real-time profit tracking, expense reports, and tax readiness.", 
      icon: <TrendingUp className="w-10 h-10" />,
      color: "bg-emerald-50" 
    },
    { 
      title: "Multi-Role Governance", 
      desc: "Granular control for Admins to manage everything, and a simplified interface for workers to handle sales.", 
      icon: <Users className="w-10 h-10" />,
      color: "bg-teal-50" 
    },
    { 
      title: "Iron-Clad Security", 
      desc: "End-to-end encryption for patient data and financial records. High-level protection against unauthorized access.", 
      icon: <Lock className="w-10 h-10" />,
      color: "bg-cyan-50" 
    },
    { 
      title: "Hybrid Cloud Backup", 
      desc: "Your data is always safe. Real-time cloud sync ensures you can restore everything instantly if hardware fails.", 
      icon: <Database className="w-10 h-10" />,
      color: "bg-emerald-50" 
    },
  ];

  const reviews = [
    { 
      name: "Dr. Elena Rodriguez", 
      role: "Pharmacy Owner", 
      text: "Medicude's AI stocking saved us 10 hours of manual data entry every week. The financial tracking is incredibly precise.",
      stars: 5
    },
    { 
      name: "James Wilson", 
      role: "Head Pharmacist", 
      text: "The worker interface is so simple that my staff required almost zero training. The mobile app makes inventory checks a breeze.",
      stars: 5
    },
    { 
      name: "Aisha Khan", 
      role: "Operations Manager", 
      text: "High-security standards were our priority. Medicude delivered that plus an amazing dashboard that runs smoothly on my tablet.",
      stars: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- Navigation --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg py-3 shadow-md' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-teal-200">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-teal-900' : 'text-white'}`}>
              MEDICUDE
            </span>
          </div>
          
          <div className="hidden md:flex space-x-10 font-medium items-center">
            {['Features', 'Dashboard', 'Security', 'Reviews'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className={`transition-colors hover:text-teal-500 ${scrolled ? 'text-slate-600' : 'text-white/90'}`}
              >
                {item}
              </a>
            ))}
            <button className="bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200 active:scale-95">
              Get Started
            </button>
          </div>

          <button className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-slate-800' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col space-y-4 shadow-xl">
            <a href="#features" className="text-lg font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#dashboard" className="text-lg font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Dashboard</a>
            <a href="#reviews" className="text-lg font-medium text-slate-700" onClick={() => setIsMenuOpen(false)}>Reviews</a>
            <button className="bg-teal-600 text-white w-full py-4 rounded-xl font-bold">Start Free Trial</button>
          </div>
        )}
      </nav>

      {/* --- Hero Section with Placeholder Background --- */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* VIDEO SLOT / BACKGROUND PLACEHOLDER */}
        {/* Instruction for User: 
          To add your video back, replace the 'bg-gradient-to-br' div below with:
          <video autoPlay loop muted playsInline className="absolute inset-0 z-10 w-full h-full object-cover">
            <source src="your-video-path.mp4" type="video/mp4" />
          </video>
        */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900">
           {/* Animated blobs for professional look without video */}
           <div className="absolute top-0 -left-20 w-96 h-96 bg-teal-400/20 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>

        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 z-20 bg-slate-900/40"></div>
        
        <div className="relative z-30 text-center px-6 max-w-5xl mt-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 text-white text-sm font-semibold shadow-xl">
            <Bot size={16} />
            <span>AI-Driven Pharmacy Management v4.0</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] drop-shadow-2xl">
            The Smartest Way To <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200">Manage Pharmacy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Revolutionize your operations with auto-invoice stocking, AI assistant, and real-time financial tracking. Designed for efficiency, built for security.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="group bg-teal-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-teal-400 shadow-2xl shadow-teal-500/30 transition-all hover:scale-105 flex items-center justify-center">
              Request Demo <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center">
              <Play className="mr-3 w-6 h-6 fill-white" /> Watch Overview
            </button>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-50 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Built for Modern Pharmacies</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Powerful tools under one roof to automate the mundane and focus on patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-teal-100 transition-all duration-500 hover:-translate-y-2 flex flex-col items-start">
                <div className={`${f.color} text-teal-600 p-5 rounded-2xl mb-8 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Dashboard Deep-Dive --- */}
      <section id="dashboard" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 my-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-10 bg-teal-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative bg-slate-800 p-2 rounded-3xl shadow-3xl border border-white/10">
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbb652167014?auto=format&fit=crop&w=1200&q=80" 
                  alt="Medicude Analytics Dashboard" 
                  className="w-full opacity-90 hover:opacity-100 transition-opacity"
                />
                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-slate-800/50 backdrop-blur-sm">
                   <div className="flex space-x-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">LIVE ANALYTICS ENGINE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-bold tracking-widest uppercase">
              Intuitive Interface
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">User-Friendly, Even <br/> for the Busiest Days</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Whether you're an Admin overseeing ten branches or a worker processing a single sale, Medicude's dashboard adapts to your role.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: <LayoutDashboard size={20}/>, text: "Automated Daily Profit Reports" },
                { icon: <CheckSquare size={20}/>, text: "Collaborative To-Do Lists for Staff" },
                { icon: <Smartphone size={20}/>, text: "Seamless Tablet & Mobile Experience" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition">
                  <div className="text-teal-400">{item.icon}</div>
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
               <div className="flex items-center space-x-4 mb-4 border-l-2 border-teal-500 pl-6">
                  <div>
                    <p className="font-bold text-xl text-white">Admin Privileges</p>
                    <p className="text-slate-400">Complete control over stocks, finance, and user roles.</p>
                  </div>
               </div>
               <div className="flex items-center space-x-4 border-l-2 border-cyan-500 pl-6">
                  <div>
                    <p className="font-bold text-xl text-white">Worker Access</p>
                    <p className="text-slate-400">Simplified UI for billing, searching items, and daily tasks.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Reviews Section --- */}
      <section id="reviews" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="mb-8 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Trusted by 2,000+ <br/> Pharmacists</h2>
              <p className="text-xl text-slate-500">Real stories from pharmacies growing with Medicude.</p>
            </div>
            <div className="flex items-center space-x-2 bg-teal-50 px-6 py-4 rounded-2xl">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <span className="text-xl font-bold text-teal-900">4.9/5 Rating</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[2rem] border border-slate-200/60 relative">
                <div className="flex text-amber-400 mb-6">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg text-slate-700 italic mb-8 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center space-x-4 border-t border-slate-200 pt-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full shadow-lg"></div>
                  <div>
                    <h4 className="font-bold text-slate-900">{r.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-teal-900 tracking-tight">MEDICUDE</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed text-lg mb-8">
                The world's most intuitive AI-powered pharmacy management system. Secure, efficient, and mobile-ready.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-teal-600 transition">FinTrack</a></li>
                <li><a href="#" className="hover:text-teal-600 transition">AI Assistant</a></li>
                <li><a href="#" className="hover:text-teal-600 transition">Inventory Management</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Legal</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-teal-600 transition">Security</a></li>
                <li><a href="#" className="hover:text-teal-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-teal-600 transition">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400">
            <p className="italic">Medicude © 2026. All rights reserved.</p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
               <Lock size={14} />
               <span className="text-sm font-medium uppercase tracking-tighter">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;