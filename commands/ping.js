// ping.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        try {
            await interaction.channel.send(`${interaction.user} Pong!`);
        } catch (error) {
            console.error('Error executing ping command:', error);
            await interaction.reply({
                content: 'There was an error executing this command.',
                ephemeral: true,
            });
        }
    },
};
