const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  Guild,
} = require("discord.js")
const { guildId } = require("./config.json")
const { token } = require("./config.json")
const fs = require('fs')
const schedule = require('node-schedule')
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 0;
rule.minute = 0;
schedule.scheduleJob(rule, function () {
  limparAtiv()
});
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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const { commandName } = interaction

  if (commandName === "kill") {
    await interaction.reply("Fechando")
    process.exit(1)
  } else if (commandName === 'addmateria') {
    const guild = client.guilds.cache.get(guildId)
    await guild.roles.create({ name: interaction.options.getString('matéria') });
    let role= await guild.roles.cache.find(role => role.name === interaction.options.getString('matéria'))
    let dados={
      label: interaction.options.getString('matéria'),
      description: '',
      value: role.id,
    }
    const anexo = new MessageEmbed()
    .setColor(cor)
    .setTitle(':white_check_mark: ' + dados.label + ' foi cadastrada')
    .setAuthor('Adicionar Matéria', avatar)
    .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
    interaction.reply({embeds:[anexo]})
    cadastrarMateria(dados)
  } else if (commandName === "matricular") {
    const collector = interaction.channel.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 7500 });
    let materias = retornaJSON(1)
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select')
          .setPlaceholder('Nenhuma Matéria Selecionada')
          .setMinValues(1)
          .addOptions(materias),
      )
    interaction.reply({ content: 'Selecione as Matérias para matrícula', components: [row], fetchReply: true })

    collector.on('collect', i => {
      if (i.user.id === interaction.user.id) {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':white_check_mark: Matriculado com Sucesso')
          .setAuthor('Matricular', avatar)
          .setThumbnail(avatar)
          .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
        interaction.followUp({ embeds: [anexo] })
        interaction.deleteReply();
      } else {
        i.reply({ content: `Estes botoes não são pra você`, ephemeral: true });
      }
    });

    collector.on('end', collected => {
      let mapIter = collected.keys();
      let cargos = (collected.get(mapIter.next().value).values)
      const member = interaction.member
      materias.forEach((item) => {
        if (cargos.includes(item.value)) {
          member.roles.add(item.value)
        }
      })
    });
  } else if (commandName === 'adicionar') {
    let dia, mes
    if (diffdatas(interaction.options.getNumber("dia"), interaction.options.getNumber("mes")) >= 0) {
      if ((verificarCargo(interaction.options.getRole('matéria').id)) !== false) {
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
              .setImage(retornaGif())
            interaction.reply({ embeds: [anexo] })
          }

        } else {
          const anexo = new MessageEmbed()
            .setColor(cor)
            .setTitle(':no_entry: Você esta tentando adicionar uma atividade em uma matéria que não esta cadastrado')
            .setAuthor('Adicionar', avatar)
            .setDescription('Pera lá camarada')
            .setImage('https://media.giphy.com/media/njYrp176NQsHS/giphy.gif')
          interaction.reply({ embeds: [anexo] })
        }

      } else {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':x: ' + interaction.options.getRole('matéria').name + ' não é uma matéria')
          .setAuthor('Adicionar', avatar)
          .setDescription('Se acha que isto é um erro cadastre o cargo como matéria com /addmateria')
          .setImage('https://media.giphy.com/media/l46CyJmS9KUbokzsI/giphy.gif')
        interaction.reply({ embeds: [anexo] })
      }
    } else {
      const anexo = new MessageEmbed()
        .setColor(cor)
        .setTitle(':x: Você está tentando adicionar uma atividade que ja passou')
        .setAuthor('Adicionar', avatar)
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.lfr4LvAHdujI4L5Ei6sY5QHaJ4%26pid%3DApi&f=1')
        .setDescription('Mc......McFly?')
        .setImage('https://media.giphy.com/media/xsF1FSDbjguis/giphy.gif')
      interaction.reply({ embeds: [anexo] })
    }
  } else if (commandName === 'listar') {
    listar(interaction)
  } else if (commandName === 'apagar') {
    if (interaction.options.getString('elemento') === '1') {
      let controle
      const channel = interaction.channel
      let cargos = interaction.member.roles.member._roles
      let atividade = retornaJSON(0)
      let mensagem = ''
      let tempo = ''
      atividade.forEach((item, index) => {
        if (cargos.includes(item.materia)) {
          let linha = index + ".[" + item.dia + "/" + item.mes + "] " + item.tipo + " de " + item.nomeMateria
          if (item.tema !== null) {
            linha.concat(" de tema" + item.tema)
          }
          linha = linha.concat('\n')
          mensagem = mensagem.concat(linha)
        }
      })
      if (mensagem.length !== 0) {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(tempo)
          .setAuthor('Apagar', avatar)
          .setDescription('Atividades condizentes com suas matérias' + tempo.toLowerCase() + ':')
          .setThumbnail(avatar)
          .setImage(retornaGif())
          .addFields(
            { name: 'Atividades', value: mensagem, inline: true },
          );
        interaction.reply({ embeds: [anexo] })
        controle = true
      }
      else {
        controle = false
      }
      if (controle === true) {
        channel.send("Por favor digite o NÚMERO da atividade a ser deletado(apenas 1 valor)")
        const filter = m => isNaN(parseInt(m.content)) === false;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });
        collector.on('collect', m => {
        });

        collector.on('end', collected => {
          if (collected.size > 0) {
            let mapIter = collected.keys();
            let indexAtividade = (collected.get(mapIter.next().value).content)
            if (atividade[indexAtividade] !== undefined) {
              atividade.splice((indexAtividade), 1)
              fs.writeFileSync('./atividades.json', JSON.stringify(atividade, null, 6))
              const anexo = new MessageEmbed()
                .setColor(cor)
                .setTitle(':white_check_mark: Atividade apagada com sucesso')
                .setAuthor('Apagar atividade', avatar)
                .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
              interaction.editReply({ embeds: [anexo] })
            } else {
              const anexo = new MessageEmbed()
                .setColor(cor)
                .setTitle(':x: Atividade não existe ou é inválida')
                .setAuthor('Apagar atividade', avatar)
                .setDescription('Erro 404')
                .setImage('https://media.giphy.com/media/tvGOBZKNEX0ac/giphy.gif')
              channel.send({ embeds: [anexo] })
            }
          }
          else {
            const anexo = new MessageEmbed()
              .setColor(cor)
              .setTitle(':x: Você não digitou nenhuma atividade')
              .setAuthor('Apagar atividade', avatar)
              .setDescription('Não trabalhamos com adivinhação')
              .setImage('https://media.giphy.com/media/tvGOBZKNEX0ac/giphy.gif')
            interaction.editReply({ embeds: [anexo] })
          }
        });
      } else {
        const anexo = new MessageEmbed()
          .setColor(cor)
          .setTitle(':x: Não há atividades para apagar')
          .setAuthor('Apagar atividade', avatar)
          .setDescription('Erro 404')
          .setImage('https://media.giphy.com/media/tvGOBZKNEX0ac/giphy.gif')
        interaction.reply({ embeds: [anexo] })
      }

    }
    else {
      const collector = interaction.channel.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 7500 });
      let materias = retornaJSON(1)
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Nenhuma Matéria Selecionada')
            .setMinValues(1)
            .addOptions(materias),
        )
      interaction.reply({ content: 'Selecione as Matérias para apagar', components: [row], fetchReply: true })

      collector.on('collect', i => {
        if (i.user.id === interaction.user.id) {
          interaction.deleteReply(interaction);
        } else {
          i.reply({ content: `Estes botoes não são pra você`, ephemeral: true });
        }
      });

      collector.on('end', collected => {
        let mapIter = collected.keys();
        let IDmaterias = (collected.get(mapIter.next().value).values)
        let index
        IDmaterias.forEach((item) => {
          const guild = client.guilds.cache.get(guildId)
          const role = guild.roles.cache.find(role => role.id === item);
          role.delete();
          index = (materias.findIndex(materias => materias.value === item))
          materias.splice(index, 1)
        })
        fs.writeFileSync('./materias.json', JSON.stringify(materias, null, 6))
      });
    }
  }

})

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
  let atividades = retornaJSON(0)
  atividades.push({
    dia: dados.dia,
    mes: dados.mes,
    tipo: dados.tipo,
    materia: dados.materia,
    nomeMateria: dados.nomeMateria,
    tema: dados.tema,
  })
  // write new data back to the file
  fs.writeFileSync('./atividades.json', JSON.stringify(atividades, null, 6))
}
function cadastrarMateria(dados) {
  fs.readFile('./materias.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`)
    } else {
      let materias = JSON.parse(data)
      materias.push({
        label: dados.label,
        description: dados.description,
        value: dados.value
      })
      // write new data back to the file
      fs.writeFile('./materias.json', JSON.stringify(materias, null, 6), (err) => {
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
function listar(interaction) {
  let cargos = interaction.member.roles.member._roles
  let atividade = retornaJSON(0)
  let mensagem = ''
  let tempo = ''
  let numero = 1
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
    default:
      tempo = "Sempre"
      break
  }
  atividade.forEach((item) => {
    if (cargos.includes(item.materia)) {
      let linha = numero + ".[" + item.dia + "/" + item.mes + "] " + item.tipo + " de " + item.nomeMateria
      if (item.tema !== null) {
        linha.concat(" de tema" + item.tema)
      }
      linha = linha.concat('\n RESTANDO:' + diffdatas(item.dia, item.mes) + ' Dias\n')
      mensagem = mensagem.concat(linha)
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
      .setImage(retornaGif())
      .addFields(
        { name: 'Atividades', value: mensagem, inline: true },
      );
    interaction.reply({ embeds: [anexo] })
    return (true)
  }
  else {
    const anexo = new MessageEmbed()
      .setColor(cor)
      .setAuthor('Listar', avatar)
      .setTitle('Não há nenhum atividade cadastrada para o periodo de tempo selecionado')
      //.setThumbnail(avatar)
      .setDescription('Pode curtir a vontade')
      .setImage('https://media.giphy.com/media/BIuuwHRNKs15C/giphy.gif');
    interaction.reply({ embeds: [anexo] })
    return (false)
  }
}
function limparAtiv() {
  let ts = Date.now()
  let date_ob = new Date(ts)
  let atividades = retornaJSON(0)
  atividades = atividades.filter(atividades => ((atividades.dia >= date_ob.getDate()) && (atividades.mes >= date_ob.getMonth() + (1 * 1))) || (atividades.dia <= date_ob.getDate()) && (atividades.mes > date_ob.getMonth() + (1 * 1)))
  fs.writeFileSync("./atividades.json", JSON.stringify(atividades, null, 4))
}
function retornaJSON(op) {
  let obj
  switch (op) {
    case 0:
      obj = fs.readFileSync('./atividades.json', 'utf-8')
      let atividade = JSON.parse(obj)
      return (atividade)
      break
    case 1:
      obj = fs.readFileSync('./materias.json', 'utf-8')
      let materias = JSON.parse(obj)
      return (materias)
      break
  }
}
function retornaGif() {
  switch (moment().day()) {
    case 0:
      return ('https://media.giphy.com/media/jUnAWY4Ti2ypWE8LaW/giphy.gif')
      break;
    case 1:
      return ('https://media.giphy.com/media/AmC5W2bbc41wY/giphy.gif')
      break;
    case 2:
      return ('https://media.giphy.com/media/l22ysLe54hZP0wubek/giphy.gif')
      break;
    case 3:
      let valor = Math.random() < 0.6;
      if (valor === true) {
        return ("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FZbVPdx-Jcbc%2Fmaxresdefault.jpg&f=1&nofb=1")
      }
      else {
        return ('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtI1IuQMymzJWRGj6AbUUSj42SPTdyGXT2AA&usqp=CAU')
      }
      break;
    case 4:
      return ('https://media.giphy.com/media/fVWFWTXjmcu4oxN2U0/giphy.gif')
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
