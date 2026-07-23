import { useEffect, useState, useRef } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ProcessingScreen() {
  const { roomId, setGeneratedTrip, setPage } = useTripSyncStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasCalled = useRef(false);

  const generateTrip = async () => {
    if (!roomId) {
      setError("No Trip Room ID found. Please create or join a room first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API Error Response (raw text):", text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: `Failed to generate trip consensus (Status: ${res.status}): ${text}` };
        }
        
        throw new Error(data.error || "The AI Travel Council could not establish common ground. Please try again.");
      }

      const tripData = await res.json();
      setGeneratedTrip(tripData);
      setPage('roundtable');
    } catch (err: any) {
      console.error("Failed to generate trip consensus:", err);
      setError(err.message || "An unexpected error occurred while generating the plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasCalled.current) {
      hasCalled.current = true;
      generateTrip();
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-md mx-auto">
      {loading ? (
        <>
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Council Convening...</h3>
          <p className="text-slate-500">
            TripSync's AI Travel Council is negotiating preferences, resolving deal-breakers, and crafting your custom itinerary. This may take up to 20 seconds.
          </p>
        </>
      ) : error ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-50 p-8 rounded-3xl border border-red-100 shadow-sm">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-900 mb-3">Negotiation Stalled</h3>
          <p className="text-red-700 text-sm mb-6 leading-relaxed">
            {error}
          </p>
          <button 
            onClick={generateTrip} 
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-950 hover:bg-slate-850 text-white rounded-2xl font-semibold transition active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} />
            Consult the Council Again
          </button>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
