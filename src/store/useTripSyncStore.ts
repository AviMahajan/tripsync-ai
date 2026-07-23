import { create } from 'zustand';
import { GeneratedTrip } from '../types';

type Page = 'landing' | 'create' | 'join' | 'waiting' | 'wizard' | 'persona' | 'processing' | 'roundtable' | 'consensus' | 'itinerary' | 'share';

interface AppState {
  currentPage: Page;
  setPage: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  tripData: {
    tripName: string;
    destination: string;
    travelDates: string;
  };
  setTripData: (data: Partial<AppState['tripData']>) => void;
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  participantId: string | null;
  setParticipantId: (id: string | null) => void;
  generatedTrip: GeneratedTrip | null;
  setGeneratedTrip: (trip: GeneratedTrip | null) => void;
}

export const useTripSyncStore = create<AppState>((set) => ({
  currentPage: 'landing',
  setPage: (page) => set({ currentPage: page }),
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  tripData: {
    tripName: '',
    destination: '',
    travelDates: '',
  },
  setTripData: (data) => set((state) => ({ tripData: { ...state.tripData, ...data } })),
  roomId: null,
  setRoomId: (id) => set({ roomId: id }),
  participantId: null,
  setParticipantId: (id) => set({ participantId: id }),
  generatedTrip: null,
  setGeneratedTrip: (trip) => set({ generatedTrip: trip }),
}));
