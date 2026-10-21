require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const PREFIX = ',';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}. Prefix is "${PREFIX}"`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === 'status') {
    const target = message.mentions.users.first();
    if (!target) {
      return message.reply('Mention someone first, like `,status @user`.');
    }

    const presence = message.guild.presences.cache.get(target.id);

    // Not in the cache at all: Discord never told us anything about them
    if (!presence) {
      return message.reply(`${target.username} is offline.`);
    }

    // In the cache but flagged offline: treat as invisible
    if (presence.status === 'offline') {
      return message.reply(`${target.username} is invisible.`);
    }

    return message.reply(`${target.username} is ${presence.status}.`);
  }
});

client.login(process.env.BOT_TOKEN);
