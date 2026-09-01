import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusPill, BlockchainLoadingState } from '../components/Shared';

const API_URL = 'http://localhost:3001/api';

export default function Dashboard() {
  const { activeRole } = useRole();
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [txPending, setTxPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ beekeeperName: '', hiveId: '', harvestDate: '', quantityKg: '', qualityTestResult: 'Pending Testing', notes: '' });

  // QR Modal State
  const [qrModalBatch, setQrModalBatch] = useState(null);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/batches`);
      setBatches(res.data.reverse());
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    const interval = setInterval(fetchBatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setTxPending(true);
    setErrorMsg('');
    try {
      await axios.post(`${API_URL}/batches`, { ...formData, roleId: activeRole.id });
      setIsCreating(false);
      setFormData({ beekeeperName: '', hiveId: '', harvestDate: '', quantityKg: '', qualityTestResult: 'Pending Testing', notes: '' });
      await fetchBatches();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Error creating batch");
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setTxPending(false);
    }
  };

  const getActionableStages = (roleName) => {
    switch (roleName) {
      case 'Beekeeper': return [];
      case 'Quality Lab': return ['Harvested'];
      case 'Processing Unit': return ['Lab Tested'];
      case 'Packaging Unit': return ['Processed'];
      case 'Distributor': return ['Packaged'];
      case 'Admin': return ['Harvested', 'Lab Tested', 'Processed', 'Packaged', 'Shipped to Retailer'];
      default: return [];
    }
  };
  const actionableStages = getActionableStages(activeRole.name);
  const slug = activeRole.name.toLowerCase().replace(' ', '-');

  const filteredBatches = batches.filter(batch => 
    batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.beekeeperName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-comb-brown mb-1">{activeRole.name} Dashboard</h1>
          <p className="text-comb-brown-light font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-status-success mr-2 shadow-glow"></span>
            Connected to Honey Chain Ledger
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search by Batch ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-wax-beige rounded-xl focus:ring-2 focus:ring-honey-gold outline-none transition-all shadow-sm font-medium text-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-comb-light"></i>
          </div>

          {activeRole.name === 'Beekeeper' && (
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-honey-gold to-honey-amber hover:from-honey-amber hover:to-honey-deep text-white px-6 py-3 rounded-xl font-bold transition-all shadow-card whitespace-nowrap"
            >
              <i className="fa-solid fa-circle-plus"></i>
              <span>New Harvest</span>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-status-alert/10 border-l-4 border-status-alert p-4 rounded-r-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <i className="fa-solid fa-triangle-exclamation text-status-alert text-2xl mr-3"></i>
              <div>
                <h3 className="text-status-alert font-bold">Access Denied</h3>
                <p className="text-status-alert/80 text-sm font-medium">{errorMsg}</p>
              </div>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-status-alert hover:opacity-70 font-bold px-2"><i className="fa-solid fa-xmark"></i></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreating && activeRole.name === 'Beekeeper' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-cream-card p-6 rounded-3xl shadow-card border border-wax-beige mb-6 relative overflow-hidden">
              {txPending && <BlockchainLoadingState message="Minting Batch to Blockchain..." />}
              <h2 className="font-display text-2xl font-bold text-comb-brown mb-6 flex items-center">
                <i className="fa-solid fa-hexagon-plus mr-3 text-honey-gold opacity-80 text-3xl"></i> Register New Honey Batch
              </h2>
              <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Beekeeper Name</label>
                  <input required type="text" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl focus:ring-2 focus:ring-honey-gold outline-none font-medium" value={formData.beekeeperName} onChange={e => setFormData({...formData, beekeeperName: e.target.value})} placeholder="e.g. Ramesh Kumar" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Hive ID</label>
                  <input required type="text" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl focus:ring-2 focus:ring-honey-gold outline-none font-medium" value={formData.hiveId} onChange={e => setFormData({...formData, hiveId: e.target.value})} placeholder="e.g. HV-014" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Harvest Date</label>
                  <input required type="date" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl focus:ring-2 focus:ring-honey-gold outline-none font-medium text-comb-brown" value={formData.harvestDate} onChange={e => setFormData({...formData, harvestDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Quantity (Kg)</label>
                  <input required type="number" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl focus:ring-2 focus:ring-honey-gold outline-none font-medium" value={formData.quantityKg} onChange={e => setFormData({...formData, quantityKg: e.target.value})} placeholder="e.g. 45" />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 text-comb-light font-bold hover:bg-wax-beige rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-comb-brown hover:bg-honey-deep text-white font-bold rounded-xl transition-colors shadow-card flex items-center">
                    <i className="fa-solid fa-link mr-2"></i> Write to Ledger
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-cream-card rounded-3xl shadow-card border border-wax-beige overflow-hidden">
        <div className="p-6 border-b border-wax-beige bg-cream-bg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-display font-bold text-xl text-comb-brown flex items-center">
            <i className="fa-solid fa-list mr-2 text-honey-gold opacity-50"></i> Ledger Records
          </h3>
          {activeRole.name !== 'Beekeeper' && (
            <span className="text-xs bg-honey-gold/10 border border-honey-gold/30 px-3 py-1.5 rounded-full text-honey-deep font-bold">
              Actionable for you: {actionableStages.length > 0 ? actionableStages.join(', ') : 'None'}
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse flex space-x-4 items-center">
                <div className="h-12 w-12 bg-wax-beige rounded-xl"></div>
                <div className="h-4 bg-wax-beige rounded w-2/6"></div>
                <div className="h-8 bg-wax-beige rounded-full w-1/6 ml-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="p-12 text-center text-comb-light font-medium">
            <i className="fa-solid fa-magnifying-glass mb-3 text-2xl opacity-30"></i>
            <p>No batches found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-wax-beige text-comb-light text-xs uppercase tracking-wider bg-cream-bg/50">
                  <th className="p-5 font-bold">Batch ID</th>
                  <th className="p-5 font-bold">Origin</th>
                  <th className="p-5 font-bold">Current Stage</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map(batch => {
                  const isActionable = actionableStages.includes(batch.currentStage) && !batch.isFinalized;
                  
                  return (
                    <tr key={batch.batchId} className={`border-b border-wax-beige/50 transition-colors group hover:bg-cream-bg ${isActionable ? 'bg-honey-gold/5' : ''}`}>
                      <td className="p-5 font-mono font-bold text-honey-deep">
                        <span className="bg-honey-gold/10 px-2 py-1 rounded">#{batch.batchId.padStart(4, '0')}</span>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-comb-brown">{batch.beekeeperName}</div>
                        <div className="text-xs font-medium text-comb-light mt-1 flex items-center">
                          <i className="fa-solid fa-box-open mr-1.5 opacity-50"></i> {batch.quantityKg}kg 
                          <span className="mx-2 opacity-30">|</span> 
                          <i className="fa-brands fa-hive mr-1.5 opacity-50"></i> {batch.hiveId}
                        </div>
                      </td>
                      <td className="p-5">
                        <StatusPill stage={batch.currentStage} />
                      </td>
                      <td className="p-5 text-right space-x-2 flex justify-end items-center">
                        {/* Quick QR Button */}
                        <button 
                          onClick={() => setQrModalBatch(batch)}
                          className="w-10 h-10 rounded-xl border border-wax-beige text-comb-light hover:text-honey-gold hover:border-honey-gold hover:bg-honey-gold/10 transition-colors flex items-center justify-center"
                          title="Show QR Code"
                        >
                          <i className="fa-solid fa-qrcode text-lg"></i>
                        </button>
                        
                        <Link 
                          to={`/dashboard/${slug}/batch/${batch.batchId}`}
                          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center ${isActionable ? 'bg-gradient-to-r from-honey-gold to-honey-amber text-white shadow-glow' : 'border border-wax-beige text-comb-brown hover:bg-wax-beige/50'}`}
                        >
                          {isActionable ? (
                            <><i className="fa-solid fa-pen-to-square mr-2"></i> Log Action</>
                          ) : (
                            <><i className="fa-solid fa-eye mr-2"></i> Details</>
                          )}
                        </Link>
                      </td>
                    </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      <AnimatePresence>
        {qrModalBatch && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-comb-brown/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-cream-bg p-8 rounded-3xl shadow-2xl max-w-sm w-full relative border-2 border-honey-gold/30 text-center"
            >
              <button 
                onClick={() => setQrModalBatch(null)} 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-wax-beige text-comb-brown hover:bg-honey-gold hover:text-white flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <h2 className="font-display font-bold text-2xl text-comb-brown mb-2">Scan Batch</h2>
              <p className="text-comb-brown-light text-sm font-medium mb-6">
                Scan to instantly view the public traceability record for this batch.
              </p>

              <div className="bg-white p-4 rounded-2xl shadow-inner border border-wax-beige inline-block mb-6 relative">
                {/* Simulated frame corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-honey-gold rounded-tl-xl -translate-x-2 -translate-y-2"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-honey-gold rounded-tr-xl translate-x-2 -translate-y-2"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-honey-gold rounded-bl-xl -translate-x-2 translate-y-2"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-honey-gold rounded-br-xl translate-x-2 translate-y-2"></div>
                
                <QRCodeSVG 
                  value={`${window.location.origin}/verify/${qrModalBatch.batchId}`} 
                  size={180} 
                  fgColor="var(--comb-brown)" 
                  bgColor="transparent" 
                />
              </div>

              <div className="bg-cream-card rounded-xl p-4 border border-wax-beige text-left shadow-sm">
                <div className="flex justify-between items-center border-b border-wax-beige/50 pb-2 mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-comb-light">Batch ID</span>
                  <span className="font-mono font-bold text-honey-deep bg-honey-gold/10 px-2 py-0.5 rounded">#{qrModalBatch.batchId.padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-comb-light">Status</span>
                  <StatusPill stage={qrModalBatch.currentStage} />
                </div>
              </div>

              <Link 
                to={`/verify/${qrModalBatch.batchId}`}
                className="block w-full mt-6 py-3 bg-comb-brown hover:bg-honey-deep text-white font-bold rounded-xl transition-colors shadow-card"
              >
                Go to Verification Page
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
