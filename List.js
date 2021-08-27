const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

function hoje (msg){
    mensagem = msg;
    mensagem.channel.send("hoje deu certo")
    return 0;
}

function semana (msg){
    mensagem = msg;
    mensagem.channel.send("semana deu certo")
    return 0;
}

module.exports = {hoje, semana};