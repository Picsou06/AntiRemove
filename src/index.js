const { ShewenyClient } = require("sheweny");
const fetch = require("node-fetch");
const config = require("../config.json");
const SERVER_ID = '939468612815687680'; // ID de votre serveur
const CHANNEL_ID = '1100112493784862720'; // ID du canal à surveiller
const MINECRAFT_API_URL = 'https://api.mojang.com/users/profiles/minecraft/';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1100184486441918484/iGOaF09-jPG6JFmvDj8Ecn_gTibDwNYkmiWUCrZxusq_qnh_53ot75IyJ0fhd5W60qB9'; // Remplacez WEBHOOK_ID et WEBHOOK_TOKEN par les valeurs de votre webhook

const client = new ShewenyClient({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      prefix: "!",
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
    modals: {
      directory: "./interactions/modals",
    },
    inhibitors: {
      directory: "./inhibitors",
    },
  },
  mode : "development", // Change to production for production bot
});

client.on('messageCreate', async message => {
  console.log("Test message")
  // Vérifie si le message provient du canal spécifié dans le serveur spécifié
  // message.channel.id === CHANNEL_ID && message.guild?.id === SERVER_ID
  if (!message.author.bot && message.channelId==CHANNEL_ID) {
    // Récupère le contenu du message
    const content = message.content.trim();
     //Vérifie si le contenu est un pseudo Minecraft
    const minecraftUsername = content.replace(/^@/, '');
    const minecraftProfile = await fetch(MINECRAFT_API_URL + minecraftUsername)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Le profil Minecraft n'existe pas");
        }
      })
      .catch(() => null);
    // Si le profil n'existe pas, supprime le message
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
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      });

      console.log(`Message remplacé : "${content}"`);
    }
  }
});

client.login(config.DISCORD_TOKEN);
