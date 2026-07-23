import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const { setPage } = useTripSyncStore();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] -left-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-rose-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24 text-center"
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-foreground bg-card backdrop-blur rounded-full shadow-sm border border-border">
          TripSync • AI-Powered Planning
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 md:mb-8 leading-[1.1]">
          Plan the trip everyone<br className="hidden md:block" /> actually agrees on.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
          Invite friends, share preferences, and let AI negotiate the perfect itinerary for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mx-auto px-4">
          <button 
            onClick={() => setPage('create')}
            className="px-8 py-4 bg-foreground text-background rounded-full font-semibold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl"
          >
            Create Trip Room <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => setPage('join')}
            className="px-8 py-4 bg-background text-foreground rounded-full font-semibold hover:bg-card transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl border border-border"
          >
            Join Trip Room
          </button>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: Users, title: "Invite Friends", desc: "Collaborate instantly with a shared link." },
          { icon: Sparkles, title: "Share Preferences", desc: "AI builds a travel persona for each friend." },
          { icon: MapPin, title: "Generate Itinerary", desc: "Get an itinerary that respects every deal-breaker." },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="w-14 h-14 bg-background text-foreground rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-border">
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
