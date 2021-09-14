const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageManager,
  TextChannel,
  Channel,
} = require("discord.js");
const { token } = require("./config.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.once("ready", () => {
  console.log("Ready!");
});
comandos();

function comandos() {
  let name
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
      name = interaction.commandName
      const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
      };
      message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
        .then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
        .catch(err => console.log());

    } else if (commandName === 'adicionar') {
      const cargo = interaction.options.getRole('matéria').name
      if (interaction.member.roles.cache.some(role => role.name === interaction.options.getRole('matéria').name)) {
        let channel
        switch (cargo) {

          case 'Estrutura de Dados':
            channel = client.channels.cache.get('887120047141711886');
            break
          case 'Banco de Dados':
            channel = client.channels.cache.get('887120047141711887');
            break;
          case 'Programação Orientada a Objetos':
            channel = client.channels.cache.get('887120047141711888');
            break;
          case 'Redes de Computadores':
            channel = client.channels.cache.get('887120047141711889');
            break;
        }
        if (interaction.options.getString('tema') === undefined || interaction.options.getString('tema') === null) {
          channel.send('[' + interaction.options.getNumber('dia') + '/' + interaction.options.getNumber('mes') + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase());
        } else {
          channel.send('[' + interaction.options.getNumber('dia') + '/' + interaction.options.getNumber('mes') + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' de tema: ' + interaction.options.getString('tema'));
        }
        await interaction.reply('Adicionado com Sucesso');
      }
      else {
        interaction.reply('Você esta tentando adicionar atividades em um matéria que não esta cadastrado');
      }
    } else if (commandName === 'listar') {
      let channel = client.channels.cache.get('887120047141711886');
      // Get messages
      let cargos= interaction.member.roles.member._roles
      console.log(cargos);
      const mensagens = await channel.messages.fetch()
        .then(messages => messages = messages.find(message => message.author.username === 'Mordomo'))
        .catch(console.error);

      //console.log(mensagens)
    }

  });

  client.on('interactionCreate', interaction => {
    if (!interaction.isSelectMenu()) return;
    if (name === 'matrícular') {
      let cargos = interaction.values;
      const member = interaction.member
      cargos.forEach((item) => {
        switch (item) {
          case '1':
            member.roles.add('887120046286078035');
            break;
          case '2':
            member.roles.add('887120046286078036');
            break;
          case '3':
            member.roles.add('887120046286078034');
            break;
          case '4':
            member.roles.add('887120046286078033');
            break;
        }
      });
      interaction.followUp("Cadastro executado com sucesso");
      interaction.deleteReply(interaction);
    }

  });
}
client.login(token);
