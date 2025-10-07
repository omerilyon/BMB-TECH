const { zokou } = require('../framework/zokou');
const { default: axios } = require('axios');
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

zokou(
  {
    nomCom: "gpt",
    reaction: "🤖",
    categorie: "ai"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;

    try {
      if (!arg || arg.length === 0) {
        return repondre("🤖 *Hello!*\nWhat question would you like to ask me?");
      }

      const prompt = arg.join(' ');

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const replyText = response.data?.choices?.[0]?.message?.content?.trim();
      if (!replyText) return repondre("⚠️ No valid response from the model.");

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: replyText
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🤖 *Powered by 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "💡 GPT Result",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: []
              })
            })
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });

    } catch (error) {
      console.error("❌ GPT Error:", error.message);
      return repondre("🚫 Sorry, I couldn't fetch the response. Please try again later.");
    }
  }
);