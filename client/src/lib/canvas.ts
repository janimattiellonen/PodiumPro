import type { PodiumForm } from "@shared/schema";

function drawMedal(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  // Draw medal circle
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw ribbon
  ctx.beginPath();
  ctx.moveTo(x, y + 20);
  ctx.lineTo(x - 10, y + 40);
  ctx.lineTo(x + 10, y + 40);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

export async function generatePodiumImage(data: PodiumForm): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Set canvas size
  canvas.width = 1200;
  canvas.height = 800;

  // Draw background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.tournament.name, canvas.width / 2, 80);

  // Draw date and website
  ctx.font = "24px sans-serif";
  ctx.fillText(data.tournament.date, canvas.width / 2, 120);
  ctx.fillText(data.tournament.websiteUrl, canvas.width / 2, 160);

  // Medal colors
  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  // Draw podium
  const podiumPositions = [
    { x: 600, y: 500, height: 200, place: "1st" },
    { x: 400, y: 600, height: 100, place: "2nd" },
    { x: 800, y: 650, height: 50, place: "3rd" }
  ];

  for (let i = 0; i < 3; i++) {
    const player = data.players[i];
    const pos = podiumPositions[i];

    // Draw medal
    drawMedal(ctx, pos.x, canvas.height - pos.height - 120, medalColors[i]);

    // Draw podium block
    ctx.fillStyle = "#64748b";
    ctx.fillRect(pos.x - 75, canvas.height - pos.height, 150, pos.height);

    // Draw placement number on podium
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(pos.place, pos.x, canvas.height - 20);

    // Draw player name
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(player.name, pos.x, canvas.height - pos.height - 60);

    // Draw score
    ctx.font = "24px sans-serif";
    ctx.fillText(`Score: ${player.score}`, pos.x, canvas.height - pos.height - 30);
  }

  return canvas.toDataURL("image/png");
}