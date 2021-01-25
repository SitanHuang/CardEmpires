const SPECIAL_COLOR = '#3F51B5';
window.SPECIAL_COLOR = SPECIAL_COLOR;

class Recon extends Card {
    constructor () {
        super('Recon', 'Reveal attacking strength', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        selectPlayer(null, x => {
            paintPlayers($('#playerSelector .card-container'), [x])
        });
        return true;
    }
}
class Usurp extends Card {
    constructor () {
        super('Usurp', 'Steal a card', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        selectPlayer(null, target => {
            selectCard(target.cards, 'Select a card', '', card => {
                alert(`You received '${card.name}'.`);
                card.remove();
                card.add(currentPlayer);
                $('#playerSelector').hide();
                repaintDashboardCards();
            }, true)
        });
        return true;
    }
}

class Pray extends Card {
    constructor () {
        super('Pray', '60% of getting prizes, 40% of losing combat cards', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        alert('Are you ready?');
        alert('3');
        alert('2');
        alert('1');
        if (Math.random() < 0.6) {
            alert('My Lord, you won that prize!');
            new Unit('Knight', 34).add(currentPlayer);
        } else {
            alert('Bad luck for you, my lord.');
            currentPlayer.cards.forEach(x => {
                if (x instanceof Combat)
                    x.remove()
            })
        }
        return true;
    }
}

class Degrade extends Card {
    constructor () {
        super('Degrade', 'Change unit names to Squad', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        currentPlayer.cards.forEach(x => {
            if (x instanceof Unit) {
                x.name = 'Squad';
            }
        });
        return true;
    }
}

class Upgrade extends Card {
    constructor () {
        super('Upgrade', 'Change unit names to Army', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        currentPlayer.cards.forEach(x => {
            if (x instanceof Unit) {
                x.name = 'Army';
            }
        });
        return true;
    }
}

class Compact extends Card {
    constructor () {
        super('Compact', 'Combine all units', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        let atk = 0;
        let def = 0;
        currentPlayer.cards.forEach(x => {
            if (x instanceof Unit) {
                atk += x.atk;
                def += x.def;
                x.remove();
            }
        });
        if (atk == 0 || def == 0) {
            alert('You have no effective units to combine.');
            return false;
        }
        new Unit('HQ', Math.max(atk, def)).add(currentPlayer);
        return true;
    }
}

class Rebirth extends Card {
    constructor () {
        super('Rebirth', 'One chance against death', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        if (currentPlayer.dead == false) {
            return false;
        }
        currentPlayer.dead = false;
        return true;
    }
}

class Train extends Card {
    constructor () {
        super('Train', 'All units def + 4, atk + 4', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        currentPlayer.cards.forEach(x => {
            if (x instanceof Unit) {
                x.def += 4;
                x.atk += 4;
            }
        })
        return true;
    }
}

class Mobilize extends Card {
    constructor () {
        super('Mobilize', 'Draw two more cards', SPECIAL_COLOR)
    }

    onSelect(type, data) {
        if (type != 'special') return false;
        if (currentPlayer.dead) {
            alert('Your are dead.');
            return false;
        }
        CARDS.shift().add(currentPlayer);CARDS.shift().add(currentPlayer);
        return true;
    }
}
