const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// Command: /push
module.exports = {
    data: new SlashCommandBuilder()
        .setName('push')
        .setDescription('Handles commit pushes')
        .addStringOption((option) =>
            option
                .setName('title')
                .setDescription('Title of the commit')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('description')
                .setDescription('Description of the commit')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('img')
                .setDescription('Optional image URL')
                .setRequired(false)
        ),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const imgUrl = interaction.options.getString('img') || null;

        // Send success message privately to the user
        await interaction.user.send({
            content: `${interaction.user}, your commit has been successfully made!`,
            embeds: [
                new MessageEmbed()
                    .setAuthor(
                        interaction.user.username,
                        interaction.user.displayAvatarURL()
                    )
                    .setTitle(title)
                    .setDescription(description)
                    .setImage(imgUrl ? imgUrl : null)
                    .setFooter(`Push by: ${interaction.user.tag}`)
                    .setColor('#3498db'),
            ],
        });

        // Send preview to the configured commit channel
        const channel = interaction.client.channels.cache.get(
            interaction.client.channelsConfig.commitChannel
        );
        if (channel) {
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setAuthor(
                            interaction.user.username,
                            interaction.user.displayAvatarURL()
                        )
                        .setTitle(title)
                        .setDescription(description)
                        .setImage(imgUrl ? imgUrl : null)
                        .setFooter(`Push by: ${interaction.user.tag}`)
                        .setColor('#3498db'),
                ],
            });
        }

        // Acknowledge the slash command with a response
        await interaction.reply('Commit made successfully!');
    },
};
