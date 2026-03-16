const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const fontDir = path.join(__dirname, 'assets', 'font');
const cacheDir = path.join(__dirname, 'cache');

try {
    if (fs.existsSync(path.join(fontDir, 'NotoSans-Bold.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-Bold.ttf'), { family: 'NotoSans', weight: 'bold' });
    }
    if (fs.existsSync(path.join(fontDir, 'NotoSans-SemiBold.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-SemiBold.ttf'), { family: 'NotoSans', weight: '600' });
    }
    if (fs.existsSync(path.join(fontDir, 'NotoSans-Regular.ttf'))) {
        registerFont(path.join(fontDir, 'NotoSans-Regular.ttf'), { family: 'NotoSans', weight: 'normal' });
    }
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-Bold.ttf'))) {
        registerFont(path.join(fontDir, 'BeVietnamPro-Bold.ttf'), { family: 'BeVietnamPro', weight: 'bold' });
    }
    if (fs.existsSync(path.join(fontDir, 'BeVietnamPro-SemiBold.ttf'))) {
        registerFont(path.join(fontDir, 'BeVietnamPro-SemiBold.ttf'), { family: 'BeVietnamPro', weight: '600' });
    }
} catch (e) {
    console.log("BalanceCard: Using fallback fonts");
}

const CURRENCY_SYMBOL = "$";

function formatMoney(amount) {
    return amount.toLocaleString("en-US");
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function getProfilePicture(uid) {
    try {
        const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const response = await axios.get(avatarURL, { responseType: 'arraybuffer', timeout: 10000 });
        return await loadImage(Buffer.from(response.data));
    } catch (error) {
        console.error("Failed to fetch profile picture:", error.message);
        return null;
    }
}

function drawDefaultAvatar(ctx, x, y, size) {
    const gradient = ctx.createRadialGradient(x + size/2, y + size/2, 0, x + size/2, y + size/2, size/2);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(1, '#16a34a');
    
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2 - 10, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(x + size/2, y + size/2 + 45, 40, 30, 0, Math.PI, 0, true);
    ctx.fill();
}

async function createBalanceCard(userData, userID, balance) {
    const width = 950;
    const height = 520;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a0f0d');
    gradient.addColorStop(0.3, '#0d1f17');
    gradient.addColorStop(0.6, '#0f2a1d');
    gradient.addColorStop(1, '#0a0f0d');
    
    drawRoundedRect(ctx, 0, 0, width, height, 25);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5 + 0.3;
        const opacity = Math.random() * 0.3 + 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.03)';
    ctx.lineWidth = 1;
    for (let i = -height; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 12, 12, width - 24, height - 24, 20);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 20, 20, width - 40, height - 40, 16);
    ctx.stroke();

    const glowGradient = ctx.createLinearGradient(0, 0, 350, 0);
    glowGradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
    glowGradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, 350, height);

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.shadowColor = 'rgba(34
