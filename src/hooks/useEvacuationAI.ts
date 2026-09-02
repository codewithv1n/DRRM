import { encryptedFetch } from '../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export function useEvacuationAI() {
  const getAIRecommendedShelters = async (nearbyCenters: any[], lat: number, lon: number) => {
    
    const response = await encryptedFetch(`${API_URL}/api/d4a8b7f1-59c3-421e-8fd9-bc37ea495201/ai-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat,
        lon,
        nearbyCenters
      })
    });
    
    const aiData = await response.json();
    
    if (aiData.data) {
      return aiData.data;
    }
    
    throw new Error("Invalid AI response or no choices returned");
  };

  return { getAIRecommendedShelters };
}
