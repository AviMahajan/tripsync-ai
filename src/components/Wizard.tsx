import { useState } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { Coffee, Users, Sun, Bed, Utensils, X, Bot } from 'lucide-react';

const wizardSteps = [
  { title: "Spending Vibe", icon: Users, options: [
      { name: "Backpacker Mode", desc: "For the adventurous and budget-conscious." },
      { name: "Comfort Zone", desc: "A blend of comfort and reasonable spending." },
      { name: "Treat Yourself", desc: "Indulge in experiences and better stays." },
      { name: "Main Character", desc: "Luxury, exclusivity, and premium vibes." }
  ] },
  { title: "Trip Energy", icon: Sun, options: [
      { name: "Beach Bum", desc: "Relaxing by the sea with a drink." },
      { name: "Café Collector", desc: "Seeking the best local brews and vibes." },
      { name: "Food Hunter", desc: "Prioritizing the best local dining." },
      { name: "Memory Maker", desc: "Focus on activities and experiences." }
  ] },
  { title: "Ideal Day", icon: Sun, options: [
      { name: "Sleep Till 10", desc: "Slow starts and late nights." },
      { name: "Slow Morning", desc: "Relaxed breakfast and leisurely pace." },
      { name: "Balanced Explorer", desc: "A mix of activities and relaxation." },
      { name: "Sunrise Chaser", desc: "Up early to beat the crowds." }
  ] },
  { title: "Stay Style", icon: Bed, options: [
      { name: "Boutique Hotel", desc: "Chic, curated, and comfortable." },
      { name: "Airbnb", desc: "Feels like home with extra privacy." },
      { name: "Hostel", desc: "Great for socializing and meeting people." },
      { name: "Luxury Resort", desc: "Full-service relaxation and amenities." }
  ] },
  { title: "Food Personality", icon: Utensils, options: [
      { name: "Street Food", desc: "Authentic tastes from local stalls." },
      { name: "Fancy Plates", desc: "Fine dining and elevated experiences." },
      { name: "Coffee First", desc: "The day doesn't start without a brew." },
      { name: "Local Cuisine", desc: "Traditional and regional specialties." }
  ] },
  { title: "Deal Breakers", icon: X, options: [
      { name: "No Early Mornings", desc: "Strictly after 9 AM only." },
      { name: "No Trekking", desc: "Prefer comfort over physical activity." },
      { name: "No Hostels", desc: "Require private and quiet spaces." },
      { name: "No Nightlife", desc: "Prefer quiet evenings in." }
  ] },
  { title: "AI Negotiator", icon: Bot, options: [
      { name: "The Diplomat", desc: "Balances everyone's needs fairly." },
      { name: "Budget Guardian", desc: "Focuses on cost-efficiency." },
      { name: "Vibe Curator", desc: "Ensures the mood stays premium." },
      { name: "Master Planner", desc: "Focuses on schedule efficiency." }
  ] },
];

import { firebaseService } from '../lib/firebase';

export function Wizard() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<any>({
    budget: '',
    tripEnergy: [],
    idealDay: '',
    stayStyle: [],
    food: [],
    dealBreakers: [],
    negotiator: '',
  });

  const { setPage, participantId } = useTripSyncStore();
  const currentStep = wizardSteps[step];

  const handleNext = async () => {
    if (!selected) {
      alert('Please select an option to continue.');
      return;
    }

    const keyMap = [
      'budget',
      'tripEnergy',
      'idealDay',
      'stayStyle',
      'food',
      'dealBreakers',
      'negotiator',
    ];
    const key = keyMap[step];
    const isArrayField = ['tripEnergy', 'stayStyle', 'food', 'dealBreakers'].includes(key);
    const updatedAnswers = {
      ...answers,
      [key]: isArrayField ? [selected] : selected,
    };

    if (step < 6) {
      setAnswers(updatedAnswers);
      setStep(step + 1);
      setSelected(null);
    } else {
      setLoading(true);
      try {
        if (participantId) {
          await firebaseService.updateParticipant(participantId, {
            preferences: updatedAnswers,
            ready: true,
          });
        }
        setPage('persona');
      } catch (error) {
        console.error('Error updating participant preferences:', error);
        alert('Failed to save your preferences. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Step {step + 1} of 7</p>
          <p className="text-sm text-slate-500">{Math.round(((step + 1) / 7) * 100)}% Complete</p>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-blue-600" animate={{ width: `${((step + 1) / 7) * 100}%` }} />
        </div>
      </div>
      
      <h2 className="text-4xl font-bold mb-10 flex items-center gap-4">
        <currentStep.icon className="text-blue-600" size={40} />
        {currentStep.title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {currentStep.options.map((option) => (
          <button 
            key={option.name} 
            onClick={() => setSelected(option.name)}
            className={`p-6 border-2 rounded-3xl text-left transition-all shadow-sm active:scale-95 ${selected === option.name ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
          >
            <p className="font-semibold text-lg mb-1">{option.name}</p>
            <p className="text-slate-500 text-sm">{option.desc}</p>
          </button>
        ))}
      </div>

      <button 
        onClick={handleNext} 
        disabled={loading}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Saving...' : step < 6 ? 'Next Question' : 'Complete Profile'}
      </button>
    </motion.div>
  );
}
