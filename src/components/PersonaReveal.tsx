import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';

export function PersonaReveal() {
  const { setPage } = useTripSyncStore();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-bold mb-2">Travel Persona</h2>
      <div className="bg-white p-8 rounded-3xl shadow-sm border mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">✈️</div>
        <h3 className="text-2xl font-bold mb-2">The Cafe Explorer</h3>
        <p className="text-gray-600">You travel for hidden cafés, memorable conversations and authentic local experiences.</p>
      </div>
      <button onClick={() => setPage('processing')} className="w-full py-4 bg-blue-600 text-white rounded-full font-medium">Start Roundtable</button>
    </motion.div>
  );
}
