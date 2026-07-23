import { Participant } from '../types';

export function buildTravelCouncilPrompt(
  roomData: { tripName: string; destination: string; travelDates: string },
  participants: Participant[]
): string {
  const participantDetails = participants.map((p) => {
    const pref = (p.preferences || {}) as any;
    return `
- Participant Name: ${p.name}
  * Spending Vibe/Budget: ${pref.budget || 'Not specified'}
  * Trip Energy: ${(pref.tripEnergy || []).join(', ') || 'Not specified'}
  * Ideal Day: ${pref.idealDay || 'Not specified'}
  * Stay Style: ${(pref.stayStyle || []).join(', ') || 'Not specified'}
  * Food Personality: ${(pref.food || []).join(', ') || 'Not specified'}
  * Deal Breakers: ${(pref.dealBreakers || []).join(', ') || 'Not specified'}
  * Selected AI Negotiator Style: ${pref.negotiator || 'The Diplomat'}
`;
  }).join('\n');

  return `You are TripSync's AI Travel Council, composed of the selected AI Negotiator personas of the participants.
Your mission is to negotiate and design the perfect trip plan for the following group.

TRIP DETAILS:
- Trip Name: ${roomData.tripName}
- Destination: ${roomData.destination}
- Dates: ${roomData.travelDates}

PARTICIPANTS AND PREFERENCES:
${participantDetails}

INSTRUCTIONS FOR GENERATION:
1. Travel Personas:
   - For EACH participant, generate a customized Travel Persona title and description based on their specific preferences.
   - Every participant MUST have exactly one custom travel persona. Do not miss anyone.
   - Do not invent preferences or traits they didn't select.

2. AI Roundtable:
   - Simulate a realistic, lively negotiation roundtable debate between the participants (representing their selected Negotiator style: Diplomat, Budget Guardian, Vibe Curator, Master Planner).
   - Each participant must say at least one statement expressing their desires, how they compromise, or how the council resolved a conflict.
   - Represent every single participant.
   - Respect explicit deal breakers (e.g., if someone has "No Early Mornings", do not schedule activities before 9:00 AM; if "No Trekking", do not include hiking; if "No Hostels", do not stay in hostels).
   - When compromises are made, explain why in the statements.

3. Facilitator Summary:
   - Provide the main agreement, main conflict, suggested compromise, and the underlying reasoning for the consensus.
   - Maximize group satisfaction rather than simply combining preferences.

4. Agreement Score:
   - Estimate an honest, calculated Agreement Score (0 to 100).
   - Provide a confidence level ("High", "Medium", or "Low") and a clear explanation of how the score was calculated based on the alignment of preferences.

5. Why This Plan:
   - Provide a list of 2-4 key reasons why this custom-tailored plan satisfies the group.

6. Budget Estimate:
   - Provide realistic cost estimates (numbers only, in INR) for: flights, stay, food, transport, activities, miscellaneous, and a calculated total.

7. Multi-day Itinerary:
   - Create a realistic multi-day itinerary matching the duration of the trip. Since dates are ${roomData.travelDates}, make it a structured list of days (e.g. Day 1, Day 2, etc.). Generally, generate 2 or 3 days of high-quality activities.
   - Important: Assume all participants are Indian travelers. Suggest "hidden gems" or authentic, lesser-known spots rather than just famous, overcrowded tourist traps. Balance travel time realistically—ensure activities are geographically feasible without impossible, rushed schedules.
   - Each activity must have a specific 'time' (formatted as "HH:MM", after 09:00 if early mornings is a deal breaker), 'activity' title, 'description', 'duration' (e.g., "2h"), and optional 'cost' (e.g. "₹500" or "Free").

OUTPUT FORMAT:
Return a JSON object matching this TypeScript structure exactly:
{
  "travelPersonas": [
    { "title": "string", "description": "string" }
  ],
  "roundtable": [
    { "traveler": "string", "statement": "string" }
  ],
  "facilitatorSummary": {
    "mainAgreement": "string",
    "mainConflict": "string",
    "suggestedCompromise": "string",
    "reasoning": "string"
  },
  "agreementScore": {
    "score": number,
    "confidence": "High" | "Medium" | "Low",
    "explanation": "string"
  },
  "whyThisPlan": ["string"],
  "budgetEstimate": {
    "flights": number,
    "stay": number,
    "food": number,
    "transport": number,
    "activities": number,
    "miscellaneous": number,
    "total": number
  },
  "itinerary": [
    {
      "day": number,
      "activities": [
        {
          "time": "string",
          "activity": "string",
          "description": "string",
          "duration": "string",
          "cost": "string"
        }
      ]
    }
  ]
}

Ensure the output is valid JSON. Do not include markdown code block formatting like \`\`\`json. Just return the raw JSON object.`;
}
