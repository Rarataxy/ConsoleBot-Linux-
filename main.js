const chalk = require('chalk');
const clear = require('clear');
const inquirer = require('inquirer');
const Discord = require('discord.js');
const bot = new Discord.Client();

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.pause()

clear();

let currentServer;
let currentChannel;
let serverlist = [];
let channellist = [];

bot.on('ready', () => {
    init();
});

bot.on('message', (message) => {
    if (message.channel.type === 'dm' && !message.author.bot) {
        let url = ''
        message.attachments.map(prop => {
            if (prop.url) url = prop.url;
        })
        url ? console.log(chalk.redBright(message.author.username) + '(' + chalk.yellow(message.author) + ')' + ': ' + chalk.white(url)) : console.log(chalk.redBright(message.author.username) + '(' + chalk.yellow(message.author) + ')' + ': ' + chalk.white(message.content))
    }
})

bot.on('message', message => {
    if (message.channel == currentChannel && !message.author.bot) {
        let url = ''
        message.attachments.map(prop => {
            if (prop.url) url = prop.url;
        })
        url ? console.log(chalk.redBright(message.author.username)  + '(' + chalk.yellow(message.author) + ')' + ': ' + chalk.white(url)) : console.log(chalk.redBright(message.author.username) + '(' + chalk.yellow(message.author) + ')' + ': ' + chalk.white(message.content))
    };
})

function init() {
    const servers = bot.guilds.cache;
    servers.map(server => {
        serverlist.push(server.name)
    });
    pickServer();
}

function pickServer() {
    clear()
    rl.pause()
    inquirer.prompt([
        {
            type: 'list',
            name: 'server',
            message: 'Pick a server',
            choices: serverlist
        }
    ])
    .then(answers => {
        currentServer = bot.guilds.cache.find(srv => srv.name === answers.server);
        channellist = []
        currentServer.channels.cache.map(channel => {
            if (channel.type == 'text') {
                channellist.push(channel.name);
            }
        });
        pickChannel();
    });
};

function pickChannel() {
    rl.pause()
    inquirer.prompt([
        {
            type: 'list',
            name: 'channel',
            message: 'Pick a channel',
            choices: channellist
        }
    ])
    .then(answers => {
        currentChannel = currentServer.channels.cache.find(ch => ch.name === answers.channel);
        rl.resume();
    });
}

function emoji(emote, chann) {
    let emoji = bot.emojis.cache.find(emoji => emoji.name == emote);
    if (emoji) {
        if (emoji.animated) {
            chann.send(`<a:${emoji.name}:${emoji.id}>`);
        } else {
            chann.send(`<:${emoji.name}:${emoji.id}>`);
        }
    }
}

rl.on('line', (input) => {
    let cmd = input.split(" ")[0]
    let args = input.split(" ").slice(1, input.length);
    let msg = args.slice(1, args.length).join(' ');
    
    if (cmd.substr(0,1) == '>') {
        switch (cmd) {
            case '>server':
                clear()
                pickServer();
            break;
            case '>channel':
                clear()
                pickChannel();
            break;
            case '>ping':
                currentServer.members.cache.map(user => {
                    if(user.user.id === args[0]) {
                        currentChannel.send(`<@${args[0]}> ` + msg);
                    }
                });
            break;
            case '>dm':
                currentServer.members.cache.map(user => {
                    if(user.user.id === args[0]) {
                        if (args[1] == '>emoji') {
                            emoji(args[2], user);
                        } else {
                            user.send(msg);
                        }
                    }
                });
            break;
            case '>clear':
                clear()
            break;
            case '>emoji': 
                emoji(args, currentChannel);
            break;
        }
    } else {
        if (!currentChannel) return;
        if (!input) return;
        currentChannel.send(input);
    }
})


bot.login('NDEzMzkyMzczMzI2ODA3MDYw.Xs5Nrg.aC5hLSUW06R_b7Nxb8ZHcIS9CMo');