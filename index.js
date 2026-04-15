/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code == 2) {
			log.info("Restarting Project...");
			startProject();
		}
	});
}

startProject();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(3000, () => {
  console.log('Uptime server running on port 3000');
});
const config = require("./config.json");

const OWNER_UID = "61573366160918";

// 🔒 OWNER LOCK
if (config.security.enableOwnerLock) {
  if (config.security.ownerUID !== OWNER_UID) {
    console.error("❌ OWNER UID CHANGED! BOT STOPPED.");
    process.exit(1);
  }
}

// 👑 OWNER BYPASS (এটাই আসল)
global.hasPermission = function (uid) {

  // 👑 OWNER ALWAYS ALLOWED
  if (uid == OWNER_UID) return true;

  // 🟢 ADMIN
  if (config.adminBot.includes(uid)) return true;

  return false;
};
