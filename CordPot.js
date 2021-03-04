/* INCLUDES */

const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

const { words } = require('./data/words.json');
const config = require('./data/config.json');

/* CLIENT FUNCTIONS */

client.on('ready', () => {
    console.log("I am now logging suspicious messages in all the servers I am in :)\n");
    client.channels.get(config.channel).send("**I am online!** :smile:");
});

client.on('message', async message => {
    if (message.author.id === client.user.id) return;
    if (config.admins.indexOf(message.author.id) !== -1) return;
    if (config.guilds.indexOf(message.guild.id) !== -1) return;
    
    findWords(message.content).then(word => {
        logMessage(message, word);
    });
    
});

/* LOGGING FUNCTIONS */

function logMessage(message, word) {
    var channel = message.channel;
    var author = message.author;
    var guild = message.guild;
    
    var time = getTime();
    var date = getDate();

    fs.appendFile(`logs/${date}.log`, `[${time}, ${guild.id}, ${channel.id}, ${word}] ${author.tag}: ${message.content}\r\n`, (err) => {
        if (err) throw err;
        client.channels.get(config.channel).send("```\n" + `${time} | ${date}\n\nAuthor: ${message.author.tag}\nGuild: ${message.guild.name}\nKeyword: ${word}\nMessage: ${message.content}` + "```");
    });
}


function findWords(message) {
    return new Promise((resolve) => {
        var message_words = message.replace("`", "").toLowerCase().split(" ");
        words.forEach(word => {
            for (i = 0; i < message_words.length; i++) { 
                if (message_words[i] === word) return resolve(word);
            }
        });
    });
}

/* EMBEDDED FUNCTIONS */

function getTime() {
    return new Date().getHours() + ":" + new Date().getMinutes();
}

function getDate() {
    var today = new Date();
    var dd = today.getDate() > 10 ? today.getDate() : '0' + today.getDate();
    var mm = today.getMonth() + 1 > 10 ? today.getMonth() + 1 : '0' + today.getMonth() + 1;
    var yyyy = today.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
}

client.login(config.token);
