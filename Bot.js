const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js")
const { token } = require("./config.json")
const fs = require('fs')
var moment = require('moment')
moment().utc().format()
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
const avatar = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MpJXHbEUZ0xuCeErZTGudAHaHa%26pid%3DApi&f=1'
const cor = '#fd0061'
client.once("ready", () => {
  console.log("Ready!")
})
comandos()

function comandos() {
  let name
  client.on("interactionCreate", async (interaction) => {
    limparAtiv()
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commandName === "kill") {
      await interaction.reply("Fechando")
      process.exit(1)
    } else if (commandName === 'addmateria') {
      if (verificarCargo(interaction.options.getRole('cargo').id) === false) {
        let dados = {
          label: interaction.options.getRole('cargo').name,
          description: '',
          value: interaction.options.getRole('cargo').id
        }
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':white_check_mark: ' + dados.label + ' foi cadastrada')
          .setAuthor('Adicionar Matéria', avatar)
          .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
        cadastrarMateria(dados)
        interaction.reply({ embeds: [anexo] })
      } else {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':x: ' + interaction.options.getRole('cargo').name + ' ja existe')
          .setAuthor('Adicionar Matéria', avatar)
          .setImage('https://media.giphy.com/media/1Be4g2yeiJ1QfqaKvz/giphy.gif')
        interaction.reply({ embeds: [anexo] })
      }
    } else if (commandName === "matricular") {
      let obj = fs.readFileSync('./materias.json', 'utf-8')
      let materias = JSON.parse(obj)
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Nenhuma Matéria Selecionada')
            .setMinValues(1)
            .addOptions(materias),
        )

      const message = await interaction.reply({ content: 'Selecione as Matérias para matrícula', components: [row], fetchReply: true })
      name = interaction.commandName
      const filter = i => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      }
      message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
        .then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
        .catch(err => console.log())

    } else if (commandName === 'adicionar') {
      let dia, mes
      console.log(verificarCargo(interaction.options.getRole('matéria').id))
      if ((verificarCargo(interaction.options.getRole('matéria').id)) !== false) {
        console.log('Passou normal')
        if (interaction.member.roles.cache.some(role => role.name === interaction.options.getRole('matéria').name)) {
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
          }
          cadastrarAtividade(atividade)
          if (interaction.options.getString('tema') === null) {
            const tema = 'Não cadastrado'
            const anexo = new MessageEmbed()
              .setColor(cor)
              .setTitle(':white_check_mark: Adicionado com Sucesso')
              .setAuthor('Adicionar', avatar)
              .setThumbnail(avatar)
              .addFields(
                { name: 'Tipo', value: interaction.options.getString('tipo') },
                { name: 'Matéria', value: interaction.options.getRole('matéria').name, inline: true },
                { name: 'Prazo', value: dia + "/" + mes, inline: true },
                { name: 'Tema', value: tema, inline: true },
              )
              .setImage(retornaGif())
            interaction.reply({ content: "||" + "<@&" + interaction.options.getRole('matéria') + ">||", embeds: [anexo] })
          } else if (interaction.options.getString('tema') !== null) {
            const tema = interaction.options.getString('tema')
            const anexo = new MessageEmbed()
              .setColor(cor)
              .setTitle(':white_check_mark: Adicionado com Sucesso')
              .setAuthor('Adicionar', avatar)
              .setThumbnail(avatar)
              .addFields(
                { name: 'Tipo', value: interaction.options.getString('tipo') },
                { name: 'Matéria', value: interaction.options.getRole('matéria').name, inline: true },
                { name: 'Prazo', value: dia + "/" + mes, inline: true },
                { name: 'Tema', value: tema, inline: true },
              )
              .setImage('https://media.giphy.com/media/gX8F8kMRTx44M/giphy.gif')
            interaction.reply({ embeds: [anexo] })
          }

        } else {
          console.log('Passou else1')
          const anexo = new MessageEmbed()
            .setColor(cor)
            .setTitle(':x: Você esta tentando adicionar uma atividade em uma matéria que não esta cadastrado')
            .setAuthor('Adicionar', avatar)
            .setDescription('Pera lá camarada')
            .setImage('https://media.giphy.com/media/njYrp176NQsHS/giphy.gif')
          interaction.reply({ embeds: [anexo] })
        }

      } else {
        console.log('Passou else2')
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':x: ' + interaction.options.getRole('matéria').name + ' não é uma matéria')
          .setAuthor('Adicionar', avatar)
          .setDescription('Se acha que isto é um erro cadastre o cargo como matéria com /addmateria')
          .setImage('https://media.giphy.com/media/l46CyJmS9KUbokzsI/giphy.gif')
        interaction.reply({ embeds: [anexo] })
      }
    } else if (commandName === 'listar') {
      limparAtiv()
      console.log('passou')
      let cargos = await interaction.member.roles.member._roles
      let obj = fs.readFileSync('./atividades.json', 'utf-8')
      let atividade = JSON.parse(obj)
      let mensagem = ''
      let tempo = ''
      let numero = 1
      let Deadline = ''
      switch (interaction.options.getString('para')) {
        case '1':
          atividade = atividade.filter(atividade => ((atividade.dia === moment().date()) && (atividade.mes === moment().month() + 1)))
          tempo = 'Hoje'
          break
        case '2':
          atividade = atividade.filter(atividade => diffdatas(atividade.dia, atividade.mes) <= 7)
          tempo = 'Semana'
          break
        case '3':
          atividade = atividade.filter(atividade => diffdatas(atividade.dia, atividade.mes) <= 31)
          tempo = 'Mês'
          break
        case '4':
          tempo = "Sempre"
          break
      }
      atividade.forEach((item) => {
        if (cargos.includes(item.materia)) {
          let linha = numero + ".[" + item.dia + "/" + item.mes + "] " + item.tipo + " de " + item.nomeMateria
          if (item.tema !== null) {
            linha.concat(" de tema" + item.tema)
          }
          linha = linha.concat('\n')
          mensagem = mensagem.concat(linha)
          Deadline = Deadline.concat(diffdatas(item.dia, item.mes) + '\n')
          numero++
        }
      })
      if (mensagem.length !== 0) {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(tempo)
          .setAuthor('Listar', avatar)
          .setDescription('Listando atividades para ' + tempo.toLowerCase() + ':')
          .setThumbnail(avatar)
          .addFields(
            { name: 'Atividades', value: mensagem, inline: true },
            { name: 'Dias restantes', value: Deadline, inline: true },
          );
        console.log('passou')
        interaction.reply({ embeds: [anexo] })
      }
      else {
        interaction.reply('Não há nenhuma atividade cadastrada para suas materias neste periodo de tempo')
      }
    }
  })
  client.on('interactionCreate', interaction => {
    if (!interaction.isSelectMenu()) return
    if (name === 'matricular') {
      let cargos = interaction.values
      const member = interaction.member
      let obj = fs.readFileSync('./materias.json', 'utf-8')
      let materias = JSON.parse(obj)
      materias.forEach((item) => {
        if (cargos.includes(item.value)) {
          member.roles.add(item.value)
        }
      })
      const anexo = new MessageEmbed()
        .setColor(cor)
        .setTitle(':white_check_mark: Matriculado com Sucesso')
        .setAuthor('Matricular', avatar)
        .setThumbnail(avatar)
        .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
      interaction.followUp({ embeds: [anexo] })
      interaction.deleteReply(interaction)
    }

  })
}
function verificarCargo(cargo) {
  let obj = fs.readFileSync('./materias.json', 'utf-8')
  let materias = JSON.parse(obj)
  let jaExiste = false
  materias.forEach((item) => {
    if (item.value === cargo) {
      jaExiste = true
    };
  });
  return (jaExiste);
}
function cadastrarAtividade(dados) {
  // read the file
  fs.readFile('./atividades.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`)
    } else {
      let atividades = JSON.parse(data)
      atividades.unshift({
        dia: dados.dia,
        mes: dados.mes,
        tipo: dados.tipo,
        materia: dados.materia,
        nomeMateria: dados.nomeMateria,
        tema: dados.tema,
      })
      // write new data back to the file
      atividades = atividades.filter(function (val) { return val !== null })
      atividades = atividades.filter(function (val) { return val !== '[]' })
      fs.writeFile('./atividades.json', JSON.stringify(atividades, null, 4), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`)
        }
      })
    }
  })
}
function cadastrarMateria(dados) {
  fs.readFile('./materias.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`)
    } else {
      let materias = JSON.parse(data)
      materias.unshift({
        label: dados.label,
        description: dados.description,
        value: dados.value
      })
      // write new data back to the file
      materias = materias.filter(function (val) { return val !== null })
      materias = materias.filter(function (val) { return val !== '[]' })
      fs.writeFile('./materias.json', JSON.stringify(materias, null, 4), (err) => {
        if (err) {
          console.log(`Error writing file: ${err}`)
        }
      })
    }
  })
}
function diffdatas(dia, mes) {
  const realData = moment(moment().date() + '-' + (moment().month() + 1) + '-' + moment().year(), "DD-MM-YYYY")
  const ativData = moment(dia + '-' + mes + '-' + moment().year(), "DD-MM-YYYY")
  const diffDias = ativData.diff(realData, 'days') // 1
  return (Number(diffDias))
}
function limparAtiv() {
  let ts = Date.now()
  let date_ob = new Date(ts)
  fs.readFile('./atividades.json', 'utf8', (err, data) => {
    let atividades = JSON.parse(data)
    atividades = atividades.filter(atividades => ((atividades.dia >= date_ob.getDate()) && (atividades.mes >= date_ob.getMonth() + (1 * 1))) || (atividades.dia <= date_ob.getDate()) && (atividades.mes > date_ob.getMonth() + (1 * 1)))
    fs.writeFile('./atividades.json', JSON.stringify(atividades, null, 4), (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`)
      }
    })
  })
}
function retornaGif() {
  switch (moment().day()) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      let valor = Math.random() < 0.5;
      if (valor === true) {
        return ("data:image/jpeg;base64,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")
      }
      else{
        return('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtI1IuQMymzJWRGj6AbUUSj42SPTdyGXT2AA&usqp=CAU')
      }
      break;
    case 4:
      break;
    case 5:
      return ('data:image/jpeg;base64,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')
      break;
    case 6:
      return ('https://media.giphy.com/media/IUEG0DmJxgRWM/giphy.gif')
      break;
  }
}
client.login(token)
