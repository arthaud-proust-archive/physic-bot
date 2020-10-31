require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const Discord = require('discord.js');
const axios = require('axios');
const { createCanvas } = require('canvas');

const {
    Search,
    dispLayers,
    dispLewis,
    randEl,
    elements,
    findAtoms,
    Atom
} = require('./meta')

const exposants = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const exposant = number=>{
    let e='';
    for(let n of number.toString()) {
        if(parseInt(n)) e+=exposants[parseInt(n)]
    }
    return e
}
const bot = new Discord.Client();

bot.on('ready', () => {
    bot.user.setActivity(`Ka-boom!`);
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message=>{
    if(message.author.id == bot.user.id) return
    if(message.content.startsWith('element')) {
        try {
            Search(message, ['n', 's'], (msg, search)=>{
                const embed = new Discord.MessageEmbed()
                    .setTitle(search.first.n)
                    .setColor("RANDOM")
                    .setThumbnail(`${process.env.URL}/element/${search.first.n}`)
                    .setDescription('Lewis schema :\n\nCaracteristics of the atom :')
                    .addFields(
                        {name: 'Symbol', value:search.first.s, inline: true},
                        {name: 'Atomic number', value: search.first.z, inline :true},
                        {name: 'Mass', value: search.first.a+' g/mol', inline: true},
                        {name: 'Layers', value: search.first.layers.filter(layer=>layer.e!==0).map(layer=>` ${layer.n}${exposant(layer.e)}`).join(' '), inline: true},
                        {name: 'Underlays', value: search.first.subLayers.map(layer=>layer.map(sublayer=>`${sublayer[0]}${exposant(sublayer[1])}`).join(' ')).join(' '), inline: true})
                    .setFooter('By Arthaud Proust', 'https://arthaud.dev/img/apple-touch-icon.png');
                message.channel.send(embed);
            })
        } catch(e) {
            message.reply(`\n\n**Little error: ${e}**,\n\n Use  \`element [name or symbol]\``);
        }
        
    }

});


function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.lineTo(x + width - radius, y + height);
    ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
    ctx.lineTo(x + width, y + radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.lineTo(x + radius, y);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
}

bot.login(process.env.APP_TOKEN);

app.use(express.static(__dirname + '/web/styles'));     // Store all assets files in public folder.
app.get('/', (req, res)=>res.sendFile(path.join(__dirname+'/web/app.html')));
app.get('/element/:search', (req, res)=>{
    const search = findAtoms(req.params.search, ['n', 's']);

    if(!search) {
        res.sendStatus(400)
    } else if(!search.result) {
        res.sendStatus(404)
    } else {
        const width = 130
        const height = 130

        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#484848'
        roundedRect(ctx, 0, 0, height, width, 20);

        ctx.font = '60px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.fillText(search.first.s, 64, 90)

        for(let el of search.first.electronsArray) {
            el.build(ctx)
        }

        const buffer = canvas.toBuffer('image/png')
        res.write(buffer)
        res.end()
    }
});
app.listen(process.env.PORT || 8001);
