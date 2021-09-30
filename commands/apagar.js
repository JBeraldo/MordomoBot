const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

module.exports = {
	data: new SlashCommandBuilder()
    .setName('apagar')
	.setDescription('apaga atividade ou matéria')
    .addStringOption(option =>
		option.setName('elemento')
			.setDescription('Atividades para fazer em')
			.setRequired(true)
			.addChoice('atividade','1')
			.addChoice('matéria','2'))
    }