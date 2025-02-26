import type { PodiumForm } from "@shared/schema";

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

  // Load and draw medal images
  const medals = [
    "https://images.unsplash.com/photo-1631359062396-9356c6fc97e8",
    "https://images.unsplash.com/photo-1631359062410-02bb201adae8",
    "https://images.unsplash.com/photo-1591850356360-067508ab570b"
  ];

  // Draw podium
  const podiumPositions = [
    { x: 600, y: 500, height: 200 },
    { x: 400, y: 600, height: 100 },
    { x: 800, y: 650, height: 50 }
  ];

  for (let i = 0; i < 3; i++) {
    const player = data.players[i];
    const pos = podiumPositions[i];

    // Draw podium block
    ctx.fillStyle = "#64748b";
    ctx.fillRect(pos.x - 75, canvas.height - pos.height, 150, pos.height);

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
