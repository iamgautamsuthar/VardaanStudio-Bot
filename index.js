const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes,
    ActivityType,
} = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize bot client with GatewayIntentBits
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // To interact with guilds
        GatewayIntentBits.GuildMessages, // To read messages
        GatewayIntentBits.MessageContent, // To read message content (important for some commands)
        GatewayIntentBits.GuildMembers, // To read members in guilds
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
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
    client.commands.set(command.data.name, command);
}

// Load events dynamically from the "events" folder
const eventFiles = fs
    .readdirSync(path.join(__dirname, 'events'))
    .filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Register slash commands (This part can be used during bot startup)
const registerCommands = async () => {
    const commands = client.commands.map((command) => command.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        // Register commands globally
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};

registerCommands();

// Listen for slash commands interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

// Ready event to set the bot status
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Set the bot's activity status to "Playing"
    client.user.setPresence({
        status: 'online', // Bot status (can be 'online', 'idle', 'dnd', or 'invisible')
        activities: [
            {
                name: 'Vardaan Studio', // Activity name
                type: ActivityType.Playing, // Activity type (Playing, Watching, Listening, etc.)
            },
        ],
    });
});

// Login to Discord
client.login(process.env.BOT_TOKEN);
