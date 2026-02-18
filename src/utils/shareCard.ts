export interface ShareCardData {
  score: number;
  accuracy: number;
  streak: number;
  rank: string;
  battlesWon: number;
  totalBattles: number;
}

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, '#1e3a5f');
  gradient.addColorStop(0.5, '#2563eb');
  gradient.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // Decorative border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, 570, 370);

  // Inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, 550, 350);

  // Logo / Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BattleGuess', 300, 65);

  // Subtitle
  ctx.fillStyle = '#d4af37';
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.fillText('HISTORICAL BATTLE GUESSING GAME', 300, 88);

  // Divider line
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 100);
  ctx.lineTo(450, 100);
  ctx.stroke();

  // Rank
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText(data.rank, 300, 145);

  // Stats grid
  const stats = [
    { label: 'Score', value: data.score.toLocaleString() },
    { label: 'Accuracy', value: `${data.accuracy}%` },
    { label: 'Best Streak', value: data.streak.toString() },
    { label: 'Battles Won', value: `${data.battlesWon}/${data.totalBattles}` },
  ];

  const startX = 75;
  const cellWidth = 130;
  const y = 200;

  stats.forEach((stat, i) => {
    const x = startX + i * cellWidth;

    // Stat box background
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.roundRect(x, y - 30, 110, 80, 10);
    ctx.fill();

    // Value
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(stat.value, x + 55, y + 10);

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText(stat.label, x + 55, y + 35);
  });

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Can you beat my score? Play at battleguess.app', 300, 340);

  // Bottom accent
  const bottomGradient = ctx.createLinearGradient(100, 360, 500, 360);
  bottomGradient.addColorStop(0, 'transparent');
  bottomGradient.addColorStop(0.5, '#d4af37');
  bottomGradient.addColorStop(1, 'transparent');
  ctx.strokeStyle = bottomGradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 360);
  ctx.lineTo(500, 360);
  ctx.stroke();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

export async function shareResult(data: ShareCardData): Promise<void> {
  const shareText = `I scored ${data.score.toLocaleString()} points on BattleGuess with ${data.accuracy}% accuracy! My rank: ${data.rank}. Can you beat me? Play at battleguess.app`;

  // Try Web Share API with image
  if (navigator.share) {
    try {
      const blob = await generateShareCard(data);
      const file = new File([blob], 'battleguess-score.png', { type: 'image/png' });

      await navigator.share({
        title: 'BattleGuess Score',
        text: shareText,
        files: [file],
      });
      return;
    } catch {
      // Fall through to clipboard
    }
  }

  // Fallback: copy text to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
  } catch {
    // Silent fail
  }
}
