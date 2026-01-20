import { useState, useCallback } from 'react';
import { battleImages } from '../data/battleImages';

interface UseImageGenerationReturn {
  getImageForBattle: (battleId: number) => string;
  isLoading: boolean;
  error: string | null;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const getImageForBattle = useCallback((battleId: number): string => {
    // Use pre-generated images
    const imagePath = battleImages[battleId];
    if (imagePath) {
      return imagePath;
    }

    // Fallback if image not found (shouldn't happen with current setup)
    console.warn(`No image found for battle ID: ${battleId}`);
    return '/battles/battle-1.png';
  }, []);

  return {
    getImageForBattle,
    isLoading,
    error,
  };
}
