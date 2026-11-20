import mspPoster from '@/assets/msp-original.png';
import mspWordmark from '@/assets/msp-logo-wordmark.png';

// The certificate is drawn on a canvas with the page's own fonts, so a name
// in any script (Korean, Chinese, accents…) prints correctly, then placed as
// one image on an A4 landscape PDF page. Nothing is sent anywhere.

/** A4 landscape at 200 dpi. */
const W = 2339;
const H = 1654;

const PAPER = '#fffaf0';
const INK = '#191919';
const MUTED = '#57534b';
const GREEN = '#a6d86f';
const DISPLAY = '"Archivo Variable", "Inter Tight Variable", sans-serif';
const BODY =
  '"Inter Tight Variable", -apple-system, "Apple SD Gothic Neo", sans-serif';
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace';

const COURSE = 'MSP ACRUX-II Engineer Onboarding';
/** Where the MSP mark sits in the poster file: x, y, width, height. */
const MARK_CROP = [25, 32, 322, 307] as const;
/** The mark's centre inside that crop: the average of its three tips,
 * measured from the file. The box's middle would sit too low, as the mark
 * is wide at the top and comes to a point at the bottom. */
const MARK_CENTRE = [160.3, 102.7] as const;

/** A file name from the person's name; letters in any script are kept. */
export function certificateFileName(name: string) {
  const slug = name
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return `CubSpace-certificate${slug ? `-${slug}` : ''}.pdf`;
}

export async function downloadCertificate(name: string, email: string) {
  await Promise.all([
    document.fonts.load(`800 40px ${DISPLAY}`),
    document.fonts.load(`600 40px ${BODY}`),
    document.fonts.load(`600 40px ${MONO}`),
  ]);
  const [wordmark, poster] = await Promise.all([
    loadImage(mspWordmark),
    loadImage(mspPoster),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is unavailable');
  draw(ctx, { name, email, date: new Date(), wordmark, poster });

  // Loaded only when someone downloads, so it never weighs on the page.
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.setProperties({ title: 'CubSpace certificate of completion' });
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 297, 210);
  pdf.save(certificateFileName(name));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

type Content = {
  name: string;
  email: string;
  date: Date;
  /** MSP wordmark, navy on white. */
  wordmark: HTMLImageElement;
  /** The poster file whose top holds the MSP mark. */
  poster: HTMLImageElement;
};

function draw(
  ctx: CanvasRenderingContext2D,
  { name, email, date, wordmark, poster }: Content,
) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  // Frame: a heavy outer rule, a hairline inside it and a square grip on each
  // corner, as the site draws its framed panels.
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(70, 70, W - 140, H - 140);
  ctx.lineWidth = 2;
  ctx.strokeRect(96, 96, W - 192, H - 192);
  ctx.fillStyle = INK;
  for (const [x, y] of [
    [70, 70],
    [W - 70, 70],
    [70, H - 70],
    [W - 70, H - 70],
  ])
    ctx.fillRect(x - 14, y - 14, 28, 28);

  // The MSP mark in the middle, faint, like a stamp under the text: the mark
  // inside two rings.
  const mid = W / 2;
  const centreY = H / 2 + 60;
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = 'multiply';
  const [sx, sy, sw, sh] = MARK_CROP;
  const scale = 760 / sw;
  // The mark's own centre on the rings' centre.
  ctx.drawImage(
    poster,
    sx,
    sy,
    sw,
    sh,
    mid - MARK_CENTRE[0] * scale,
    centreY - MARK_CENTRE[1] * scale,
    sw * scale,
    sh * scale,
  );
  ctx.strokeStyle = '#0b3b6b';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(mid, centreY, 540, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(mid, centreY, 510, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Top left: the Melbourne Space Program wordmark. Multiply drops its white
  // ground into the paper.
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const wordH = 104;
  ctx.drawImage(
    wordmark,
    170,
    150,
    (wordmark.width / wordmark.height) * wordH,
    wordH,
  );
  ctx.restore();
  text(ctx, 'MSP · ACRUX-II', W - 170, 232, `600 34px ${MONO}`, MUTED, 'right');

  text(
    ctx,
    'CERTIFICATE OF COMPLETION',
    mid,
    520,
    `800 96px ${DISPLAY}`,
    INK,
    'center',
    true,
  );
  ctx.fillStyle = GREEN;
  ctx.fillRect(mid - 140, 570, 280, 12);

  text(ctx, 'This certifies that', mid, 700, `500 46px ${BODY}`, MUTED);
  // The name, shrunk to fit the frame when it is long.
  let size = 132;
  do {
    ctx.font = `800 ${size}px ${DISPLAY}`;
    size -= 4;
  } while (ctx.measureText(name).width > W - 520 && size > 48);
  text(ctx, name, mid, 870, ctx.font, INK);
  text(ctx, email, mid, 950, `500 40px ${BODY}`, MUTED);

  text(ctx, `has completed the ${COURSE},`, mid, 1080, `600 50px ${BODY}`, INK);
  text(
    ctx,
    'including the CubeSat mission and subsystems knowledge check, all answers correct.',
    mid,
    1150,
    `500 40px ${BODY}`,
    MUTED,
  );

  // Footer: date on the left, issuer on the right, each over a rule.
  const issued = date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.fillStyle = INK;
  ctx.fillRect(220, 1400, 560, 3);
  ctx.fillRect(W - 780, 1400, 560, 3);
  text(ctx, issued, 500, 1380, `700 44px ${BODY}`, INK);
  text(ctx, 'DATE', 500, 1460, `600 30px ${MONO}`, MUTED);
  text(ctx, 'CubSpace', W - 500, 1380, `800 48px ${DISPLAY}`, INK);
  text(ctx, 'ISSUED BY', W - 500, 1460, `600 30px ${MONO}`, MUTED);
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  font: string,
  colour: string,
  align: CanvasTextAlign = 'center',
  wide = false,
) {
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  // The site's display face is set wide; canvas can do the same where the
  // browser supports it.
  if ('fontStretch' in ctx) ctx.fontStretch = wide ? 'expanded' : 'normal';
  ctx.fillText(value, x, y);
}
