import { useState } from 'react';
import { useTripSyncStore } from '../store/useTripSyncStore';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { firebaseService } from '../lib/firebase';

export function JoinRoom() {
  const { setPage, setRoomId, setParticipantId } = useTripSyncStore();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
        alert('Please fill out all fields.');
        return;
    }
    try {
      const { roomId, participantId } = await firebaseService.joinRoom(code, name);
      setRoomId(roomId);
      setParticipantId(participantId);
      setPage('waiting');
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please check the code and try again.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto px-6 py-24">
      <button onClick={() => setPage('landing')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition">
        <ArrowLeft size={16} /> Back
      </button>
      <h2 className="text-3xl font-bold mb-8">Join a Trip Room</h2>
      <div className="space-y-4">
        <input type="text" placeholder="Room Code" className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setCode(e.target.value)} />
        <input type="text" placeholder="Your Name" className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setName(e.target.value)} />
        <button onClick={handleJoin} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition active:scale-95">Join Room</button>
      </div>
    </motion.div>
  );
}
