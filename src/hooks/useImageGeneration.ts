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

    return '/battles/battle-1.webp';
  }, []);

  return {
    getImageForBattle,
    isLoading,
    error,
  };
}
