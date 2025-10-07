const os = require("os");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");

// Contact message for verified context
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255772341432\nEND:VCARD"
    }
  }
};

zokou(
  {
    nomCom: "ping",
    categorie: "General",
    reaction: "🟢",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    try {
      const start = Date.now();
      const usedRAM = format(os.totalmem() - os.freemem());
      const totalRAM = format(os.totalmem());
      const uptime = process.uptime(); // in seconds

      moment.tz.setDefault("EAT");
      const time = moment().format("HH:mm:ss");

      const formattedUptime = () => {
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        return `${h}h ${m}m ${s}s`;
      };

      const end = Date.now();
      const pingTime = end - start;

      const responseText = `
╭═〔 🛰 *SYSTEM PING STATUS* 〕═╮
│
│ 🏓 *Ping:* ${pingTime}ms
│ ⏰ *Time:* ${time} (EAT)
│ ⌚ *Uptime:* ${formattedUptime()}
│ 🖥️ *RAM:* ${usedRAM} / ${totalRAM}
│
╰═▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃═╯
`;

      await zk.sendMessage(
        dest,
        {
          text: responseText,
          contextInfo: {
            mentionedJid: [ms.key.participant || ms.key.remoteJid],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363382023564830@newsletter",
              newsletterName: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛",
              serverMessageId: 145,
            },
          },
        },
        { quoted: quotedContact }
      );
    } catch (e) {
      console.error("Error in ping command:", e);
      repondre(`An error occurred: ${e.message}`);
    }
  }
);
