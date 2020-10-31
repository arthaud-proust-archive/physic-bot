require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const Discord = require('discord.js');

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
                    .setColor("WHITE")
                    .attachFiles([{name: "image.png", attachment:search.first.electionImage}])
                    .setThumbnail('attachment://image.png')
                    .setDescription('Lewis schema :\n\nCaracteristics of the atom :')
                    .addFields(
                        {name: 'Symbol', value:search.first.s, inline: true},
                        {name: 'Atomic number', value: search.first.z, inline :true},
                        {name: 'Mass', value: search.first.a+' g/mol', inline: true},
                        {name: 'Layers', value: search.first.layers.filter(layer=>layer.e!==0).map(layer=>` ${layer.n}${exposant(layer.e)}`).join(' '), inline: true},
                        {name: 'Underlays', value: search.first.subLayers.map(layer=>layer.map(sublayer=>`${sublayer[0]}${exposant(sublayer[1])}`).join(' ')).join(' '), inline: true},
                        {name: 'Lewis schema url', value: `${process.env.URL}/element/${search.first.s}.png`})
                    .setFooter('By Arthaud Proust', 'https://arthaud.dev/img/apple-touch-icon.png');
                message.channel.send(embed);
            })
        } catch(e) {
            message.reply(`\n\n**Little error: ${e}**,\n\n Use  \`element [name or symbol]\``);
        }
        
    }

});



bot.login(process.env.APP_TOKEN);

app.use(express.static(__dirname + '/web/styles'));     // Store all assets files in public folder.
app.get('/', (req, res)=>res.sendFile(path.join(__dirname+'/web/app.html')));
app.get('/element/:search', (req, res)=>{
    const search = findAtoms(req.params.search.replace('.png', ''), ['n', 's']);

    if(!search) {
        res.sendStatus(400)
    } else if(!search.result) {
        res.sendStatus(404)
    } else {
        res.write(search.first.electionImage)
        res.end()
    }
});
app.listen(process.env.PORT || 8001);
