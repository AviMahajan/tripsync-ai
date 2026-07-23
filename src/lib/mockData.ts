import { GeneratedTrip } from '../types';

export const mockTripResponse: GeneratedTrip = {
  travelPersonas: [
    { title: "The Cafe Explorer", description: "You enjoy discovering hidden cafes and memorable local experiences." }
  ],
  roundtable: [
    { traveler: "Avi", statement: "I'd rather stay in an Airbnb if it lets us fit scuba diving into the budget." }
  ],
  facilitatorSummary: {
    mainAgreement: "Preference for local cuisine and flexible mornings.",
    mainConflict: "Budget allocation between premium stays and activities.",
    suggestedCompromise: "Opt for mid-range boutique stays to free up budget for scuba diving.",
    reasoning: "Prioritizing shared experiences aligns with group's 'Memory Maker' energy."
  },
  agreementScore: {
    score: 85,
    confidence: "High",
    explanation: "Group preferences are largely aligned around local experiences."
  },
  whyThisPlan: ["Local food prioritized", "Airbnb chosen for budget flexibility"],
  budgetEstimate: { flights: 500, stay: 400, food: 300, transport: 100, activities: 200, miscellaneous: 50, total: 1550 },
  itinerary: [{ day: 1, activities: [{ time: "09:00", activity: "Cafe Hop", description: "Local cafe tour", duration: "2h" }] }]
};
