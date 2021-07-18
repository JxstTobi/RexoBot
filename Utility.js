function getGuildMemberRank(uuid, guild) {
    var memberobject = guild.members;
    for (var key of Object.keys(memberobject)) {
        if (memberobject[key].uuid === uuid) {
            return memberobject[key].rank;
        }
    }
    return;
}
function getOnline(uuid, session) {
    if (session.online === false) {
        return ('Nein');
    }
    if (session.online === true) {
        return ('Ja');
    }
}
function getGuildMemberJoined(uuid, guild) {
    var memberobject = guild.members;
    for (var key of Object.keys(memberobject)) {
        if (memberobject[key].uuid === uuid) {
            return memberobject[key].joined;
        }
    }
    console.log("Invalid Name");
    return;
}
function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}
function getProfileID(cutename, profiles) {
    var profilesobject = profiles;
    for (var key of Object.keys(profilesobject)) {
        if (profilesobject[key].cute_name === upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(cutename))) {
            return profilesobject[key].profile_id;
        }
    }
    return;
}
function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && 
        !isNaN(parseFloat(str));
}
const constants = {
    // By sky.shiiyu.moe
    // XP required for each level of a skill
    leveling_xp: {
        1: 50,
        2: 125,
        3: 200,
        4: 300,
        5: 500,
        6: 750,
        7: 1000,
        8: 1500,
        9: 2000,
        10: 3500,
        11: 5000,
        12: 7500,
        13: 10000,
        14: 15000,
        15: 20000,
        16: 30000,
        17: 50000,
        18: 75000,
        19: 100000,
        20: 200000,
        21: 300000,
        22: 400000,
        23: 500000,
        24: 600000,
        25: 700000,
        26: 800000,
        27: 900000,
        28: 1000000,
        29: 1100000,
        30: 1200000,
        31: 1300000,
        32: 1400000,
        33: 1500000,
        34: 1600000,
        35: 1700000,
        36: 1800000,
        37: 1900000,
        38: 2000000,
        39: 2100000,
        40: 2200000,
        41: 2300000,
        42: 2400000,
        43: 2500000,
        44: 2600000,
        45: 2750000,
        46: 2900000,
        47: 3100000,
        48: 3400000,
        49: 3700000,
        50: 4000000,
        51: 4300000,
        52: 4600000,
        53: 4900000,
        54: 5200000,
        55: 5500000,
        56: 5800000,
        57: 6100000,
        58: 6400000,
        59: 6700000,
        60: 7000000
    },

    skills_cap: {
        taming: 50,
        farming: 60,
        mining: 60,
        combat: 60,
        foraging: 50,
        fishing: 50,
        enchanting: 60,
        alchemy: 50,
        carpentry: 50,
        runecrafting: 25
    },
}
//By sky.lea.moe
function getLevelByXp(xp, type = 'regular') {
    let xp_table;

    switch (type) {
        case 'runecrafting':
            xp_table = constants.runecrafting_xp;
            break;
        case 'dungeon':
            xp_table = constants.dungeon_xp;
            break;
        default:
            xp_table = constants.leveling_xp;
    }

    if (isNaN(xp)) {
        return {
            xp: 0,
            level: 0,
            xpCurrent: 0,
            xpForNext: xp_table[1],
            progress: 0
        };
    }

    let xpTotal = 0;
    let level = 0;

    let xpForNext = Infinity;

    let maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();
    let maxLevelCap = maxLevel;
    for (let x = 1; x <= maxLevelCap; x++) {
        xpTotal += xp_table[x];

        if (xpTotal > xp) {
            xpTotal -= xp_table[x];
            break;
        } else {
            level = x;
        }
    }

    let xpCurrent = Math.floor(xp - xpTotal);

    if (level < maxLevel)
        xpForNext = Math.ceil(xp_table[level + 1]);

    let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

    return {
        xp,
        level,
        maxLevel,
        xpCurrent,
        xpForNext,
        progress
    };
}
function getSlayerLevelByXp(xp, type) {
    if (xp >= 5) {
        if (xp >= 15) {
            if (xp >= 200) {
                if (xp >= 1000) {
                    if (xp >= 5000) {
                        if (xp >= 20000) {
                            if (xp >= 100000) {
                                if (xp >= 400000) {
                                    if (xp >= 1000000) {
                                        return 9;
                                    }
                                    return 8;
                                }
                                return 7;
                            }
                            return 6;
                        }
                        return 5;
                    }
                    return 4;
                }
                return 3;
            }
            return 2;
        }
        return 1;
    }
}
module.exports.getGuildMemberRank = getGuildMemberRank
module.exports.getOnline = getOnline
module.exports.getGuildMemberJoined = getGuildMemberJoined
module.exports.upperCaseFirstLetter = upperCaseFirstLetter
module.exports.getProfileID = getProfileID
module.exports.isNumeric = isNumeric
module.exports.getLevelByXp = getLevelByXp
module.exports.getSlayerLevelByXp = getSlayerLevelByXp