class AI {
    constructor (player) {
        this.attach(player);
    }

    calcRisks() {
        console.log('calcRisks()');
        let player = this.player;
        this._risks = PLAYERS.filter(x => x != player && !x.dead).map(this.evalPlayer);
    }

    get risks() {
        return this._risks.filter(x => !x.player.dead)
    }

    evalPlayer(x) {
        let atk = 0;
        let def = 0;
        let maxUnit = 0;
        x.cards.forEach(xx => {
            if (xx instanceof Combat) {
                if (xx.atk > 0) atk += xx.atk;
                if (xx.def > 0) def += xx.def;
            } else if (xx instanceof Unit) {
                maxUnit = Math.max(maxUnit, Math.max(xx.atk, xx.def));
            }
        });
        atk += x.spirit.strength;
        def += x.spirit.defend;
        atk += maxUnit;
        def += maxUnit;
        return { player: x, atk: atk, def: def }
    }

    useRecon() {
        console.log('Use recon: ');
        let recon = this.cards.filter(x => x instanceof Recon);
        if (recon.length) {
            recon[0].remove();
            this.player.action = true;
            console.log('USED');
            this.calcRisks();
        }
    }

    tryCombats2(evalResult) {
        let player = this.player;
        let maxUnit = this.maxUnit;
        let result = combine(
            this.combats.sort((x, y) =>
                Math.max(x.atk, x.def) - Math.max(y.atk, y.def)
            ), 1);
        let minCombo = null;
        result.forEach(combo => {
            if (minCombo) return;
            let atk = maxUnit.atk + player.spirit.strength;
            let def = maxUnit.def + player.spirit.defend;
            combo.forEach(x => {
                atk += x.atk;
                def += x.def;
            });
            let first = calcFirst(tmpCombats, combo);
            if (first == 1 && def > evalResult.atk)
                minCombo = combo;
            else if (first == 2 && atk >= evalResult.def)
                minCombo = combo;
            else if (atk >= evalResult.def && def > evalResult.atk)
                minCombo = combo;
        });
        let atk = maxUnit.atk + player.spirit.strength;
        let def = maxUnit.def + player.spirit.defend;
        if (atk >= evalResult.def && def > evalResult.atk) {
            return [];
        }
        let disguise = this.combats.filter(x => x instanceof Disguise)
        if (minCombo &&
            minCombo.filter(x => x instanceof Disguise).length == 0
            && disguise.length) {
            minCombo.push(disguise[0]);
        }
        return minCombo;
    }

    tryCombats(evalResult) {
        let player = this.player;
        let maxUnit = this.maxUnit;
        let result = combine(
            this.combats.sort((x, y) =>
                Math.max(x.atk, x.def) - Math.max(y.atk, y.def)
            ), 1);
        let minCombo = null;
        result.forEach(combo => {
            if (minCombo) return;
            let atk = maxUnit.atk + player.spirit.strength;
            let def = maxUnit.def + player.spirit.defend;
            combo.forEach(x => {
                atk += x.atk;
                def += x.def;
            });
            if (atk > evalResult.atk && def > evalResult.def) {
                minCombo = combo;
            }
        });
        let assaultUsed = false;
        if (minCombo && minCombo.length == 0)
            return this.cards.filter(x => (
                x instanceof Retract ||
                (x instanceof Assault && (assaultUsed ? false : assaultUsed = true))
            ));
        return minCombo;
    }

