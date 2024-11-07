module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        // Check if the interaction is a slash command
        const { commandName } = interaction;

        // Get the command from client.commands collection
        const command = client.commands.get(commandName);

        // If the command exists, execute it
        if (command) {
            try {
                await interaction.deferReply();
            } catch (error) {
                console.error(`Error executing ${commandName} command:`, error);
                await interaction.reply({
                    content: 'There was an error executing this command.',
                    ephemeral: true,
                });
            }
        }
    },
};
