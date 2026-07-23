import { useEffect } from 'react';
import { useTripSyncStore } from './store/useTripSyncStore';
import { LandingPage } from './components/LandingPage';
import { CreateRoom } from './components/CreateRoom';
import { JoinRoom } from './components/JoinRoom';
import { WaitingRoom } from './components/WaitingRoom';
import { Wizard } from './components/Wizard';
import { PersonaReveal } from './components/PersonaReveal';
import { ProcessingScreen } from './components/ProcessingScreen';
import { Roundtable } from './components/Roundtable';
import { ConsensusScreen } from './components/ConsensusScreen';
import { Itinerary } from './components/Itinerary';
import { ShareScreen } from './components/ShareScreen';
import { Sun, Moon } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const { currentPage, theme, toggleTheme } = useTripSyncStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 rounded-full bg-white/50 backdrop-blur shadow-sm border border-slate-200 z-50"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'create' && <CreateRoom />}
      {currentPage === 'join' && <JoinRoom />}
      {currentPage === 'waiting' && <WaitingRoom />}
      {currentPage === 'wizard' && <Wizard />}
      {currentPage === 'persona' && <PersonaReveal />}
      {currentPage === 'processing' && <ProcessingScreen />}
      {currentPage === 'roundtable' && <Roundtable />}
      {currentPage === 'consensus' && <ConsensusScreen />}
      {currentPage === 'itinerary' && <Itinerary />}
      {currentPage === 'share' && <ShareScreen />}
      <Toaster />
    </div>
  );
}
