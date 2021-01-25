var CARD_COLORS = ['#9C27B0', '#3F51B5', '#009688', '#CDDC39'];
var CARDS = [];

class Card {
    constructor (name, description, color, player) {
        this.id = Math.random() * 100000;
        this.name = name;
        this.description = description;
        this.color = color;
        this.player = player;
    }

    add(player) {
        let that = this;
        if (player)
            this.player = player;
        this.player.cards.unshift(this);
        CARDS = CARDS.filter(x => x.id != that.id).sort(x => .5 - Math.random());
    }

    remove() {
        let that = this;
        this.player.cards = this.player.cards.filter(x => x.id != that.id);
        CARDS.push(that);
        CARDS = CARDS.sort(x => .5 - Math.random())
    }

    /*
    Types:
    1. Special 2. Combat 3. Unit
    */
    onSelect(type, data) {
        return false;
    }
}

function initCards() {
    for (let i = 0; i < PLAYERS.length + 2; i++) {
        CARDS.push(new Unit('Army', 20));
        CARDS.push(new Unit('Division', 12));
        CARDS.push(new Unit('Division', 12));
        CARDS.push(new Unit('Brigade', 8));
        CARDS.push(new Unit('Brigade', 8));
        CARDS.push(new Unit('Brigade', 8));
        CARDS.push(new Unit('Squad', 4));
        CARDS.push(new Unit('Squad', 4));
        CARDS.push(new Unit('Squad', 4));
        CARDS.push(new Unit('Squad', 4));
    }

    let lam = () => {
        CARDS.push(new Recon());
        CARDS.push(new Recon());
        CARDS.push(new Upgrade());
        CARDS.push(new Degrade());
        CARDS.push(new Compact());
        // CARDS.push(new Coup());
        CARDS.push(new Mobilize());
        // CARDS.push(new Usurp());
        CARDS.push(new Train());
        // CARDS.push(new Destroy());
        // CARDS.push(new Reveal());

        CARDS.push(new Disguise());
        CARDS.push(new Assault());
        CARDS.push(new Assault());
        // CARDS.push(new CounterStrategy());
        CARDS.push(new Encircle());
        CARDS.push(new Entrench());
        // CARDS.push(new CounterEncircle());
        CARDS.push(new Blitz());
        // CARDS.push(new CounterBlitz());
        CARDS.push(new Trump());
        CARDS.push(new Retract());
        CARDS.push(new Pray());
    };
    CARDS.push(new Rebirth());
    CARDS.push(new Usurp());
    for (let i = 0;i < 3;i++) {
        lam();
    }

    CARDS = CARDS.sort(x => .5 - Math.random()).reverse()
}
