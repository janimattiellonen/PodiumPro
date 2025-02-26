import type { PodiumForm } from "@shared/schema";

async function loadImage(url: string): Promise<HTMLImageElement | null> {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow loading from other domains

      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  index: number
) {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, Math.PI * 2);

  // Add black border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Fill with placeholder color
  ctx.fillStyle = colors[index];
  ctx.fill();
  ctx.restore();
}

async function drawCircularImage(
  ctx: CanvasRenderingContext2D, 
  img: HTMLImageElement | null,
  x: number,
  y: number,
  size: number,
  index: number
) {
  if (!img) {
    drawPlaceholder(ctx, x, y, size, index);
    return;
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, Math.PI * 2);

  // Add black border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Clip and draw image
  ctx.clip();
  const aspectRatio = img.width / img.height;
  let drawWidth = size;
  let drawHeight = size;

  if (aspectRatio > 1) {
    drawWidth = size * aspectRatio;
  } else {
    drawHeight = size / aspectRatio;
  }

  const drawX = x - drawWidth/2;
  const drawY = y - drawHeight/2;
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

export async function generatePodiumImage(data: PodiumForm): Promise<string> {
  try {
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

    // Medal emojis matching the form
    const medals = ["🥇", "🥈", "🥉"];

    // Draw podium positions
    const podiumPositions = [
      { x: 600, y: 500, height: 200, place: "1st" },
      { x: 400, y: 600, height: 100, place: "2nd" },
      { x: 800, y: 650, height: 50, place: "3rd" }
    ];

    // Load all images first
    const playerImages = await Promise.all(
      data.players.map(player => loadImage(player.imageUrl))
    );

    for (let i = 0; i < 3; i++) {
      const player = data.players[i];
      const pos = podiumPositions[i];
      const img = playerImages[i];

      // Draw podium block
      ctx.fillStyle = "#64748b";
      ctx.fillRect(pos.x - 75, canvas.height - pos.height, 150, pos.height);

      // Draw placement number on podium
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(pos.place, pos.x, canvas.height - 20);

      // Draw player image as circle with border
      await drawCircularImage(
        ctx,
        img,
        pos.x,
        canvas.height - pos.height - 120,
        100,
        i
      );

      // Draw medal emoji above image
      ctx.font = "48px sans-serif";
      ctx.fillText(
        medals[i],
        pos.x,
        canvas.height - pos.height - 180
      );

      // Draw player name
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(player.name, pos.x, canvas.height - pos.height - 60);

      // Draw score
      ctx.font = "24px sans-serif";
      ctx.fillText(`Score: ${player.score}`, pos.x, canvas.height - pos.height - 30);
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating podium image:", error);
    throw error;
  }
}