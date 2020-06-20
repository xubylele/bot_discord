const Discord = require('discord.js')
const { prefix, token } = require('../config.json')
const ytdl = require('ytdl-core')

const bot = new Discord.Client()

const queue = new Map()

bot.once('ready', () => {
    console.log('Ready!')
})
bot.once('reconnecting', () => {
    console.log('Reconnecting!')
})
bot.once('disconnect', () => {
    console.log('Disconnect!')
})


bot.on('message', async message => {
    if(message.author.bot) return

    if(!message.content.startsWith(prefix)) return
    const serveQueue = queue.get(message.guild.id)

    if(message.content.startsWith(`${prefix}play`)){
        execute(message, serveQueue)
        return
    }else if(message.content.startsWith(`${prefix}skip`)){
        skip(message, serveQueue)
        return
    }else if(message.content.startsWith(`${prefix}stop`)){
        stop(message, serveQueue)
        return
    }else{
        message.channel.send('Ingresa un comando valido tonto weon')
    }
})

async function execute(message, serverQueue) {
    const args = message.content.split(' ')
    const voiceChannel = message.member.voice.channel
    
    if(!voiceChannel) return message.channel.send('Entra a un canal de voz primero, tonto')
    
    const permissions = voiceChannel.permissionsFor(message.client.user)

    if(!permissions.has('CONNECT') || !permissions.has('SPEAK')) return message.channel.send('No tengo permisos en ese canal de voz')

    const songInfo = await ytdl.getInfo(args[1])
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    }

    if(!serverQueue){

        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        }

        queue.set(message.guild.id, queueContruct)
        queueContruct.songs.push(song)

        try {
            var connection = await voiceChannel.join()
            queueContruct.connection = connection
            play(message.guild, queueContruct.songs[0])

        } catch (error) {
            console.log(error)
            queue.delete(message.guild.id)
            return message.channel.send(err)
        }
    }else{
        serverQueue.songs.push(song)
        console.log(serverQueue.songs)
        const embed = {
            color: ('#460101'),
            title: ('Bot Queue'),
            url: (song.url),
            fields: [
                { name: 'Cancion', value: song.title },
                { name: 'Status', value: 'agregado con exito' }
            ]
        }
        return message.channel.send({embed: embed})
    }
    
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id)
    if(!song){
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))

    

    dispatcher.on('end', () => {
        console.log('Music ended!')

        serverQueue.song.shift()

        play(guild, serverQueue.songs[0])
    }).on('error', error => {
        console.log(error)
    })

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
}

function stop(message, serverQueue) {
    if(!message.member.voice.channel) return message.channel.send('Entra a un canal de voz primero, tonto')

    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
}

bot.login(token)