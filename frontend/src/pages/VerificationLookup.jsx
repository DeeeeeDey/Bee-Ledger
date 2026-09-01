import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';

const API_URL = 'http://localhost:3001/api';

export default function VerificationLookup() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${API_URL}/batches`);
        setBatches(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // Handle QR Scanner initialization and cleanup
  useEffect(() => {
    let scanner = null;
    
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        false // verbose
      );

      scanner.render(
        (decodedText) => {
          // On Success
          if (scanner) {
            scanner.clear();
          }
          setIsScanning(false);
          
          try {
            // If it's a full URL (like http://localhost:5173/verify/1)
            const url = new URL(decodedText);
            navigate(url.pathname);
          } catch (e) {
            // If it's just the batch ID text
            navigate(`/verify/${decodedText}`);
          }
        },
        (error) => {
          // Ignore frequent error callbacks when no QR is found yet in the frame
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [isScanning, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/verify/${searchTerm.trim()}`);
    }
  };

  const filteredBatches = batches.filter(b => 
    b.batchId.includes(searchTerm) || 
    b.beekeeperName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page bg-hex-pattern min-h-screen relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10 bg-cream-bg/90 backdrop-blur-md border-b border-wax-beige">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <i className="fa-solid fa-hexagon-nodes text-2xl text-honey-gold"></i>
          <span className="font-display font-bold text-xl text-comb-brown tracking-tight">Bee Ledger</span>
        </Link>
        <Link to="/" className="text-comb-brown font-bold hover:text-honey-deep transition-colors text-sm">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center pt-10 md:pt-16 px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 max-w-2xl">
          <i className="fa-solid fa-qrcode text-5xl md:text-6xl text-honey-gold mb-4 drop-shadow-md"></i>
          <h1 className="font-display text-4xl md:text-5xl font-black text-comb-brown mb-3">Verify a Product</h1>
          <p className="text-comb-brown-light font-medium text-lg px-4">
            Scan a QR code or enter a Batch ID to view its immutable cryptographic history.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="w-full max-w-2xl">
          
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input 
                type="text" 
                placeholder="Enter Batch ID (e.g. 1)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-14 bg-white border-2 border-wax-beige rounded-2xl font-bold text-comb-brown outline-none focus:border-honey-gold shadow-card text-lg transition-colors"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-comb-light text-xl"></i>
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-honey-gold hover:bg-honey-deep text-white px-5 py-2 rounded-xl font-bold transition-all shadow-glow flex items-center"
              >
                Verify
              </button>
            </form>

            <button 
              type="button"
              onClick={() => setIsScanning(true)}
              className="bg-comb-brown hover:bg-honey-deep text-white px-6 py-4 sm:py-0 rounded-2xl font-bold transition-all shadow-card flex items-center justify-center whitespace-nowrap"
            >
              <i className="fa-solid fa-camera mr-2 text-xl"></i>
              Scan QR
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-card border border-wax-beige mb-10">
            <h2 className="font-display font-bold text-xl text-comb-brown mb-4 flex items-center">
              <i className="fa-solid fa-list mr-3 text-honey-gold opacity-50"></i> Public Ledger Directory
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-honey-gold"></i>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {filteredBatches.map(b => (
                  <Link 
                    key={b.batchId} 
                    to={`/verify/${b.batchId}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-wax-beige hover:border-honey-gold hover:bg-honey-gold/5 transition-all group"
                  >
                    <div>
                      <div className="font-bold text-comb-brown group-hover:text-honey-deep transition-colors flex items-center">
                        <span className="font-mono text-xs bg-wax-beige px-2 py-0.5 rounded mr-3">#{b.batchId.padStart(4, '0')}</span>
                        {b.beekeeperName}
                      </div>
                      <div className="text-xs text-comb-light mt-1 font-medium">Hive: {b.hiveId} • {b.quantityKg}kg</div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-comb-light block mb-1">Current Stage</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                        b.currentStage.includes('Rejected') ? 'bg-status-alert/10 text-status-alert' : 
                        b.isFinalized ? 'bg-status-success/10 text-status-success' : 'bg-honey-gold/10 text-honey-deep'
                      }`}>
                        {b.currentStage}
                      </span>
                    </div>
                  </Link>
                ))}
                {filteredBatches.length === 0 && (
                  <div className="text-center p-8 text-comb-light font-medium">
                    No batches found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-comb-brown/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-3xl shadow-2xl max-w-lg w-full relative border-2 border-honey-gold/30"
            >
              <button 
                onClick={() => setIsScanning(false)} 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-wax-beige text-comb-brown hover:bg-honey-gold hover:text-white flex items-center justify-center transition-colors z-10"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>

              <div className="text-center mb-6 pt-2">
                <h2 className="font-display font-bold text-2xl text-comb-brown">Scan QR Code</h2>
                <p className="text-comb-brown-light text-sm font-medium mt-1">Point your camera at a Honey Chain QR code.</p>
              </div>

              {/* Container for html5-qrcode */}
              <div className="rounded-2xl overflow-hidden border border-wax-beige bg-cream-bg">
                <div id="qr-reader" className="w-full"></div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Global override for html5-qrcode styles to make it look nicer */}
      <style dangerouslySetInnerHTML={{__html: `
        #qr-reader { border: none !important; }
        #qr-reader__scan_region { background: #000; }
        #qr-reader__dashboard_section_csr button { 
          background-color: var(--honey-gold) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          cursor: pointer !important;
          margin: 10px 5px !important;
        }
        #qr-reader__dashboard_section_swaplink { display: none !important; }
        #qr-reader__camera_selection { padding: 8px; border-radius: 8px; margin-bottom: 10px; border: 1px solid var(--wax-beige); outline: none; }
      `}} />
    </div>
  );
}
