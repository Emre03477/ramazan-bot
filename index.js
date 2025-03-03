const { Client, GatewayIntentBits, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { REST } = require("@discordjs/rest");
const fs = require("fs");
const path = require("path");

// Ayran Code Share
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

const token = "BOT TOKEN";
const clientId = "BOT İDSİ";
const commands = [];
const commandsPath = path.join(__dirname, "komutlar");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
        commands.push(command.data.toJSON()); // Ayran Code Share
    }
}
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Komutlar kaydediliyor... - Ayran Code Share");

        // Ayran Code Share
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log("Komutlar başarıyla kaydedildi! - Ayran Code Share");
    } catch (error) {
        console.error("Komutlar kaydedilirken hata oluştu:", error);
    }
})();
// Ayran Code Share
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = require(path.join(commandsPath, `${interaction.commandName}.js`));
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("Komut çalıştırılırken hata oluştu:", error);
        await interaction.reply({ content: "Komut çalıştırılırken bir hata oluştu!", ephemeral: true });
    }
});
client.once("ready", () => {
    console.log(`Bot başlatıldı: ${client.user.tag} - Ayran Code Share`);
});

client.login(token);
