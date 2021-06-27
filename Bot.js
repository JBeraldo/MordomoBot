const Discord = require("discord.js")
const client = new Discord.Client()
const dotenv = require('dotenv');
const mysql = require('mysql');
function conectar(){//conection factory
  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'ADS'
  });
  // connect to mysql
  connection.connect(function(err) {
    // in case of error
      if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});
return connection
}
const db=conectar(); //variavel que recebe a conexão com o MySql
/*$query = 'CREATE TABLE teste(PersonID int)'
db.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Query succesfully executed: ", rows);
});*/

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
              msg.channel.send("Adicionou materia")
              break;
            case "trabalho" :
              msg.channel.send("Adicionou Trabalho")
              break;
            case "aula" :
              msg.channel.send("Adicionou Aula")
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
        msg.channel.send("deu certo");
        break;
      case "?hoje" :
        msg.channel.send("deu certo");
        break;
      case "?semana" :
        msg.channel.send("deu certo");
        break;
    }
    
  }
})


client.login(process.env.TOKEN)