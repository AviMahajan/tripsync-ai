import { useEffect, useState } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { Copy, Users, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { firebaseService } from '../lib/firebase';
import { toast } from 'sonner';

export function WaitingRoom() {
  const { setPage, tripData, roomId } = useTripSyncStore();
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const isHost = true; // Simplified for MVP

  useEffect(() => {
    if (!roomId) return;
    const unsubRoom = firebaseService.getRoom(roomId, setRoom);
    const unsubParts = firebaseService.getParticipants(roomId, (parts) => {
        if (parts.length > participants.length) {
            const newParticipant = parts[parts.length - 1];
            toast.success(`🎉 ${newParticipant.name} joined the Trip Room.`);
        }
        setParticipants(parts);
    });
    return () => { unsubRoom(); unsubParts(); };
  }, [roomId, participants.length]);

  useEffect(() => {
    if (room && room.status === 'wizard') {
      setPage('wizard');
    }
  }, [room, setPage]);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleStartWizard = async () => {
    if (!roomId) return;
    try {
      await firebaseService.updateRoom(roomId, { status: 'wizard' });
      setPage('wizard');
    } catch (error) {
      console.error('Error starting preference wizard:', error);
      setPage('wizard');
    }
  };

  if (!room) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{room.tripName || tripData.tripName}</h2>
        <p className="text-muted-foreground">{room.destination || tripData.destination} • {room.travelDates || tripData.travelDates}</p>
      </div>
      
      <div className="grid gap-4 md:gap-6 mb-8">
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Users size={20} /> Participants ({participants.length})</h3>
            <div className="space-y-3">
                {participants.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                        <span className='font-semibold text-foreground'>{p.name}</span>
                        {p.ready && <span className="flex items-center gap-1 text-sm font-semibold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full"><CheckCircle size={14} /> Ready</span>}
                    </div>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
                <h3 className="font-semibold text-foreground mb-2">Room Code</h3>
                <div className='font-mono font-bold text-lg mb-4 text-foreground'>{room.code}</div>
                <button onClick={() => copyToClipboard(room.code, "Room code copied.")} className="flex items-center gap-2 text-primary font-semibold text-sm">
                     <Copy size={16} /> Copy Code
                </button>
            </div>
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
                <h3 className="font-semibold text-foreground mb-2">Invite Link</h3>
                <div className='text-sm text-muted-foreground mb-4 truncate'>{window.location.origin}/join/{room.code}</div>
                <button onClick={() => copyToClipboard(`${window.location.origin}/join/${room.code}`, "Invite link copied.")} className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <LinkIcon size={16} /> Copy Link
                </button>
            </div>
        </div>
      </div>
      
      {isHost && (
        <button 
            disabled={participants.length === 0}
            onClick={handleStartWizard} 
            className="w-full py-4 bg-foreground text-background rounded-2xl font-semibold hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Start Preference Wizard
        </button>
      )}
    </motion.div>
  );
}
