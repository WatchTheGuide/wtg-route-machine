const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Check if Path2D is available globally or needs polyfill
// In node-canvas, Path2D might not be available directly depending on version.
// But let's try to use it. If it fails, we might need another approach.
// However, for simple paths, we can just use the SVG path string if the context supports it?
// No, context doesn't support SVG path strings directly in standard API without Path2D.

const sizes = [1024, 512, 384, 256, 192, 180, 152, 144, 128, 120, 96, 72, 48];
const outputDir = path.join(__dirname, '../assets/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ff6600';
    const cornerRadius = size * 0.225;

    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(size - cornerRadius, 0);
    ctx.quadraticCurveTo(size, 0, size, cornerRadius);
    ctx.lineTo(size, size - cornerRadius);
    ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
    ctx.lineTo(cornerRadius, size);
    ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();

    // Icon
    const ratio = size / 1024;
    const baseScale = 35;
    const scale = baseScale * ratio;

    // Center X: 512 - (12 * 35) = 92
    // Center Y: 100
    const baseOffsetX = 512 - 12 * baseScale;
    const baseOffsetY = 100;

    const offsetX = baseOffsetX * ratio;
    const offsetY = baseOffsetY * ratio;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Pin Path: M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0
    // We need to draw this manually if Path2D is not available.
    // But let's try to simulate it or use a simplified version if needed.
    // Actually, node-canvas usually doesn't support Path2D constructor with SVG string in older versions.
    // Let's try to implement the path commands manually for this specific icon.

    // Pin:
    // M 20 10
    // c 0 4.993 -5.539 10.193 -7.399 11.799
    // a 1 1 0 0 1 -1.202 0
    // C 9.539 20.193 4 14.993 4 10
    // a 8 8 0 0 1 16 0

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.bezierCurveTo(20, 14.993, 14.461, 20.193, 12.601, 21.799);
    // a 1 1 0 0 1 -1.202 0  -> arc
    // This is a small arc at the tip.
    // Start point: 12.601, 21.799
    // End point: 11.399, 21.799 (approx)
    // Radius 1, x-axis-rotation 0, large-arc 0, sweep 1
    // We can approximate or use arcTo?
    // Let's just use lineTo for the tip or a small curve.
    ctx.bezierCurveTo(12.4, 22, 11.6, 22, 11.399, 21.799);

    // C 9.539 20.193 4 14.993 4 10
    ctx.bezierCurveTo(9.539, 20.193, 4, 14.993, 4, 10);

    // a 8 8 0 0 1 16 0 -> circle arc
    // Center 12, 10, radius 8?
    // M 20 10 is start. 4 10 is end of previous segment.
    // Arc from 4,10 to 20,10.
    // 8 8 0 0 1 16 0 means rx=8 ry=8 rot=0 large=0 sweep=1 dx=16 dy=0
    // So from x=4 to x=20 is +16.
    // This is a semi-circle? No, full circle?
    // 4 to 20 is diameter 16. Radius 8.
    // Yes, it's the top half of the circle.
    ctx.arc(12, 10, 8, Math.PI, 0); // From PI (left) to 0 (right)

    ctx.fill();

    // Checkmark
    // M9 10l2 2 4-4
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(9, 10);
    ctx.lineTo(11, 12);
    ctx.lineTo(15, 8);
    ctx.stroke();

    ctx.restore();

    const buffer = canvas.toBuffer('image/png');
    const filename = `icon-${size}.png`;
    fs.writeFileSync(path.join(outputDir, filename), buffer);
    console.log(`Generated ${filename}`);
  }
}

generateIcons().catch(console.error);
