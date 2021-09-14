const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

module.exports = {
	data: new SlashCommandBuilder()
    .setName('listar')
	.setDescription('listar atividades/provas/trabalhos')
    .addStringOption(option =>
		option.setName('para')
			.setDescription('Atividades para fazer em')
			.setRequired(true)
			.addChoice('Hoje','Prova')
			.addChoice('Semana','Trabalho')
			.addChoice('Mês','Atividade')
            .addChoice('Sempre','Atividade'))
    }