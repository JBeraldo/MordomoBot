const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmateria')
		.setDescription('Mostra os cargos possiveis para cadastrar como matéria')
        .addRoleOption(Option => Option.setName('cargo').setDescription('cargo para ser transformado em opção de matéria').setRequired(true))
};
