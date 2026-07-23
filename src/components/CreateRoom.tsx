import { useState } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { firebaseService } from '../lib/firebase';
import { CalendarDateRangePicker } from './ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export function CreateRoom() {
  const { setPage, setTripData, setRoomId, tripData, setParticipantId } = useTripSyncStore();
  const [hostName, setHostName] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    console.log('handleCreate clicked');
    if (!hostName.trim()) {
        alert('Please enter your name.');
        return;
    }
    if (!tripData.tripName.trim()) {
        alert('Please enter a trip name.');
        return;
    }
    if (!tripData.destination.trim()) {
        alert('Please enter a destination.');
        return;
    }
    if (!date?.from || !date?.to) {
        alert('Please select a date range.');
        return;
    }
    console.log('Form validation passed');
    setLoading(true);
    try {
      console.log('Starting Firebase room creation...');
      const travelDates = `${format(date.from, "LLL dd")} - ${format(date.to, "LLL dd")}`;
      const { id, code } = await firebaseService.createRoom({ 
        hostName, 
        travelDates, 
        tripName: tripData.tripName, 
        destination: tripData.destination 
      });
      console.log('Room created successfully:', { id, code });
      setRoomId(id);
      
      // Also join the host as the first participant
      console.log('Joining host to room...');
      const { participantId } = await firebaseService.joinRoom(code, hostName);
      console.log('Host joined successfully:', participantId);
      setParticipantId(participantId);

      console.log('Navigating to waiting room...');
      setPage('waiting');
    } catch (error) {
      console.error('CRITICAL ERROR in handleCreate:', error);
      alert(`Failed to create room: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('handleCreate finally block reached');
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-6 py-24">
      <button onClick={() => setPage('landing')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition">
        <ArrowLeft size={16} /> Back
      </button>

      <h2 className="text-4xl font-bold mb-2">Create your Trip Room</h2>
      <p className="text-slate-600 mb-10">Get started by setting the stage for your group trip.</p>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Your Name</label>
          <input type="text" placeholder="e.g. Avi" className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setHostName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Trip Name</label>
          <input type="text" placeholder="e.g. Goa Escape" className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setTripData({ tripName: e.target.value })} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="text" placeholder="Where are you going?" className="w-full p-4 pl-12 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setTripData({ destination: e.target.value })} />
          </div>
        </div>
        
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Travel Dates</label>
            <CalendarDateRangePicker date={date} setDate={setDate} />
        </div>
        
        <button onClick={handleCreate} disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition active:scale-95 shadow-lg">
          {loading ? 'Creating...' : 'Create Trip Room'}
        </button>
      </div>
    </motion.div>
  );
}
