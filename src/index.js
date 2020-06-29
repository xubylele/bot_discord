const Discord = require('discord.js')
const { token } = require('../config.json')

const bot = new Discord.Client()

bot.once('ready', () => {
    console.log('Ready!')
})
bot.once('reconnecting', () => {
    console.log('Reconnecting!')
})
bot.once('disconnect', () => {
    console.log('Disconnect!')
})


bot.on('messageReactionAdd', (reaction, user) => {
    console.log(user)
    console.log(reaction.message.channel.id)
    if(user.username === 'Korbel'){
        console.log(user.username)
        if (reaction.emoji.id === "595739180999639050" || reaction.emoji.name === '🤡') {
            let channel = bot.channels.cache.get(reaction.message.channel.id)
            console.log(channel)
            if(channel == null) return
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('GRACIAS TATA')
                .setDescription('GRACIAS TATA')
                .setThumbnail('https://imgur.com/KLNZQXO.png')
                .addFields(
                    { name: 'GRACIAS TATA', value: 'GRACIAS TATA' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'GRACIAS TATA', value: 'GRACIAS TATA', inline: true },
                    { name: 'GRACIAS TATA', value: 'GRACIAS TATA', inline: true },
                )
                .addField('GRACIAS TATA', 'GRACIAS TATA', true)
                .setImage('https://imgur.com/KLNZQXO.png')
                .setTimestamp()
                .setFooter('GRACIAS TATA', 'https://imgur.com/KLNZQXO.png');
    
            channel.send(exampleEmbed);
        }
    }
});

bot.login(token)