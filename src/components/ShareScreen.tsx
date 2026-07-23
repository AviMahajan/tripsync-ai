import { motion } from 'motion/react';

export function ShareScreen() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-bold mb-8">Trip Sync Complete!</h2>
      <div className="space-y-4">
        <button className="w-full py-4 border rounded-full font-medium">Download PDF</button>
        <button className="w-full py-4 bg-blue-600 text-white rounded-full font-medium">Copy Share Link</button>
      </div>
    </motion.div>
  );
}
