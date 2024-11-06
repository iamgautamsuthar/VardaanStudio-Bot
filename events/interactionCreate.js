module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        // Check if the interaction is a slash command
        const { commandName } = interaction;

        // Handle the /push command
        if (commandName === 'push') {
            const command = client.commands.get('push');
            if (command) {
                await interaction.deferReply();
                await command.execute(interaction);
            }
        }
    },
};
