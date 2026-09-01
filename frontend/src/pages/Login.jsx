import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { login } = useRole();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setPin('');
    setError(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.length >= 4) { // Demo accepts any 4+ char PIN
      setIsSuccess(true);
      setTimeout(() => {
        login(selectedRole.id, pin);
        const slug = selectedRole.name.toLowerCase().replace(' ', '-');
        navigate(`/dashboard/${slug}`);
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  // True CSS Honeycomb Layout arrays
  const row1 = [ROLES[0], ROLES[5]]; // Beekeeper, Admin
  const row2 = [ROLES[1], ROLES[2], ROLES[3]]; // Lab, Processor, Packager
  const row3 = [ROLES[4]]; // Distributor

  const renderHex = (role) => (
    <motion.button
      key={role.id}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleRoleClick(role)}
      className={`clip-hex w-[140px] h-[160px] md:w-[170px] md:h-[196px] bg-cream-card flex flex-col items-center justify-center shadow-card hover:shadow-card-hover transition-all duration-300 relative group overflow-hidden ${selectedRole?.id === role.id ? 'bg-honey-gold shadow-glow' : 'hover:bg-honey-gold'}`}
    >
      <div className={`absolute inset-0 bg-honey-gold opacity-0 group-hover:opacity-10 transition-opacity ${selectedRole?.id === role.id ? 'opacity-100' : ''}`}></div>
      <div className={`mb-3 relative z-10 transition-colors ${selectedRole?.id === role.id ? 'text-white' : 'text-honey-deep group-hover:text-white'}`}>
        <i className={`fa-solid fa-${role.icon} text-3xl md:text-4xl drop-shadow-sm`}></i>
      </div>
      <span className={`font-display font-bold text-center px-4 leading-tight text-sm md:text-base relative z-10 transition-colors ${selectedRole?.id === role.id ? 'text-white' : 'text-comb-brown group-hover:text-white'}`}>
        {role.name}
      </span>
      {/* Decorative border matching honeycomb */}
      <div className={`absolute inset-1 clip-hex border-[3px] transition-colors ${selectedRole?.id === role.id ? 'border-white/30' : 'border-wax-beige/50 group-hover:border-white/20'}`}></div>
    </motion.button>
  );

  return (
    <div className="page bg-hex-pattern flex flex-col items-center justify-center p-4 relative min-h-screen">
      
      {/* Animated Bees */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-20">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`bee-${i}`}
            className="absolute text-2xl"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth], y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight] }}
            transition={{ duration: 15 + Math.random() * 15, repeat: Infinity, ease: "linear" }}
          >
            🐝
          </motion.div>
        ))}
      </div>

      <header className="absolute top-0 w-full bg-cream-bg/90 backdrop-blur-md border-b border-wax-beige z-20 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-comb-brown hover:text-honey-deep transition-colors font-bold text-sm">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Home</span>
          </Link>
          <div className="font-display font-bold text-xl tracking-tight text-comb-brown">
            <i className="fa-solid fa-hexagon-nodes text-honey-gold mr-2 opacity-80"></i>
            Bee Ledger
          </div>
        </div>
      </header>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 relative z-10 mt-20">
        <h1 className="font-display text-4xl md:text-5xl font-black text-comb-brown mb-3 drop-shadow-sm">Choose Your Role</h1>
        <p className="text-comb-brown-light font-medium text-lg bg-white/50 backdrop-blur inline-block px-4 py-1 rounded-full border border-wax-beige">Select your position in the supply chain</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        {/* True Honeycomb Interlocking Layout */}
        <div className="flex justify-center space-x-2 md:space-x-3">
          {row1.map(renderHex)}
        </div>
        <div className="flex justify-center space-x-2 md:space-x-3 -mt-6 md:-mt-10">
          {row2.map(renderHex)}
        </div>
        <div className="flex justify-center space-x-2 md:space-x-3 -mt-6 md:-mt-10">
          {row3.map(renderHex)}
        </div>
      </motion.div>

      {/* PIN Modal */}
      <AnimatePresence>
        {selectedRole && !isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-comb-brown/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`bg-cream-card p-8 rounded-3xl shadow-2xl max-w-md w-full relative ${error ? 'animate-shake border-2 border-status-alert' : 'border border-wax-beige'}`}
            >
              <button onClick={() => setSelectedRole(null)} className="absolute top-6 right-6 text-comb-light hover:text-comb-brown bg-wax-beige/50 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-honey-gold rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-glow">
                  <i className={`fa-solid fa-${selectedRole.icon} text-4xl text-white -rotate-12`}></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-comb-brown">Authenticate</h2>
                <p className="text-comb-brown-light mt-1 font-medium">Logging in as <strong className="text-honey-deep bg-honey-gold/10 px-2 py-0.5 rounded">{selectedRole.name}</strong></p>
              </div>

              <form onSubmit={handlePinSubmit}>
                <div className="mb-6">
                  <input 
                    type="password" 
                    autoFocus
                    placeholder="Demo PIN (any 4+ digits)" 
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className={`w-full text-center text-xl tracking-[0.5em] font-mono font-bold p-4 bg-cream-bg border-2 ${error ? 'border-status-alert' : 'border-wax-beige'} rounded-xl focus:border-honey-gold focus:ring-0 outline-none transition-colors text-comb-brown shadow-inner`}
                  />
                  {error && <p className="text-status-alert text-sm font-bold text-center mt-3"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Access Denied — Incorrect PIN</p>}
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-honey-gold to-honey-amber hover:from-honey-amber hover:to-honey-deep text-white font-bold text-lg py-4 rounded-xl shadow-glow transition-all active:scale-95 flex items-center justify-center">
                  Access Ledger <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-honey-gold z-50 flex items-center justify-center"
          >
            <motion.div animate={{ scale: [1, 1.2, 10], opacity: [1, 1, 0] }} transition={{ duration: 0.8 }} className="clip-hex w-32 h-32 bg-white flex items-center justify-center shadow-2xl">
              <i className="fa-solid fa-check text-6xl text-honey-gold drop-shadow-md"></i>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
