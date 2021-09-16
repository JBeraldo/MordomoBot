const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { token } = require("./config.json");
const fs = require('fs');
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
      let dia, mes
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
        if (interaction.options.getNumber('dia') > 31 || interaction.options.getNumber('dia') < 1) {
          dia = 0
        }
        else{
          dia=interaction.options.getNumber('dia')
        }
        if (interaction.options.getNumber('mes') > 12 || interaction.options.getNumber('mes') < 1) {
          mes = 0
        }
        else{
          mes=interaction.options.getNumber('mes')
        }
        let atividade = {
          dia: dia,
          mes: mes,
          tipo: interaction.options.getString('tipo'),
          materia: interaction.options.getRole('matéria').id,
          tema: interaction.options.getString('tema'),
          nota: interaction.options.getString('nota')
        }
        cadastrarAtividade(atividade)
        if (interaction.options.getString('tema') === null && interaction.options.getString('nota') === 'false') {
          channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase());
        } else if (interaction.options.getString('tema') !== null && interaction.options.getString('nota') === 'false') {
          channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' de tema: ' + interaction.options.getString('tema'));
        } else if(interaction.options.getString('tema') === null && interaction.options.getString('nota') === 'true'){
          channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' valendo nota ');
        }
        else if(interaction.options.getString('tema') !== null && interaction.options.getString('nota') === 'true'){
          channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() +' de tema ' + interaction.options.getString('tema')+' valendo nota ');
        }
        
        await interaction.reply('Adicionado com Sucesso');
      }
      else {
        interaction.reply('Você esta tentando adicionar atividades em um matéria que não esta cadastrado');
      }
    } else if (commandName === 'listar') {
      let channel = client.channels.cache.get('887120047141711886');
      // Get messages
      let cargos = await interaction.member.roles.member._roles
      let mensagens = [];
      for (let i = 0; i < cargos.length; i++) {
        switch (cargos[i]) {
          case '887120046286078035':
            channel = client.channels.cache.get('887120047141711886');
            mensagens += await channel.messages.fetch()
              .then(messages => messages = messages.find(message => message.author.username === 'Mordomo'))
              .catch(console.error)
            break
          case '887120046286078036':
            channel = client.channels.cache.get('887120047141711887');
            mensagens += await channel.messages.fetch()
              .then(messages => messages = messages.find(message => message.author.username === 'Mordomo'))
              .catch(console.error)
            break;
          case '887120046286078034':
            channel = client.channels.cache.get('887120047141711888');
            mensagens += await channel.messages.fetch()
              .then(messages => messages = messages.find(message => message.author.username === 'Mordomo'))
              .catch(console.error)
            break;
          case '887120046286078033':
            channel = client.channels.cache.get('887120047141711889');
            mensagens += await channel.messages.fetch()
              .then(messages => messages = messages.find(message => message.author.username === 'Mordomo'))
              .then(messages => messages = messages.get)
              .catch(console.error)
            break;
        }
        switch (interaction.options.getString('para')) {
          case '4':

            break
        }
      }


      console.log(mensagens)
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
function cadastrarAtividade(dados) {
  // read the file
  fs.readFile('./atividades.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      // parse JSON string to JSON object

      let atividades = JSON.parse(data)

      console.log(atividades)
      // add a new record
      atividades.unshift({
        dia: dados.dia,
        mes: dados.mes,
        tipo: dados.tipo,
        materia: dados.materia,
        tema: dados.tema,
        nota: dados.nota
      });
      // write new data back to the file
      atividades = atividades.filter(function (val) { return val !== null })
      atividades = atividades.filter(function (val) { return val !== '[]' })
      console.log(atividades)
      fs.writeFile('./atividades.json', JSON.stringify(atividades, null, 4), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`);
        }
      });
    }
  });
}
client.login(token);
