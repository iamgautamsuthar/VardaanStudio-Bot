const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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

        try {
            // await interaction.reply({
            //     content: `${interaction.user}, your commit has been successfully made!`,
            //     embeds: [
            //         new EmbedBuilder()
            //             .setAuthor({
            //                 name: interaction.user.username,
            //                 iconURL: interaction.user.displayAvatarURL(),
            //             })
            //             .setTitle(title)
            //             .setDescription(description)
            //             .setImage(imgUrl ? imgUrl : null)
            //             .setFooter({ text: `Push by: ${interaction.user.tag}` })
            //             .setColor('#3498db'),
            //     ],
            // });

            // solve Error [InteractionAlreadyReplied]: The reply to this interaction has already been sent or deferred.
            if (interaction.deferred) {
                await interaction.editReply({
                    content: `${interaction.user}, your commit has been successfully made!`,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setTitle(title)
                            .setDescription(description)
                            .setImage(imgUrl ? imgUrl : null)
                            .setFooter({
                                text: `Push by: ${interaction.user.tag}`,
                            })
                            .setColor('#3498db'),
                    ],
                });
                return;
            }

            if (interaction.replied) {
                await interaction.editReply({
                    content: `${interaction.user}, your commit has been successfully made!`,
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setTitle(title)
                            .setDescription(description)
                            .setImage(imgUrl ? imgUrl : null)
                            .setFooter({
                                text: `Push by: ${interaction.user.tag}`,
                            })
                            .setColor('#3498db'),
                    ],
                });
            }

            await interaction.reply(
                `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
            );

            // Send preview to the configured commit channel
            const channel = interaction.client.channels.cache.get(
                interaction.client.channelsConfig.commitChannel
            );
            if (channel) {
                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL(),
                            })
                            .setTitle(title)
                            .setDescription(description)
                            .setImage(imgUrl ? imgUrl : null)
                            .setFooter({
                                text: `Push by: ${interaction.user.tag}`,
                            })
                            .setColor('#3498db'),
                    ],
                });
            }
        } catch (error) {
            console.error('Error executing /push command:', error);
        }
    },
};
