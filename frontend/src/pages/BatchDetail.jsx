import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useRole } from '../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusPill, BlockchainLoadingState, VerificationTimeline } from '../components/Shared';

const API_URL = 'http://localhost:3001/api';

export default function BatchDetail() {
  const { id } = useParams();
  const { activeRole } = useRole();
  const slug = activeRole.name.toLowerCase().replace(' ', '-');
  
  const [batch, setBatch] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [txPending, setTxPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [updateData, setUpdateData] = useState({ stageName: 'Lab Tested', actorName: '', notes: '', isFinalized: false, qualityTestResultUpdate: '' });

  useEffect(() => {
    if (activeRole.name === 'Quality Lab') setUpdateData(prev => ({ ...prev, stageName: 'Lab Tested' }));
    else if (activeRole.name === 'Processing Unit') setUpdateData(prev => ({ ...prev, stageName: 'Processed' }));
    else if (activeRole.name === 'Packaging Unit') setUpdateData(prev => ({ ...prev, stageName: 'Packaged' }));
    else if (activeRole.name === 'Distributor') setUpdateData(prev => ({ ...prev, stageName: 'Shipped to Retailer' }));
  }, [activeRole]);

  const fetchData = async () => {
    try {
      const [bRes, hRes] = await Promise.all([
        axios.get(`${API_URL}/batches/${id}`),
        axios.get(`${API_URL}/batches/${id}/history`)
      ]);
      setBatch(bRes.data);
      setHistory(hRes.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setTxPending(true);
    setErrorMsg('');
    try {
      await axios.post(`${API_URL}/batches/${id}/stage`, { ...updateData, roleId: activeRole.id });
      await fetchData(); // Refresh data from backend
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Access Denied — Incorrect Role");
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setTxPending(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-comb-brown font-display font-bold text-xl"><i className="fa-solid fa-circle-notch fa-spin text-honey-gold mr-3"></i> Loading Ledger Record...</div>;
  }

  if (!batch || batch.batchId === '0') {
    return <div className="p-12 text-center text-status-alert font-display font-bold text-xl">Batch not found on ledger.</div>;
  }

  const getActionableStages = (roleName) => {
    switch (roleName) {
      case 'Quality Lab': return ['Harvested'];
      case 'Processing Unit': return ['Lab Tested'];
      case 'Packaging Unit': return ['Processed'];
      case 'Distributor': return ['Packaged'];
      case 'Admin': return ['Harvested', 'Lab Tested', 'Processed', 'Packaged', 'Shipped to Retailer'];
      default: return [];
    }
  };
  const isActionable = getActionableStages(activeRole.name).includes(batch.currentStage) && !batch.isFinalized;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to={`/dashboard/${slug}`} className="inline-flex items-center text-comb-brown hover:text-honey-deep font-bold transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Dashboard
      </Link>

      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-comb-brown mb-2">Batch #{batch.batchId.padStart(4, '0')}</h1>
          <StatusPill stage={batch.currentStage} />
        </div>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-status-alert/10 border-l-4 border-status-alert p-4 rounded-xl shadow-sm flex items-center justify-between mb-6">
            <div className="flex items-center">
              <i className="fa-solid fa-shield-halved text-status-alert text-2xl mr-3"></i>
              <div>
                <h3 className="text-status-alert font-bold">Smart Contract Reverted</h3>
                <p className="text-status-alert/80 text-sm font-medium">{errorMsg}</p>
              </div>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-status-alert hover:opacity-70 font-bold px-2"><i className="fa-solid fa-xmark"></i></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Form */}
      {isActionable && (
        <div className="bg-cream-card p-6 md:p-8 rounded-3xl shadow-card border-2 border-honey-gold/30 mb-8 relative overflow-hidden">
          {txPending && <BlockchainLoadingState message={`Writing ${activeRole.name} stage to ledger...`} />}
          
          <h2 className="font-display text-2xl font-bold text-comb-brown mb-6 flex items-center">
            <i className="fa-solid fa-pen-to-square mr-3 text-honey-gold opacity-80"></i>
            Log {activeRole.name} Action
          </h2>
          
          <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Stage Conclusion</label>
              <select className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl font-medium outline-none focus:border-honey-gold text-comb-brown" value={updateData.stageName} onChange={e => setUpdateData({...updateData, stageName: e.target.value})}>
                {activeRole.name === 'Quality Lab' && (<><option>Lab Tested</option><option>Rejected - Failed Quality Test</option></>)}
                {activeRole.name === 'Processing Unit' && <option>Processed</option>}
                {activeRole.name === 'Packaging Unit' && <option>Packaged</option>}
                {activeRole.name === 'Distributor' && <option>Shipped to Retailer</option>}
                {activeRole.name === 'Admin' && (<><option>Lab Tested</option><option>Processed</option><option>Packaged</option><option>Shipped to Retailer</option></>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Facility Name</label>
              <input required type="text" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl font-medium outline-none focus:border-honey-gold text-comb-brown" value={updateData.actorName} onChange={e => setUpdateData({...updateData, actorName: e.target.value})} placeholder="e.g. Punjab Agri Labs" />
            </div>

            {(activeRole.name === 'Quality Lab' || activeRole.name === 'Admin') && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Lab Test Summary</label>
                <input type="text" className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl font-medium outline-none focus:border-honey-gold text-comb-brown" value={updateData.qualityTestResultUpdate} onChange={e => setUpdateData({...updateData, qualityTestResultUpdate: e.target.value})} placeholder="e.g. Passed - Sucrose 3.2%, Moisture 17%" />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-comb-brown-light mb-1 uppercase tracking-wider">Process Notes</label>
              <textarea className="w-full p-3 bg-wax-beige/30 border border-wax-beige rounded-xl font-medium outline-none focus:border-honey-gold text-comb-brown" value={updateData.notes} onChange={e => setUpdateData({...updateData, notes: e.target.value})} rows={2} placeholder="Any relevant details..."></textarea>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between mt-2 pt-4 border-t border-wax-beige gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-wax-beige text-honey-gold focus:ring-honey-gold transition-all" 
                  checked={updateData.isFinalized || (updateData.stageName === 'Shipped to Retailer') || (updateData.stageName === 'Rejected - Failed Quality Test')} 
                  onChange={e => setUpdateData({...updateData, isFinalized: e.target.checked})} 
                  disabled={updateData.stageName === 'Shipped to Retailer' || updateData.stageName === 'Rejected - Failed Quality Test'}
                />
                <span className="text-sm font-bold text-comb-brown">Mark as Final Stage in Blockchain</span>
              </label>
              
              <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-comb-brown hover:bg-honey-deep text-white font-bold rounded-xl transition-colors shadow-glow flex items-center justify-center">
                Sign & Commit
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History View */}
      <div className="bg-cream-card p-6 md:p-8 rounded-3xl shadow-card border border-wax-beige">
        <h2 className="font-display font-bold text-2xl text-comb-brown mb-8 border-b border-wax-beige pb-4">Chain of Custody History</h2>
        <VerificationTimeline history={history} />
      </div>

    </div>
  );
}
