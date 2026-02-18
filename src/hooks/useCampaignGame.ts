import { useState, useCallback } from 'react';
import type { Battle } from '../types';
import { getBattleById } from '../data/battles/index';
import { campaigns, type Campaign } from '../data/campaigns';
import { useLocalStorage } from './useLocalStorage';

export type CampaignPhase = 'select' | 'narrative-pre' | 'playing' | 'result' | 'narrative-post' | 'complete';

export interface CampaignState {
  phase: CampaignPhase;
  campaign: Campaign | null;
  currentBattleIndex: number;
  currentBattle: Battle | null;
  score: number;
  correctGuesses: number;
  totalBattles: number;
  narrativeText: string;
}

export interface CampaignProgress {
  [campaignId: string]: {
    completed: boolean;
    score: number;
    correctGuesses: number;
    totalBattles: number;
  };
}

export function useCampaignGame() {
  const [state, setState] = useState<CampaignState>({
    phase: 'select',
    campaign: null,
    currentBattleIndex: 0,
    currentBattle: null,
    score: 0,
    correctGuesses: 0,
    totalBattles: 0,
    narrativeText: '',
  });

  const [progress, setProgress] = useLocalStorage<CampaignProgress>('battleguess-campaigns', {});

  const selectCampaign = useCallback((campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    setState({
      phase: 'narrative-pre',
      campaign,
      currentBattleIndex: 0,
      currentBattle: null,
      score: 0,
      correctGuesses: 0,
      totalBattles: campaign.battleIds.length,
      narrativeText: campaign.narratives.intro,
    });
  }, []);

  const startBattle = useCallback(() => {
    setState(prev => {
      if (!prev.campaign) return prev;
      const battleId = prev.campaign.battleIds[prev.currentBattleIndex];
      const battle = getBattleById(battleId);
      if (!battle) return prev;
      return {
        ...prev,
        phase: 'playing',
        currentBattle: battle,
      };
    });
  }, []);

  const recordResult = useCallback((correct: boolean, score: number) => {
    setState(prev => ({
      ...prev,
      phase: 'result',
      score: prev.score + score,
      correctGuesses: prev.correctGuesses + (correct ? 1 : 0),
    }));
  }, []);

  const advanceFromResult = useCallback(() => {
    setState(prev => {
      if (!prev.campaign) return prev;
      const nextIndex = prev.currentBattleIndex + 1;

      if (nextIndex >= prev.campaign.battleIds.length) {
        // Campaign complete
        setProgress(p => ({
          ...p,
          [prev.campaign!.id]: {
            completed: true,
            score: prev.score,
            correctGuesses: prev.correctGuesses,
            totalBattles: prev.totalBattles,
          },
        }));
        return {
          ...prev,
          phase: 'narrative-post' as CampaignPhase,
          narrativeText: prev.campaign.narratives.outro,
        };
      }

      // Show between narrative
      const narrativeText = prev.campaign.narratives.between[prev.currentBattleIndex] || '';
      return {
        ...prev,
        phase: 'narrative-pre' as CampaignPhase,
        currentBattleIndex: nextIndex,
        currentBattle: null,
        narrativeText,
      };
    });
  }, [setProgress]);

  const completeCampaign = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'complete',
    }));
  }, []);

  const backToSelect = useCallback(() => {
    setState({
      phase: 'select',
      campaign: null,
      currentBattleIndex: 0,
      currentBattle: null,
      score: 0,
      correctGuesses: 0,
      totalBattles: 0,
      narrativeText: '',
    });
  }, []);

  return {
    state,
    progress,
    campaigns,
    actions: {
      selectCampaign,
      startBattle,
      recordResult,
      advanceFromResult,
      completeCampaign,
      backToSelect,
    },
  };
}
