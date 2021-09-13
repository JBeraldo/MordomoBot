const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('matrícular')
		.setDescription('Mostra as Opções de Matérias disponiveis para cursar'),
};
