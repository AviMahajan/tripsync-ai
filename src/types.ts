/**
 * Core TripSync Types
 */

export interface Preferences {
  budget: string;
  tripEnergy: string[];
  idealDay: string;
  stayStyle: string[];
  food: string[];
  dealBreakers: string[];
  negotiator: string;
}

export interface Participant {
  id: string;
  name: string;
  preferences: Preferences;
  travelPersona?: {
    title: string;
    description: string;
  };
}

export interface ItineraryDay {
  day: number;
  activities: {
    time: string;
    activity: string;
    description: string;
    duration: string;
    cost?: string;
  }[];
}

export interface GeneratedTrip {
  travelPersonas: Participant["travelPersona"][];
  roundtable: { traveler: string; statement: string }[];
  facilitatorSummary: {
    mainAgreement: string;
    mainConflict: string;
    suggestedCompromise: string;
    reasoning: string;
  };
  agreementScore: {
    score: number;
    confidence: "High" | "Medium" | "Low";
    explanation: string;
  };
  whyThisPlan: string[];
  budgetEstimate: {
    flights: number;
    stay: number;
    food: number;
    transport: number;
    activities: number;
    miscellaneous: number;
    total: number;
  };
  itinerary: ItineraryDay[];
}

export interface TripRoom {
  id: string;
  tripName: string;
  destination: string;
  travelDates: string;
  hostName: string;
  status: "waiting" | "roundtable" | "ready";
  createdAt: string;
}
