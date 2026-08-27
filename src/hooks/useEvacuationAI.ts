export function useEvacuationAI() {
  const getAIRecommendedShelters = async (nearbyCenters: any[], lat: number, lon: number) => {
    const contextText = nearbyCenters.map((c: any) => 
      `- Name: "${c.name}", Barangay: ${c.barangay}, Status: ${c.status || 'Unknown'}, Capacity: ${c.current_occupants || 0}/${c.capacity} occupants, Distance from user: ${c.distance != null ? c.distance.toFixed(2) + ' km' : 'Unknown'}`
    ).join('\n');

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [
          {
            role: "system", 
            content: "You are a critical disaster management AI for Quezon City. Your goal is to select the 3 BEST evacuation centers for the user based strictly on the provided list. RULES:\n1. Prioritize centers that are Open and NOT full (occupants < capacity).\n2. Pick the ones with the absolute shortest distance (lowest km value).\nRespond ONLY with a valid JSON array of up to 3 shelters. Do NOT include any explanations, markdown formatting, or backticks. Format exactly as: [{\"name\": \"...\", \"distance\": \"...km away\", \"status\": \".../x Families\", \"isFull\": false}]"
          },
          {
            role: "user", 
            content: `My current GPS location is: Latitude ${lat}, Longitude ${lon}.\n\nHere are the pre-calculated nearest evacuation centers:\n${contextText}\n\nAnalyze their distances and capacities. Return the top 3 nearest available shelters in the requested JSON format.`
          }
        ],
        temperature: 0.1
      })
    });
    
    const aiData = await aiResponse.json();
    console.log('AI response:', aiData);
    
    if (aiData.choices && aiData.choices[0]) {
      const text = aiData.choices[0].message.content.trim();
      console.log('AI text:', text);
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    throw new Error("Invalid AI response or no choices returned");
  };

  return { getAIRecommendedShelters };
}
