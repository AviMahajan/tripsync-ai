import { useState } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { mockTripResponse } from '../lib/mockData';
import { motion } from 'motion/react';
import { Clock, RefreshCw, DollarSign, Wallet, Plane, Home, UtensilsCrossed, Car, Compass, Download } from 'lucide-react';
import { generateItineraryPDF } from '../lib/pdfExporter';

export function Itinerary() {
  const { setPage, generatedTrip, tripData } = useTripSyncStore();
  const [selectedDay, setSelectedDay] = useState(1);
  const trip = generatedTrip || mockTripResponse;

  const handleDownloadPDF = () => {
    try {
        generateItineraryPDF(trip, tripData.destination || 'Trip', tripData.travelDates || 'Dates');
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('Could not generate PDF. Please try again.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 py-6 md:py-12 space-y-6 md:space-y-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Consolidated Itinerary</h2>
        <p className="text-muted-foreground">Curated and synchronized by your AI Travel Council to maximize group satisfaction.</p>
      </div>

      {/* Budget Breakdown Section */}
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="text-primary" size={24} />
            Budget Estimate
          </h3>
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Estimated Total</p>
            <p className="text-2xl md:text-3xl font-extrabold text-primary">₹{trip.budgetEstimate.total}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {[
            { icon: Plane, label: "Flights", value: trip.budgetEstimate.flights },
            { icon: Home, label: "Stay", value: trip.budgetEstimate.stay },
            { icon: UtensilsCrossed, label: "Food", value: trip.budgetEstimate.food },
            { icon: Car, label: "Transport", value: trip.budgetEstimate.transport },
            { icon: Compass, label: "Activities", value: trip.budgetEstimate.activities },
            { icon: DollarSign, label: "Misc", value: trip.budgetEstimate.miscellaneous },
          ].map((item, i) => (
            <div key={i} className="bg-background p-4 rounded-2xl border border-border text-center">
              <item.icon className="text-muted-foreground mx-auto mb-2" size={20} />
              <p className="text-xs text-muted-foreground font-medium mb-1">{item.label}</p>
              <p className="font-bold text-foreground text-sm sm:text-base">₹{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-background border border-border rounded-full w-max overflow-x-auto max-w-full">
          {trip.itinerary.map((day) => (
            <button 
              key={day.day} 
              onClick={() => setSelectedDay(day.day)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition shrink-0 ${selectedDay === day.day ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Day {day.day}
            </button>
          ))}
        </div>

        <div className="space-y-6 pb-24">
          {trip.itinerary.find(d => d.day === selectedDay)?.activities.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 md:gap-6 bg-card p-5 md:p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-primary rounded-full" />
                <div className="w-0.5 h-full bg-border mt-2" />
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <p className="font-semibold text-lg text-foreground break-words">{a.activity}</p>
                      <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-1 shrink-0">
                        <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                            <Clock size={14} />
                            {a.time}
                        </div>
                        {a.cost && (
                          <span className="text-xs text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded">{a.cost}</span>
                        )}
                      </div>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">{a.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background border-t border-border z-50">
        <button onClick={handleDownloadPDF} className="w-full py-4 bg-foreground text-background rounded-2xl font-semibold text-lg hover:bg-slate-800 transition active:scale-95 shadow-md flex items-center justify-center gap-2">
          <Download size={20} />
          Download PDF
        </button>
      </div>
    </motion.div>
  );
}
