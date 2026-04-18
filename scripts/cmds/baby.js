const axios = require("axios");

const mahmud = [
        "বট",
        "@নি্ঁঝু্ঁম্ঁ রা্ঁতে্ঁর্ঁ প্ঁরী্ঁ",
        "siyam",
        "baby",
        "bby",
        "নিঝুম",
        "bbu",
        "jan",
        "সিয়াম বট",
        "জান",
        "জানু",
        "বেবি",
        "Nijhum",
        "Nijhum"
       ];

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "hinata",
                aliases: ["baby", "bby", "bbu", "jan", "janu", "Nijhum", "siyam Bot"],
                version: "1.8",
                author: "亗 SIYAM HASAN 亗",
                countDown: 2,
                role: 0,
                description: {
                        bn: "হিনাতা এআই এর সাথে চ্যাট করুন এবং তাকে নতুন কিছু শেখান",
                        en: "Chat with Hinata AI and teach her new things",
                        vi: "Trò chuyện with Hinata AI and teach her new things"
                },
                category: "chat",
                guide: {
                        bn: '   {pn} [মেসেজ] - চ্যাট করতে\n   {pn} teach [প্রশ্ন] - [উত্তর] - শেখাতে\n   {pn} msg [প্রশ্ন] - উত্তর খুঁজতে\n   {pn} edit [প্রশ্ন] - [নতুন উত্তর] - এডিট করতে\n   {pn} remove [প্রশ্ন] - [ইনডেক্স] - ডিলিট করতে\n   {pn} list/list all - টিচার লিস্ট দেখতে',
                        en: '   {pn} [msg] - to chat\n   {pn} teach [q] - [a] - to teach\n   {pn} msg [q] - search reply\n   {pn} edit [q] - [new_a] - to edit\n   {pn} remove [q] - [index] - to remove\n   {pn} list/list all - to see teachers',
                        vi: '   {pn} [tn] - để trò chuyện\n   {pn} teach [h] - [tl] - để dạy\n   {pn} msg [h] - tìm kiếm câu trả lời\n   {pn} edit [h] - [tl_mới] - để sửa\n   {pn} remove [h] - [số] - để xóa\n   {pn} list/list all - để xem danh sách'
                }
        },

        langs: {
                bn: {
                        noInput: "বলো বেবি😘",
                        teachUsage: "❌ | সঠিক নিয়ম: teach [প্রশ্ন] - [উত্তর]",
                        teachSuccess: "✅ উত্তর যুক্ত হয়েছে: \"%1\" -> \"%2\"\n• টিচার: %3\n• মোট ডাটা: %4",
                        removeUsage: "❌ | সঠিক নিয়ম: remove [প্রশ্ন] - [ইনডেক্স]",
                        editUsage: "❌ | সঠিক নিয়ম: edit [প্রশ্ন] - [নতুন উত্তর]",
                        editSuccess: "✅ সফলভাবে এডিট করা হয়েছে!\n• প্রশ্ন: \"%1\"\n• নতুন উত্তর: \"%2\"",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact 亗 SIYAM HASAN 亗।"
                },
                en: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Format: teach [question] - [answer]",
                        teachSuccess: "✅ Reply added: \"%1\" -> \"%2\"\n• Teacher: %3\n• Total: %4",
                        removeUsage: "❌ | Format: remove [question] - [index]",
                        editUsage: "❌ | Format: edit [question] - [new answer]",
                        editSuccess: "✅ Successfully edited!\n• Q: \"%1\"\n• New A: \"%2\"",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Định dạng: teach [câu hỏi] - [câu trả lời]",
                        teachSuccess: "✅ Đã thêm câu trả lời: \"%1\" -> \"%2\"\n• Giáo viên: %3\n• Tổng số: %4",
                        removeUsage: "❌ | Định dạng: remove [câu hỏi] - [số]",
                        editUsage: "❌ | Định dạng: edit [câu hỏi] - [câu trả lời mới]",
                        editSuccess: "✅ Đã sửa thành công!\n• H: \"%1\"\n• TL mới: \"%2\"",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, usersData, getLang, commandName }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) return api.sendMessage("Unauthorized author change.", event.threadID);

                const uid = event.senderID;
                if (!args[0]) return api.sendMessage(getLang("noInput"), event.threadID, (err, info) => {
                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                }, event.messageID);

                try {
                        const baseUrl = await baseApiUrl();
                        const action = args[0].toLowerCase();

                        if (action === "teach") {
                                const input = args.slice(1).join(" ");
                                const [trigger, ...responsesArr] = input.split(" - ");
                                const responses = responsesArr.join(" - ");
                                if (!trigger || !responses) return api.sendMessage(getLang("teachUsage"), event.threadID, event.messageID);
                                const res = await axios.post(`${baseUrl}/api/jan/teach`, { trigger, responses, userID: uid });
                                const name = await usersData.getName(uid);
                                return api.sendMessage(getLang("teachSuccess", trigger, responses, name, res.data.count), event.threadID, event.messageID);
                        }

                        if (action === "edit") {
                                const input = args.slice(1).join(" ");
                                const [oldTrigger, ...newArr] = input.split(" - ");
                                const newResponse = newArr.join(" - ");
                                if (!oldTrigger || !newResponse) return api.sendMessage(getLang("editUsage"), event.threadID, event.messageID);
                                await axios.put(`${baseUrl}/api/jan/edit`, { oldTrigger, newResponse });
                                return api.sendMessage(getLang("editSuccess", oldTrigger, newResponse), event.threadID, event.messageID);
                        }

                        if (action === "remove") {
                                const input = args.slice(1).join(" ");
                                const [trigger, index] = input.split(" - ");
                                if (!trigger || !index || isNaN(index)) return api.sendMessage(getLang("removeUsage"), event.threadID, event.messageID);
                                const res = await axios.delete(`${baseUrl}/api/jan/remove`, { data: { trigger, index: parseInt(index) } });
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        if (action === "msg") {
                                const searchTrigger = args.slice(1).join(" ");
                                if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID);
                                try {
                                        const response = await axios.get(`${baseUrl}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
                                        return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
                                } catch (error) {
                                        const errorMessage = error.response?.data?.error || error.message || "error";
                                        return api.sendMessage(errorMessage, event.threadID, event.messageID);
                                }
                        }

                        if (action === "list") {
                                const endpoint = args[1] === "all" ? "/list/all" : "/list";
                                const res = await axios.get(`${baseUrl}/api/jan${endpoint}`);
                                if (args[1] === "all") {
                                        let message = "👑 List of Hinata Teachers:\n\n";
                                        const data = Object.entries(res.data.data).sort((a, b) => b[1] - a[1]).slice(0, 50);
                                        for (let i = 0; i < data.length; i++) {
                                                const [uID, count] = data[i];
                                                const name = await usersData.getName(uID) || "User";
                                                message += `${i + 1}. ${name}: ${count}\n`;
                                        }
                                        return api.sendMessage(message, event.threadID, event.messageID);
                                }
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: args.join(" "), style: 3, attachments: event.attachments || [] });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                        }, event.messageID);

                } catch (err) {
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        },

        onReply: async function ({ api, event, commandName }) {
                try {
                        const baseUrl = await baseApiUrl();
                        const res = await axios.post(`${baseUrl}/api/hinata`, { 
                                text: event.body?.toLowerCase() || "hi", 
                                style: 3, 
                                attachments: event.attachments || [] 
                        });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                        }, event.messageID);
                } catch (err) { console.error(err); }
        },

        onChat: async function ({ api, event, commandName }) {
                const message = event.body?.toLowerCase() || "";
                if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
                        api.setMessageReaction("🕊️", event.messageID, () => {}, true);
                        const randomReplies = [
                                [
"╔══✦💬✦══╗\n┃ 𝗛𝗼𝗽 𝗕𝗲𝗱𝗮😾,𝗕𝗼𝘀𝘀 বল 𝗕𝗼𝘀𝘀😼\n╚══✦💫✦══╝",

"╭───❖ 💬 ❖───╮\n┃ আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 \n╰───❖ 💫 ❖───╯",

"┏━━━✦💬✦━━━┓\n┃ 𝗡𝗮𝘄 𝗔𝗺𝗮𝗿 𝗕𝗼𝘀𝘀 𝗞 𝗠𝗲𝗮𝘀𝘀𝗮𝗴𝗲 𝗗𝗮𝘄 💙 Facebook Link: [https://www.facebook.com/profile.php?id=61568411310748] 🌐✨\n┗━━━✦💫✦━━━┛",

"╔═━━━💬━━━═╗\n┃ গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ\n╚═━━━💫━━━═╝",

"╭━━━✦💬✦━━━╮\n┃ বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏\n╰━━━✦💫✦━━━╯",

"┌──✦💬✦──┐\n┃ 𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘\n└──✦💫✦──┘",

"╔════💬════╗\n┃ এটায় দেখার বাকি সিলো_🙂🙂🙂\n╚════💫════╝",

"╭═💬═╮\n┃ 𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒\n╰═💫═╯",

"┏━💬━┓\n┃ 𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺\n┗━💫━┛",

"╔➤💬➤╗\n┃ বেশি 𝗕𝗯𝘆 𝗕𝗲𝗯𝘆 করলে 𝗟𝗲𝗮𝘃𝗲 নিবো কিন্তু 😒😒\n╚➤💫➤╝",

"╭➤💬➤╮\n┃ __বেশি বেবি বললে কামুর দিমু 🤭🤭\n╰➤💫➤╯",

"┏➤💬➤┓\n┃ 𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂\n┗➤💫➤┛",

"╔❖💬❖╗\n┃ আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀\n╚❖💫❖╝",

"╭❖💬❖╮\n┃ 𝗕𝗯𝘆 বললে চাকরি থাকবে না\n╰❖💫❖╯",

"┏❖💬❖┓\n┃ 𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, সিয়াম, সিয়াম ও তো করতে পারো😑?\n┗❖💫❖┛",

"╔═💬═╗\n┃ আমার সোনার বাংলা, তারপরে লাইন কি? 🙈\n╚═💫═╝",

"╭═💬═╮\n┃ 🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲\n╰═💫═╯",

"┏═💬═┓\n┃ হটাৎ আমাকে মনে পড়লো 🙄\n┗═💫═┛",

"╔✧💬✧╗\n┃ 𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿\n╚✧💫✧╝",

"╭✧💬✧╮\n┃ 𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤\n╰✧💫✧╯",

"┏✧💬✧┓\n┃ আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁\n┗✧💫✧┛",

"╔▣💬▣╗\n┃ খাওয়া দাওয়া করসো 🙄\n╚▣💫▣╝",

"╭▣💬▣╮\n┃ এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈\n╰▣💫▣╯",

"┏▣💬▣┓\n┃ আরে আমি মজা করার 𝗠𝗼𝗼𝗱 এ নাই😒\n┗▣💫▣┛",

"╔◆💬◆╗\n┃ 𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁\n╚◆💫◆╝",

"╭◆💬◆╮\n┃ আরে Bolo আমার জান, কেমন আসো? 😚\n╰◆💫◆╯",

"┏◆💬◆┓\n┃ একটা 𝗕𝗙 খুঁজে দাও 😿\n┗◆💫◆┛",

"╔⬤💬⬤╗\n┃ 𝗢𝗶 𝗠𝗮𝗺𝗮 𝗔𝗿 𝗗𝗮𝗸𝗶𝘀 𝗡𝗮 𝗣𝗶𝗹𝗶𝘇 😿\n╚⬤💫⬤╝",

"╭⬤💬⬤╮\n┃ 𝗔𝗺𝗮𝗿 𝗝𝗮𝗻𝘂 𝗟𝗮𝗴𝗯𝗲 𝗧𝘂𝗺𝗶 𝗞𝗶 𝗦𝗶𝗻𝗴𝗲𝗹 𝗔𝗰𝗵𝗼?\n╰⬤💫⬤╯",

"┏⬤💬⬤┓\n┃ আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺\n┗⬤💫⬤┛",

"╔◉💬◉╗\n┃ তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄\n╚◉💫◉╝",

"╭◉💬◉╮\n┃ আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄\n╰◉💫◉╯",

"┏◉💬◉┓\n┃ চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫\n┗◉💫◉┛",

"╔✿💬✿╗\n┃ আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে\n╚✿💫✿╝",

"╭✿💬✿╮\n┃ বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏\n╰✿💫✿╯",

"┏✿💬✿┓\n┃ ভুলে জাও আমাকে 😞😞\n┗✿💫✿┛",

"╔✪💬✪╗\n┃ দেখা হলে কাঠগোলাপ দিও..🤗\n╚✪💫✪╝",

"╭✪💬✪╮\n┃ শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺\n╰✪💫✪╯",

"┏✪💬✪┓\n┃ আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺\n┗✪💫✪┛",

"╔★💬★╗\n┃ বলো কি করতে পারি তোমার জন্য 😚\n╚★💫★╝",

"╭★💬★╮\n┃ কথা দেও আমাকে পটাবা...!! 😌\n╰★💫★╯",

"┏★💬★┓\n┃ বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋\n┗★💫★┛",

"╔☯💬☯╗\n┃ আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺\n╚☯💫☯╝",

"╭☯💬☯╮\n┃ বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒\n╰☯💫☯╯",

"┏☯💬☯┓\n┃ Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈\n┗☯💫☯┛",

"╔☀💬☀╗\n┃ আজকে আমার mন ভালো নেই 🙉\n╚☀💫☀╝",

"╭☀💬☀╮\n┃ আমি হাজারো মশার 𝗖𝗿𝘂𝘀𝗵😓\n╰☀💫☀╯",

"┏☀💬☀┓\n┃ ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣\n┗☀💫☀┛",

"╔⚡💬⚡╗\n┃ __ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌\n╚⚡💫⚡╝",

"╭⚡💬⚡╮\n┃ মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚\n╰⚡💫⚡╯"
]
                    
                        const msgParts = message.trim().split(/\s+/);
                        if (msgParts.length === 1 && event.attachments.length === 0) {
                                const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                                return api.sendMessage(reply, event.threadID, (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                }, event.messageID);
                        } else {
                                let userText = message;
                                for (const p of mahmud) { if (message.startsWith(p)) { userText = message.substring(p.length).trim(); break; } }
                                try {
                                        const baseUrl = await baseApiUrl();
                                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: userText, style: 3, attachments: event.attachments });
                                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                        }, event.messageID);
                                } catch (e) { console.error(e); }
                        }
                }
        }
};
