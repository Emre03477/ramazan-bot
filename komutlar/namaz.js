const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const croxydb = require('croxydb');

// API key'ler keyler için: https://collectapi.com/tr/api/pray/namaz-vakitleri-api
const keys = [
  "key1",
  "key2"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('namaz')
    .setDescription('Belirtilen şehir için namaz vakitlerini gösterir ve alarm oluşturmanızı sağlar.')
    .addStringOption(option =>
      option.setName('şehir')
        .setDescription('Namaz vakitlerini öğrenmek istediğiniz şehir.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const selectedCity = interaction.options.getString('şehir');
    const apiKey = keys[Math.floor(Math.random() * keys.length)];

    try {
      const response = await fetch(`https://api.collectapi.com/pray/all?data.city=${selectedCity}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': `apikey ${apiKey}`
        }
      });

      if (!response.ok) throw new Error('API isteği başarısız oldu.');
      const data = await response.json();
      const prayerTimes = data.result;

      const embed = new EmbedBuilder()
        .setTitle(`🕌 ${selectedCity.toUpperCase()} Namaz Vakitleri`)
        .setColor('#57F287')
        .setDescription('Aşağıda namaz vakitleri listelenmiştir. Alarm oluşturmak için **Alarm Oluştur** butonuna tıklayın.')
        .addFields(
          { name: '🌅 İmsak', value: prayerTimes.find(time => time.vakit === 'İmsak')?.saat || 'Bilgi yok', inline: true },
          { name: '☀️ Güneş', value: prayerTimes.find(time => time.vakit === 'Güneş')?.saat || 'Bilgi yok', inline: true },
          { name: '🕒 Öğle', value: prayerTimes.find(time => time.vakit === 'Öğle')?.saat || 'Bilgi yok', inline: true },
          { name: '🌤 İkindi', value: prayerTimes.find(time => time.vakit === 'İkindi')?.saat || 'Bilgi yok', inline: true },
          { name: '🌙 Akşam', value: prayerTimes.find(time => time.vakit === 'Akşam')?.saat || 'Bilgi yok', inline: true },
          { name: '🌌 Yatsı', value: prayerTimes.find(time => time.vakit === 'Yatsı')?.saat || 'Bilgi yok', inline: true }
        )
        .setFooter({ text: 'Ayran Code Share', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      

      await interaction.reply({ embeds: [embed] });

      
    } catch (error) {
      console.error('Hata oluştu:', error);
      await interaction.reply({ content: '❌ Namaz vakitleri alınırken bir hata oluştu.', ephemeral: true });
    }
  },
};
