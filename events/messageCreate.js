module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot) return;

        const prefix = '/';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if the command exists
        if (!message.client.commands.has(commandName)) return;

        try {
            const command = message.client.commands.get(commandName);
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    },
};
