const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  Guild,
  Interaction,
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
    if(verificarCargo(interaction.options.getString('matéria'))===false){
      const guild = client.guilds.cache.get(guildId)
      await guild.roles.create({ name: interaction.options.getString('matéria') });
      let role = await guild.roles.cache.find(role => role.name === interaction.options.getString('matéria'))
      let dados = {
        label: interaction.options.getString('matéria'),
        description: '',
        value: role.id,
      }
      const anexo = new MessageEmbed()
        .setColor(cor)
        .setTitle(':white_check_mark: ' + dados.label + ' foi cadastrada')
        .setAuthor('Adicionar Matéria', avatar)
        .setImage('https://media.giphy.com/media/8xgqLTTgWqHWU/giphy.gif')
      interaction.reply({ embeds: [anexo] })
      cadastrarMateria(dados)
    }else{
      const anexo = new MessageEmbed()
        .setColor(cor)
        .setTitle(':x: ' + interaction.options.getString("matéria") + ' Já existe')
        .setAuthor('Adicionar Matéria', avatar)
        .setImage('https://media.giphy.com/media/bcrOR2stk6tKIxqPOZ/giphy.gif')
      interaction.reply({ embeds: [anexo] })
    }
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
      if ((verificarCargo(interaction.options.getRole('matéria').name)) !== false) {
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
      let atividades = retornaJSON(0)
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
          index = (materias.findIndex(materias => materias.value === item))
          materias.splice(index, 1)
          atividades = atividades.filter(atividades => atividades.nomeMateria !== role.name)
          role.delete();
        })
        fs.writeFileSync('./materias.json', JSON.stringify(materias, null, 6))
        fs.writeFileSync('./atividades.json', JSON.stringify(atividades, null, 6))
      });
    }
  }

})

function verificarCargo(cargo) {
  let obj = fs.readFileSync('./materias.json', 'utf-8')
  let materias = JSON.parse(obj)
  let jaExiste = false
  materias.forEach((item) => {
    if (item.label === cargo) {
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
  //sim eu fiz uma função só pra retornar um gif dependendo do dia da semana, as vezes não e sobre funcionalidade e sim diversão
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
      return ('https://media.giphy.com/media/fVWFWTXjmcu4oxN2U0/giphy.gif')
      break;
    case 6:
      return ('https://media.giphy.com/media/IUEG0DmJxgRWM/giphy.gif')
      break;
  }
}
client.login(token)
