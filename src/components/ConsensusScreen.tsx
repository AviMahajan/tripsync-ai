import { useTripSyncStore } from '../store/useTripSyncStore';
import { mockTripResponse } from '../lib/mockData';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldAlert, Sparkles, Lightbulb } from 'lucide-react';

export function ConsensusScreen() {
  const { setPage, generatedTrip } = useTripSyncStore();
  const trip = generatedTrip || mockTripResponse;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h2 className="text-4xl font-bold mb-4 text-slate-900">Trip Consensus</h2>
      
      {/* Agreement Score */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Council Agreement Score</p>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-6xl font-bold text-blue-600">{trip.agreementScore.score}</span>
          <span className="text-2xl font-bold text-slate-400">/100</span>
          <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full ${
            trip.agreementScore.confidence === 'High' ? 'bg-green-50 text-green-700' :
            trip.agreementScore.confidence === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
            'bg-orange-50 text-orange-700'
          }`}>
            {trip.agreementScore.confidence} Confidence
          </span>
        </div>
        <p className="text-slate-600 leading-relaxed text-lg">{trip.agreementScore.explanation}</p>
      </div>

      {/* Facilitator Summary */}
      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} />
          Facilitator Report
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Main Agreement
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">{trip.facilitatorSummary.mainAgreement}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-semibold text-sm text-amber-700 mb-2 flex items-center gap-1.5">
              <ShieldAlert size={16} /> Key Conflict Point
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">{trip.facilitatorSummary.mainConflict}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <Lightbulb className="text-yellow-500" size={20} />
            The Compromise & Reasoning
          </h4>
          <p className="text-slate-700 font-medium text-sm">
            {trip.facilitatorSummary.suggestedCompromise}
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            {trip.facilitatorSummary.reasoning}
          </p>
        </div>
      </div>

      {/* Why This Plan */}
      {trip.whyThisPlan && trip.whyThisPlan.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Why This Plan Works</h3>
          <ul className="space-y-3">
            {trip.whyThisPlan.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-600">
                <span className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => setPage('itinerary')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-slate-800 transition active:scale-95 shadow-md">
        View Itinerary & Budget
      </button>
    </motion.div>
  );
}
