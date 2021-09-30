const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmateria')
		.setDescription('Mostra os cargos possiveis para cadastrar como matéria')
        .addStringOption(Option => Option.setName('matéria').setDescription('Matéria a ser adicionada').setRequired(true))
};
