require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const Discord = require('discord.js');

const { exposant } = require('./utils');
const { Search, findAtoms } = require('./meta')

const bot = new Discord.Client();


/* bot event listeners */

bot.on('ready', () => {
    bot.user.setActivity(`element carbone`);
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message=>{
    if(message.author.id == bot.user.id) return
    if(message.content.startsWith('element')) {
        try {
            Search(message, ['n', 's'], (msg, search)=>{
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Élément: ${search.first.n}`)
                    .attachFiles([{name: "image.png", attachment:search.first.electionImage}])
                    .setThumbnail('attachment://image.png')
                    .setDescription(`Caractéristiques et shéma de Lewis de l'atome :`)
                    .addFields(
                        {name: 'Symbole', value:search.first.s, inline: true},
                        {name: 'Numéro atomique', value: search.first.z, inline :true},
                        {name: 'Masse', value: search.first.a+' g/mol', inline: true},
                        {name: 'Couches électroniques', value: search.first.layers.filter(layer=>layer.e!==0).map(layer=>` ${layer.n}${exposant(layer.e)}`).join(' '), inline: false},
                        {name: 'Sous-couches', value: search.first.subLayers.map(layer=>layer.map(sublayer=>`${sublayer[0]}${exposant(sublayer[1])}`).join(' ')).join(' '), inline: false})
                    .setFooter('Par Arthaud Proust', 'https://arthaud.dev/img/apple-touch-icon.png');
                msg.channel.send(embed);
            })
        } catch(e) {
            message.reply(`\n\n**Errur: ${e}**,\n\n Utilise  \`element [nom ou symbole]\``);
        }
    }
});



/* Login du bot et pages web */

bot.login(process.env.APP_TOKEN);

// Fichiers statiques (css).
app.use(express.static(__dirname + '/web/styles'));     

// Page principale (doc)
app.get('/', (req, res)=>res.sendFile(path.join(__dirname+'/web/app.html')));

// Retourne l'image shéma lewis correpondante à l'élément cherché
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