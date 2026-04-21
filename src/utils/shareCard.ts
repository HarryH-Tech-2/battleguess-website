import type { BattleRoundResult } from '../types';
import { battleImages } from '../data/battleImages';

export interface ShareCardData {
  score: number;
  accuracy: number;
  streak: number;
  rank: string;
  battlesWon: number;
  totalBattles: number;
  battleResults: BattleRoundResult[];
  isDaily?: boolean;
}

export type ShareStatus = 'shared' | 'copied' | 'failed';

const WIDTH = 1080;
const HEIGHT = 1350;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const srcRatio = img.width / img.height;
  const dstRatio = dw / dh;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;
  if (srcRatio > dstRatio) {
    // source wider than dest -> crop sides
    sw = img.height * dstRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / dstRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function resultColor(r: BattleRoundResult | undefined): string {
  if (!r) return '#4b5563'; // neutral gray
  if (!r.correct) return '#ef4444';
  if (r.hintsUsed > 0) return '#eab308';
  return '#22c55e';
}

function resultMark(r: BattleRoundResult | undefined): string {
  if (!r) return '';
  return r.correct ? '✓' : '✕';
}

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // --- Background: deep military gradient (navy -> black) ---
  const bg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bg.addColorStop(0, '#0b1220');
  bg.addColorStop(0.55, '#0f1f2e');
  bg.addColorStop(1, '#05070c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Topographic-ish diagonal map lines
  ctx.strokeStyle = 'rgba(212,175,55,0.04)';
  ctx.lineWidth = 1;
  for (let i = -HEIGHT; i < WIDTH; i += 36) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + HEIGHT, HEIGHT);
    ctx.stroke();
  }

  // Vignette corners
  const vignette = ctx.createRadialGradient(
    WIDTH / 2,
    HEIGHT / 2,
    WIDTH * 0.4,
    WIDTH / 2,
    HEIGHT / 2,
    WIDTH * 0.9,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Outer gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, WIDTH - 36, HEIGHT - 36);

  // Inner thin border
  ctx.strokeStyle = 'rgba(212,175,55,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, WIDTH - 64, HEIGHT - 64);

  // --- Header ---
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 82px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('BATTLEGUESS', WIDTH / 2, 130);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 22px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText('THE MILITARY HISTORY GAME', WIDTH / 2, 168);

  // Gold divider
  const divGrad = ctx.createLinearGradient(200, 0, WIDTH - 200, 0);
  divGrad.addColorStop(0, 'rgba(212,175,55,0)');
  divGrad.addColorStop(0.5, '#d4af37');
  divGrad.addColorStop(1, 'rgba(212,175,55,0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 195);
  ctx.lineTo(WIDTH - 200, 195);
  ctx.stroke();

  // --- Battle image collage (2x2) ---
  const collageX = 60;
  const collageY = 230;
  const collageW = WIDTH - 120; // 960
  const collageH = 580;
  const gap = 14;
  const tileW = (collageW - gap) / 2;
  const tileH = (collageH - gap) / 2;

  // Pick up to 4 battle images. Prefer the user's played battles; if fewer than 4,
  // pad with other battles for visual density.
  const playedIds = data.battleResults.map((r) => r.battleId);
  const uniquePlayed: number[] = [];
  for (const id of playedIds) {
    if (!uniquePlayed.includes(id)) uniquePlayed.push(id);
    if (uniquePlayed.length >= 4) break;
  }
  const allIds = Object.keys(battleImages).map(Number);
  const padIds: number[] = [];
  for (const id of allIds) {
    if (uniquePlayed.length + padIds.length >= 4) break;
    if (!uniquePlayed.includes(id)) padIds.push(id);
  }
  const tileIds = [...uniquePlayed, ...padIds].slice(0, 4);

  const loaded = await Promise.all(
    tileIds.map((id) => (battleImages[id] ? loadImage(battleImages[id]) : Promise.resolve(null))),
  );

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx = collageX + col * (tileW + gap);
    const ty = collageY + row * (tileH + gap);
    const img = loaded[i];

    ctx.save();
    roundRectPath(ctx, tx, ty, tileW, tileH, 14);
    ctx.clip();

    if (img) {
      drawCoverImage(ctx, img, tx, ty, tileW, tileH);
    } else {
      const pg = ctx.createLinearGradient(tx, ty, tx + tileW, ty + tileH);
      pg.addColorStop(0, '#1e293b');
      pg.addColorStop(1, '#0f172a');
      ctx.fillStyle = pg;
      ctx.fillRect(tx, ty, tileW, tileH);
    }

    // Dark bottom gradient for contrast
    const shade = ctx.createLinearGradient(tx, ty + tileH * 0.55, tx, ty + tileH);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = shade;
    ctx.fillRect(tx, ty, tileW, tileH);
    ctx.restore();

    // Tile border
    ctx.strokeStyle = 'rgba(212,175,55,0.4)';
    ctx.lineWidth = 2;
    roundRectPath(ctx, tx, ty, tileW, tileH, 14);
    ctx.stroke();

    // Corner result badge (only for actually-played battles)
    const matchingResult = data.battleResults.find((r) => r.battleId === tileIds[i]);
    if (matchingResult) {
      const badgeR = 28;
      const bx = tx + tileW - badgeR - 16;
      const by = ty + badgeR + 16;

      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.arc(bx + 2, by + 2, badgeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = resultColor(matchingResult);
      ctx.beginPath();
      ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(resultMark(matchingResult), bx, by + 1);
      ctx.textBaseline = 'alphabetic';
    }
  }

  // --- Rank badge ---
  const rankY = 862;
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  const rankText = data.rank.toUpperCase();
  const rankMetrics = ctx.measureText(rankText);
  const rankPadX = 36;
  const rankBadgeW = Math.ceil(rankMetrics.width) + rankPadX * 2;
  const rankBadgeH = 56;
  const rankBadgeX = (WIDTH - rankBadgeW) / 2;

  // Gold gradient badge
  const rankGrad = ctx.createLinearGradient(0, rankY - rankBadgeH / 2, 0, rankY + rankBadgeH / 2);
  rankGrad.addColorStop(0, '#f4d47a');
  rankGrad.addColorStop(0.5, '#d4af37');
  rankGrad.addColorStop(1, '#9a7a1f');
  ctx.fillStyle = rankGrad;
  roundRectPath(ctx, rankBadgeX, rankY - rankBadgeH / 2, rankBadgeW, rankBadgeH, rankBadgeH / 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, rankBadgeX, rankY - rankBadgeH / 2, rankBadgeW, rankBadgeH, rankBadgeH / 2);
  ctx.stroke();

  ctx.fillStyle = '#1a1205';
  ctx.textBaseline = 'middle';
  ctx.fillText(rankText, WIDTH / 2, rankY + 2);
  ctx.textBaseline = 'alphabetic';

  // --- Score hero ---
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 120px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillText(data.score.toLocaleString(), WIDTH / 2, 1008);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('POINTS', WIDTH / 2, 1036);

  // --- Stats row ---
  const statsY = 1098;
  const statCenters = [WIDTH * 0.22, WIDTH * 0.5, WIDTH * 0.78];
  const stats = [
    { value: `${data.accuracy}%`, label: 'ACCURACY' },
    { value: `${data.battlesWon}/${data.totalBattles}`, label: 'BATTLES WON' },
    { value: data.streak.toString(), label: 'BEST STREAK' },
  ];

  stats.forEach((stat, i) => {
    ctx.fillStyle = '#f4d47a';
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
    ctx.fillText(stat.value, statCenters[i], statsY);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(stat.label, statCenters[i], statsY + 26);
  });

  // --- Emoji grid strip ---
  if (data.battleResults.length > 0) {
    const stripY = 1188;
    const maxCircles = Math.min(data.battleResults.length, 20);
    const cr = 13;
    const gapC = 10;
    const totalW = maxCircles * (cr * 2) + (maxCircles - 1) * gapC;
    const startX = (WIDTH - totalW) / 2 + cr;
    data.battleResults.slice(0, maxCircles).forEach((r, i) => {
      const cx = startX + i * (cr * 2 + gapC);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.arc(cx + 1.5, stripY + 1.5, cr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = resultColor(r);
      ctx.beginPath();
      ctx.arc(cx, stripY, cr, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- Footer ---
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '600 26px system-ui, -apple-system, sans-serif';
  ctx.fillText('Can you beat my score?', WIDTH / 2, 1268);

  ctx.fillStyle = '#d4af37';
  ctx.font = '700 30px system-ui, -apple-system, sans-serif';
  ctx.fillText('battleguess.app', WIDTH / 2, 1308);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.92);
  });
}

export function generateShareText(data: ShareCardData): string {
  const lines: string[] = [];

  if (data.isDaily) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    lines.push(`🎖️ BattleGuess Daily — ${today}`);
    lines.push(`Score: ${data.battlesWon}/${data.totalBattles}`);
  } else {
    lines.push(`🎖️ BattleGuess — ${data.rank}`);
    lines.push(`⭐ ${data.score.toLocaleString()} pts · 🎯 ${data.accuracy}% · 🔥 ${data.streak} streak`);
  }

  if (data.isDaily && data.streak > 0) {
    lines.push(`Streak: ${data.streak} days`);
  }
  lines.push('');

  if (data.battleResults.length > 0) {
    const emojis = data.battleResults.map((result) => {
      if (!result.correct) return '🔴';
      if (result.hintsUsed > 0) return '🟡';
      return '🟢';
    });
    lines.push(emojis.join(''));
    lines.push('');
  }

  lines.push('Can you beat me? Play the military history game:');
  lines.push('https://battleguess.app');
  lines.push('');
  lines.push('#BattleGuess #MilitaryHistory');

  return lines.join('\n');
}

export async function shareResult(data: ShareCardData): Promise<ShareStatus> {
  const shareText = generateShareText(data);

  if (navigator.share) {
    try {
      const blob = await generateShareCard(data);
      const file = new File([blob], 'battleguess-score.jpg', { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'BattleGuess Score',
          text: shareText,
          url: 'https://battleguess.app',
          files: [file],
        });
        return 'shared';
      }

      await navigator.share({
        title: 'BattleGuess Score',
        text: shareText,
        url: 'https://battleguess.app',
      });
      return 'shared';
    } catch {
      // user cancelled or share failed — fall through
    }
  }

  try {
    await navigator.clipboard.writeText(shareText);
    return 'copied';
  } catch {
    return 'failed';
  }
}
