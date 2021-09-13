const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageComponentInteraction,
} = require("discord.js");
const { token } = require("./config.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS ,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;


  if (commandName === "kill") {
    await interaction.reply("Fechando");
    process.exit(1);
  } else if (commandName === "matrícular") {
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select')
          .setPlaceholder('Nenhuma Matéria Selecionada')
          .setMinValues(1)
          .setMaxValues(4)
          .addOptions([
            {
              label: 'Estrutura de dados',
              description: 'Matéria do Segundo Periodo',
              value: '1',
            },
            {
              label: 'Banco de Dados',
              description: 'Matéria do Segundo Periodo',
              value: '2',
            },
            {
              label: 'Programação Orientada a Objetos',
              description: 'Matéria do Segundo Periodo',
              value: '3',
            },
            {
              label: 'Redes de Computadores',
              description: 'Matéria do Segundo Periodo',
              value: '4',
            },
          ]),
      );

    const message = await interaction.reply({ content: 'Selecione as Matérias para matrícula', components: [row], fetchReply: true });
    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
      .then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
      .catch(err => console.log());

  }
});
client.on('interactionCreate', interaction => {
  if (!interaction.isSelectMenu()) return;
  let cargos = interaction.values;
  const member = interaction.member
  cargos.forEach((item) => {
    switch (item) {
      case '1':
        member.roles.add('887102858200248400');
        break;
      case '2':
        member.roles.add('880963942795583498');
        break;
      case '3':
        member.roles.add('887106941216768011');
        break;
      case '4':
        member.roles.add('887107151527563274');
        break;
    }
  });
  interaction.followUp("Cadastro executado com sucesso");
});

client.login(token);
