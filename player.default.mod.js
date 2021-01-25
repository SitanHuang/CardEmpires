var PLAYER_COLORS = ['#9C27B0', '#795548', '#3F51B5', '#009688', '#CDDC39', 'rgba(0, 0, 0, 0.6)'].sort(() => { return .5 - Math.random(); })
var PLAYERS = [];

let _player_index = 0;

var currentPlayer = null;
var oldPlayer = null;
var currentPlayerIndex = 0;

var year = 0;

function switchTo(player) {
    oldPlayer = currentPlayer;
    currentPlayer = player;
    showBanner();
}

function switchBack() {
    old = oldPlayer;
    oldPlayer = currentPlayer;
    currentPlayer = old;
    showBanner();
}

function next() {
    $('#reviewAttack, #switchAttack, #attack').hide();
    if (currentPlayer && !currentPlayer.action
        && currentPlayer.cards.filter(x => x instanceof Unit).length
        && !currentPlayer.dead) {
        alert('Use at least 1 unit card.');
        return;
    }
    console.log('Next Turn----------------------------------------------------')
    switchTo(PLAYERS[currentPlayerIndex]);
    PLAYERS[currentPlayerIndex].turn++;
    year++;
    PLAYERS[currentPlayerIndex].action = false;
    PLAYERS[currentPlayerIndex].attacks = 0;
    if (++currentPlayerIndex >= PLAYERS.length)
        currentPlayerIndex = 0;
}

class Player {
    get dead() {
        return this.count == 0;
    }

    set dead(bool) {
        this.count = bool ? 0 : 4;
    }

    constructor () {
        let that = this;

        this.spirit = SPIRITS.shift();
        SPIRITS.push(this.spirit);

        this.cards = [];
        // Array(5).fill(1).forEach(x => CARDS.shift().add(that))
        this.dead = false;
        this.color = PLAYER_COLORS.shift();
        this.index = _player_index;
        this.name = (++_player_index).toString();
        this.turn = 1;
        this.attacks = 0;
        this.action = true;
        this.count = 4;
        PLAYERS.unshift(this);

        this.spirit.card.forEach(x => {
            x.player = that;
            x.add();
        })
    }

    get drawable() {
        return this.turn % 2 != 0;
    }

    remove() {
        let that = this;
        PLAYERS = PLAYERS.filter(x => x != that);
    }
}
