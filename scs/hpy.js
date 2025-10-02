
const { bmbtz} = require('../devbmb/bmbtz');
const axios = require('axios');
const wiki = require('wikipedia');
const conf = require(__dirname + "/../settings");

bmbtz({
  nomCom: "fact",
  reaction: '✌️',
  categorie: "Conversion"
}, async (dest, zk, context) => {
  const { repondre: respond, arg, ms } = context;

  try {
    const response = await axios.get("https://nekos.life/api/v2/fact");
    const data = response.data;
    const factMessage = `
┏━━━━ *𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛-FACT* ━━━━━◆                     
┃
┃   *◇* ${data.fact} 
┃
┃   *◇* Regards *𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛*
┃      
 ╭────────────────◆
 │ *_Powered by 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷._*
 ╰─────────────────◆
    `;

    await zk.sendMessage(dest, {
      text: factMessage,
      contextInfo: {
        forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363382023564830@newsletter',
              newsletterName: '𝙱.𝙼.𝙱-𝚇𝙼𝙳',
              serverMessageId: 143},
        externalAdReply: {
          
          title: "Fun Fact",
          body: "Here's a fun fact to enlighten your day!",
          thumbnailUrl: conf.URL,
          sourceUrl: conf.GURL,
          mediaType: 1,
          
        }
      }
    }, { quoted: ms });
  } catch (error) {
    console.error(error);
    await respond("An error occurred while fetching the fact.");
  }
});

bmbtz({
  nomCom: "github",
  aliases: ["git"],
  reaction: '💻',
  categorie: "Search"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const githubUsername = arg.join(" ");

  if (!githubUsername) {
    return repondre("Give me a valid GitHub username like: github Toputech");
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${githubUsername}`);
    const data = response.data;

    if (data.message === "Not Found") {
      return repondre(`User ${githubUsername} not found.`);
    }

    const thumb = data.avatar_url; // Using the avatar_url as the thumbnail

    const githubMessage = `
°GITHUB USER INFO°
🚩 Id: ${data.id}
🔖 Name: ${data.name}
🔖 Username: ${data.login}
✨ Bio: ${data.bio}
🏢 Company: ${data.company}
📍 Location: ${data.location}
📧 Email: ${data.email || "Not provided"}
📰 Blog: ${data.blog || "Not provided"}
🔓 Public Repos: ${data.public_repos}
🔐 Public Gists: ${data.public_gists}
👪 Followers: ${data.followers}
🫶 Following: ${data.following}
`;

    await zk.sendMessage(dest, {
      text: githubMessage,
      contextInfo: {
        forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363382023564830@newsletter',
              newsletterName: '𝙱.𝙼.𝙱-𝚇𝙼𝙳',
              serverMessageId: 143},
        externalAdReply: {
          title: "𝙱.𝙼.𝙱-𝚇𝙼𝙳 GITHUB USER INFO",
          body: `Information about ${data.login}`,
          mediaType: 1,
          thumbnailUrl: thumb,
          sourceUrl: conf.GURL,
        
        },
      },
    }, { quoted: ms });

  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    await repondre("An error occurred while fetching GitHub user data.");
  }
});
      
