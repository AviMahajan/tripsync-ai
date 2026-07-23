import { useTripSyncStore } from '../store/useTripSyncStore';
import { mockTripResponse } from '../lib/mockData';
import { motion } from 'motion/react';

export function Roundtable() {
  const { setPage, generatedTrip } = useTripSyncStore();
  const trip = generatedTrip || mockTripResponse;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold">AI Roundtable</h2>
        <div className="bg-white px-6 py-3 rounded-full border shadow-sm">
            <span className="text-sm font-semibold text-slate-500 mr-2">Agreement Score</span>
            <span className="text-xl font-bold text-blue-600">{trip.agreementScore.score}/100</span>
        </div>
      </header>

      <div className="space-y-8">
        {trip.roundtable.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                {item.traveler[0]}
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-w-[80%]">
                <p className="font-semibold text-sm mb-1 text-blue-600">{item.traveler}</p>
                <p className="text-lg text-slate-800">{item.statement}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setPage('consensus')} className="mt-12 w-full py-5 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-slate-800 transition active:scale-95">View Consensus</button>
    </motion.div>
  );
}
