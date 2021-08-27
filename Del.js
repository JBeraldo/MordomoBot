const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

function materia (msg){
    mensagem = msg;
    msg.channel.send("Deletou materia");
    return 0;
}

function aula (msg){
    mensagem = msg;
    msg.channel.send("Deletou aula");
    return 0;
}

function prova (msg){
    mensagem = msg;
    msg.channel.send("Deletou prova");
    return 0;
}

function trabalho (msg){
    mensagem = msg;
    msg.channel.send("Deletou trabalho");
    return 0;
}

function atividade (msg){
    mensagem = msg;
    msg.channel.send("Deletou atividade");
    return 0;
}

function pa (msg){
    mensagem = msg;
    msg.channel.send("Deletou PA");
    return 0;
}

module.exports = {materia,aula,prova,trabalho,atividade,pa};