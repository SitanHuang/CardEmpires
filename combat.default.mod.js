const COMBAT_COLOR = '#008070';

class Combat extends Card {
    constructor (name, description) {
        super (name, description, COMBAT_COLOR);
    }

    onSelect(type, data) {
        return false;
    }

    onExecute(unit1, unit2, uc, u1c) {}
}

class Assault extends Combat {
    constructor() {
        super('Assault', 'Attacks first, Def - 4, Atk + 4');
        this.def = -4;
        this.atk = 4;
    }
}

class Encircle extends Combat {
    constructor() {
        super('Encircle', 'Def - 4, Atk + 8');
        this.def = -4;
        this.atk = 8;
    }
}

class Blitz extends Combat {
    constructor() {
        super('Blitz', 'Atk + 8');
        this.def = 0;
        this.atk = 8;
    }
}
class Disguise extends Combat {
    constructor() {
        super('Disguise', 'Hide all cards during attack, atk - 4');
        this.def = 0;
        this.atk = -4;
    }
}

class Trump extends Combat {
    constructor() {
        super('Trump', 'Def + 4, Atk + 8');
        this.def = 4;
        this.atk = 8;
    }
}

class Retract extends Combat {
    constructor() {
        super('Retract', 'Attacker retreats upon defeat');
        this.def = 0;
        this.atk = 0;
    }
}

class Entrench extends Combat {
    constructor() {
        super('Entrench', 'Def + 8');
        this.def = 8;
        this.atk = 0;
    }
}

function calcFirst(c1, c2) {
    let l1 = c1.filter(x => x instanceof Assault).length;
    let l2 = c2.filter(x => x instanceof Assault).length;
    return l2 > l1 ? 2 : 1;
}

function renderAttackGroup(clazz, unit, combats, first) {
    let final = {atk: unit.atk, def: unit.def};
    let spirit = unit.player.spirit;
    let mod = '';
    combats.forEach(card => {
        card.remove();
        final.atk = Math.max(0, final.atk + card.atk);
        final.def = Math.max(0, final.def + card.def);
        mod += `<strong>${card.name}</strong>
        + Def ${card.def} & Atk ${card.atk}
        <br>`;
    });
    mod += `<strong>${spirit.name}</strong> + Def ${spirit.defend} & Atk ${spirit.strength}`;
    final.atk = Math.max(0, final.atk + spirit.strength);
    final.def = Math.max(0, final.def + spirit.defend);
    $(`#reviewAttack .${clazz}-group`).html(
        `<h3>${unit.name} - Def ${unit.def} Atk ${unit.atk}</h3>
        ${mod}<br>
        ----------------------------<br>
        Def: ${final.def} Atk: ${final.atk}<br>
        ${first ? '<strong>Assault: </strong> - Go first' : ''}
        `
    );
    return final;
}

function calcCombat(f1, f2, first) {
    for (let i = first;;i++) {
        let atker = i % 2 == 0 ? f2 : f1;
        let dfder = i % 2 == 0 ? f1 : f2;
        dfder.def -= atker.atk;
        if (dfder.def <= 0) return i % 2 == 0 ? 2 : 1;
    }
}
