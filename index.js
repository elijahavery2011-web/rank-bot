const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.TOKEN;

const rankOrder = [
  "Bronze 1",
  "Bronze 2",
  "Bronze 3",
  "Silver 1",
  "Silver 2",
  "Silver 3",
  "Gold 1",
  "Gold 2",
  "Gold 3",
  "Platinum 1",
  "Platinum 2",
  "Platinum 3",
  "Diamond 1",
  "Diamond 2",
  "Diamond 3",
  "Master",
  "GrandMaster",
];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.content.toLowerCase() !== "!can1v1") return;

  const member = await message.guild.members.fetch(message.author.id);

  const userRank = rankOrder.find(rank =>
    member.roles.cache.some(role => role.name === rank)
  );

  if (!userRank) {
    return message.reply("You do not have a valid rank role.");
  }

  const rankIndex = rankOrder.indexOf(userRank);

  const allowedRanks = rankOrder.filter((_, index) => {
    return index >= rankIndex - 2 && index <= rankIndex + 2;
  });

  let output = `**Your rank:** ${userRank}\n\n**You can 1v1:**\n`;

  for (const rankName of allowedRanks) {
    const role = message.guild.roles.cache.find(r => r.name === rankName);

    if (!role) {
      output += `\n**${rankName}:** Role not found`;
      continue;
    }

    const members = role.members
      .filter(m => !m.user.bot)
      .map(m => m.displayName)
      .sort((a, b) => a.localeCompare(b));

    output += `\n**${rankName}:** ${members.length ? members.join(", ") : "No one"}`;
  }

  if (output.length > 2000) {
    return message.reply("The list is too long to send in one message.");
  }

  message.channel.send(output);
});

client.login(TOKEN);
