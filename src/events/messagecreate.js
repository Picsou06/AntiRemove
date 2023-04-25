const path = require('path');
const { Event } = require("sheweny");

const config = require(path.join(__dirname, "..", "..", 'config.json'));

module.exports = class  extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Surveillance des pseudos lors de la création d'un message",
      once: false,
    });
  }
  execute(message) {
    if (!message.author.bot && config.LIST_OF_CHANNELS.includes(message.channelId) && message.guild?.id === config.SERVER_ID) {
      // Récupère le contenu du message
      const content = message.content.trim();
       //Vérifie si le contenu est un pseudo Minecraft
      const minecraftUsername = content.replace(/^@/, '');
      const minecraftProfile = fetch(config.MINECRAFT_API_URL + minecraftUsername)
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
        // Créer un nouveau message avec le même pseudo et photo de profil
        const newMessage = {
          content: content,
          avatarURL: message.author.avatarURL(),
          username: message.author.username,
        };
  
        // Supprime le message d'origine
        message.delete();
  
        // Envoie le nouveau message avec le webhook
        const webhookPayload = {
          username: newMessage.username,
          avatar_url: newMessage.avatarURL,
          content: newMessage.content
        };
        fetch(config.WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookPayload)
        });
  
        console.log(`Message remplacé : "${content}"`);
      }
    }
  }
};
