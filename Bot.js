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
  if (msg.content.startsWith("?")) {
    let mensagem = msg.content.split(" ");
    for (let i = 0; i < mensagem.length; i++) {
      mensagem[i]=mensagem[i].toLowerCase();
    }
    switch (mensagem[0]) {
      case "?add" :
        if(mensagem[1] !== undefined){
          switch (mensagem[1]) {
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
          }
        }
        else{
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