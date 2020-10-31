const Discord = require('discord.js');
const {
    elements,
    Atom,
} = require('./atom')


function findAtoms(input, rules=['n']) {
    if(input == "") return false;

    input = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();   // Upper only the first letter, lower others
    
    let atoms = rules.map(rule=>{
        if(rule =="z" || rule == "a") {
            return(elements.filter(element=>element[rule] == parseFloat(input)));
        } else {
            return(elements.filter(element=>element[rule].toLowerCase() == input.toLowerCase()));
        }
    }).flat();

    
    let result = atoms.length!==0;
    let first = result?new Atom(atoms[0].z):null;
    // console.log([atoms[0], first])

    let similars = rules.map(rule=>{
        if(rule =="z" || rule == "a") {
            return(elements.filter(element=>Math.round(element[rule]) == parseInt(input)));
        } else {
            return(elements.filter(element=>element[rule].toLowerCase().startsWith(input.toLowerCase())));
        }
    }).flat();
    
    return {result, first, atoms, similars};
}

function Search(msg, rules=[], onSuccess) {
    const research = msg.content.split(' ')[1];
    const search = findAtoms(research, rules);

    if(!search) {
        msg.reply(`Donne un élément sinon je ne fonctionne pas`);
    } else if(!search.result) {
        msg.reply(`Je ne connais pas cet élément`);
        if(search.similars.length!==0) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Essaie avec ça')
                .setColor("#dddddd")
                .setDescription(`${search.similars.map(p=>p.n).join('\n')}`)
                .setFooter('Par Arthaud Proust', 'https://arthaud.dev/img/apple-touch-icon.png');
            msg.channel.send(embed);
        }
    } else {
        onSuccess(msg, search)
    }
}

function randEl() {
    // génère un atome au hasard
    const atom = new Atom(Math.floor(Math.random() * elements.length));
    
    atom.build('#exElement'); // l'affiche

    // animation
    $('#exElement').animate({
        opacity: 1,
    }, 800, function() {
        setTimeout(() => {
            $('#exElement').animate({
            opacity: 0,
            }, 800, function() {
                randEl()
            });
        }, 2500);
    });
}

module.exports = {
    Search,
    randEl,
    elements,
    findAtoms,
    Atom
}