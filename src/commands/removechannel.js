const { Command } = require("sheweny");
const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "removechannel",
      description: "Enlever le channel de la vérification pseudo",
      type: "SLASH_COMMAND",
      category: "Misc",
      channel: "GUILD",
    });
  }

  async execute(interaction) {
    const channelId = interaction.channelId;
    const configFile = "./config.json";
    let config = {};

    try {
      const data = await fs.promises.readFile(configFile);
      config = JSON.parse(data.toString());
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Une erreur est survenue", ephemeral: true });
    }

    if (!config.LIST_OF_CHANNELS) {
      config.LIST_OF_CHANNELS = [];
    }

    config.LIST_OF_CHANNELS = config.LIST_OF_CHANNELS.filter((id) => id !== channelId);

    try {
      await fs.promises.writeFile(configFile, JSON.stringify(config, null, 2));
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Une erreur est survenue", ephemeral: true });
    }

    await interaction.reply({ content: "Le channel a bien été enlevé", ephemeral: true });
  }
};
