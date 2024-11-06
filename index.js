const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize bot client
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Load channels configuration from config.json in the root directory
client.channelsConfig = require('./config.json');

// Command handler
client.commands = new Collection();

// Load commands dynamically from the "commands" folder
const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands'))
    .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    client.commands.set(command.name, command);
}

// Load events dynamically from the "events" folder
const eventFiles = fs
    .readdirSync(path.join(__dirname, 'events'))
    .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Login to Discord
client.login(process.env.BOT_TOKEN);
