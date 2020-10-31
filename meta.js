const {
    elements,
    findAtoms,
    Atom,
} = require('./atom')

function Search(msg, rules=[], onSuccess) {
    const research = msg.content.split(' ')[1];
    const search = findAtoms(research, rules);

    if(!search) {
        msg.reply(`Please provide an element name or symbol`);
    } else if(!search.result) {
        msg.reply(`This element doesn't exist`);
        // if(search.similars.length!==0) {
        //     $('#result'+name).append( `
        //     <span>Essayer avec:
        //         ${search.similars.map(p=>(` <code class="proposition${name}">${p.n}</code>`))}
        //     </span>
        //     `);
        // }
    } else {
        onSuccess(msg, search)
    }
}


function dispLayers(msg) {
    Search(msg, ['n', 's'], (msg, search)=>msg.reply(JSON.stringify(search.first.layers)))
}


function dispLewis(msg){
    Search(msg, ['n', 'z', 's'], (msg, search)=>msg.reply(search.first.getLewis()))
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
    dispLayers,
    dispLewis,
    randEl,
    elements,
    findAtoms,
    Atom
}