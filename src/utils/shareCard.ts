import type { BattleRoundResult } from '../types';

export interface ShareCardData {
  score: number;
  accuracy: number;
  streak: number;
  rank: string;
  battlesWon: number;
  totalBattles: number;
  battleResults: BattleRoundResult[];
}

export type ShareStatus = 'shared' | 'copied' | 'failed';

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext('2d')!;

  // Background — dark green military gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, '#14532d');
  gradient.addColorStop(0.5, '#166534');
  gradient.addColorStop(1, '#15803d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 450);

  // Subtle texture overlay (diagonal lines)
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let i = -450; i < 600; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 450, 450);
    ctx.stroke();
  }

  // Gold outer border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, 576, 426);

  // Green inner border
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, 556, 406);

  // Title: "BattleGuess"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BattleGuess', 300, 62);

  // Subtitle
  ctx.fillStyle = '#d4af37';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('HISTORICAL BATTLE GUESSING GAME', 300, 82);

  // Gold divider
  const divGrad = ctx.createLinearGradient(120, 0, 480, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, '#d4af37');
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, 94);
  ctx.lineTo(480, 94);
  ctx.stroke();

  // Rank
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.fillText(data.rank, 300, 130);

  // Stats grid — 4 boxes
  const stats = [
    { label: 'Score', value: data.score.toLocaleString() },
    { label: 'Accuracy', value: `${data.accuracy}%` },
    { label: 'Best Streak', value: data.streak.toString() },
    { label: 'Battles Won', value: `${data.battlesWon}/${data.totalBattles}` },
  ];

  const startX = 60;
  const cellWidth = 125;
  const boxY = 155;

  stats.forEach((stat, i) => {
    const x = startX + i * cellWidth;

    // Box background
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x, boxY, 110, 80, 8);
    ctx.fill();

    // Box border
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, boxY, 110, 80, 8);
    ctx.stroke();

    // Value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(stat.value, x + 55, boxY + 38);

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText(stat.label, x + 55, boxY + 60);
  });

  // Battle results row — colored circles
  if (data.battleResults.length > 0) {
    const resultsY = 275;

    // "Battle Results" label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE RESULTS', 300, resultsY);

    const circleY = resultsY + 25;
    const circleRadius = 10;
    const maxCircles = Math.min(data.battleResults.length, 20);
    const totalWidth = maxCircles * (circleRadius * 2 + 6) - 6;
    const circleStartX = 300 - totalWidth / 2 + circleRadius;

    data.battleResults.slice(0, maxCircles).forEach((result, i) => {
      const cx = circleStartX + i * (circleRadius * 2 + 6);

      // Circle color: green=correct no hints, yellow=correct+hints, red=wrong
      let color: string;
      if (!result.correct) {
        color = '#ef4444'; // red
      } else if (result.hintsUsed > 0) {
        color = '#eab308'; // yellow
      } else {
        color = '#22c55e'; // green
      }

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.arc(cx + 1, circleY + 1, circleRadius, 0, Math.PI * 2);
      ctx.fill();

      // Circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fill();

      // Check or X mark
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(result.correct ? '✓' : '✕', cx, circleY);
    });

    ctx.textBaseline = 'alphabetic';
  }

  // Legend
  const legendY = data.battleResults.length > 0 ? 340 : 280;
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';

  if (data.battleResults.length > 0) {
    // Draw mini legend circles
    const legendItems = [
      { color: '#22c55e', label: 'No hints' },
      { color: '#eab308', label: 'With hints' },
      { color: '#ef4444', label: 'Wrong' },
    ];
    const legendTotalWidth = 240;
    const legendStartX = 300 - legendTotalWidth / 2;

    legendItems.forEach((item, i) => {
      const lx = legendStartX + i * 85;
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(lx, legendY - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, lx + 8, legendY);
    });
  }

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Can you beat my score? Play at battleguess.app', 300, 400);

  // Bottom gold accent
  const bottomGrad = ctx.createLinearGradient(100, 0, 500, 0);
  bottomGrad.addColorStop(0, 'transparent');
  bottomGrad.addColorStop(0.5, '#d4af37');
  bottomGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = bottomGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 418);
  ctx.lineTo(500, 418);
  ctx.stroke();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export function generateShareText(data: ShareCardData): string {
  const lines: string[] = [];

  // Header
  lines.push(`🎖️ BattleGuess — ${data.rank}`);
  lines.push(`⭐ ${data.score.toLocaleString()} pts | 🎯 ${data.accuracy}% | 🔥 ${data.streak} streak`);
  lines.push('');

  // Emoji grid
  if (data.battleResults.length > 0) {
    const emojis = data.battleResults.map((result) => {
      if (!result.correct) return '🔴';
      if (result.hintsUsed > 0) return '🟡';
      return '🟢';
    });
    lines.push(emojis.join(''));
    lines.push('');
  }

  // Footer
  lines.push('Can you beat me? battleguess.app');

  return lines.join('\n');
}

export async function shareResult(data: ShareCardData): Promise<ShareStatus> {
  const shareText = generateShareText(data);

  // Try Web Share API with image file first
  if (navigator.share) {
    try {
      const blob = await generateShareCard(data);
      const file = new File([blob], 'battleguess-score.png', { type: 'image/png' });

      // Check if the browser can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'BattleGuess Score',
          text: shareText,
          files: [file],
        });
        return 'shared';
      }

      // Fall back to text-only Web Share
      await navigator.share({
        title: 'BattleGuess Score',
        text: shareText,
      });
      return 'shared';
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  // Fallback: copy emoji text to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    return 'copied';
  } catch {
    return 'failed';
  }
}
