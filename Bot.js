const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const dotenv = require('dotenv');
dotenv.config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

client.on("message", msg => {
  if (msg.content.startsWith("?")) { //Detecta se a palavra é um comando começando com ?
    let mensagem = msg.content.split(" ");// Divide as partes do comando pelo espaço e joga num array de string
    for (let i = 0; i < mensagem.length; i++) {// Passa tudo pra minusculo para padronizar
      mensagem[i]=mensagem[i].toLowerCase();
    }
    switch (mensagem[0]) {//switch para achar o comando equivalente
      case "?add" :
        if(mensagem[1] !== undefined){
          switch (mensagem[1]) {// switch de subcomando
            case "materia" :
            case "matéria" :
              add.materia(msg);
              break;
            case "trabalho" :
              add.trabalho(msg);
              break;
            case "aula" :
              add.aula(msg);
              break;
            case "prova" :
              add.prova(msg);
              break;
            case "pa" :
              add.pa(msg);
              break;
            case "prova" :
              msg.channel.send("Adicionou Prova")
              break;
            case "pa" :
              msg.channel.send("Adicionou PA")
              break;
          }
        }
        else{//Trataemento de erro de sintaxe
          msg.channel.send("Erro de sintaxe BURRO")
        }        
        break;
      case "?del" :
        if(mensagem[1] !== undefined){
          switch (mensagem[1]) {// switch de subcomando
            case "materia" :
            case "matéria" :
              del.materia(msg);
              break;
            case "trabalho" :
              del.trabalho(msg);
              break;
            case "aula" :
              del.aula(msg);
              break;
            case "prova" :
              del.prova(msg);
              break;
            case "pa" :
              del.pa(msg);
              break;
          }
        }
        else{//Trataemento de erro de sintaxe
          msg.channel.send("Erro de sintaxe BURRO")
        }  
        break;
      case "?hoje" :
        list.hoje(msg);
        break;
      case "?semana" :
        list.semana(msg);
        break;
    }
    
  }
}
)
client.login(process.env.TOKEN)