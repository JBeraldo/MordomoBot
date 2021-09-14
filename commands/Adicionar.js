const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

module.exports = {
	data: new SlashCommandBuilder()
    .setName('adicionar')
	.setDescription('Adicionar Trabalho prova ou atividade')
    .addStringOption(option =>
		option.setName('tipo')
			.setDescription('tipo de atividade')
			.setRequired(true)
			.addChoice('Prova','Prova')
			.addChoice('Trabalho','Trabalho')
			.addChoice('Atividade','Atividade'))
	.addRoleOption(option => option.setName('matéria').setDescription('De qual matéria').setRequired(true))
    .addNumberOption(option => option.setName('dia').setDescription('Dia da atividade').setRequired(true))
    .addNumberOption(option => option.setName('mes').setDescription('Mês da atividade').setRequired(true))
    .addStringOption(option => option.setName('tema').setDescription('O que será cobrado na atividade'))
};