    think() {
        let player = this.player;

        if (window.requestSwitchAttack) {
            if (this.dead) {
                alert('dead request switch attack STUB');
                return;
            }
            let targetStrength = {
                player: tmpUnit.player,
                atk: tmpUnit.atk + tmpUnit.player.spirit.strength,
                def: tmpUnit.def + tmpUnit.player.spirit.defend,
            };
            tmpCombats.forEach(x => {
                targetStrength.atk += x.atk;
                targetStrength.def += x.def;
            });
            let combo = this.tryCombats2(targetStrength);
            if (combo) {
                window.tmpUnit2 = this.maxUnit;
                window.tmpCombats2 = combo;
            } else {
                window.tmpUnit2 = this.minUnit;
                window.tmpCombats2 = [];
            }
            $('#nextScreen').hide();
            reviewAttack();
            return;
        }

        console.log(`---------${player.name}--------`);
        if (player.dead && !this.tryRebirth()) {
            this.player.action = true;
            next();
            return;
        }

        let useNormalSpecialCard = x => {
            if (x instanceof Train &&
                player.ai.units.length == 0) {
                console.log('Skip Train');
                return;
            }
            console.log('Use ' + x.name);
            let oldAlert = alert;
            alert = () => {};
            x.onSelect('special')
            x.remove();
            alert = oldAlert;
        }

        if (player.drawable) {
            this.cards.filter(x => x instanceof Mobilize)
                .forEach(useNormalSpecialCard);
        }

        this.cards.forEach(x => {
            if (x instanceof Usurp) x.remove();
        })

        this.cards.filter(x => (
            x instanceof Pray ||
            x instanceof Train ||
            x instanceof Degrade ||
            x instanceof Upgrade ||
            (!player.drawable && x instanceof Compact)))
            .forEach(useNormalSpecialCard);

        let strength = this.evalPlayer(this.player);
        this.useRecon();

        if ((!player.drawable || this.units.length > 2) &&
            this.units.length && this.player.attacks <= 2 &&
            year > PLAYERS.length) {
            console.log('Looking to attack');
            let targets = this.risks.filter(x =>
                strength.atk >= x.def && x.atk < strength.def
                && this.tryCombats(x)
            ).sort((x, y) =>
                Math.max(x.atk, x.def) - Math.max(y.atk, y.def)
            );
            console.log(`Found ${targets.length} targets.`);
            if (targets.length != 0){
                this.attack(
                    this.maxUnit,
                    this.tryCombats(targets[0]),
                    targets[0].player);
                return;
            }
        }

        if (!player.drawable && this.cards.length < CARD_MAX) {
            this.drawCards();
            next();
            return;
        }

        if (this.player.action) {
            next();
            return;
        }
        // attack use min
        let minUnit = this.minUnit;
        if (minUnit)
            this.attack(
                minUnit,
                this.cards.filter(x =>
                    x instanceof Retract ||
                    x instanceof Disguise),
                this.risks.sort(
                    (x, y) => x.def - y.def
                )[0].player
            );
        else
            next();
    }

    attack(unit, combats, target) {
        if (!unit) {
            alert('ERROR: AI.attack(a, b, c) where a is null.')
            return;
        }
        if (target.dead) {
            alert('ERROR: AI.attack(a, b, c) where c is dead.')
            return;
        }
        if (target.cards.filter(x => x instanceof Unit).length == 0) {
            alert('Target capitulated.');
            console.log('AI target directly capitulated.')
            target.dead = true;
            this.think();
            return;
        }
        this.player.action = true;
        if (++this.player.attacks > 2) return;
        console.log(`Attack ${target.name}`);
        unit.remove();
        combats.forEach(x => x.remove())
        window.tmpUnit = unit;
        window.tmpCombats = combats;
        window.tmpTarget = target;
        this.calcRisks();
        switchAttack();
    }

    drawCards() {
        console.log('Draw cards');
        for (let i = this.cards.length;i < CARD_MAX;i++) {
            drawCard();
        }
    }

    tryRebirth() {
        let rebirth = this.cards.filter(x => x instanceof Rebirth);
        if (rebirth.length) {
            rebirth[0].onSelect('special');
            rebirth[0].remove();
            return true;
        }
    }

    attach(player) {
        player.ai = this;
        this.player = player;
        this.calcRisks();
    }

    get units() {
        return this.player.cards.filter(x => x instanceof Unit);
    }

    get combats() {
        return this.player.cards.filter(x => x instanceof Combat);
    }

    get cards() {
        return this.player.cards;
    }

    set cards(c) {
        this.player.cards = c;
    }

    get minUnit() {
        return this.units.sort((x, y) => x.atk - y.atk)[0]
    }

    get maxUnit() {
        return this.units.sort((x, y) => y.atk - x.atk)[0]
    }
}


function aiThink() {
    if (!currentPlayer.ai){
        new AI(currentPlayer);
        console.log('Creating AI for P ' + currentPlayer.name);
    }
    currentPlayer.ai.think();
}
