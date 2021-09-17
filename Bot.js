const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageManager,
} = require("discord.js");
const { token } = require("./config.json");
const fs = require('fs');
var moment = require('moment');
moment().utc().format()
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
    limparAtiv()
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;


    if (commandName === "kill") {
      await interaction.reply("Fechando");
      process.exit(1);
    } else if (commandName === "matricular") {
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
          case 'everyone':
            break;

        }
        if (channel !== undefined) {
          if (interaction.options.getNumber('dia') > 31 || interaction.options.getNumber('dia') < 1) {
            dia = 0
          }
          else {
            dia = interaction.options.getNumber('dia')
          }
          if (interaction.options.getNumber('mes') > 12 || interaction.options.getNumber('mes') < 1) {
            mes = 0
          }
          else {
            mes = interaction.options.getNumber('mes')
          }
          let atividade = {
            dia: dia,
            mes: mes,
            tipo: interaction.options.getString('tipo'),
            materia: interaction.options.getRole('matéria').id,
            nomeMateria: interaction.options.getRole('matéria').name,
            tema: interaction.options.getString('tema'),
            nota: interaction.options.getString('nota')
          }
          cadastrarAtividade(atividade)
          if (interaction.options.getString('tema') === null && (interaction.options.getString('nota') === 'false' || interaction.options.getString('nota') === null)) {
            channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase());
          } else if (interaction.options.getString('tema') !== null && (interaction.options.getString('nota') === 'false' || interaction.options.getString('nota') === null)) {
            channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' de tema: ' + interaction.options.getString('tema'));
          } else if (interaction.options.getString('tema') === null && interaction.options.getString('nota') === 'true') {
            channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' valendo nota ');
          }
          else if (interaction.options.getString('tema') !== null && interaction.options.getString('nota') === 'true') {
            channel.send('[' + dia + '/' + mes + '] ' + interaction.options.getString('tipo') + ' de ' + interaction.options.getRole('matéria').name.toLowerCase() + ' de tema ' + interaction.options.getString('tema') + ' valendo nota ');
          }
          await interaction.reply(':white_check_mark: Adicionado com Sucesso');
        }
        else{
          interaction.reply(':x: Você selecionou um cargo que não representa uma matéria');
        }
      }
      else {
        interaction.reply(':x: Você esta tentando adicionar atividades em um matéria que não esta cadastrado OU Selecionou um cargo que não representa uma matéria');
      }
    } else if (commandName === 'listar') {
      limparAtiv()
      let cargos = await interaction.member.roles.member._roles
      let obj = fs.readFileSync('./atividades.json', 'utf-8')
      let atividade = JSON.parse(obj)
      let mensagem
      let numero = 1
      switch (interaction.options.getString('para')) {
        case '1':
          atividade = atividade.filter(atividade => ((atividade.dia === moment().date()) && (atividade.mes === moment().month() + 1)))
          mensagem = 'Atividades das suas disciplinas cadastradas para hoje: \n'
          break
        case '2':
          atividade = atividade.filter(atividade => diffdatas(atividade.dia, atividade.mes) <= 7)
          mensagem = 'Atividades das suas disciplinas cadastradas para semana: \n'
          break
        case '3':
          atividade = atividade.filter(atividade => diffdatas(atividade.dia, atividade.mes) <= 31)
          mensagem = 'Atividades das suas disciplinas cadastradas para o mês: \n'
          break

      }
      atividade.forEach((item) => {
        if (cargos.includes(item.materia)) {
          let linha = numero + ".[" + item.dia + "/" + item.mes + "] " + item.tipo + " de " + item.nomeMateria
          if (item.tema !== null) {
            linha.concat(" de tema" + item.tema)
          }
          if (item.nota !== null) {
            linha.concat(', valendo nota')
          }
          linha = linha.concat('\n')
          mensagem = mensagem.concat(linha)
          numero++
        }
      })
      if (mensagem.length !== 0) {
        interaction.reply(mensagem)
      }
      else {
        interaction.reply('Não há nenhuma atividade cadastrada para suas materias neste periodo de tempo')
      }
    }
  });
  client.on('interactionCreate', interaction => {
    if (!interaction.isSelectMenu()) return;
    if (name === 'matricular') {
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
      interaction.followUp(":white_check_mark: Cadastro executado com sucesso");
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
      let atividades = JSON.parse(data)
      atividades.unshift({
        dia: dados.dia,
        mes: dados.mes,
        tipo: dados.tipo,
        materia: dados.materia,
        nomeMateria: dados.nomeMateria,
        tema: dados.tema,
        nota: dados.nota
      });
      // write new data back to the file
      atividades = atividades.filter(function (val) { return val !== null })
      atividades = atividades.filter(function (val) { return val !== '[]' })
      fs.writeFile('./atividades.json', JSON.stringify(atividades, null, 4), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`);
        }
      });
    }
  });
}
function diffdatas(dia, mes) {
  const realData = moment()
  const ativData = moment(dia + '-' + mes + '-' + moment().year(), "DD-MM-YYYY")
  const diffDias = ativData.diff(realData, 'days') // 1
  console.log(diffDias)
  return (diffDias)
}
function limparAtiv() {
  let ts = Date.now();
  let date_ob = new Date(ts);
  fs.readFile('./atividades.json', 'utf8', (err, data) => {
    let atividades = JSON.parse(data)
    atividades = atividades.filter(atividades => ((atividades.dia >= date_ob.getDate()) && (atividades.mes >= date_ob.getMonth() + (1 * 1))) || (atividades.dia <= date_ob.getDate()) && (atividades.mes > date_ob.getMonth() + (1 * 1)));
    fs.writeFile('./atividades.json', JSON.stringify(atividades, null, 4), (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
      }
    });
  })
}
client.login(token);
