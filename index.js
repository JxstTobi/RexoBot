const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const file = fs.createWriteStream("file.docx");
const fetch = require("node-fetch");
const mysql = require('mysql');
var CronJob = require('cron').CronJob;
const { RichEmbed, Channel, MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const connection = mysql.createConnection({
  host     : config.host,
  port     : '3306',
  user     : config.user,
  password : config.password,
  database : config.database,
  charset : 'utf8mb4'
});
const constants = {
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
};
const COLORS = {
    turquoise: 0x1abc9c,
    greensea: 0x16a085,
    sunflower: 0xf1c40f,
    Orange: 0xf39c12,
    Emerland: 0x2ecc71,
    nephritis: 0x27ae60,
    carrot: 0xe67e22,
    pumpkin: 0xd35400,
    peterriver: 0x3498db,
    belizehole: 0x2980b9,
    alizarin: 0xe74c3c,
    pomegranate: 0xc0392b,
    amethyst: 0x9b59b6,
    whisteria: 0x8e44ad,
    clouds: 0xecf0f1,
    silver: 0xbdc3c7,
    wetasphalt: 0x34495e,
    midnightblue: 0x2c3e50,
    concrete: 0x95a5a6,
    asbestos: 0x7f8c8d,
    silver: 0xbdc3c7

} 
function cataLoop(msg, args) {
    connection.query(`SELECT * FROM verified WHERE discordid = ` + msg.member.id, function (err, result, fields) {
    var string = JSON.stringify(result);
    var json =  JSON.parse(string);
    var errorEmbed = new MessageEmbed();
    if(json.length != 0) {
    for(var i = 0; i < result.length; i++) {
        var user = msg.member
        console.log(json[i].discordid)
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + json[i].name)
        .then(result2 => result2.json())
        .then(({ player }) => {
            if(player != undefined) {
            fetch("https://api.hypixel.net/skyblock/profiles?key=" + config.api_key + "&uuid=" + player.uuid)
            .then(result1 => result1.json())
            .then(({ profiles }) => {
                if(profiles != undefined) {
                var parray = []
                for(var p = 0; p < profiles.length; p++) {
                var last_save = profiles[p].members[player.uuid].last_save
                parray.push(last_save)
                parray.sort();
               }
               function getCataExp(last_save) {
                var profilesobject = profiles;
                for (var key of Object.keys(profilesobject)) {
                    if (profilesobject[key].members[player.uuid].last_save === last_save) {
                        return profilesobject[key].members[player.uuid].dungeons.dungeon_types.catacombs.experience
                    }
                }
                console.log('Dieses Profil existiert nicht.');
                return;
            }
               console.log(player.displayname + " " + user.id + " " + getCataExp(parray[parray.length - 1]))     
               var cataExp = getCataExp(parray[parray.length - 1]);
            if(cataExp >= 625 && cataExp < 4385)            {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 5'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 5 Rolle erhalten.')
            } else if(cataExp >= 4385 && cataExp < 25340)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 5')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 10 Rolle erhalten.')
            } else if(cataExp >= 25340 && cataExp < 135640)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 55')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 15 Rolle erhalten.')
            } else if(cataExp >= 135640 && cataExp < 668640)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 55')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 20 Rolle erhalten.')
            } else if(cataExp >= 668640 && cataExp < 3084640)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 5')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 25 Rolle erhalten.')
            } else if(cataExp >= 3084640 && cataExp < 13259640)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 5')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35')); } catch {}
                msg.channel.send('Du hast die Catacombs 30 Rolle erhalten.')
            } else if(cataExp >= 13259640)     {
                user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Catacombs 35'));
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 5')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 15')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 20')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 25')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 10')); } catch {}
                try { user.roles.remove(msg.guild.roles.cache.find(role => role.name === 'Catacombs 30')); } catch {}
                msg.channel.send('Du hast die Catacombs 35 Rolle erhalten.')
            } 
        } else {
            errorEmbed.addField('Error', 'Keine SkyBlock-Profile gefunden.');
            errorEmbed.addField('Information', 'Falls der Spieler Profile hat und diese trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
            msg.channel.send(errorEmbed);
        }
            })
        } else {
            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
            msg.channel.send(errorEmbed);
        }
        })
    }
} else {
    msg.channel.send('Verifiziere dich bitte in <#808788152541642782>.')
}
})
}
var client = new Discord.Client();
client.on('ready', () => {
    console.log(`logged in as ${client.user.username}`);
    client.user.setActivity('Hypixel Skyblock API', { type: 'WATCHING' });
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var h = today2.getHours()
    var yyyy2 = today2.getFullYear();
    today2 = dd2 + '/' + mm2 + '/' + yyyy2;
    connection.connect(err => {
    console.log("--------------------------------\n");
    if (err) return console.log('[ERR] | MySQL error \n' + err);
    console.log('[OK] | MySQL connected');
    function guild(msg, args) {
    fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
    .then(result => result.json())
    .then(({ guild }) => {  
        connection.query(`SELECT * FROM guildstats WHERE Date = '${today2}';`, function (err, result, fields) {
            var string = JSON.stringify(result);
            var json =  JSON.parse(string);
            console.log(json.Members)
            for(var i = 0; i<json.length; i++) {
                console.log(json[i].Members)
            if(json[i].Members === undefined) {
                connection.query(`INSERT INTO guildstats(Members, Date) VALUES ('${guild.members.length}', '${today2}') ON DUPLICATE KEY UPDATE Members = '${guild.members.length}' AND Date = ${today2};`, function (err, result, fields) {
                });
            } else {
                connection.query(`UPDATE guildstats SET Members = '${guild.members.length}' WHERE Date = '${today2}';`, function (err, result, fields) {
                    console.log(err)
                });
            }
        } 
        if(json.length === 0) {
            if(json.Members === undefined) {
                connection.query(`INSERT INTO guildstats(Members, Date) VALUES ('${guild.members.length}', '${today2}') ON DUPLICATE KEY UPDATE Members = '${guild.members.length}' AND Date = ${today2}`, function (err, result, fields) {
                });
            } else {
                connection.query(`UPDATE guildstats SET Members = '${guild.members.length}' WHERE Date = '${today2}'`, function (err, result, fields) {
                    console.log(err)
                });
            }
        }
        })
    })
    }
var job = new CronJob('0 2,4,6,8,10,12,14,15,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * *', function() {
    guild();
  }, null, true, 'Europe/Berlin');
  job.start();
});
})
function getBans(msg, args) {
    msg.guild.fetchBans()
  .then(banned => {
    let list = banned.map(user => user.id).join('\n');

    // Make sure if the list is too long to fit in one message, you cut it off appropriately.
    console.log(list)
  })
  .catch(msg.guild.fetchBans());
}
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
    if(session.online === false) {
        return('Nein');
    }
    if(session.online === true) {
        return('Ja');
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
var cmdmap = {
    pinfo: player_cmd,
    stamm: stamm_cmd,
    checkuser: checkuser_cmd,
    roleclaim: role_cmd,
    botinfo: botinfo_cmd,
    help: help_cmd,
    icheck: lastonline,
    urlaub: urlaub_cmd,
    dverify: dungeon_verify_command,
    //user: fetch_user_cmd,
    cata: cataLoop,
    kicktage: check_kickdays,
    gstats: guildinfo,
    gscammers: gscammer_cmd
}
function player_cmd(msg, args) {
    var channel = msg.channel,
        playerInfoEmbed = new Discord.MessageEmbed(),
        errorEmbed = new Discord.MessageEmbed();
    errorEmbed.setColor(COLORS.carrot);
    if(args.length === 1) {
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => result.json())
        .then(({ player }) => {
        if(player != undefined) {
            var uuid = player.uuid,
                displayName = player.displayname;
            fetch("https://api.hypixel.net/status?key=" + config.api_key + "&uuid=" + uuid)
            .then(result =>  result.json()) 
            .then(({ session }) => {
                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                .then(result =>  result.json()) 
                .then(({ guild }) => {
            playerInfoEmbed.setTitle('`Spieler-Info von ' + displayName + '`');
            playerInfoEmbed.setURL('https://api.hypixel.net');
            playerInfoEmbed.setColor(COLORS.silver);
            playerInfoEmbed.addFields(
                { name: 'UUID:', value: '' + uuid },
                { name: 'Momentan online: ', value : '' + getOnline(uuid, session) });
            if(guild != undefined) {
                var guildName = guild.name,
                    preferredGames = guild.preferredGames;      
                playerInfoEmbed.addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Gilde:', value: '' + guildName },
                    { name: 'Rang in der Gilde:', value: '' + getGuildMemberRank(uuid, guild) },
                    { name: 'Hauptspiel der Gilde:', value: '' + preferredGames });
                channel.send(playerInfoEmbed);
            } else {
                playerInfoEmbed.addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Gilde:', value: 'Keine' });
                channel.send(playerInfoEmbed);
            }
        });
    });
    } else {
        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
        channel.send(errorEmbed);
    }
    });  
    } else {
        errorEmbed.addField('Error', 'Bitte gebe einen Namen an.');
        channel.send(errorEmbed);
    }
}
function stamm_cmd(msg, args) {
    var channel = msg.channel,
        botChannel = client.channels.cache.get('702073362972803082'),
        beantragungsChannel = client.channels.cache.get('703649124242948116'),
        errorEmbed = new MessageEmbed(),
        informationEmbed = new MessageEmbed();
    informationEmbed.setColor(COLORS.greensea);
    errorEmbed.setColor(COLORS.pumpkin);
    if(args.length === 1) {
        var today = Date.now();
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => result.json())
        .then(({ player }) => {
            if(player === null || player === undefined) {
                errorEmbed.addField('Error','Dieser Spieler existiert nicht.');
                errorEmbed.setFooter('Versuche es in ca 2 Minuten nochmal, falls der Spieler existiert.')
                channel.send(errorEmbed);
            } else {
            var uuid = player.uuid;
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
            .then(result => result.json())
            .then(({ guild }) => {
                var idGuild1 = '5d8f585577ce8436b66ace6e';
                var guildTag = null;
                if(guild === null){
                    errorEmbed.addField('Error','Du bist nicht in unserer Gilde! Trete uns doch bei /g join Rexo');
                    channel.send(errorEmbed);
                } else if(guild._id === idGuild1) {
                    if(channel === botChannel) {
                        guildTag = "1";
                        var time_difference = today - getGuildMemberJoined(uuid, guild);
                            time_difference = time_difference/1000/60/60/24;
                        if(time_difference >= 21) {
                            informationEmbed.addField('Information', 'Beantragung erfolgreich gesendet.');
                            channel.send(informationEmbed);
                            var beantragungsEmbed = new MessageEmbed();
                            beantragungsEmbed.setColor(COLORS.silver);
                            beantragungsEmbed.setColor(COLORS.pumpkin);
                            beantragungsEmbed.setTitle("Stamm Beantragung von `" + msg.member.user.tag + "`");
                            beantragungsEmbed.addField('IGN:', "`" + player.displayname + "`");
                            beantragungsEmbed.addField('Gilde: ', guildTag);
                            beantragungsChannel.send('', beantragungsEmbed);
                        } else {
                            errorEmbed.addField('Error', 'Beantragung fehlgeschlagen. Du bist weniger als 21d in der Gilde.');
                            errorEmbed.setFooter('Versuche es in ca 2 Minuten nochmal, falls der Spieler existiert.')
                            channel.send(errorEmbed);
                        }
                    } else {
                        errorEmbed.addField('Error', 'Dies ist der falsche Channel nutze ' + "<#702073362972803082>");
                        channel.send(errorEmbed);
                    }
                } else {
                    errorEmbed.addField('Error','Du bist nicht in unserer Gilde! Trete uns doch bei /g join Rexo');
                    channel.send(errorEmbed);
                }
            })
        }
    })
} else {
    chan.send("Bitte gebe einen Namen an.")
}
}
function checkuser_cmd(msg, args) {
    var checkUserEmbed = new MessageEmbed(),
        infoEmbed = new MessageEmbed();
    infoEmbed.setColor(COLORS.greensea);
    infoEmbed.addField('Information', 'Wenn du keine Antwort außer dieser Nachricht bekommst, dann existiert der Spieler nicht!');
    msg.channel.send(infoEmbed);
    if(args.length === 1) {
        checkUserEmbed.setTitle('Report-Information');
        checkUserEmbed.setColor(COLORS.silver);
        fetch("https://api.mojang.com/users/profiles/minecraft/" + args[0])
        .then(result => result.json())
        .then(({ id }) => {
            msg.channel.send(checkUserEmbed).then(msge => {
                if(id != undefined) {
                    checkUserEmbed.addField('Name:', '`' + args[0] + '`');
                    checkUserEmbed.addField('UUID:', id);
                    msge.edit(checkUserEmbed);
                    fetch("https://script.tftech.de/api/hggv2/?key=bf5a20d1-44a7-4b3d-843c-b0a22fbda8e5&uuid=" + id)
                    .then(result => result.json())
                    .then(( { reports }) => {
                        if(reports != undefined) {
                            for(var i = 0; i < reports.length; i++) {
                                checkUserEmbed.addField('Reports:', '' + reports[0].keyword);
                                msge.edit(checkUserEmbed);
                                checkUserEmbed.addField('Beschreibung:', '' + reports[0].description);
                                msge.edit(checkUserEmbed);
                                checkUserEmbed.addField('Beweise:', '' + reports[0].proofs);
                                msge.edit(checkUserEmbed);
                            }
                        } else {
                            checkUserEmbed.addField('Reports:', 'Keine Reports gefunden.');
                            msge.edit(checkUserEmbed);
                        }
                    })
                } else {
                    checkUserEmbed.setColor(COLORS.pumpkin);
                    checkUserEmbed.addField('Status:', 'Spieler nicht gefunden.');
                    msg.channel.send(checkUserEmbed);
                }
            });
        });
    } else {
        checkUserEmbed.setColor(COLORS.pumpkin);
        checkUserEmbed.addField('Status:', 'Gebe bitte einen Namen an.');
        msg.channel.send(checkUserEmbed);
    }
}
function role_cmd(msg, args) {
    var author = msg.member,
        channel = msg.channel,
        msgGuild = msg.guild,
        errorEmbed = new Discord.MessageEmbed(),
        guildEmbed = new MessageEmbed;
    errorEmbed.setColor(COLORS.pumpkin);
    guildEmbed.setColor(COLORS.silver);
    if(args.length === 2) {
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => result.json())
        .then(({ player }) => {
            if(player === undefined) {        
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
                channel.send(errorEmbed);
            } else {
                
                var uuid = player.uuid, 
                    profiles =  player.stats.SkyBlock.profiles;
                fetch("https://api.hypixel.net/skyblock/profile?key=" + config.api_key + "&profile=" + getProfileID(args[1], profiles))
                .then(result => result.json())
                .then(({ profile }) => {
                    if(player.socialMedia != undefined) {
                        if(player.socialMedia.links != undefined) {
                            var dc_tag_hypixel = player.socialMedia.links.DISCORD;
                            if(dc_tag_hypixel != undefined) {
                                if(dc_tag_hypixel === author.user.tag) {
                                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                                .then(result => result.json())
                                .then(({ guild }) => {
                                    var idGuild1 = '5d8f585577ce8436b66ace6e';
                                    if(guild === null  || guild._id != idGuild1) {
                                        guildEmbed.addField('Gilden Rolle', "Du bist nicht in unseren Gilden");
                                        const g1Role = msgGuild.roles.cache.find(role => role.name === '1. Gilde');
                                        author.roles.remove(g1Role);
                                        channel.send(guildEmbed);
                                    } else if(guild._id === idGuild1) {
                                        const g1Role = msgGuild.roles.cache.find(role => role.name === '1. Gilde');
                                        author.roles.add(g1Role);
                                        guildEmbed.addField('Gilden Rolle', "Gilde 1 hinzugefügt");
                                        channel.send(guildEmbed);
                                    }
                                })      
                                if(profile != undefined) {      
                                    if(profile.members[uuid].unlocked_coll_tiers != undefined && 
                                    profile.members[uuid].experience_skill_foraging != undefined &&
                                    profile.members[uuid].experience_skill_combat != undefined &&
                                    profile.members[uuid].experience_skill_mining != undefined &&
                                    profile.members[uuid].experience_skill_alchemy != undefined &&
                                    profile.members[uuid].experience_skill_farming != undefined &&
                                    profile.members[uuid].experience_skill_taming != undefined &&
                                    profile.members[uuid].experience_skill_enchanting != undefined &&
                                    profile.members[uuid].experience_skill_fishing != undefined)  {
                                        var foragingExp = profile.members[uuid].experience_skill_foraging,
                                            combatExp = profile.members[uuid].experience_skill_combat,
                                            miningExp = profile.members[uuid].experience_skill_mining,
                                            alchemyExp = profile.members[uuid].experience_skill_alchemy,
                                            farmingExp = profile.members[uuid].experience_skill_farming,
                                            tamingExp = profile.members[uuid].experience_skill_taming,
                                            enchantingExp = profile.members[uuid].experience_skill_enchanting,
                                            fishingExp = profile.members[uuid].experience_skill_fishing,
                                            unlockedCollections = profile.members[uuid].unlocked_coll_tiers,
                                            maxedCollections = 0,
                                            maxedFarmingCollections = 0;
                                        if(unlockedCollections.includes("WHEAT_11")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Wheat'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Wheat')); }   
                                        if(unlockedCollections.includes("CARROT_ITEM_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Carrot'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Carrot')); }
                                        if(unlockedCollections.includes("POTATO_ITEM_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Potato'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Potato')); }
                                        if(unlockedCollections.includes("PUMPKIN_11")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Pumpkin'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Pumpkin')); }
                                        if(unlockedCollections.includes("MELON_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Melon'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Melon')); }
                                        if(unlockedCollections.includes("SEEDS_6")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Seeds'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Seeds')); }
                                        if(unlockedCollections.includes("MUSHROOM_COLLECTION_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Mushroom'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Mushroom')); }
                                        if(unlockedCollections.includes("INK_SACK:3_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Cocoa Beans'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Cocoa Beans')); }
                                        if(unlockedCollections.includes("CACTUS_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Cactus'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Cactus')); }
                                        if(unlockedCollections.includes("SUGAR_CANE_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Sugar Cane'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sugar Cane')); }
                                        if(unlockedCollections.includes("FEATHER_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Feather'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Feather')); }
                                        if(unlockedCollections.includes("LEATHER_10")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Leather'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Leather')); }
                                        if(unlockedCollections.includes("PORK_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Raw Porkchop'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Porkchop')); }
                                        if(unlockedCollections.includes("RAW_CHICKEN_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Raw Chicken'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Chicken')); }
                                        if(unlockedCollections.includes("MUTTON_10")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Mutton'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Mutton')); }
                                        if(unlockedCollections.includes("RABBIT_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Raw Rabbit'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Rabbit')); }
                                        if(unlockedCollections.includes("NETHER_STALK_12")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Nether Wart'));
                                            maxedFarmingCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Nether Wart')); }
                                        var maxedMiningCollections = 0;
                                        if(unlockedCollections.includes("COBBLESTONE_10")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Cobblestone'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Cobblestone')); }
                                        if(unlockedCollections.includes("COAL_10")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Coal'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Coal')); }
                                        if(unlockedCollections.includes("IRON_INGOT_12")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Iron Ingot'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Iron Ingot')); }
                                        if(unlockedCollections.includes("GOLD_INGOT_9")) {
                                            author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Gold Ingot'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Gold Ingot')); }
                                        if(unlockedCollections.includes("DIAMOND_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Diamond'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Diamond')); }
                                        if(unlockedCollections.includes("INK_SACK:4_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Lapis Lazuli'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Lapis Lazuli')); }
                                        if(unlockedCollections.includes("EMERALD_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Emerald'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Emerald')); }
                                        if(unlockedCollections.includes("REDSTONE_16")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Redstone'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Redstone')); }
                                        if(unlockedCollections.includes("QUARTZ_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Nether Quartz'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Nether Quartz')); }
                                        if(unlockedCollections.includes("QUARTZ_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Nether Quartz'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Nether Quartz')); }
                                        if(unlockedCollections.includes("OBSIDIAN_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian')); }
                                        if(unlockedCollections.includes("OBSIDIAN_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian')); }
                                        if(unlockedCollections.includes("OBSIDIAN_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Obsidian')); }
                                        if(unlockedCollections.includes("GLOWSTONE_DUST_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Glowstone'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Glowstone')); }
                                        if(unlockedCollections.includes("GRAVEL_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Gravel'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Gravel')); }
                                        if(unlockedCollections.includes("ICE_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ice'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ice')); }
                                        if(unlockedCollections.includes("NETHERRACK_3")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Netherrack'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Netherrack')); }
                                        if(unlockedCollections.includes("SAND_7")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sand'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sand')); }
                                        if(unlockedCollections.includes("ENDER_STONE_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'End Stone'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'End Stone')); }
                                        if(unlockedCollections.includes("MITHRIL_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Mithril'));
                                            maxedMiningCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Mithril')); }
                            /*
                            *    Combat
                            */

                                        var maxedCombatCollections = 0;
                                        if(unlockedCollections.includes("ROTTEN_FLESH_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Rotten Flesh'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Rotten Flesh')); }
                                        if(unlockedCollections.includes("BONE_10")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Bone'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Bone')); }
                                        if(unlockedCollections.includes("STRING_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'String'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'String')); }
                                        if(unlockedCollections.includes("SPIDER_EYE_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Spider Eye'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Spider Eye')); }
                                        if(unlockedCollections.includes("SULPHUR_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Gunpowder'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Gunpowder')); }
                                        if(unlockedCollections.includes("ENDER_PEARL_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Enderpearl'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Enderpearl')); }
                                        if(unlockedCollections.includes("GHAST_TEAR_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ghast Tear'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ghast Tear')); }
                                        if(unlockedCollections.includes("SLIME_BALL_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Slimeball'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Slimeball')); }
                                        if(unlockedCollections.includes("BLAZE_ROD_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Blaze Rod'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Blaze Rod')); }
                                        if(unlockedCollections.includes("MAGMA_CREAM_9")) {
                                            author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Magma Cream'));
                                            maxedCombatCollections++;
                                            maxedCollections++;
                                        } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Magma Cream')); }
                            /*
                            *   Foraging
                            */
                            var maxedForagingCollections = 0
                            if(unlockedCollections.includes("LOG_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Oak Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Oak Wood')); }
                            if(unlockedCollections.includes("LOG:1_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Spruce Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Spruce Wood')); }
                            if(unlockedCollections.includes("LOG:2_10")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Birch Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Birch Wood')); }
                            if(unlockedCollections.includes("LOG_2:1_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Dark Oak Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Dark Oak Wood')); }
                            if(unlockedCollections.includes("LOG_2_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Acacia Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Acacia Wood')); }
                            if(unlockedCollections.includes("LOG:3_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Jungle Wood'));
                                maxedForagingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Jungle Wood')); }
                            /*
                            *    Fishing
                            */
                            var maxedFishingCollections = 0;
                            if(unlockedCollections.includes("RAW_FISH_11")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Fish'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Fish')); }
                            if(unlockedCollections.includes("RAW_FISH:1_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Salmon'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Raw Salmon')); }
                            if(unlockedCollections.includes("RAW_FISH:2_7")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Clownfish'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Clownfish')); }
                            if(unlockedCollections.includes("RAW_FISH:3_10")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Pufferfish'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Pufferfish')); }
                            if(unlockedCollections.includes("PRISMARINE_SHARD_5")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Prismarine Shard'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Prismarine Shard')); }
                            if(unlockedCollections.includes("PRISMARINE_CRYSTALS_7")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Prismarine Crystals'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Prismarine Crystals')); }
                            if(unlockedCollections.includes("CLAY_BALL_5")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Clay'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Clay')); }
                            if(unlockedCollections.includes("WATER_LILY_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Lily Pad'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Lily Pad')); }
                            if(unlockedCollections.includes("INK_SACK_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ink Sack'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Ink Sack')); }
                            if(unlockedCollections.includes("SPONGE_9")) {
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sponge'));
                                maxedFishingCollections++;
                                maxedCollections++;
                            } else { author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sponge')); }
                            //Placeholder roles
                            if(maxedFarmingCollections > 0) {
                                try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '750370595811623042')); } catch {}
                            }
                            if(maxedMiningCollections > 0) {
                                try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '769989929789816882')); } catch {}
                            }
                            if(maxedCombatCollections > 0) {
                                try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777193990964510760')); } catch {}
                            }
                            if(maxedForagingCollections > 0) {
                                try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777196588439175200')); } catch {}
                            }
                            if(maxedFishingCollections > 0) {
                                try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777196860653174833')); } catch {}
                            }
                            /*
                            *   Skills
                            */
                            function isForaging25(foragingExp) {
                                if(foragingExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isCombat25(combatExp) {
                                if(combatExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isMining25(miningExp) {
                                if(miningExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isFarming25(farmingExp) {
                                if(farmingExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isAlchemy25(alchemyExp) {   
                                if(alchemyExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isTaming25(tamingExp) {
                                if(tamingExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isEnchanting25(enchantingExp) {
                                if(enchantingExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isFishing25(fishingExp) {
                                if(fishingExp >= 3000000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isRev7(slayerExpZombie) {
                                if(slayerExpZombie >= 100000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }  
                            function isTara7(slayerExpSpider) {
                                if(slayerExpSpider >= 100000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }   
                            function isSven7(slayerExpWolf) {
                                if(slayerExpWolf >= 100000) {
                                    return "0";
                                } else {
                                    return "1";
                                }
                            }       
                            /*
                            *   Slayer
                            */
                                    
                            var slayer_exp_zombie = profile.members[uuid].slayer_bosses.zombie.xp,
                                slayer_exp_wolf = profile.members[uuid].slayer_bosses.wolf.xp,
                                slayer_exp_spider = profile.members[uuid].slayer_bosses.spider.xp;
                            /*
                            *   Create final embed
                            */
                            var roleEmbed = new MessageEmbed()
                            roleEmbed.setTitle('Role Claim')
                            roleEmbed.setColor(COLORS.Emerland)
                            roleEmbed.setThumbnail('https://i.imgur.com/p6wcIcc.png')
                            roleEmbed.setURL('https://sky.lea.moe/stats/' + args[0] + '/' + args[1] )
                            roleEmbed.addFields(
                                { name: 'Skill Rollen', value: 'Fügt dir eine Skill Rolle hinzu, wenn du in diesem Skill Level 25 bist.' }
                            )
                            if(isForaging25(foragingExp) === "0") {
                                roleEmbed.addField('Foraging 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Foraging 25'));
                            } else {
                                roleEmbed.addField('Foraging 25', ':red_square:');
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Foraging 25'));
                            }
                            if(isCombat25(combatExp) === "0") {
                                roleEmbed.addField('Combat 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Combat 25'));
                            } else {
                                roleEmbed.addField('Combat 25', ':red_square:');
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Combat 25'));
                            }
                            if(isMining25(miningExp) === "0") {
                                roleEmbed.addField('Mining 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Mining 25'));
                            } else {
                                roleEmbed.addField('Mining 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Mining 25'));
                            }
                            if(isFarming25(farmingExp) === "0") {
                                roleEmbed.addField('Farming 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Farming 25'));
                            } else {
                                roleEmbed.addField('Farming 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Farming 25'));
                            }
                            if(isAlchemy25(alchemyExp) === "0") {
                                roleEmbed.addField('Alchemy 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Alchemy 25'));
                            } else {
                                roleEmbed.addField('Alchemy 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Alchemy 25'));
                            }
                            if(isTaming25(tamingExp) === "0") {
                                roleEmbed.addField('Taming 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Taming 25'));
                            } else {
                                roleEmbed.addField('Taming 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Taming 25'));
                            }
                            if(isEnchanting25(enchantingExp) === "0") {
                                roleEmbed.addField('Enchanting 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Enchanting 25'));
                            } else {
                                roleEmbed.addField('Enchanting 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Enchating 25'));
                            }
                            if(isFishing25(fishingExp) === "0") {
                                roleEmbed.addField('Fishing 25', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Fishing 25'));
                            } else {
                                roleEmbed.addField('Fishing 25', ':red_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Fishing 25'));
                            }
                            roleEmbed.addFields(
                                { name: 'Slayer Rollen', value: 'Fügt dir eine Slayer Rolle hinzu, wenn du bei diesem Slayer Level 7 bist.' }
                            )
                            if(isRev7(slayer_exp_spider) === "0") {
                                roleEmbed.addField('Revenant Horror 7', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Revenant Horror 7'));
                            } else {
                                roleEmbed.addField('Revenant Horror 7', ':red_square:');
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Revenant Horror 7'));
                            }
                            if(isTara7(slayer_exp_spider) === "0") {
                                roleEmbed.addField('Tarantula Broodfather 7', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Tarantula Broodfather 7'));
                            } else {
                                roleEmbed.addField('Tarantula Broodfather 7', ':red_square:');
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Tarantula Broodfather 7'));
                            }
                            if(isSven7(slayer_exp_wolf) === "0") {
                                roleEmbed.addField('Sven Packmaster 7', ':green_square:');
                                author.roles.add(msgGuild.roles.cache.find(role => role.name === 'Sven Packmaster 7'));
                            } else {
                                roleEmbed.addField('Sven Packmaster 7', ':red_square:');
                                author.roles.remove(msgGuild.roles.cache.find(role => role.name === 'Sven Packmaster 7'));
                            }
                            roleEmbed.addField('Collections', 'Dir wurden ' + maxedCollections + ' Collection-Rollen hinzugefügt.');
                            channel.send(roleEmbed);                   
                        } else {
                            errorEmbed.addField('Error', 'Deine API ist nicht eingeschalten oder du hast nicht alle Skills freigeschalten!')
                            errorEmbed.addField('Information', 'So aktivierst du deine API: \nHypixel SkyBlock -> SkyBlock Menu -> Einstellungen -> API\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.')    
                            channel.send(errorEmbed);
                        }
                            } else {
                                errorEmbed.addField('Information', 'Falls dieses Profil existiert und es trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
                                channel.send(errorEmbed);
                            }
                    } else {
                        errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!')
                        errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.')    
                        channel.send(errorEmbed);
                        } 
                        } else {
                            errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!')
                            errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.')    
                            channel.send(errorEmbed);
                            }
                    } else {
                        errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!')
                        errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.')    
                        channel.send(errorEmbed);
                        }
                } else {
                    errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!')
                    errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.')    
                    channel.send(errorEmbed);
                }
            });
        }       
    }); 
} else {
    channel.send("Nutze den Befehl so: r!roleclaim <name> <profile>")
}  
}
function gscammer_cmd(msg, args) {
        if(msg.member.roles.cache.some(role => role.name === 'Team (Ping)')) { 
        var embed_i = new MessageEmbed();
        embed_i.addField('Information', 'Wenn diese Nachricht leer bleibt, dann hat die Gilde 0 Scammer :).')
        msg.channel.send(embed_i).then(msge => {
        fetch("https://api.hypixel.net/guild?key=47cb944b-4834-42e6-ab0f-d09914558bac&player=64e008cbc99b4397ae670d4624acf9d7")
        .then(result => result.json())
        .then(({ guild }) => {    
     function task(i) { 
        setTimeout(function() {
            fetch("https://script.tftech.de/api/hggv2/?key=bf5a20d1-44a7-4b3d-843c-b0a22fbda8e5")
            .then(result => result.json())
            .then(( { found }) => {
                console.log(i + '. UUID: ' + guild.members[i].uuid + ', Grund: Kein Report')
                if(found != undefined) {
                if(found === true) {
                 fetch("https://script.tftech.de/api/hggv2/?key=bf5a20d1-44a7-4b3d-843c-b0a22fbda8e5")
                 .then(result => result.json())
                 .then(( { reports }) => {
                     for(var i2 = 0; i2 < reports.length; i2++) {
                         embed_i.addField(i+1 + '. UUID: ' + reports[i2].uuid + ', Grund: ' + reports[i2].keyword)
                         msge.edit(embed_i)
                     }
                 })
                }
             } 
            })
        }, 100*i)
       } 
            for(var i = 0; i<guild.members.length; i++) {
                task(i)
            }
        })
        msge.edit(embed_i)
    })
        } else {
            msg.channel.send('Dazu hast du keine Rechte')
        }
}
function dungeon_verify_command(msg, args) {
    msg.delete();
    if(msg.channel == client.channels.cache.get('808788152541642782')) {
        if(args.length == 1) {
    fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
    .then(result => result.json())
    .then(({ player }) => {
        if(player != undefined) {
        if(player.socialMedia != undefined) {
            if(player.socialMedia.links != undefined) {
                var dc_tag_hypixel = player.socialMedia.links.DISCORD;
                if(dc_tag_hypixel != undefined) {
                    if(dc_tag_hypixel === msg.member.user.tag) {
                        msg.reply('Erfolgreich verifiziert.')
                        .then(msgg => {
                        msgg.delete({ timeout: 5000 })
                        })
                        var id = msg.member.user.id
                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name === 'dungeon-verified'));
                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.id === '809141707282448424'));
                        connection.query(`INSERT INTO verified(name, uuid, discordid) VALUES ('${args[0]}', '${player.uuid}','${id}');`, function (err, result, fields) {console.log(err)});
                        connection.query(`SELECT * FROM verified WHERE discordid = ` + msg.member.id + `;`, function (err, result, fields) {
                        console.log(result)
                        })
                    } else {
                        const user = client.users.cache.get(msg.member.user.id);
                        user.send('Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
                    }
                } else {
                    const user = client.users.cache.get(msg.member.user.id);
                    user.send('Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
                }
            } else {
                const user = client.users.cache.get(msg.member.user.id);
                user.send('Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
            }
        } else {
            const user = client.users.cache.get(msg.member.user.id);
            user.send('Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
        }
    } else {
        const user = client.users.cache.get(msg.member.user.id);
        user.send('Spieler für die Verifizierung in <#808788152541642782> konnte nicht gefunden werden. \nFalls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche dich bitte in 2-3 Minuten erneut zu verifizieren.\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
    }
    });
} else {
    msg.reply('Gebe bitte einen Namen an <@' + msg.member.user.id + '>.')
    .then(msgg => {
    msgg.delete({ timeout: 5000 })
    })
}
} else {
    msg.reply('Falscher Kanal. Nutze bitte <#808788152541642782>')
    .then(msgg => {
    msgg.delete({ timeout: 5000 })
    })
}
}
function fetch_user_cmd(msg, args) {
    var args = msg.content.split(' ').slice(1);
    if(args.length === 1) {
    var user = client.users.cache.find(user => user.id === args[0])
    if(user != undefined) {
    msg.channel.send(user.tag)
    } else {
        msg.channel.send('Invaild ID')
    }
    } else {
        msg.channel.send('Usage: r!user <id>')
    }
}
function lastonline(msg, args) {
    if(msg.member.roles.cache.some(role => role.name === 'Team (Ping)')) { 
    var embed_i = new MessageEmbed();
    embed_i.setFooter("Falls diese Nachricht nach 2 Minuten noch keine Namen enthält, dann ist niemand inaktiv.")              
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var h = today2.getHours()
    var min = today2.getMinutes()
    var sec = today2.getSeconds()
    var yyyy2 = today2.getFullYear();
    //ce65e438450f490ba04402f87fde6fb2
    today2 = dd2 + '/' + mm2 + '/' + yyyy2 + "(" + h + ":" + min + ":" + sec + ")";
    if(args.length === 1) {
        if(args[0] === "1") {
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
            .then(result => result.json())
            .then(({ guild }) => {    
                connection.query(`INSERT INTO kicktagetable(Datum, DiscordTag) VALUES ('${today2}', '${msg.author.tag}');`, function (err, result, fields) {});
            
                msg.channel.send(embed_i).then(msge => {
                for (i = 0; i < guild.members.length; i++) {     
                    fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + guild.members[i].uuid)
                    .then(result => result.json())
                    .then(({ name }) => {  
                        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + name)
                        .then(result => result.json())
                        .then(  ({ player }) => {
                            function getGuildMemberRank(uuid) {
                                var memberobject = guild.members;
                                    for (var key of Object.keys(memberobject)) {
                                        if (memberobject[key].uuid === uuid) {
                                            return memberobject[key].rank;
                                        }
                                    }        
                                return;
                            }
                            if(player != null) {  
                            var today = new Date();
                            var time_difference = today - player.lastLogin;
                            time_difference = time_difference/1000/60/60/24;
                            embed_i.setFooter("Falls diese Nachricht nach 2 Minuten noch keine Namen enthält, dann ist niemand inaktiv.")                       
                         
                            if(Math.round(time_difference) >= 5) {
                                var displayName = player.displayname;
                                connection.query("SELECT AbgemeldetBisMilis FROM urlaub WHERE Name ='" + displayName +"';", function (err, result, fields) {
                                var string = JSON.stringify(result);
                                var json =  JSON.parse(string);
                                console.log(json.length)
                                    if(json.length === 0) {
                                        embed_i.addField(getGuildMemberRank(player.uuid) + ': `'+player.displayname +'`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Nicht abgemeldet.')
                                msge.edit(embed_i) 
                                } else {                            
                                    var string = JSON.stringify(result);
                                    var json =  JSON.parse(string);
                                    var abgemeldetesDatum = new Date(parseInt(json[0].AbgemeldetBisMilis))
                                    var resultTime = parseInt(json[0].AbgemeldetBisMilis)
                                    var dd = String(abgemeldetesDatum.getDate()).padStart(2, '0');
                                    var mm = String(abgemeldetesDatum.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    var yyyy = abgemeldetesDatum.getFullYear();
                                    
                                    abgemeldetesDatum = dd + '/' + mm + '/' + yyyy;
                                    embed_i.setTitle("Inaktivitätsliste")
                                    var dd = String(today.getDate()).padStart(2, '0');
                                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    var yyyy = today.getFullYear();
                                    
                                    today = dd + '/' + mm + '/' + yyyy;
                                    console.log(resultTime)
                                    embed_i.addField(getGuildMemberRank(player.uuid) + ': `'+player.displayname +'`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Abgemeldet bis ' + abgemeldetesDatum)
                                    msge.edit(embed_i)  
                                }     
                                });
                            } 
                            }
                        
                        })
                })  
                    function Sleep(milliseconds) {
                        return new Promise(resolve => setTimeout(resolve, milliseconds));
                       }
                    Sleep(1000)
                }
               Sleep(2000)
        })
        })
        } 
        if(args[0] === "2") {
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438450f490ba04402f87fde6fb2")
            .then(result => result.json())
            .then(({ guild }) => {    
                connection.query(`INSERT INTO kicktagetable(Datum, DiscordTag) VALUES ('${today2}', '${msg.author.tag}');`, function (err, result, fields) {});
                msg.channel.send(embed_i).then(msge => {
                for (i = 0; i < guild.members.length; i++) {     
                    fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + guild.members[i].uuid)
                    .then(result => result.json())
                    .then(({ name }) => {  
                        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + name)
                        .then(result => result.json())
                        .then(  ({ player }) => {
                            function getGuildMemberRank(uuid) {
                                var memberobject = guild.members;
                                    for (var key of Object.keys(memberobject)) {
                                        if (memberobject[key].uuid === uuid) {
                                            return memberobject[key].rank;
                                        }
                                    }        
                                return;
                            }
                            if(player != null) {    
                            var today = new Date();
                            var time_difference = today - player.lastLogin;
                            time_difference = time_difference/1000/60/60/24;
                            if(Math.round(time_difference) >= 5) {
                                var displayName = player.displayname;
                                connection.query("SELECT AbgemeldetBisMilis FROM urlaub WHERE Name ='" + displayName +"';", function (err, result, fields) {
                                var string = JSON.stringify(result);
                                var json =  JSON.parse(string);
                                console.log(json.length)
                                    if(json.length === 0) {
                                embed_i.addField(getGuildMemberRank(player.uuid) + ': `'+player.displayname +'`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Nicht abgemeldet.')
                                msge.edit(embed_i) 
                                } else {                            
                                    var string = JSON.stringify(result);
                                    var json =  JSON.parse(string);
                                    var abgemeldetesDatum = new Date(parseInt(json[0].AbgemeldetBisMilis))
                                    var resultTime = parseInt(json[0].AbgemeldetBisMilis)
                                    var dd = String(abgemeldetesDatum.getDate()).padStart(2, '0');
                                    var mm = String(abgemeldetesDatum.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    var yyyy = abgemeldetesDatum.getFullYear();
                                    
                                    abgemeldetesDatum = dd + '/' + mm + '/' + yyyy;
                                    embed_i2.setTitle("Inaktivitätsliste")
                                    var dd = String(today.getDate()).padStart(2, '0');
                                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    var yyyy = today.getFullYear();
                                    
                                    today = dd + '/' + mm + '/' + yyyy;
                                    console.log(resultTime)
                                    embed_i2.addField(getGuildMemberRank(player.uuid) + ': `'+player.displayname +'`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Abgemeldet bis ' + abgemeldetesDatum)
                                    msge.edit(embed_i2)  
                                }     
                                });
                            } 
                            }
                        
                        })
                })  
                    function Sleep(milliseconds) {
                        return new Promise(resolve => setTimeout(resolve, milliseconds));
                       }
                    Sleep(1000)
                }
               Sleep(2000)
        })
        })
        } 
    } else {
        msg.channel.send('Nutze den Befehl so: `r!icheck <Gilde>`, Beispiel: `r!icheck 1`, Mögliche Gilden: 1, 2')
    }
    } else {
        msg.channel.send('Dazu hast du keine Rechte')
    }
}
function help_cmd(msg, args) {
    var cont = msg.content,
    author = msg.member,
    chan = msg.channel,
    guild = msg.guild;
    var embed6 = new MessageEmbed();
    embed6.addField('Stamm-Command', 'r!stamm <name> - Stamm-Beantragungs-Command');
    embed6.addField('Cata-Command', 'r!cata - Gibt dir deine Catacombs-Skillrolle');
    embed6.addField('Verify-Command', 'r!dverify <name> - Verifiziert dich für Dungeons');
    embed6.addField('Roleclaim-Command', 'r!roleclaim <name> <Skyblock-Profile> | Skill-,Slayer- und Gilden-Rollen claimen(z.B. Combat 25). **WICHTIG:** Euer Discord-Account auf Hypixel verlinkt sein.');
    embed6.addField('Spieler-Info-Command', 'r!pinfo <name> - Zeigt Informationen über den Spieler');
    embed6.addField('Bot-Info-Command', 'r!botinfo - Zeigt Infos über den Bot');
    embed6.addField('Hilfe-Command', 'r!help - Hilfenachricht des Bots');
    //embed6.setFooter('Offizieller Hilfe Befehl')
    chan.send('', embed6);
}
function botinfo_cmd(msg, args) {
    var cont = msg.content,
    author = msg.member,
    chan = msg.channel,
    guild = msg.guild;
    var embed4 = new MessageEmbed();
    embed4.setColor(COLORS.Emerland);
    embed4.setTitle('Botinfo');
    embed4.addField('Bot-Besitzer', '<@702790608649060432>');
    embed4.addField('Hilfe-Befehl', 'r!help');
    embed4.addField('Letztes Update', '21.7.2020 | 14:47');
    embed4.addField('Version', '0.0.3');
    embed4.setFooter('Offizieler Rexo-Tools Bot');
    chan.send('', embed4);
}
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function urlaub_cmd(msg, args) {
    var errorEmbed = new MessageEmbed();
    if(args.length === 2) {
    fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
    .then(result => result.json())
    .then(({ player }) => {
        if(player != null) {
            var uuid = player.uuid
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
            .then(result =>  result.json()) 
            .then(({ guild }) => {
                if(guild != null) {
                if(guild.name === 'Rexo') {
                    var args = msg.content.split(' ').slice(1);
                    if(isNumeric(args[1])) {
                    var millis = parseInt(args[1])*1000*60*60*24
                    var today = new Date();
                    console.log(today);
                    connection.query(`INSERT INTO urlaub (Name, Zeit, Grund, AbgemeldetBisMilis) VALUES
                    ('${args[0]}','${args[1]}','-','${today.getTime()+millis}');`, function (err, result, fields) {});
                    msg.reply(args[0] + ' wurde für ' + args[1] + ' Tage abgemeldet.')
                    .then(msgg => {
                    msgg.delete({ timeout: 5000 })
                    })
                    .catch(console.error);
                    } else {
                        msg.channel.send('Gebe die Tage bitte als Zahl an!')
                    }
                } else {
                    msg.channel.send('Du bist nicht in unserer Gilde.')
                }
            } else {
                msg.channel.send('Du bist nicht in unserer Gilde.')
            }
        })
        } else {
            errorEmbed.addField('Error', 'Spieler wurde nicht gefunden.')
            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.')
            msg.channel.send(errorEmbed)
        }
    })
} else {
    msg.channel.send('Benutze den Befehl bitte so: **r!urlaub <name> <Zeit in Tagen>**')
}
}
function check_kickdays(msg, args) {
    msg.delete()
    connection.query(`SELECT * FROM kicktagetable;`, function (err, result, fields) {
        var string = JSON.stringify(result);
        var json =  JSON.parse(string);
        if(msg.member.roles.cache.some(role => role.name === 'Admin') 
        || msg.member.roles.cache.some(role => role.name === 'Moderator') 
        || msg.member.roles.cache.some(role => role.name === 'Leader') 
        || msg.member.id === '702790608649060432') {
        
    var embed_i = new MessageEmbed();
    var embed_i2 = new MessageEmbed();
    embed_i.setTitle('Kicktage/ICheck-Uses')
    embed_i2.setTitle('Kicktage/ICheck-Uses')
    if(json.length != 0) {
        msg.channel.send(embed_i).then(msge => {
            for(var i = 0; i < json.length; i++) {
                embed_i2.addField("Datum: " + json[i].Datum, "Nutzer: " + json[i].DiscordTag)
                msge.edit(embed_i2)
            }
        })
        } else {
            msg.channel.send('Keine Einträge gefunden!')
        }
    } else {
        msg.channel.send('Dazu hast du keine Berechtigungen!')
    }
    });
}
function getLevelByXp(xp, type = 'regular', levelCap, personalCap){
    let xp_table;

    switch(type){
        case 'runecrafting':
            xp_table = constants.runecrafting_xp;
            break;
        case 'dungeon':
            xp_table = constants.dungeon_xp;
            break;
        default:
            xp_table = constants.leveling_xp;
    }

    if(isNaN(xp)){
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
    for(let x = 1; x <= maxLevelCap; x++){
        xpTotal += xp_table[x];

        if(xpTotal > xp){
            xpTotal -= xp_table[x];
            break;
        }else{
            level = x;
        }
    }

    let xpCurrent = Math.floor(xp - xpTotal);

    if(level < maxLevel)
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
        if(xp >=5) {
            if(xp >= 15) {
                if(xp >= 200) {
                    if(xp >= 1000) {
                        if(xp >= 5000) {
                            if(xp >= 20000) {
                                if(xp >= 100000) {
                                    if(xp >= 400000) {
                                        if(xp >= 1000000) {
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
async function guildinfo(msg, args) {
    var embed_i = new MessageEmbed();
    var date = new Date();
    connection.query("SELECT * FROM gstatsUses;", function (err, result, fields) {                 
    function task(i, guild, msge) { 
        setTimeout(function() { 
         fetch("https://api.hypixel.net/skyblock/profiles?key=47cb944b-4834-42e6-ab0f-d09914558bac&uuid=" + guild.members[i].uuid)
         .then(result1 => result1.json())
         .then(({ profiles }) => {
             console.log(i)
             console.log(guild.members[i].uuid)
             var parray = []
             if(profiles != undefined) {
         for(var p = 0; p < profiles.length; p++) {
             var last_save = profiles[p].members[guild.members[i].uuid].last_save
             parray.push(last_save)
             parray.sort();
         }
            function getFarming(last_save) {
             var profilesobject = profiles;
             for (var key of Object.keys(profilesobject)) {
                 if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                     return profilesobject[key].members[guild.members[i].uuid].experience_skill_farming
                 }
             }    
             console.log('Dieses Profil existiert nicht.');
             return;
             }
             function getMining(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_mining
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getCombat(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_combat
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getForaging(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_foraging
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getFishing(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_fishing
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getEnchanting(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_enchanting
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }        
             function getAlchemy(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_alchemy
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getTaming(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].experience_skill_taming
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getZombie(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         if(profilesobject[key].members[guild.members[i].uuid].slayer_bosses != null) {
                         return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.zombie.xp
                         }
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getTara(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.spider.xp
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             function getWolf(last_save) {
                 var profilesobject = profiles;
                 for (var key of Object.keys(profilesobject)) {
                     if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                         return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.wolf.xp
                     }
                 }       
                 console.log('Dieses Profil existiert nicht.');
                 return;
             }
             
             if(getFarming(parray[parray.length-1]) != undefined) {
                 total_farming_exp = total_farming_exp + getFarming(parray[parray.length-1])
             }
             if(getMining(parray[parray.length-1]) != undefined) {
                 total_mining_exp = total_mining_exp + getMining(parray[parray.length-1])
             }  
             if(getCombat(parray[parray.length-1]) != undefined) {
                 total_combat_exp = total_combat_exp + getCombat(parray[parray.length-1])
             }
             if(getForaging(parray[parray.length-1]) != undefined) {
                 total_foraging_exp = total_foraging_exp + getForaging(parray[parray.length-1])
             }
             if(getFishing(parray[parray.length-1]) != undefined) {
                 total_fishing_exp = total_fishing_exp + getFishing(parray[parray.length-1])
             }
             if(getEnchanting(parray[parray.length-1]) != undefined) {
                 total_enchanting_exp = total_enchanting_exp + getEnchanting(parray[parray.length-1])
             }
             if(getAlchemy(parray[parray.length-1]) != undefined) {
                 total_alchemy_exp = total_alchemy_exp + getAlchemy(parray[parray.length-1])
             }
             if(getTaming(parray[parray.length-1]) != undefined) {
                 total_taming_exp = total_taming_exp + getTaming(parray[parray.length-1])
             }        
             if(getZombie(parray[parray.length-1]) != undefined 
             && getTara(parray[parray.length-1]) != undefined 
             && getWolf(parray[parray.length-1]) != undefined) {
                 total_slayer_exp = total_slayer_exp + getWolf(parray[parray.length-1]) + getTara(parray[parray.length-1]) + getZombie(parray[parray.length-1])
             }
             if(i === guild.members.length-1) {
                 connection.query(`DELETE FROM gstatsUses`)
                 connection.query(`INSERT INTO gstatsUses(Date, Members, FarmingExp, MiningExp, CombatExp, ForagingExp, FishingExp, EnchantingExp, AlchemyExp, TamingExp, SlayerExp) VALUES(${date.getTime()}, ${guild.members.length}, ${total_farming_exp}, ${total_mining_exp}, ${total_combat_exp}, ${total_foraging_exp}, ${total_fishing_exp}, ${total_enchanting_exp}, ${total_alchemy_exp}, ${total_taming_exp}, ${total_slayer_exp})`)
                 embed_i.addFields(
                 { name: 'Farming', value: 'Total Exp: ' + (total_farming_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_farming_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_farming_exp/guild.members.length).level, inline: true},
                 { name: 'Mining', value: 'Total Exp: ' + (total_mining_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_mining_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_mining_exp/guild.members.length).level, inline: true},
                 { name: 'Combat', value: 'Total Exp: ' + (total_combat_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_combat_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_combat_exp/guild.members.length).level, inline: true},
                 { name: 'Foraging', value: 'Total Exp: ' + (total_foraging_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_foraging_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_foraging_exp/guild.members.length).level, inline: true},
                 { name: 'Fishing', value: 'Total Exp: ' + (total_fishing_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_fishing_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_fishing_exp/guild.members.length).level, inline: true},
                 { name: 'Enchanting', value: 'Total Exp: ' + (total_enchanting_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_enchanting_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_enchanting_exp/guild.members.length).level, inline: true},
                 { name: 'Alchemy', value: 'Total Exp: ' +  (total_alchemy_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_alchemy_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_alchemy_exp/guild.members.length).level, inline: true},
                 { name: 'Taming', value: 'Total Exp: ' +  (total_taming_exp/1000000).toFixed(1) + "m\nAverage Exp: " + ((total_taming_exp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_taming_exp/guild.members.length).level, inline: true},
                 { name: 'Slayer', value: 'Total Exp: ' +  (total_slayer_exp/1000000).toFixed(1) + "m\nAverage Exp: " + Math.round(total_slayer_exp/3/guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(total_slayer_exp/3/guild.members.length), inline: true},
                 { name: 'All Skills', value: 
                 'Total Exp: ' 
                     + ((total_farming_exp 
                     + total_mining_exp 
                     + total_combat_exp 
                     + total_foraging_exp 
                     + total_fishing_exp 
                     + total_enchanting_exp 
                     + total_taming_exp
                     + total_alchemy_exp)/1000000).toFixed(1) + 
                 "m\nAverage Exp per Skill: " 
                     + ((
                         ((total_farming_exp 
                         + total_mining_exp 
                         + total_combat_exp 
                         + total_foraging_exp 
                         + total_fishing_exp 
                         + total_enchanting_exp 
                         + total_alchemy_exp
                         + total_taming_exp)
                         /8)
                         /guild.members.length)/1000000).toFixed(1) +
                 "m\nAverage Level: " + 
                 getLevelByXp(((total_farming_exp 
                     + total_mining_exp 
                     + total_combat_exp 
                     + total_foraging_exp 
                     + total_fishing_exp 
                     + total_enchanting_exp 
                     + total_alchemy_exp
                     + total_taming_exp)
                     /8)
                     /guild.members.length).level
                     , inline: true}
                 )
             msge.edit(embed_i)
             }
            }
         })   
        }, 1000 * i); 
      }
        var string = JSON.stringify(result);
        var json =  JSON.parse(string);
        for(var i = 0; i<json.length; i++) {
        if(json[0] != undefined) {
            console.log((date.getTime()-json[0].Date))
            if((date.getTime()-json[0].Date)>43200000) {
                    var total_farming_exp = 0;
                    var total_mining_exp = 0;
                    var total_combat_exp = 0;
                    var total_foraging_exp = 0;
                    var total_fishing_exp = 0;
                    var total_enchanting_exp = 0;
                    var total_alchemy_exp = 0;
                    var total_taming_exp = 0;
                    var total_slayer_exp = 0;
                    var today = new Date();
                    var today1 = new Date();
                    var today2 = new Date();
                    var dd2 = String(today2.getDate()).padStart(2, '0');
                    var mm2 = String(today2.getMonth() + 1).padStart(2, '0');
                    var yyyy2 = today2.getFullYear();
                    embed_i.setTitle('Guildstats-Tracker')
                    embed_i.setThumbnail('https://i.imgur.com/rD1j3vJ.jpeg')
                    today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                    today1 = dd2-7 + '/' + mm2 + '/' + yyyy2;
                    today = dd2-1 + '/' + mm2 + '/' + yyyy2; 
                    msg.channel.send(embed_i).then(msge => {
                    fetch("https://api.hypixel.net/guild?key=47cb944b-4834-42e6-ab0f-d09914558bac&player=64e008cbc99b4397ae670d4624acf9d7")
                    .then(result => result.json())
                    .then(({ guild }) => {     
                        for(var i = 0; i<guild.members.length; i++) {
                            task(i, guild, msge)
                        }
                        embed_i.addField("Heute", 'Member: ' + guild.members.length)
                        msge.edit(embed_i)
                    })
                    msge.edit(embed_i)
                })
            } else {
                if(msg.member.roles.cache.some(role => role.name === 'Team (Ping)')) { 
                    msg.channel.send("Loading Data...").then(msge => {
                    fetch("https://api.hypixel.net/guild?key=47cb944b-4834-42e6-ab0f-d09914558bac&player=64e008cbc99b4397ae670d4624acf9d7")
                    .then(result => result.json())
                    .then(({ guild }) => {  
                        embed_i.setTitle('Guildstats-Tracker')
                        embed_i.setThumbnail('https://i.imgur.com/rD1j3vJ.jpeg')
                        embed_i.addField("Information", "Die Gilden Statistiken werden maximal alle 12h geupdated")
                        embed_i.setFooter("Der Druchschnitt der Level wurde anhand der durchschnittlichen Exp berechnet.")
                        embed_i.addField("Heute", 'Member: ' + guild.members.length)
                    embed_i.addFields(
                        { name: 'Farming', value: 'Total Exp: ' + (json[0].FarmingExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].FarmingExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FarmingExp/guild.members.length).level, inline: true},
                        { name: 'Mining', value: 'Total Exp: ' + (json[0].MiningExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].MiningExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].MiningExp/guild.members.length).level, inline: true},
                        { name: 'Combat', value: 'Total Exp: ' + (json[0].CombatExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].CombatExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].CombatExp/guild.members.length).level, inline: true},
                        { name: 'Foraging', value: 'Total Exp: ' + (json[0].ForagingExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].ForagingExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].ForagingExp/guild.members.length).level, inline: true},
                        { name: 'Fishing', value: 'Total Exp: ' + (json[0].FishingExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].FishingExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FishingExp/guild.members.length).level, inline: true},
                        { name: 'Enchanting', value: 'Total Exp: ' + (json[0].EnchantingExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].EnchantingExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].EnchantingExp/guild.members.length).level, inline: true},
                        { name: 'Alchemy', value: 'Total Exp: ' +  (json[0].AlchemyExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].AlchemyExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].AlchemyExp/guild.members.length).level, inline: true},
                        { name: 'Taming', value: 'Total Exp: ' +  (json[0].TamingExp/1000000).toFixed(1) + "m\nAverage Exp: " + ((json[0].TamingExp/guild.members.length)/1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].TamingExp/guild.members.length).level, inline: true},
                        { name: 'Slayer', value: 'Total Exp: ' +  (json[0].SlayerExp/1000000).toFixed(1) + "m\nAverage Exp: " + Math.round(json[0].SlayerExp/3/guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(json[0].SlayerExp/3/guild.members.length), inline: true},
                        { name: 'All Skills', value: 
                        'Total Exp: ' 
                            + ((json[0].FarmingExp
                            + json[0].MiningExp
                            + json[0].CombatExp
                            + json[0].ForagingExp
                            + json[0].FishingExp
                            + json[0].EnchantingExp
                            + json[0].AlchemyExp
                            + json[0].TamingExp)/1000000).toFixed(1) + 
                        "m\nAverage Exp per Skill: " 
                            + ((
                                ((json[0].FarmingExp
                                    + json[0].MiningExp
                                    + json[0].CombatExp
                                    + json[0].ForagingExp
                                    + json[0].FishingExp
                                    + json[0].EnchantingExp
                                    + json[0].AlchemyExp
                                    + json[0].TamingExp)
                                /8)
                                /guild.members.length)/1000000).toFixed(1) +
                        "m\nAverage Level: " + 
                        getLevelByXp(((json[0].FarmingExp
                            + json[0].MiningExp
                            + json[0].CombatExp
                            + json[0].ForagingExp
                            + json[0].FishingExp
                            + json[0].EnchantingExp
                            + json[0].AlchemyExp
                            + json[0].TamingExp)
                            /8)
                            /guild.members.length).level
                            , inline: true}
                        )
                        msge.edit(embed_i)
                        })
                        })
                } else {
                    msg.channel.send('Dazu hast du keine Rechte')
                }
            }
        }
        }
        if(json[0] === undefined) {
            if(msg.member.roles.cache.some(role => role.name === 'Team (Ping)')) { 
                var total_farming_exp = 0;
                var total_mining_exp = 0;
                var total_combat_exp = 0;
                var total_foraging_exp = 0;
                var total_fishing_exp = 0;
                var total_enchanting_exp = 0;
                var total_alchemy_exp = 0;
                var total_taming_exp = 0;
                var total_slayer_exp = 0;
                var today = new Date();
                var today1 = new Date();
                var today2 = new Date();
                var dd2 = String(today2.getDate()).padStart(2, '0');
                var mm2 = String(today2.getMonth() + 1).padStart(2, '0');
                var yyyy2 = today2.getFullYear();
                embed_i.setTitle('Guildstats-Tracker')
                embed_i.setThumbnail('https://i.imgur.com/rD1j3vJ.jpeg')
                today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                today1 = dd2-7 + '/' + mm2 + '/' + yyyy2;
                today = dd2-1 + '/' + mm2 + '/' + yyyy2; 
                embed_i.addField("Information", "Die Gilden Statistiken werden maximal alle 12h geupdated")
                embed_i.setFooter("Der Druchschnitt der Level wurde anhand der durchschnittlichen Exp berechnet.")
                msg.channel.send("Loading Data...").then(msge => {
                fetch("https://api.hypixel.net/guild?key=47cb944b-4834-42e6-ab0f-d09914558bac&player=64e008cbc99b4397ae670d4624acf9d7")
                .then(result => result.json())
                .then(({ guild }) => {     
                    for(var i = 0; i<guild.members.length; i++) {
                        task(i, guild, msge)
                    }
                    embed_i.addField("Heute", 'Member: ' + guild.members.length)
                })
                msge.edit(embed_i)
            })
                } else {
                    msg.channel.send('Dazu hast du keine Rechte')
                }
        }
    
    })
}
client.on('message', (msg) => { 
    var cont = msg.content;
    var invoke = cont.split(' ')[0].substr(config.prefix.length)   
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = today2.getFullYear();
    today2 = dd2 + '/' + mm2 + '/' + yyyy2;
        args = cont.split(' ').slice(1);    
    if(cont.startsWith('r!')) {
        if(invoke in cmdmap) {
            cmdmap[invoke](msg, args);
    }
}
})
client.login(config.token)