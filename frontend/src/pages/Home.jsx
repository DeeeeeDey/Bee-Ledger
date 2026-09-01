import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-cream-bg min-h-screen text-comb-brown overflow-hidden bg-hex-pattern relative">
      {/* Floating Bees Animation */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`bee-${i}`}
            className="absolute text-3xl"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{ 
              duration: 20 + Math.random() * 20, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🐝
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-cream-bg/90 backdrop-blur-md border-b border-wax-beige z-50 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-hexagon-nodes text-3xl text-honey-gold"></i>
            <span className="font-display font-bold text-2xl tracking-tight text-comb-brown">Bee Ledger</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="font-semibold text-comb-brown-light hover:text-honey-deep transition-colors">How It Works</a>
            <Link to="/lookup" className="font-semibold text-comb-brown-light hover:text-honey-deep transition-colors">Verify a Product</Link>
            <Link to="/login" className="bg-honey-gold hover:bg-honey-amber text-white px-6 py-2.5 rounded-full font-bold shadow-card transition-all hover:-translate-y-0.5">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Animated Background Fallback */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0 bg-cream-bg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wax-beige/50 z-10"></div>
          <div className="w-full h-full relative opacity-60">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-honey-gold/40 hex-drift"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${20 + Math.random() * 20}s`,
                  animationDelay: `-${Math.random() * 10}s`,
                  transform: `scale(${0.5 + Math.random()})`,
                }}
              >
                <svg width="120" height="138" viewBox="0 0 100 115" fill="currentColor">
                  <path d="M50 0 L100 28.8 L100 86.6 L50 115.4 L0 86.6 L0 28.8 Z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto text-center relative z-20 max-w-4xl">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, type: "spring" }}>
            <i className="fa-solid fa-hexagon text-honey-gold text-5xl mb-6 opacity-80 drop-shadow-md"></i>
          </motion.div>

          <motion.h1 
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-comb-brown"
          >
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }} className="block">
              Verified
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="block text-transparent bg-clip-text bg-gradient-to-r from-honey-gold via-honey-amber to-honey-deep">
              From Hive to Home
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-comb-brown-light mb-10 max-w-2xl mx-auto opacity-85 font-medium"
          >
            Immutable blockchain traceability ensuring every drop of honey is pure, authentic, and ethically sourced.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/login" className="w-full sm:w-auto bg-gradient-to-r from-honey-gold to-honey-amber text-white px-8 py-4 rounded-full font-bold text-lg shadow-glow transition-all hover:scale-105 text-center flex items-center justify-center">
              Login to Dashboard
            </Link>
            <Link to="/lookup" className="w-full sm:w-auto border-2 border-honey-gold bg-white hover:bg-honey-gold hover:text-white text-comb-brown px-8 py-4 rounded-full font-bold text-lg transition-all text-center shadow-card hover:shadow-glow flex items-center justify-center">
              Verify a Product <i className="fa-solid fa-qrcode ml-2"></i>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white relative z-20 border-y border-wax-beige">
        <div className="container mx-auto px-6">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="bg-cream-bg p-8 rounded-3xl shadow-sm border border-wax-beige text-center hover:shadow-card transition-shadow">
              <div className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-honey-gold to-honey-deep mb-2">14%</div>
              <p className="text-comb-brown-light font-medium">of global honey is adulterated or mislabeled.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-cream-bg p-8 rounded-3xl shadow-sm border border-wax-beige text-center hover:shadow-card transition-shadow">
              <div className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-honey-gold to-honey-deep mb-2">2nd</div>
              <p className="text-comb-brown-light font-medium">India's rank in global honey exports.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-cream-bg p-8 rounded-3xl shadow-sm border border-wax-beige text-center hover:shadow-card transition-shadow">
              <div className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-honey-gold to-honey-deep mb-2">13,388</div>
              <p className="text-comb-brown-light font-medium">beekeepers organized under SFURTI clusters.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced visuals */}
      <section id="how-it-works" className="py-24 px-6 relative z-20 bg-cream-bg overflow-hidden">
        <i className="fa-solid fa-hexagon absolute top-0 left-0 text-[300px] text-honey-gold opacity-5 -translate-x-1/2 -translate-y-1/4"></i>
        <i className="fa-solid fa-hexagon absolute bottom-0 right-0 text-[300px] text-honey-gold opacity-5 translate-x-1/4 translate-y-1/4"></i>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-4xl font-bold mb-16 text-comb-brown">
            The Supply Chain Journey
          </motion.h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative px-4">
            <motion.div 
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} viewport={{ once: true }}
              className="hidden md:block absolute top-1/2 left-10 right-10 h-1.5 bg-gradient-to-r from-wax-beige via-honey-gold to-wax-beige -z-10 -translate-y-1/2 origin-left rounded-full"
            ></motion.div>
            
            {[
              { label: 'Harvest', icon: 'warehouse', color: 'text-honey-deep' }, 
              { label: 'Lab Test', icon: 'flask-conical', color: 'text-status-success' }, 
              { label: 'Process', icon: 'gears', color: 'text-honey-amber' }, 
              { label: 'Package', icon: 'box-open', color: 'text-comb-brown-light' }, 
              { label: 'Verify', icon: 'qrcode', color: 'text-comb-brown' }
            ].map((step, i) => (
              <motion.div 
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center mb-10 md:mb-0 group"
              >
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-white clip-hex shadow-card"></div>
                  <div className="absolute inset-1 bg-wax-beige/30 clip-hex"></div>
                  <i className={`fa-solid fa-${step.icon} text-3xl ${step.color} relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-110`}></i>
                </div>
                <span className="font-bold text-comb-brown text-lg">{step.label}</span>
                <span className="text-xs text-comb-light mt-1 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">Step {i+1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-comb-brown text-wax-beige py-12 text-center relative z-20">
        <i className="fa-solid fa-hexagon-nodes text-4xl text-honey-gold mb-6 opacity-50 drop-shadow-glow"></i>
        <p className="font-display font-bold text-2xl mb-2 text-white">Bee Ledger</p>
        <p className="text-sm opacity-60">Verified From Hive to Home • Built for SIH 2026</p>
      </footer>
    </div>
  );
}
