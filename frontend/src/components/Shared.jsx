import React from 'react';
import { motion } from 'framer-motion';

// Status Pill
export const StatusPill = ({ stage }) => {
  const isRejected = stage.includes('Rejected');
  const isPassed = stage.includes('Passed') || stage === 'Shipped to Retailer' || stage === 'Packaged' || stage === 'Processed' || stage === 'Lab Tested';
  
  let colorClass = 'bg-status-pending text-white'; // Default pending
  if (isRejected) colorClass = 'bg-status-alert text-white';
  else if (isPassed) colorClass = 'bg-status-success text-white';
  if (stage === 'Harvested') colorClass = 'bg-honey-gold text-comb-brown';

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors duration-300 ${colorClass}`}>
      <i className="fa-solid fa-hexagon w-3 h-3 mr-1.5 opacity-80 text-[10px] flex items-center justify-center"></i>
      {stage}
    </span>
  );
};

// Blockchain Loading State
export const BlockchainLoadingState = ({ message = "Confirming transaction on blockchain..." }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-cream-bg/85 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl"
  >
    <div className="relative mb-6 flex items-center justify-center w-24 h-24">
      <i className="fa-solid fa-hexagon text-[80px] text-honey-gold animate-spin-slow opacity-20 absolute"></i>
      <i className="fa-solid fa-hexagon text-[80px] text-honey-gold animate-pulse absolute"></i>
      <i className="fa-solid fa-link text-3xl text-comb-brown absolute z-10 animate-bounce"></i>
    </div>
    <p className="text-comb-brown font-display font-bold text-xl">{message}</p>
  </motion.div>
);

// Verification Timeline (Shared)
export const VerificationTimeline = ({ history }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative border-l-2 border-honey-amber/30 ml-4 space-y-8 py-4">
      {history.map((stage, index) => {
        const date = new Date(Number(stage.timestamp) * 1000);
        const isLast = index === history.length - 1;
        const isError = stage.stageName.includes("Rejected");
        
        return (
          <motion.div variants={itemVariants} key={index} className="relative pl-8">
            <div className={`absolute -left-[18px] top-1 h-8 w-8 rounded-full flex items-center justify-center bg-cream-bg border-4 ${
              isError ? 'border-status-alert' : isLast ? 'border-honey-gold' : 'border-wax-beige'
            }`}>
              {isError ? (
                <i className="fa-solid fa-triangle-exclamation text-status-alert text-[10px]"></i>
              ) : isLast ? (
                <i className="fa-solid fa-check text-honey-gold text-[10px]"></i>
              ) : (
                <div className="w-2 h-2 rounded-full bg-wax-beige" />
              )}
            </div>
            
            <div className={`bg-cream-card p-5 rounded-2xl border-2 ${isError ? 'border-status-alert/30 shadow-status-alert/10' : 'border-wax-beige hover:border-honey-gold/50'} shadow-sm transition-all`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <h3 className={`font-display font-bold text-lg ${isError ? 'text-status-alert' : 'text-comb-brown'}`}>
                  {stage.stageName}
                </h3>
                <div className="text-xs font-mono text-comb-light bg-wax-beige/50 px-2.5 py-1 rounded-md mt-1 sm:mt-0">
                  {date.toLocaleString()}
                </div>
              </div>
              <div className="text-sm font-sans text-comb-light font-medium mb-3 flex items-center">
                <span className="text-xs uppercase tracking-wider opacity-70 mr-2">Logged By</span> 
                <span className="bg-honey-gold/10 text-honey-deep px-2 py-0.5 rounded-md font-bold">{stage.actorName}</span>
              </div>
              {stage.notes && (
                <div className="text-sm font-sans text-comb-brown bg-wax-beige/30 p-4 rounded-xl border border-wax-beige/60 italic leading-relaxed">
                  "{stage.notes}"
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
