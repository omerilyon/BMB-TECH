const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

// Contact verify
const verifiedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "BMB TECH",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:BMB-TECH\nORG:BMB-TECH;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD`
    }
  }
};

bmbtz({
  nomCom: "lyrics",
  reaction: '🎵',
  categorie: "Music",
  aliases: ["lyric", "mistari"]
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const songName = arg.join(" ").trim();

  if (!songName) {
    return repondre("🎶 Please provide a song name.\n📌 Example: *.lyrics Shape of You*");
  }

  // API endpoints
  const apis = [
    `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(songName)}`,
    `https://some-random-api.com/others/lyrics?title=${encodeURIComponent(songName)}`,
    `https://api.davidcyriltech.my.id/lyrics?title=${encodeURIComponent(songName)}`
  ];

  let lyricsData;
  for (const api of apis) {
    try {
      const response = await axios.get(api);
      if (response.data?.result?.lyrics) {
        lyricsData = response.data;
        break;
      }
    } catch (error) {
      console.error(`API ${api} failed:`, error.message);
    }
  }

  if (!lyricsData?.result) {
    return repondre("❌ Couldn't find lyrics for *" + songName + "*");
  }

  const { title, artist, thumb, lyrics } = lyricsData.result;
  const imageUrl = thumb || "https://files.catbox.moe/7kc76s.jpg"; // fallback image

  try {
    // Download album art
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Ki-box ya lyrics
    const boxLyrics = 
`╭───────────────◆
│ 🎶 *${title}* 
│ 👤 Artist: ${artist}
│────────────────
${lyrics.substring(0, 1500)}  
╰───────────────◆
> 📌 Powered by *BMB TECH*`;

    await zk.sendMessage(dest, {
      image: Buffer.from(imageResponse.data),
      caption: boxLyrics,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "BMB XMD Updates",
          serverMessageId: 50
        },
        externalAdReply: {
          title: "Bmb Tech Lyrics Finder",
          body: "Get any song lyrics instantly 🎶",
          thumbnail: Buffer.from(imageResponse.data),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: verifiedContact });

  } catch (error) {
    console.error("Error sending lyrics:", error);
    repondre(`🎶 *${title}* - ${artist}\n\n${lyrics.substring(0, 2000)}...\n\n*[Truncated - image failed to load]*`);
  }
});
