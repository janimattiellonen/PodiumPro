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

function drawPodiumPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  index: number,
) {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  drawPlaceholder(ctx, x, y, size, colors[index], true);
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  backgroundColor: string,
  isBorderVisible: boolean
) {

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, Math.PI * 2);

  if (isBorderVisible) {
    // Add black border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 10;
    ctx.stroke();
  }


  // Fill with placeholder color
  ctx.fillStyle = backgroundColor;
  ctx.fill();
  ctx.restore();
}

async function drawCircularImageWithOptionalPlaceholder(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  x: number,
  y: number,
  size: number,
  index: number,
) {
  if (!img) {
    drawPodiumPlaceholder(ctx, x, y, size, index);
    return;
  }

  await drawCircularImage(ctx, img, x, y, size, true);
}

async function drawCircularPSLogo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  drawPlaceholder(ctx, x, y, size, '#277E30', true);
  await drawCircularImage(ctx, img, x, y, size / 2, false);

}

async function drawCircularImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  isBorderVisible: boolean
) {

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, Math.PI * 2);


  if (isBorderVisible) {
    // Add black border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 10;
    ctx.stroke();
  }


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


function formatDate(dateStr?: string | undefined): string {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  return formatter.replace(/\//g, '.');
}

export async function generatePodiumImage(data: PodiumForm): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Set canvas size
    canvas.width = 1400;
    canvas.height = 1000;


    // #277E30
    // #184F1B
    // Draw background
    ctx.fillStyle = "#277E30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const logo = await loadImage('/puskasoturit-logo.png');


    /*
    // Load and draw logo
    if (logo) {
      // Size the logo proportionally (10% of canvas width)
      const logoWidth = canvas.width * 0.1;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      ctx.drawImage(logo, 20, 20, logoWidth, logoHeight);
    }
    */

    const logoBig = await loadImage('/puskasoturit-logo-big.png');

    if (logoBig) {
      ctx.save();
      ctx.globalAlpha = 0.18;

      // Size the logo proportionally (10% of canvas width)
      const logoWidth = canvas.width;
      const logoHeight = (logoBig.height / logoBig.width) * logoWidth;
      ctx.drawImage(logoBig, 0, 0, logoWidth, logoHeight);
      ctx.restore();
    }

    // Draw title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(data.tournament.name, canvas.width / 2, 80);

    // Draw date and website
    ctx.font = "24px sans-serif";
    ctx.fillText(formatDate(data.tournament.date), canvas.width / 2, 120);
    ctx.fillText(data.tournament.websiteUrl, canvas.width / 2, 160);

    // Medal emojis matching the form
    const medals = ["🥇", "🥈", "🥉"];

    const podiumWidth = 250;
    const margin = 5;
    const offset = 50;

    // Draw podium positions
    const podiumPositions = [
      { x: 400 + podiumWidth + margin, y: 500, height: 200, place: "1st" },
      { x: 400, y: 600, height: 140, place: "2nd" },
      { x: 400 + 2 * podiumWidth + 2 * margin, y: 650, height: 80, place: "3rd" }
    ];

    // Load all images first
    const playerImages = await Promise.all(
      data.players.map(player => {
        console.log('Loading image:', player.imageUrl);
        return loadImage(player.imageUrl);
      })
    );

    for (let i = 0; i < 3; i++) {
      const player = data.players[i];
      const pos = podiumPositions[i];
      const img = playerImages[i];

      // Draw podium block
      ctx.fillStyle = "#291503";
      // green: #184F1B
      //#64748b
      ctx.fillRect(pos.x - 75, canvas.height - pos.height, podiumWidth, pos.height);

      // Draw placement number on podium
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.fillText(pos.place, pos.x + offset, canvas.height - 20);

      // Draw player image as circle with border
      await drawCircularImageWithOptionalPlaceholder(
        ctx,
        img,
        pos.x + offset,
        canvas.height - pos.height - 220,
        200,
        i
      );

      if (logo && player.isTeamMember) {
        await drawCircularPSLogo(
          ctx,
          logo,
          pos.x + 120,
          canvas.height - pos.height - 300,
          60,
        )
      }

      // Draw medal emoji above image
      ctx.font = "120px sans-serif";
      ctx.fillText(
        medals[i],
        pos.x + offset,
        canvas.height - pos.height - 370
      );

      // Draw player name
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(player.name, pos.x + offset, canvas.height - pos.height - 60);

      // Draw score
      ctx.font = "24px sans-serif";
      ctx.fillText(`${player.score}`, pos.x + offset, canvas.height - pos.height - 30);
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating podium image:", error);
    throw error;
  }
}
