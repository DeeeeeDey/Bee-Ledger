import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = 'http://localhost:3001';

export function Sidebar() {
  const { activeRole, logout } = useRole();
  const location = useLocation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('blockchain_event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 15));
    });
    return () => socket.disconnect();
  }, []);

  if (!activeRole) return null;
  const slug = activeRole.name.toLowerCase().replace(' ', '-');
  const basePath = `/dashboard/${slug}`;

  return (
    <div className="w-64 bg-comb-brown text-cream-bg flex flex-col h-screen sticky top-0 shadow-2xl z-40 hidden md:flex">
      {/* Brand */}
      <div className="p-6 flex items-center space-x-3 border-b border-comb-light/30">
        <i className="fa-solid fa-hexagon-nodes text-3xl text-honey-gold"></i>
        <span className="font-display font-bold text-xl tracking-tight text-white">Bee Ledger</span>
      </div>

      {/* Role Profile */}
      <div className="p-6 bg-comb-light/20 border-b border-comb-light/30">
        <div className="text-xs uppercase tracking-widest text-honey-gold/80 mb-2 font-bold">Active Role</div>
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-honey-gold/20 text-honey-gold shadow-glow">
            <i className={`fa-solid fa-${activeRole.icon}`}></i>
          </div>
          <span className="font-sans font-semibold text-white">{activeRole.name}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <Link to={basePath} className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.pathname === basePath && !location.search ? 'bg-honey-gold text-comb-brown font-bold' : 'hover:bg-comb-light/30 text-cream-bg/80 hover:text-white'}`}>
          <i className="fa-solid fa-chart-line w-5 text-center mr-2"></i>
          {activeRole.name === 'Beekeeper' ? 'My Batches' : 'Pending Actions'}
        </Link>
        {activeRole.name === 'Beekeeper' && (
          <Link to={`${basePath}?new=true`} className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.search.includes('new=true') ? 'bg-honey-gold text-comb-brown font-bold' : 'hover:bg-comb-light/30 text-cream-bg/80 hover:text-white'}`}>
            <i className="fa-solid fa-circle-plus w-5 text-center mr-2"></i>
            New Batch
          </Link>
        )}
        <Link to={`${basePath}?history=true`} className={`flex items-center px-4 py-3 rounded-xl transition-all ${location.search.includes('history=true') ? 'bg-honey-gold text-comb-brown font-bold' : 'hover:bg-comb-light/30 text-cream-bg/80 hover:text-white'}`}>
          <i className="fa-solid fa-clock-rotate-left w-5 text-center mr-2"></i>
          My History
        </Link>
      </div>

      {/* Live Event Feed (Pinned at bottom) */}
      <div className="h-64 border-t border-comb-light/30 bg-comb-brown-light/10 flex flex-col">
        <div className="p-3 border-b border-comb-light/20 flex items-center justify-between bg-comb-brown-light/20">
          <h2 className="font-bold text-xs uppercase tracking-wider text-honey-gold flex items-center">
            <i className="fa-solid fa-bolt w-3 h-3 mr-1.5"></i>
            Live Ledger
          </h2>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-honey-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-honey-gold"></span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          <AnimatePresence>
            {events.length === 0 ? (
              <div className="text-center text-cream-bg/40 text-xs mt-6 italic">Awaiting blocks...</div>
            ) : (
              events.map((ev, i) => (
                <motion.div 
                  key={`${ev.txHash}-${i}`} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  layout
                  className="bg-comb-brown-light/30 rounded-lg p-2.5 border border-comb-light/20"
                >
                  <div className="text-[10px] text-honey-gold/80 mb-0.5">{formatDistanceToNow(new Date(ev.timestamp))} ago</div>
                  <div className="text-xs text-white font-medium mb-1 leading-tight">{ev.title}</div>
                  <div className="flex items-center text-[9px] text-cream-bg/60 truncate font-mono">
                    <span className="mr-1">Tx:</span>
                    <a href="#" className="hover:text-honey-gold truncate">{ev.txHash}</a>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout} className="p-4 border-t border-comb-light/30 flex items-center justify-center text-sm font-bold text-cream-bg/70 hover:text-white hover:bg-comb-light/20 transition-all">
        <i className="fa-solid fa-right-from-bracket mr-2"></i>
        Switch Role
      </button>
    </div>
  );
}
