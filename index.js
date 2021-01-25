function showBanner() {
    $('#dashboard').hide();
    paintPlayers($('#nextScreen .card-container'), [currentPlayer], () => {}, true);
    $('#nextScreen').show().find('button').last()
        .replaceWith(`<button onclick="$(this).text('go').attr('onclick', 'start()')">ready</button>`);
}

function start() {
    $('#nextScreen').hide();
    $('#dashboard').show()
        .find('h3').html(`Health: ${currentPlayer.count}<br>
            ${currentPlayer.spirit.name}<br>${currentPlayer.spirit.desc}`);
    $('#drawCardButton').show();
    repaintDashboardCards();
}

function repaintDashboardCards() {
    paintCards($('#dashboard .card-container'), null, 'special');
}

var CARD_MAX = 7;

function drawCard(limit) {
    if (isNaN(limit)) limit = Math.max(0, CARD_MAX - currentPlayer.cards.length);
    if (currentPlayer.dead) {
        alert('You are dead.')
        return;
    }
    if (currentPlayer.drawable) {
        alert('Wait for next turn.');
        return;
    }
    if (limit == 0) {
        alert('Your limit is reached.(' + CARD_MAX + ' cards)');
        $('#drawCardButton').hide();
        return;
    }
    currentPlayer.action = true;
    if (currentPlayer.cards.filter(x => x instanceof Unit).length == 0
        && currentPlayer.cards.length >= 4) {
        CARDS.filter(x => x instanceof Unit)[0].add(currentPlayer);
    } else
        CARDS.shift().add(currentPlayer);
    paintCards($('#dashboard .card-container'), null, 'special', x => {alert('Use cards until next round.')}, true)
}

function selectPlayer(players, callback) {
    players = players ? players : PLAYERS.filter(x => x != currentPlayer)
    $('#playerSelector').show().find('h2').text('Select target player')
        .parent().find('button').show();
    paintPlayers($('#playerSelector .card-container'), players, callback, true)
}

function selectCard(cards, text, type, callback, hidden) {
    $('#playerSelector').show().find('h2').text(text);
    paintCards($('#playerSelector .card-container'), cards, type, callback, false, hidden)
}

function paintCards(container, players, type, callback, animate, hide) {
    callback = callback ? callback : x => {
        if (x.onSelect('special')) {
            x.remove();
            currentPlayer.action = true;
            return currentPlayer.cards;
        } else
            alert('Card cannot be used here.');
    };
    players = players ? players : currentPlayer.cards;
    container.html('');
    players.forEach((x, y) => {
        let ele = $(`
            <div class='card' style="background: ${x.color};${x.color ? '' : 'color: black'}">
            <h4>${hide ? x.name.replace(/./g, 'x') : x.name}</h4>
            <h3>${hide ? 'Hidden' : x.description}</h6>
            </div>`).click(e => {
                let repaint = callback(x);
                if (repaint)
                    paintCards(container, repaint, type, callback, animate)
            });
        if (animate && y == 0)
            ele.addClass('animated flipInX ');
        container.append(ele)
    })
}

function paintPlayers(container, players, callback, hide) {
    players = players ? players : PLAYERS;
    container.html('');
    players.forEach(x => {
        let cards = '';
        x.cards.forEach(x => {
            cards += `<span style='background: ${x.color}'>${hide ? '' : x.name[0]}</span>`;
        })
        let ele = $(`
            <div class=card style="background: ${x.color};${x.color ? '' : 'color: black'}">
            <h4>P ${x.name}</h4>
            <h3>${x.spirit.name}<br>${x.spirit.desc}</h3>
            <h5>Health ${x.count}/4</h5>
            ${cards}
            </div>`).click(e => {
                let repaint = callback(x);
                if (repaint)
                    paintPlayers(container, repaint, callback)
            });
        container.append(ele)
    })
}
