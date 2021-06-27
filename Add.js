const Discord = require("discord.js")
const client = new Discord.Client()

function materia (msg){
    mensagem = msg;
    msg.channel.send("Adicionou materia");
    return 0;
}

function aula (msg){
    mensagem = msg;
    msg.channel.send("Adicionou aula");
    return 0;
}

function prova (msg){
    mensagem = msg;
    msg.channel.send("Adicionou prova");
    return 0;
}

function trabalho (msg){
    mensagem = msg;
    msg.channel.send("Adicionou trabalho");
    return 0;
}

function atividade (msg){
    mensagem = msg;
    msg.channel.send("Adicionou atividade");
    return 0;
}

function pa (msg){
    mensagem = msg;
    msg.channel.send("Adicionou PA");
    return 0;
}

module.exports = {materia,aula,prova,trabalho,atividade,pa};