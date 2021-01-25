const UNIT_COLOR = 'rgba(0, 0, 0, 0.6)';

class Unit extends Card {
    constructor(name, val) {
        super(name, '', UNIT_COLOR);
        this.atk = val
        this.def = val
    }

    onSelect(type, data) {
        if (type == 'special') {
            if (year <= PLAYERS.length) {
                alert('You cannot attack during first round.');
                return false;
            }
            if (++currentPlayer.attacks > 2) {
                alert('You already attacked twice this round.');
                return false;
            }

            let that = this;
            this.remove();

            window.tmpUnit = this;
            window.tmpCombats = [];

            selectPlayer(null, target => {
                window.tmpTarget = target;
                $('#playerSelector').hide();
                showAttack();
            })
            $('#playerSelector button').hide();
            return true;
        }
        return false;
    }

    get description() {
        return `Strength ${this.atk}`;
    }

    set description(s) {}
}

function addUnit() {
    let units = tmpTarget.cards.filter(x => (x instanceof Unit && x != tmpUnit2));
    if (!units.length) {
        alert('No more units.');
        return;
    }
    selectCard(units,'Select a unit', 'unit', x => {
        tmpUnit2 = x;
        showSwitchAttack();
        $('#playerSelector').hide();
    })
}

function switchAttack() {
    window.requestSwitchAttack = true;
    let units = tmpTarget.cards.filter(x => x instanceof Unit);
    if (!units.length) {
        tmpTarget.dead = true;
        alert('Target capitulated.');
        window.requestSwitchAttack = false;
        $('#attack').hide();
        if (currentPlayer.ai) {
            aiThink();
        } else
            start();
        return;
    }

    $('#attack').hide();
    switchTo(tmpTarget);
    $('#dashboard').hide();

    window.tmpUnit2 = null;
    window.tmpCombats2 = [];

    $('#switchAttack').show()[0].scrollTop = 0;
    showSwitchAttack();
}

function showSwitchAttack() {
    $('#switchAttack').show();
    let tmpCards = tmpCombats.slice(0);
    tmpCards.push(tmpUnit);
    paintCards($('#switchAttack .card-container').first(), tmpCards, '', x => {},
        false, tmpCards.filter(x => x instanceof Disguise).length);
    let tmpCards2 = tmpCombats2.slice(0);
    if (tmpUnit2) tmpCards2.push(tmpUnit2);
    paintCards($('#switchAttack .card-container').last(), tmpCards2, 'combat', x => {
        x.add();
        tmpCombats2 = tmpCombats2.filter(a => a != x)
        showSwitchAttack();
    }, true)
}


function addCombatCard2() {
    let combats = tmpTarget.cards.filter(x => x instanceof Combat);
    if (!combats.length) {
        alert('No more combat cards.')
        return;
    }
    selectCard(
        combats,
        'Select combat cards', 'combat', x => {
            x.remove();
            tmpCombats2.unshift(x);
            $('#playerSelector').hide();
            showSwitchAttack();
        })
}


function showAttack() {
    $('#attack').show();
    let tmpCards = tmpCombats.slice(0);
    tmpCards.push(tmpUnit);
    paintCards($('#attack .card-container'), tmpCards, 'combat', x => {
        x.add();
        tmpCombats = tmpCombats.filter(a => a != x)
        showAttack();
    }, true)
}

function addCombatCard() {
    let combats = currentPlayer.cards.filter(x => x instanceof Combat);
    if (!combats.length) {
        alert('No more combat cards.')
        return;
    }
    selectCard(
        combats,
        'Select combat cards', 'combat', x => {
            x.remove();
            tmpCombats.unshift(x);
            $('#playerSelector').hide();
            showAttack();
        })
}

function reviewAttack() {
    if (!tmpUnit2) {
        alert('Please add a unit.');
        return;
    }
    window.requestSwitchAttack = false;
    $('#switchAttack').hide();
    $('#reviewAttack').show();
    let first = calcFirst(tmpCombats, tmpCombats2);
    let f1 = renderAttackGroup('left', tmpUnit, tmpCombats, first == 1);
    let f2 = renderAttackGroup('right', tmpUnit2, tmpCombats2, first == 2);
    let win = calcCombat(f1, f2, first);
    if (win == 1) {
        let l1 = tmpUnit;
        let l2 = tmpUnit2;
        l1.remove();
        l2.remove();
        $('#reviewAttack h1').text('P ' + tmpUnit.player.name + '(attacker) won.');
        tmpUnit2.player.count--;
        if (tmpUnit2.player.dead) {
            alert('Target capitulated.')
            tmpUnit2.player.cards.forEach(x => {
                if (x instanceof Unit)
                    x.remove();
            })
        }
    } else {
        let l1 = tmpUnit;
        let l2 = tmpUnit2;
        l1.remove();
        l2.remove();
        if (tmpCombats
            .filter(x => x instanceof Retract).length)
            l1.add();
        l2.add();
        $('#reviewAttack h1').text('P ' + tmpUnit2.player.name + '(defender) won.');
    }
}
