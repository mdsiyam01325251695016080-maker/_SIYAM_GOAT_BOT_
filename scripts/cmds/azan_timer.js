const moment = require("moment-timezone");

// 🔒 AUTHOR LOCK
const AUTHOR = "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ";

module.exports.config = {
  name: "azan_timer",
  version: "5.1",
  role: 0,
  author: AUTHOR,
  description: "🕌 আযানের সময় অনুযায়ী ভিডিওসহ অটো মেসেজ পাঠাবে, র্যান্ডম দোয়া সহ (স্ট্রিম ভিডিও) [Update 5.1]",
  category: "AutoTime",
  countDown: 3,
};

// Author verification
if (module.exports.config.author !== AUTHOR) {
  console.log("❌ Author changed! Bot disabled.");
  return;
}

// ডোয়া লিস্ট
const duas = [
  "🤲 اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي\nহে আল্লাহ, আমাকে ক্ষমা করুন ও দয়া করুন",
  "🤲 رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন",
  "🤲 اللّهُمَّ اهْدِنِي الصِّرَاطَ الْمُسْتَقِيمَ\nহে আল্লাহ, আমাকে সরল পথে পরিচালিত করুন",
  "🤲 رَبَّنَا تَقَبَّلْ مِنَّا\nহে আমাদের রব, আমাদের আমল কবুল করুন",
  "🤲 اللّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا\nহে আল্লাহ, আমাকে হালাল রিযিক দান করুন"
];

function getRandomDua() {
  return duas[Math.floor(Math.random() * duas.length)];
}

// আযানের সময় এবং ভিডিও ডেটা
const azanData = {
  "04:50:00 AM": { message: "🌅 ফজরের আযান! দিনের শুরু আলোর সাথে করো 🕌", video: "https://files.catbox.moe/gr8zqw.mp4" },
  "01:00:00 PM": { message: "🕌 যোহরের আযান! নামাজে যোগ দাও ✨", video: "https://files.catbox.moe/gr8zqw.mp4" },
  "04:50:00 PM": { message: "🌇 আসরের আযান! শান্তি আর ভাবনায় সময় দাও 🕌", video: "https://files.catbox.moe/gr8zqw.mp4" },
  "06:10:00 PM": { message: "🌆 মাগরিবের আযান! সূর্য অস্ত যাচ্ছে, নামাজ পড়ো 🕌", video: "https://files.catbox.moe/gr8zqw.mp4" },
  "07:50:00 PM": { message: "🌃 এশার আযান! রাতের শান্তি উপভোগ করো 🕌", video: "https://files.catbox.moe/gr8zqw.mp4" }
};

module.exports.onLoad = async function ({ api }) {
  console.log("✅ Azan Timer 5.1 Loaded — আযানের সময় চেক শুরু হয়েছে...");

  const checkAzanAndSend = async () => {
    const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
    const azanInfo = azanData[now];

    if (!azanInfo) return;

    const timeFormatted = moment().tz("Asia/Dhaka").format("hh:mm A");
    const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
    const randomDua = getRandomDua();

    const finalMessage =
`◢◤━━━━━━━━━━━━━━━━◥◣
📅>ᴅᴀᴛᴇ: ${todayDate}
🕒>ᴛɪᴍᴇ: ${timeFormatted}  
${azanInfo.message}
━━━━━━━━━━━━━━━━━━

📿 দোয়া:
${randomDua}

━━━━━━━━━━━━━━━━━━
🤖[ʙᴏᴛ ᴏᴡɴᴇʀ:-${AUTHOR}]🤖
🤲(সবাই নামাজ আদায় করুন)🤲
◥◣━━━━━━━━━━━━━━━━◢◤`;

    try {
      const allThreads = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = allThreads.filter(t => t.isGroup);

      console.log(`🕒 ${now} → ${groupThreads.length} গ্রুপে আযানের বার্তা পাঠানো হচ্ছে...`);

      for (const thread of groupThreads) {
        try {
          await api.sendMessage({ body: finalMessage, attachment: azanInfo.video }, thread.threadID);
        } catch (err) {
          console.error(`❌ গ্রুপ ${thread.threadID} পাঠানো যায়নি:`, err.message);
        }
      }

      console.log("✅ সফলভাবে সব গ্রুপে আযানের বার্তা পাঠানো হয়েছে!");
    } catch (err) {
      console.error("❌ Azan Timer General Error:", err);
    }
  };

  setInterval(checkAzanAndSend, 1000);
};

module.exports.onStart = () => {};
