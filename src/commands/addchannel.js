const { Command } = require("sheweny");
const fs = require("fs");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "addchannel",
      description: "ajouter un channel de vérification de pseudo",
      type: "SLASH_COMMAND",
      category: "Misc",
      setDefaultMemberPermissions: "BanMembers",
      channel: "GUILD",
    });
  }

  async execute(interaction) {
    const channelId = interaction.channelId;
    const configFile = "./config.json";
    let config = {};

    interaction.channel.createWebhook({
      name: "Antiremove " + interaction.guild.channels.cache.get(channelId).name,
      avatar: 'https://i.imgur.com/mI8XcpG.jpg',
      reason: 'Anti remove pour le channel ' + interaction.guild.channels.cache.get(channelId).name
    })

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

    if (config.LIST_OF_CHANNELS.includes(channelId)) {
      return interaction.reply({ content: "Le channel est déjà dans la liste", ephemeral: true });
    }

    config.LIST_OF_CHANNELS.push(channelId);

    try {
      await fs.promises.writeFile(configFile, JSON.stringify(config, null, 2));
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: "Une erreur est survenue", ephemeral: true });
    }

    // Répond à l'interaction
    await interaction.reply({ content: "Le channel a bien été ajouté", ephemeral: true });
  }
};
