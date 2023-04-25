const path = require('path');
const { Event } = require("sheweny");
const fs = require("fs");

module.exports = class  extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Surveillance des pseudos lors de la création d'un message",
      once: false,
    });
  }
  async execute(message) {
    const configFile = "./config.json"; // Chemin du fichier config.json
    let config = {}; // Crée un objet vide

    // Lit le contenu du fichier config.json
    try {
      const data = await fs.promises.readFile(configFile);
      config = JSON.parse(data.toString());
    } catch (err) {
      console.error(err);
      return message.reply({ content: "Une erreur est survenue", ephemeral: true });
    }

    // Vérifie si la liste existe déjà dans le fichier config.json, sinon la crée
    if (!config.LIST_OF_CHANNELS) {
      config.LIST_OF_CHANNELS = [];
    }

    if (!message.author.bot && config.LIST_OF_CHANNELS.includes(message.channelId) && message.guild?.id === config.SERVER_ID) {
      // Récupère le contenu du message
      const content = message.content.trim();
       //Vérifie si le contenu est un pseudo Minecraft
      const minecraftUsername = content.replace(/^@/, '',);
      const minecraftProfile = await fetch(config.MINECRAFT_API_URL + minecraftUsername)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Le profil Minecraft n'existe pas");
          }
        })
        .catch(() => null);
      if (!minecraftProfile) {
        message.delete();
        console.log(`Message supprimé : "${content}"`);
      } else {
        // Supprime le message d'origine
        message.delete();

        try {
          const webhooks = await message.channel.fetchWebhooks();
          const webhook = webhooks.find(wh => wh.token);
      
          if (!webhook) {
            return console.log('No webhook was found that I can use!');
          }
          await webhook.send({
            content: content,
            username: message.author.username,
            avatarURL: message.author.avatarURL(),
          });
        } catch (error) {
          console.error('Error trying to send a message: ', error);
        }
      }
        console.log(`Message remplacé : "${content}"`);
      }
    }
  }