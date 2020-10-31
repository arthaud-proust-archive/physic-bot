const exposants = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const exposant = number=>{
    let e='';
    for(let n of number.toString()) {
        if(parseInt(n)) e+=exposants[parseInt(n)]
    }
    return e
}

const roundedRect = function(ctx, x, y, width, height, radius) {
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


module.exports = {
    exposant,
    roundedRect
}