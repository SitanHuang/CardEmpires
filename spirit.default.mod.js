var SPIRITS = [
    {
        name: 'Nationalism',
        desc: 'Def + 2, Atk + 2, +Recon, +Assault, +Rebirth',
        strength: 2,
        defend: 2,
        card: [new Mobilize(), new Assault(), new Rebirth()]
    },
    {
        name: 'Neutralism',
        desc: 'Def + 4, +Recon',
        strength: 0,
        defend: 4,
        card: [new Recon(), new Recon()]
    },
    {
        name: 'Imperialism',
        desc: 'Atk + 4,+Mobilize, +Trump',
        strength: 4,
        defend: 0,
        card: [new Mobilize(), new Trump()]
    },
    {
        name: 'Communism',
        desc: '+Assault, +Red Army, +Trump, +Blitz, +Train',
        strength: 0,
        defend: 0,
        card: [new Assault(), new Trump(), new Blitz(), new Train(), new Unit('Red Army', 34)]
    },
    {
        name: 'Non-aligned',
        desc: '',
        strength: 0,
        defend: 0,
        card: []
    },
    {
        name: 'Guerilla',
        desc: 'Def + 2, +Assault, +Encircle, +Degrade, +Disguise, +Recon',
        strength: 0,
        defend: 2,
        card: [new Assault(), new Encircle(), new Degrade(), new Disguise(), new Recon()]
    },
    {
        name: 'Unrest',
        desc: 'Atk - 2, +Rebirth',
        strength: -2,
        defend: 0,
        card: [new Rebirth(),new Rebirth()]
    }
].sort(x => .5 - Math.random()).sort(x => .5 - Math.random()).sort(x => .5 - Math.random());
