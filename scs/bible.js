
const { zokou } = require('../framework/zokou');
const axios = require('axios');
const wiki = require('wikipedia');
const conf = require(__dirname + "/../set");

zokou({
  nomCom: "bible",
  reaction: '📖',
  categorie: "Mods"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const reference = arg.join(" ");
  
  if (!reference) {
    return repondre("Please specify the book, chapter, and verse you want to read. Example: bible Mathew 3:16", {
      contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363382023564830@newsletter',
         newsletterName: "Bmb Tech",
         serverMessageId: 143,
        },
      },
    });
  }
  
  try {
    const response = await axios.get(`https://bible-api.com/${reference}`);
    
    if (!response.data) {
      return repondre("Invalid reference. Example: bible john 3:16", {
        contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363382023564830@newsletter',
         newsletterName: "Bmb Tech",
         serverMessageId: 143,
          },
        },
      });
    }
    
    const data = response.data;
    const messageText = `
> *BIBLE HOLY BIBLE*

> WE'RE READING: ${data.reference}

> NUMBER OF VERSES: ${data.verses.length}

> NOW READ: ${data.text}

> LANGUAGE: ${data.translation_name}
 `;
    
    await zk.sendMessage(dest, {
      text: messageText,
      contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363382023564830@newsletter',
         newsletterName: "Bmb Tech",
         serverMessageId: 143,
        },
      },
    }, { quoted: ms });
    
  } catch (error) {
    console.error("Error fetching Bible passage:", error);
    await repondre("An error occurred while fetching the Bible passage. Please try again later.", {
      contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363382023564830@newsletter',
         newsletterName: " Bmb Tech",
         serverMessageId: 143,
        },
      },
    });
  }
});
