const { Command } = require("sheweny");
const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "listofchannel",
      description: "Liste des channels qui vérifie les pseudos minecraft",
      type: "SLASH_COMMAND",
      category: "Misc",
      channel: "GUILD",
    });
  }

  async execute(interaction) {
    const configFile = "./config.json"; // Chemin du fichier config.json
    let config = {}; // Crée un objet vide

    // Lit le contenu du fichier config.json
    try {
      const data = await fs.promises.readFile(configFile);
      config = JSON.parse(data.toString());
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Une erreur est survenue", ephemeral: true });
    }

    // Vérifie si la liste existe déjà dans le fichier config.json, sinon la crée
    if (!config.LIST_OF_CHANNELS) {
      config.LIST_OF_CHANNELS = [];
    }

    // Crée un tableau de noms de channels à partir des IDs de channels enregistrés
    const channelNames = config.LIST_OF_CHANNELS.map((id) => {
      const channel = interaction.guild.channels.cache.get(id);
      if (!channel) {
        // Supprime l'ID du channel de la liste s'il n'est pas trouvé
        const index = config.LIST_OF_CHANNELS.indexOf(id);
        if (index !== -1) {
          config.LIST_OF_CHANNELS.splice(index, 1);
          fs.writeFileSync(configFile, JSON.stringify(config));
        }
      }
      return channel.name;
    });

    // Répond à l'interaction avec la liste des noms de channels
    await interaction.reply({ content: `Liste des channels : ${channelNames.join(", ")}`, ephemeral: true });
  }
};
