const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Set the bot's status to Playing using ActivityType.PLAYING
        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: 'Vardaan Studio',
                    type: ActivityType.Playing, // Using ActivityType.PLAYING directly
                },
            ],
        });
        console.log('Bot is online!');
    },
};
