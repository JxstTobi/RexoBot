const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const fetch = require("node-fetch");
const mysql = require('mysql');
var CronJob = require('cron').CronJob;
var errorEmbed = new Discord.MessageEmbed();
const { RichEmbed, Channel, MessageEmbed } = require('discord.js');
const connection = mysql.createConnection({
    host: config.host,
    port: '3306',
    user: config.user,
    password: config.password,
    database: config.database,
    charset: 'utf8mb4'
});
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
var cmdmap = {
    pinfo: player_cmd,
    stamm: stamm_cmd,
    checkuser: checkuser_cmd,
    roleclaim: role_cmd,
    botinfo: botinfo_cmd,
    help: help_cmd,
    icheck: icheck_cmd,
    urlaub: urlaub_cmd,
    dverify: dverify_cmd,
    cata: cata_cmd,
    gstats: gstats_cmd,
    gscammers: gscammers_cmd,
    warn: warns_cmd,
    warns: checkwarns,
    itemembed: itemembed_cmd
}
var client = new Discord.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}`);
    client.user.setActivity('Hypixel Skyblock API', { type: 'WATCHING' });
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    connection.connect(err => {
        console.log("--------------------------------\n");
        if (err) return console.log('[ERR] | MySQL error \n' + err);
        console.log('[OK] | MySQL connected');
        function guild() {
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                    connection.query(`SELECT * FROM guildstats WHERE Date = '${today}';`, function (err, result, fields) {
                        if(err != null) {
                            console.log(err);
                        }
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);
                        for (var i = 0; i < json.length; i++) {
                            console.log(json[i].Members)
                            if (json[i].Members === undefined) {
                                connection.query(`INSERT INTO guildstats(Members, Date) VALUES ('${guild.members.length}', '${today}') ON DUPLICATE KEY UPDATE Members = '${guild.members.length}' AND Date = ${today};`, function (err, result, fields) {
                                    if(err != null) {
                                        console.log(err);
                                    }
                                });
                            } else {
                                connection.query(`UPDATE guildstats SET Members = '${guild.members.length}' WHERE Date = '${today}';`, function (err, result, fields) {
                                    if(err != null) {
                                        console.log(err);
                                    }
                                });
                            }
                        }
                        if (json.length === 0) {
                            if (json.Members === undefined) {
                                connection.query(`INSERT INTO guildstats(Members, Date) VALUES ('${guild.members.length}', '${today}') ON DUPLICATE KEY UPDATE Members = '${guild.members.length}' AND Date = ${today}`, function (err, result, fields) {
                                    if(err != null) {
                                        console.log(err);
                                    }
                                });
                            } else {
                                connection.query(`UPDATE guildstats SET Members = '${guild.members.length}' WHERE Date = '${today2}'`, function (err, result, fields) {
                                    if(err != null) {
                                        console.log(err);
                                    }
                                });
                            }
                        }
                    })
                }) } } )
        }
        var job = new CronJob('0 2,4,6,8,10,12,14,15,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * *', function () {
            guild();
        }, null, true, 'Europe/Berlin');
        job.start();
    });
})
/*
* Commands
*/
function itemembed_cmd(msg, args) {
    if(msg.member.roles.cache.some(role => role.name === "Team (Ping)")) {
        if(args.length == 6) {
            msg.delete()
            var embed = new Discord.MessageEmbed()
                .setTitle(args[0].replace(/_/g,  " "))
                .addField('Schaden(Damage): ', args[1], true)
                .addField('Stärke(Strength): ', args[2], true)
                .addField('Seltenheit(Rarity): ', args[3], true)
                .addField('Nützlichkeit: ', args[4].replace(/_/g, ' '), true)
                .setThumbnail(args[5]);
            msg.channel.send(embed);
        } else {
            msg.channel.send('Benutze den Befehl so: r!itemembed <Item Name> <Schaden> <Stärke> <Seltenheit> <Nützlichkeit> <Thumbnail(Link)> \n**Nutze anstatt Leerzeichen Unterstriche. Bsp.: Aspect_of_the_Dragons anstatt Aspect of the Dragons**');
        }
    }
}
function player_cmd(msg, args) {
    var channel = msg.channel,
        playerInfoEmbed = new Discord.MessageEmbed();
    errorEmbed.setColor(COLORS.carrot);
    if (args.length === 1) {
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                if (player != undefined) {
                    var uuid = player.uuid,
                        displayName = player.displayname;
                    fetch("https://api.hypixel.net/status?key=" + config.api_key + "&uuid=" + uuid)
                    .then(result => { if(result.status === 200) { result.json().then(({ session }) => {
                            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                    playerInfoEmbed.setTitle('`Spieler-Info von ' + displayName + '`');
                                    playerInfoEmbed.setURL('https://api.hypixel.net');
                                    playerInfoEmbed.setColor(COLORS.silver);
                                    playerInfoEmbed.addFields(
                                        { name: 'UUID:', value: '' + uuid },
                                        { name: 'Momentan online: ', value: '' + getOnline(uuid, session) });
                                    if (guild != undefined) {
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
                                }) } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status);
                                    channel.send(errorEmbed);
                                } } );
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } );
                } else {
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    channel.send(errorEmbed);
                }
            }) } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status)
                channel.send(errorEmbed);
            }} );
    } else {
        errorEmbed.addField('Error', 'Bitte gebe einen Namen an.');
        channel.send(errorEmbed);
    }
}
function stamm_cmd(msg, args) {
    var channel = msg.channel,
        botChannel = client.channels.cache.get('702073362972803082'),
        beantragungsChannel = client.channels.cache.get('703649124242948116'),
        informationEmbed = new MessageEmbed();
        errorEmbed.setColor(COLORS.carrot);
    informationEmbed.setColor(COLORS.greensea);
    if (args.length === 1) {
        var today = Date.now();
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                if (player === null || player === undefined) {
                    errorEmbed.addField('Error', 'Dieser Spieler existiert nicht.');
                    errorEmbed.addField('Information', 'Versuche es in ca 2 Minuten nochmal, falls der Spieler existiert.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    channel.send(errorEmbed);
                } else {
                    var uuid = player.uuid;
                    fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                            var idGuild1 = '5d8f585577ce8436b66ace6e',
                                idGuild2 = '5edccecc8ea8c933dbd107ab',
                                guildTag = null;
                            if (guild === null) {
                                errorEmbed.addField('Error', 'Du bist nicht in unserer Gilde! Trete uns doch bei /g join Rexo');
                                channel.send(errorEmbed);
                            } else if (guild._id === idGuild1) {
                                if (channel === botChannel) {
                                    guildTag = "1";
                                    var time_difference = today - getGuildMemberJoined(uuid, guild);
                                    time_difference = time_difference / 1000 / 60 / 60 / 24;
                                    if (time_difference >= 21) {
                                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.id === '703219748699373619'));
                                        informationEmbed.addField('Information', 'Beantragung erfolgreich gesendet.');
                                        channel.send(informationEmbed);
                                        var beantragungsEmbed = new MessageEmbed()
                                            .setColor(COLORS.silver)
                                            .setColor(COLORS.pumpkin)
                                            .setTitle("Stamm Beantragung von `" + msg.member.user.tag + "`")
                                            .addField('IGN:', "`" + player.displayname + "`")
                                            .addField('Gilde: ', guildTag)
                                            .send('', beantragungsEmbed);
                                    } else {
                                        errorEmbed.addField('Error', 'Beantragung fehlgeschlagen. Du bist weniger als 21d in der Gilde.');
                                        channel.send(errorEmbed);
                                    }
                                } else {
                                    errorEmbed.addField('Error', 'Dies ist der falsche Channel nutze ' + "<#702073362972803082>");
                                    channel.send(errorEmbed);
                                }
                            } else if (guild._id === idGuild2) {
                                if (channel === botChannel) {
                                    guildTag = "2";
                                    var time_difference = today - getGuildMemberJoined(uuid, guild);
                                    time_difference = time_difference / 1000 / 60 / 60 / 24;
                                    if (time_difference >= 21) {
                                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.id === '703219748699373619'));
                                        informationEmbed.addField('Information', 'Beantragung erfolgreich gesendet.');
                                        channel.send(informationEmbed);
                                        var beantragungsEmbed = new MessageEmbed()
                                            .setColor(COLORS.silver)
                                            .setColor(COLORS.pumpkin)
                                            .setTitle("Stamm Beantragung von `" + msg.member.user.tag + "`")
                                            .addField('IGN:', "`" + player.displayname + "`")
                                            .addField('Gilde: ', guildTag)
                                            .send('', beantragungsEmbed);
                                    } else {
                                        errorEmbed.addField('Error', 'Beantragung fehlgeschlagen. Du bist weniger als 21d in der Gilde.');
                                        channel.send(errorEmbed);
                                    }
                                } else {
                                    errorEmbed.addField('Error', 'Dies ist der falsche Channel nutze ' + "<#702073362972803082>");
                                    channel.send(errorEmbed);
                                }
                            } else {
                                errorEmbed.addField('Error', 'Du bist nicht in unserer Gilde! Trete uns doch bei /g join Rexo');
                                channel.send(errorEmbed);
                            }
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } )
                }
            }) } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                channel.send(errorEmbed);
            } } )
    } else {
        channel.send("Bitte gebe einen Namen an.");
    }
}
function checkuser_cmd(msg, args) {
    var checkUserEmbed = new MessageEmbed(),
        infoEmbed = new MessageEmbed()
            .setColor(COLORS.greensea)
            .addField('Information', 'Wenn du keine Antwort außer dieser Nachricht bekommst, dann existiert der Spieler nicht!\nBugs des Bots bitte bei den Developern des Servers melden.');
    msg.channel.send(infoEmbed);
    if (args.length === 1) {
        checkUserEmbed.setTitle('Report-Information');
        checkUserEmbed.setColor(COLORS.silver);
        fetch("https://api.mojang.com/users/profiles/minecraft/" + args[0])
        .then(result => { if(result.status === 200) { result.json().then(({ id }) => {
            console.log(id)
                msg.channel.send(checkUserEmbed).then(msge => {
                    if (id != undefined) {
                        checkUserEmbed.addField('Name:', '`' + args[0] + '`');
                        checkUserEmbed.addField('UUID:', id);
                        msge.edit(checkUserEmbed);
                        fetch("https://script.tftech.de/api/hggv2/?key=bf5a20d1-44a7-4b3d-843c-b0a22fbda8e5&uuid=" + id)
                        .then(result => { if(result.status === 200) { result.json().then(({ reports }) => {
                        if(reports != undefined) {
                            if(reports.length === 1) {
                                if (reports != undefined) {
                                        checkUserEmbed.addField('Reports:', '' + reports[0].keyword);
                                        msge.edit(checkUserEmbed);
                                        checkUserEmbed.addField('Beschreibung:', '' + reports[0].description);
                                        msge.edit(checkUserEmbed);
                                        checkUserEmbed.addField('Beweise:', 'Links: ' + reports[0].proofs );
                                        msge.edit(checkUserEmbed);
                                } else {
                                    checkUserEmbed.addField('Reports:', 'Keine Reports gefunden.');
                                    msge.edit(checkUserEmbed);
                                }
                            } else if(reports.length === 2) {
                                if (reports != undefined) {
                                    checkUserEmbed.addField('Reports:', 'Report 1: ' + reports[1].keyword + "\nReport 2: "  + reports[0].keyword);
                                    msge.edit(checkUserEmbed);
                                    checkUserEmbed.addField('Beschreibung:', 'Report 1: ' + reports[1].description + "\nReport 2: "  + reports[0].description);
                                    msge.edit(checkUserEmbed);
                                    checkUserEmbed.addField('Beweise:', 'Report 1: Links: ' + reports[1].proofs + "\nReport 2: Links: " + reports[0].proofs);
                                    msge.edit(checkUserEmbed);
                            } else {
                                checkUserEmbed.addField('Reports:', 'Keine Reports gefunden.');
                                msge.edit(checkUserEmbed);
                            }
                            } else {
                                checkUserEmbed.addField('Reports:', 'Keine Reports gefunden.');
                                msge.edit(checkUserEmbed);
                            }
                        } else {
                            checkUserEmbed.addField('Reports:', 'Keine Reports gefunden.');
                            msge.edit(checkUserEmbed);
                        }
                            }) } } )
                    } else {
                        checkUserEmbed.setColor(COLORS.pumpkin);
                        checkUserEmbed.addField('Status:', 'Spieler nicht gefunden.');
                        msg.channel.send(checkUserEmbed);
                    }
                });
            }) } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                msg.channel.send(errorEmbed);
            } } );
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
    errorEmbed.setColor(COLORS.carrot);
    guildEmbed.setColor(COLORS.silver);
    if (args.length === 2) {
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                if (player === undefined || player === null) {
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    channel.send(errorEmbed);
                } else if (player != undefined && player != null) {
                    var uuid = player.uuid,
                        profiles = player.stats.SkyBlock.profiles;
                    fetch("https://api.hypixel.net/skyblock/profile?key=" + config.api_key + "&profile=" + getProfileID(args[1], profiles))
                    .then(result => { if(result.status === 200) { result.json().then(({ profile }) => {
                            if (player.socialMedia != undefined) {
                                if (player.socialMedia.links != undefined) {
                                    var dc_tag_hypixel = player.socialMedia.links.DISCORD;
                                    if (dc_tag_hypixel != undefined) {
                                        if (dc_tag_hypixel === author.user.tag) {
                                            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                                            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                                    var idGuild1 = '5d8f585577ce8436b66ace6e';
                                                    if (guild === null || guild._id != idGuild1) {
                                                        guildEmbed.addField('Gilden Rolle', "Du bist nicht in unseren Gilden");
                                                        const g1Role = msgGuild.roles.cache.find(role => role.id === '727152109509673031');
                                                        author.roles.remove(g1Role);
                                                        channel.send(guildEmbed);
                                                    } else if (guild._id === idGuild1) {
                                                        const g1Role = msgGuild.roles.cache.find(role => role.id === '727152109509673031');
                                                        author.roles.add(g1Role);
                                                        guildEmbed.addField('Gilden Rolle', "Gilde 1 hinzugefügt");
                                                        channel.send(guildEmbed);
                                                    }
                                                }) } } )
                                            if (profile != undefined) {
                                                if (profile.members[uuid].unlocked_coll_tiers != undefined &&
                                                    profile.members[uuid].experience_skill_foraging != undefined &&
                                                    profile.members[uuid].experience_skill_combat != undefined &&
                                                    profile.members[uuid].experience_skill_mining != undefined &&
                                                    profile.members[uuid].experience_skill_alchemy != undefined &&
                                                    profile.members[uuid].experience_skill_farming != undefined &&
                                                    profile.members[uuid].experience_skill_taming != undefined &&
                                                    profile.members[uuid].experience_skill_enchanting != undefined &&
                                                    profile.members[uuid].experience_skill_fishing != undefined) {
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
                                                    if (unlockedCollections.includes("WHEAT_11")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750367915802624114'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750367915802624114')); }
                                                    if (unlockedCollections.includes("CARROT_ITEM_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750370881385005086'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750370881385005086')); }
                                                    if (unlockedCollections.includes("POTATO_ITEM_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371461134418030'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371461134418030')); }
                                                    if (unlockedCollections.includes("PUMPKIN_11")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371464611627110'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371464611627110')); }
                                                    if (unlockedCollections.includes("MELON_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371468331712512'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371468331712512')); }
                                                    if (unlockedCollections.includes("SEEDS_6")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371471007809627'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371471007809627')); }
                                                    if (unlockedCollections.includes("MUSHROOM_COLLECTION_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371473713135727'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371473713135727')); }
                                                    if (unlockedCollections.includes("INK_SACK:3_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371477039087677'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371477039087677')); }
                                                    if (unlockedCollections.includes("CACTUS_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371479291559999'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371479291559999')); }
                                                    if (unlockedCollections.includes("SUGAR_CANE_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371482504265909'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371482504265909')); }
                                                    if (unlockedCollections.includes("FEATHER_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371484928704652'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371484928704652')); }
                                                    if (unlockedCollections.includes("LEATHER_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371490167521362'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371490167521362')); }
                                                    if (unlockedCollections.includes("PORK_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371487566921751'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371487566921751')); }
                                                    if (unlockedCollections.includes("RAW_CHICKEN_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371493124505650'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371493124505650')); }
                                                    if (unlockedCollections.includes("MUTTON_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371495972175944'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371495972175944')); }
                                                    if (unlockedCollections.includes("RABBIT_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371497910206575'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371497910206575')); }
                                                    if (unlockedCollections.includes("NETHER_STALK_12")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '750371501126975578'));
                                                        maxedFarmingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '750371501126975578')); }
                                                    /*
                                                    * Mining
                                                    */
                                                    var maxedMiningCollections = 0;
                                                    if (unlockedCollections.includes("COBBLESTONE_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990507329617961'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990507329617961')); }
                                                    if (unlockedCollections.includes("COAL_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990510676410428'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990510676410428')); }
                                                    if (unlockedCollections.includes("IRON_INGOT_12")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990513549639740'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990513549639740')); }
                                                    if (unlockedCollections.includes("GOLD_INGOT_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990516711751761'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990516711751761')); }
                                                    if (unlockedCollections.includes("DIAMOND_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990519492706374'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990519492706374')); }
                                                    if (unlockedCollections.includes("INK_SACK:4_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990522009157664'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990522009157664')); }
                                                    if (unlockedCollections.includes("EMERALD_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990525175464027'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990525175464027')); }
                                                    if (unlockedCollections.includes("REDSTONE_16")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990528107806722'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990528107806722')); }
                                                    if (unlockedCollections.includes("QUARTZ_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990530829647873'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990530829647873')); }
                                                    if (unlockedCollections.includes("OBSIDIAN_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990533602213929'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990533602213929')); }
                                                    if (unlockedCollections.includes("GLOWSTONE_DUST_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990536861581373'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990536861581373')); }
                                                    if (unlockedCollections.includes("GRAVEL_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990540238258176'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990540238258176')); }
                                                    if (unlockedCollections.includes("ICE_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990543635513394'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990543635513394')); }
                                                    if (unlockedCollections.includes("NETHERRACK_3")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990546457493525'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990546457493525')); }
                                                    if (unlockedCollections.includes("SAND_7")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990549871656971'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990549871656971')); }
                                                    if (unlockedCollections.includes("ENDER_STONE_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '769990552270667796'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '769990552270667796')); }
                                                    if (unlockedCollections.includes("MITHRIL_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '825063871597379644'));
                                                        maxedMiningCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '825063871597379644')); }
                                                    /*
                                                    *    Combat
                                                    */
                                                    var maxedCombatCollections = 0;
                                                    if (unlockedCollections.includes("ROTTEN_FLESH_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770738918718570566'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770738918718570566')); }
                                                    if (unlockedCollections.includes("BONE_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739012369514509'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739012369514509')); }
                                                    if (unlockedCollections.includes("STRING_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739071705940001'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739071705940001')); }
                                                    if (unlockedCollections.includes("SPIDER_EYE_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739198029988151'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739198029988151')); }
                                                    if (unlockedCollections.includes("SULPHUR_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739272902246420'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739272902246420')); }
                                                    if (unlockedCollections.includes("ENDER_PEARL_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739340455968858'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739340455968858')); }
                                                    if (unlockedCollections.includes("GHAST_TEAR_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739432864088075'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739432864088075')); }
                                                    if (unlockedCollections.includes("SLIME_BALL_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739510593585153'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739510593585153')); }
                                                    if (unlockedCollections.includes("BLAZE_ROD_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739579246346270'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739579246346270')); }
                                                    if (unlockedCollections.includes("MAGMA_CREAM_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739659868733441'));
                                                        maxedCombatCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739659868733441')); }
                                                    /*
                                                    *   Foraging
                                                    */
                                                    var maxedForagingCollections = 0;
                                                    if (unlockedCollections.includes("LOG_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739756438650951'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739756438650951')); }
                                                    if (unlockedCollections.includes("LOG:1_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739809412186112'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739809412186112')); }
                                                    if (unlockedCollections.includes("LOG:2_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739864017567744'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739864017567744')); }
                                                    if (unlockedCollections.includes("LOG_2:1_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739933139697684'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739933139697684')); }
                                                    if (unlockedCollections.includes("LOG_2_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770739989456748596'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770739989456748596')); }
                                                    if (unlockedCollections.includes("LOG:3_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770744225587003423'));
                                                        maxedForagingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770744225587003423')); }
                                                    /*
                                                    *    Fishing
                                                    */
                                                    var maxedFishingCollections = 0;
                                                    if (unlockedCollections.includes("RAW_FISH_11")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740175248293898'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740175248293898')); }
                                                    if (unlockedCollections.includes("RAW_FISH:1_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740249206325262'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740249206325262')); }
                                                    if (unlockedCollections.includes("RAW_FISH:2_7")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '777197212936962098'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '777197212936962098')); }
                                                    if (unlockedCollections.includes("RAW_FISH:3_10")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740331393581107'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740331393581107')); }
                                                    if (unlockedCollections.includes("PRISMARINE_SHARD_5")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740440257003550'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740440257003550')); }
                                                    if (unlockedCollections.includes("PRISMARINE_CRYSTALS_7")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740534226321448'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740534226321448')); }
                                                    if (unlockedCollections.includes("CLAY_BALL_5")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740606329946132'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740606329946132')); }
                                                    if (unlockedCollections.includes("WATER_LILY_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740691877756968'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740691877756968')); }
                                                    if (unlockedCollections.includes("INK_SACK_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740751713697812'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740751713697812')); }
                                                    if (unlockedCollections.includes("SPONGE_9")) {
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '770740810496213013'));
                                                        maxedFishingCollections++;
                                                        maxedCollections++;
                                                    } else { author.roles.remove(msgGuild.roles.cache.find(role => role.id === '770740810496213013')); }
                                                    //Placeholder roles
                                                    if (maxedFarmingCollections > 0) {
                                                        try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '750370595811623042')); } catch { }
                                                    }
                                                    if (maxedMiningCollections > 0) {
                                                        try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '769989929789816882')); } catch { }
                                                    }
                                                    if (maxedCombatCollections > 0) {
                                                        try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777193990964510760')); } catch { }
                                                    }
                                                    if (maxedForagingCollections > 0) {
                                                        try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777196588439175200')); } catch { }
                                                    }
                                                    if (maxedFishingCollections > 0) {
                                                        try { author.roles.add(msgGuild.roles.cache.find(role => role.id === '777196860653174833')); } catch { }
                                                    }
                                                    /*
                                                    *   Skills
                                                    */
                                                    function isForaging25(foragingExp) {
                                                        if (foragingExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isCombat25(combatExp) {
                                                        if (combatExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isMining25(miningExp) {
                                                        if (miningExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFarming25(farmingExp) {
                                                        if (farmingExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isAlchemy25(alchemyExp) {
                                                        if (alchemyExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isTaming25(tamingExp) {
                                                        if (tamingExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isEnchanting25(enchantingExp) {
                                                        if (enchantingExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFishing25(fishingExp) {
                                                        if (fishingExp >= 3000000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isRev7(slayerExpZombie) {
                                                        if (slayerExpZombie >= 100000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isTara7(slayerExpSpider) {
                                                        if (slayerExpSpider >= 100000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isSven7(slayerExpWolf) {
                                                        if (slayerExpWolf >= 100000) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isEnderman3(slayerExpEnderman) {
                                                        if (slayerExpEnderman >= 300) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    /*
                                                    *   Slayer
                                                    */

                                                    var slayer_exp_zombie = profile.members[uuid].slayer_bosses.zombie.xp,
                                                        slayer_exp_wolf = profile.members[uuid].slayer_bosses.wolf.xp,
                                                        slayer_exp_spider = profile.members[uuid].slayer_bosses.spider.xp
                                                        slayer_exp_enderman = profile.members[uuid].slayer_bosses.enderman.xp;
                                                    /*
                                                    *   Create final embed
                                                    */
                                                    var roleEmbed = new MessageEmbed()
                                                        .setTitle('Role Claim')
                                                        .setColor(COLORS.Emerland)
                                                        .setThumbnail('https://i.imgur.com/p6wcIcc.png')
                                                        .setURL('https://sky.lea.moe/stats/' + args[0] + '/' + args[1])
                                                        .addFields(
                                                        { name: 'Skill Rollen', value: 'Fügt dir eine Skill Rolle hinzu, wenn du in diesem Skill Level 25 bist.' });
                                                    if (isForaging25(foragingExp)) {
                                                        roleEmbed.addField('Foraging 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556162320597008'));
                                                    } else {
                                                        roleEmbed.addField('Foraging 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556162320597008'));
                                                    }
                                                    if (isCombat25(combatExp)) {
                                                        roleEmbed.addField('Combat 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727508450254258237'));
                                                    } else {
                                                        roleEmbed.addField('Combat 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727508450254258237'));
                                                    }
                                                    if (isMining25(miningExp)) {
                                                        roleEmbed.addField('Mining 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727555564284149762'));
                                                    } else {
                                                        roleEmbed.addField('Mining 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727555564284149762'));
                                                    }
                                                    if (isFarming25(farmingExp)) {
                                                        roleEmbed.addField('Farming 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556040887107584'));
                                                    } else {
                                                        roleEmbed.addField('Farming 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556040887107584'));
                                                    }
                                                    if (isAlchemy25(alchemyExp)) {
                                                        roleEmbed.addField('Alchemy 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '810135337648259072'));
                                                    } else {
                                                        roleEmbed.addField('Alchemy 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '810135337648259072'));
                                                    }
                                                    if (isTaming25(tamingExp)) {
                                                        roleEmbed.addField('Taming 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556988543959040'));
                                                    } else {
                                                        roleEmbed.addField('Taming 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556988543959040'));
                                                    }
                                                    if (isEnchanting25(enchantingExp)) {
                                                        roleEmbed.addField('Enchanting 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556734490771486'));
                                                    } else {
                                                        roleEmbed.addField('Enchanting 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556734490771486'));
                                                    }
                                                    if (isFishing25(fishingExp)) {
                                                        roleEmbed.addField('Fishing 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556252527230986'));
                                                    } else {
                                                        roleEmbed.addField('Fishing 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556252527230986'));
                                                    }
                                                    roleEmbed.addFields( { name: 'Slayer Rollen', value: 'Fügt dir eine Slayer Rolle hinzu, wenn du bei diesem Slayer Level 7 bist.' } );
                                                    if (isRev7(slayer_exp_zombie)) {
                                                        roleEmbed.addField('Revenant Horror 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888340511260752'));
                                                    } else {
                                                        roleEmbed.addField('Revenant Horror 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888340511260752'));
                                                    }
                                                    if (isTara7(slayer_exp_spider)) {
                                                        roleEmbed.addField('Tarantula Broodfather 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888342289907744'));
                                                    } else {
                                                        roleEmbed.addField('Tarantula Broodfather 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888342289907744'));
                                                    }
                                                    if (isSven7(slayer_exp_wolf)) {
                                                        roleEmbed.addField('Sven Packmaster 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888338376622092'));
                                                    } else {
                                                        roleEmbed.addField('Sven Packmaster 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888338376622092'));
                                                    }
                                                    if (isEnderman3(slayer_exp_zombie)) {
                                                        roleEmbed.addField('Voidgloom Seraph 3', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '849369703063355422'));
                                                    } else {
                                                        roleEmbed.addField('Voidgloom Seraph 3', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '849369703063355422'));
                                                    }
                                                    roleEmbed.addField('Collections', 'Dir wurden ' + maxedCollections + ' Collection-Rollen hinzugefügt.');
                                                    channel.send(roleEmbed);
                                                } else {
                                                    errorEmbed.addField('Error', 'Deine API ist nicht eingeschalten oder du hast nicht alle Skills freigeschalten!');
                                                    errorEmbed.addField('Information', 'So aktivierst du deine API: \nHypixel SkyBlock -> SkyBlock Menu -> Einstellungen -> API\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                                    channel.send(errorEmbed);
                                                }
                                            } else {
                                                errorEmbed.addField('Error', 'Dieses Profil wurde nicht gefunden!')
                                                errorEmbed.addField('Information', 'Falls dieses Profil existiert und es trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                channel.send(errorEmbed);
                                            }
                                        } else {
                                            errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                            errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                            channel.send(errorEmbed);
                                        }
                                    } else {
                                        errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                        errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
                                        channel.send(errorEmbed);
                                    }
                                } else {
                                    errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                    errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                    channel.send(errorEmbed);
                                }
                            } else {
                                errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.');
                                channel.send(errorEmbed);
                            }
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } );
                }
            }) } else if (result) { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                channel.send(errorEmbed);
            } } );
    } else {
        channel.send("Nutze den Befehl so: r!roleclaim <name> <profile>");
    }
}
function botinfo_cmd(msg, args) {
    var chan = msg.channel
    var embed4 = new MessageEmbed()
        .setColor(COLORS.Emerland)
        .setTitle('Botinfo')
        .addField('Bot-Besitzer', '<@702790608649060432>')
        .addField('Developer', '<@702790608649060432>')
        .addField('Hilfe-Befehl', 'r!help')
        .addField('Letztes Update', '24.4.2021 | 22:12')
        .addField('Letzter Start',`${new Date(client.readyTimestamp).getDate()}.${new Date(client.readyTimestamp).getMonth() + 1}.${new Date(client.readyTimestamp).getFullYear()} | ${new Date(client.readyTimestamp).getHours()}:${new Date(client.readyTimestamp).getMinutes()}`)
        .addField('Version', '0.0.5')
        .setFooter('Offizieler Rexo-Tools Bot');
    chan.send('', embed4);
}
function help_cmd(msg, args) {
    var chan = msg.channel;
    var helpEmbed = new MessageEmbed()
        .addField('Stamm-Command:', 'r!stamm <name> - Stamm-Beantragungs-Command.')
        .addField('Cata-Command:', 'r!cata - Gibt dir deine Catacombs-Skillrolle.')
        .addField('Verify-Command:', 'r!dverify <name> - Verifiziert dich für Dungeons.')
        .addField('Roleclaim-Command:', 'r!roleclaim <name> <Skyblock-Profile> | Skill-,Slayer- und Gilden-Rollen claimen(z.B. Combat 25). **WICHTIG:** Euer Discord-Account auf Hypixel verlinkt sein.')
        .addField('Spieler-Info-Command:', 'r!pinfo <name> - Zeigt Informationen über den Spieler.')
        .addField('Bot-Info-Command:', 'r!botinfo - Zeigt Infos über den Bot.')
        .addField('Hilfe-Command:', 'r!help - Hilfenachricht des Bots.')
        .addField('Urlaub-Command', 'r!urlaub <name> <Tage als Zahl> -  Meldet dich für den Zeitraum ab.')
        .addField('Gilden-Stats-Command', 'r!gstats - Zeigt die Stats der Gilde.')
        .addField('Checkuser-Command', 'r!checkuser <IGN> - Zeigt dir, ob der Nutzer scammt.')
    chan.send('', helpEmbed);
}
function icheck_cmd(msg, args) {
    if (msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
        var embed_i = new MessageEmbed();
        embed_i.setFooter("Falls diese Nachricht nach 2 Minuten noch keine Namen enthält, dann ist niemand inaktiv.");
        var today2 = new Date(),
             dd2 = String(today2.getDate()).padStart(2, '0'),
             mm2 = String(today2.getMonth() + 1).padStart(2, '0'),
             h = today2.getHours(),
             min = today2.getMinutes(),
             sec = today2.getSeconds(),
             yyyy2 = today2.getFullYear();
        today2 = dd2 + '/' + mm2 + '/' + yyyy2 + "(" + h + ":" + min + ":" + sec + ")";
        if (args.length === 1) {
            if (args[0] === "1") {
                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                        connection.query(`INSERT INTO kicktagetable(Datum, DiscordTag) VALUES ('${today2}', '${msg.author.tag}');`, function (err, result, fields) {
                            if(err != null) {
                                console.log(err);
                            }
                        });

                        msg.channel.send(embed_i).then(msge => {
                            for (i = 0; i < guild.members.length; i++) {
                                fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + guild.members[i].uuid)
                                .then(result => { if(result.status === 200) { result.json().then(({ name }) => {
                                        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + name)
                                        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                                                function getGuildMemberRank(uuid) {
                                                    var memberobject = guild.members;
                                                    for (var key of Object.keys(memberobject)) {
                                                        if (memberobject[key].uuid === uuid) {
                                                            return memberobject[key].rank;
                                                        }
                                                    }
                                                    return;
                                                }
                                                if (player != null) {
                                                    var today = new Date();
                                                    var time_difference = today - player.lastLogin;
                                                    time_difference = time_difference / 1000 / 60 / 60 / 24;
                                                    embed_i.setFooter("Falls diese Nachricht nach 2 Minuten noch keine Namen enthält, dann ist niemand inaktiv.");

                                                    if (Math.round(time_difference) >= 5) {
                                                        var displayName = player.displayname;
                                                        connection.query("SELECT AbgemeldetBisMilis FROM urlaub WHERE Name ='" + displayName + "';", function (err, result, fields) {
                                                            if(err != null) {
                                                                console.log(err);
                                                            }
                                                            var string = JSON.stringify(result);
                                                            var json = JSON.parse(string);
                                                            console.log(json.length);
                                                            if (json.length === 0) {
                                                                embed_i.addField(getGuildMemberRank(player.uuid) + ': `' + player.displayname + '`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Nicht abgemeldet.');
                                                                msge.edit(embed_i);
                                                            } else {
                                                                var string = JSON.stringify(result);
                                                                var json = JSON.parse(string);
                                                                var abgemeldetesDatum = new Date(parseInt(json[0].AbgemeldetBisMilis))
                                                                var resultTime = parseInt(json[0].AbgemeldetBisMilis);
                                                                var dd = String(abgemeldetesDatum.getDate()).padStart(2, '0');
                                                                var mm = String(abgemeldetesDatum.getMonth() + 1).padStart(2, '0');
                                                                var yyyy = abgemeldetesDatum.getFullYear();

                                                                abgemeldetesDatum = dd + '/' + mm + '/' + yyyy;
                                                                embed_i.setTitle("Inaktivitätsliste");
                                                                var dd = String(today.getDate()).padStart(2, '0');
                                                                var mm = String(today.getMonth() + 1).padStart(2, '0');
                                                                var yyyy = today.getFullYear();

                                                                today = dd + '/' + mm + '/' + yyyy;
                                                                console.log(resultTime*10^-3);
                                                                embed_i.addField(getGuildMemberRank(player.uuid) + ': `' + player.displayname + '`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Abgemeldet bis ' + abgemeldetesDatum);
                                                                msge.edit(embed_i);
                                                            }
                                                        });
                                                    }
                                                }

                                            }) } else { 
                                                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                errorEmbed.addField('Error: ', result.status);
                                                msg.channel.send(errorEmbed);
                                            } } )
                                    }) } else { 
                                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        errorEmbed.addField('Error: ', result.status);
                                        msg.channel.send(errorEmbed);
                                    } } )
                                function Sleep(milliseconds) {
                                    return new Promise(resolve => setTimeout(resolve, milliseconds));
                                }
                                Sleep(1000);
                            }
                            Sleep(2000);
                        })
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status);
                        msg.channel.send(errorEmbed);
                    } } )
            }
            if (args[0] === "2") {
                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438450f490ba04402f87fde6fb2")
                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                        connection.query(`INSERT INTO kicktagetable(Datum, DiscordTag) VALUES ('${today2}', '${msg.author.tag}');`, function (err, result, fields) { 
                            if(err != null) {
                                console.log(err);
                            }
                        });

                        msg.channel.send(embed_i).then(msge => {
                            for (i = 0; i < guild.members.length; i++) {
                                fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + guild.members[i].uuid)
                                .then(result => { if(result.status === 200) { result.json().then(({ name }) => {
                                        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + name)
                                        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                                                function getGuildMemberRank(uuid) {
                                                    var memberobject = guild.members;
                                                    for (var key of Object.keys(memberobject)) {
                                                        if (memberobject[key].uuid === uuid) {
                                                            return memberobject[key].rank;
                                                        }
                                                    }
                                                    return;
                                                }
                                                if (player != null) {
                                                    var today = new Date();
                                                    var time_difference = today - player.lastLogin;
                                                    time_difference = time_difference / 1000 / 60 / 60 / 24;
                                                    embed_i.setFooter("Falls diese Nachricht nach 2 Minuten noch keine Namen enthält, dann ist niemand inaktiv.");

                                                    if (Math.round(time_difference) >= 5) {
                                                        var displayName = player.displayname;
                                                        connection.query("SELECT AbgemeldetBisMilis FROM urlaub WHERE Name ='" + displayName + "';", function (err, result, fields) {
                                                            var string = JSON.stringify(result);
                                                            var json = JSON.parse(string);
                                                            console.log(json.length)
                                                            if (json.length === 0) {
                                                                embed_i.addField(getGuildMemberRank(player.uuid) + ': `' + player.displayname + '`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Nicht abgemeldet.')
                                                                msge.edit(embed_i);
                                                            } else {
                                                                var string = JSON.stringify(result);
                                                                var json = JSON.parse(string);
                                                                var abgemeldetesDatum = new Date(parseInt(json[0].AbgemeldetBisMilis));
                                                                var resultTime = parseInt(json[0].AbgemeldetBisMilis);
                                                                var dd = String(abgemeldetesDatum.getDate()).padStart(2, '0');
                                                                var mm = String(abgemeldetesDatum.getMonth() + 1).padStart(2, '0');
                                                                var yyyy = abgemeldetesDatum.getFullYear();

                                                                abgemeldetesDatum = dd + '/' + mm + '/' + yyyy;
                                                                embed_i.setTitle("Inaktivitätsliste");
                                                                var dd = String(today.getDate()).padStart(2, '0');
                                                                var mm = String(today.getMonth() + 1).padStart(2, '0');
                                                                var yyyy = today.getFullYear();

                                                                today = dd + '/' + mm + '/' + yyyy;
                                                                console.log(resultTime);
                                                                embed_i.addField(getGuildMemberRank(player.uuid) + ': `' + player.displayname + '`', 'Offline: ' + Math.round(time_difference) + ' Tage \nUrlaub: Abgemeldet bis ' + abgemeldetesDatum);
                                                                msge.edit(embed_i);
                                                            }
                                                        });
                                                    }
                                                }

                                            }) } else { 
                                                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                errorEmbed.addField('Error: ', result.status);
                                                msg.channel.send(errorEmbed);
                                            } } )
                                    }) } else { 
                                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        errorEmbed.addField('Error: ', result.status);
                                        msg.channel.send(errorEmbed);
                                    } } )
                                function Sleep(milliseconds) {
                                    return new Promise(resolve => setTimeout(resolve, milliseconds));
                                }
                                Sleep(1000);
                            }
                            Sleep(2000);
                        })
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status);
                        msg.channel.send(errorEmbed);
                    } } )
            }
        } else {
            msg.channel.send('Nutze den Befehl so: `r!icheck <Gilde>`, Beispiel: `r!icheck 1`, Mögliche Gilden: 1, 2');
        }
    } else {
        msg.channel.send('Dazu hast du keine Rechte');
    }
}
function urlaub_cmd(msg, args) {
    errorEmbed.setColor(COLORS.carrot);
    if (args.length === 2) {
        fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
        .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                if (player != null) {
                    var uuid = player.uuid
                    fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=" + uuid)
                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                            if (guild != null) {
                                if (guild.name === 'Rexo' || guild.name === 'Rexo2') {
                                    var args = msg.content.split(' ').slice(1);
                                    if (isNumeric(args[1])) {
                                        var millis = parseInt(args[1]) * 1000 * 60 * 60 * 24
                                        var today = new Date();
                                        console.log(today);
                                        connection.query(`INSERT INTO urlaub (Name, Zeit, Grund, AbgemeldetBisMilis) VALUES ('${args[0]}','${args[1]}','-','${today.getTime() + millis}');`, function (err, result, fields) {
                                            if(err != null) {
                                                console.log(err);
                                            }
                                         });
                                        msg.reply(args[0] + ' wurde für ' + args[1] + ' Tage abgemeldet.')
                                            .then(msgg => {
                                                msgg.delete({ timeout: 5000 })
                                            })
                                            .catch(console.error);
                                    } else {
                                        msg.channel.send('Gebe die Tage bitte als Zahl an!');
                                    }
                                } else {
                                    msg.channel.send('Du bist nicht in unserer Gilde.');
                                }
                            } else {
                                msg.channel.send('Du bist nicht in unserer Gilde.');
                            }
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status)
                            channel.send(errorEmbed);
                        } } ) 
                } else {
                    errorEmbed.addField('Error', 'Spieler wurde nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    msg.channel.send(errorEmbed);
                }
            }) ;
            } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                msg.channel.send(errorEmbed);
            } } );
    } else {
        msg.channel.send('Benutze den Befehl bitte so: **r!urlaub <name> <Zeit in Tagen>**');
    }
}
function dverify_cmd(msg, args) {
    msg.delete();
    errorEmbed.setColor(COLORS.carrot);
    if (msg.channel == client.channels.cache.get('808788152541642782')) {
        if (args.length == 1) {
            fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + args[0])
            .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                    if (player != undefined) {
                        if (player.socialMedia != undefined) {
                            if (player.socialMedia.links != undefined) {
                                var dc_tag_hypixel = player.socialMedia.links.DISCORD;
                                if (dc_tag_hypixel != undefined) {
                                    if (dc_tag_hypixel === msg.member.user.tag) {
                                        msg.reply('Erfolgreich verifiziert.')
                                            .then(msgg => {
                                                msgg.delete({ timeout: 5000 });
                                            })
                                        var id = msg.member.user.id;
                                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.id === '808787481901400064'), function (err, result, fields) {
                                            if(err != null) {
                                                console.log(err);
                                            }
                                            });
                                        msg.member.roles.add(msg.guild.roles.cache.find(role => role.id === '809141707282448424'), function (err, result, fields) {
                                            if(err != null) {
                                                console.log(err);
                                            }
                                            });
                                        connection.query(`DELETE FROM verified WHERE discordid = ` + id);
                                        connection.query(`INSERT INTO verified(name, uuid, discordid) VALUES ('${args[0]}', '${player.uuid}','${id}');`, function (err, result, fields) {
                                            if(err != null) {
                                                console.log(err);
                                            }
                                            });
                                        connection.query(`SELECT * FROM verified WHERE discordid = ` + msg.member.id + `;`, function (err, result, fields) {
                                            console.log(result);
                                        });
                                    } else {
                                        const user = client.users.cache.get(msg.member.user.id);
                                        errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                                        errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                        user.send(errorEmbed);
                                    }
                                } else {
                                    const user = client.users.cache.get(msg.member.user.id);
                                    errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                                    errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                    user.send(errorEmbed);
                                }
                            } else {
                                const user = client.users.cache.get(msg.member.user.id);
                                errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                                errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                user.send(errorEmbed);
                            }
                        } else {
                            const user = client.users.cache.get(msg.member.user.id);
                            errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                            errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                            user.send(errorEmbed);
                        }
                    } else {
                        const user = client.users.cache.get(msg.member.user.id);
                        errorEmbed.addField('Error', 'Spieler für die Verifizierung in <#808788152541642782> konnte nicht gefunden werden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche dich bitte in 2-3 Minuten erneut zu verifizieren.\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                        user.send(errorEmbed);
                    }
                }) } else { 
                    const user = client.users.cache.get(msg.member.user.id);
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    errorEmbed.addField('Error: ', result.status);
                    user.send(errorEmbed);
                } } );
        } else {
            msg.reply('Gebe bitte einen Namen an <@' + msg.member.user.id + '>.')
                .then(msgg => {
                    msgg.delete({ timeout: 5000 });
                })
        }
    } else {
        msg.reply('Falscher Kanal. Nutze bitte <#808788152541642782>')
            .then(msgg => {
                msgg.delete({ timeout: 5000 });
            })
    }
}
function cata_cmd(msg, args) {
    connection.query(`SELECT * FROM verified WHERE discordid = ` + msg.member.id, function (err, result, fields) {
            if(err != null) {
                console.log(err);
            }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        errorEmbed.setColor(COLORS.carrot);
        if (json.length != 0) {
            for (var i = 0; i < result.length; i++) {
                var user = msg.member;
                console.log(json[i].discordid);
                fetch("https://api.hypixel.net/player?key=" + config.api_key + "&name=" + json[i].name)
                .then(result => { if(result.status === 200) { result.json().then(({ player }) => {
                        if (player != undefined) {
                            fetch("https://api.hypixel.net/skyblock/profiles?key=" + config.api_key + "&uuid=" + player.uuid)
                            .then(result => { if(result.status === 200) { result.json().then(({ profiles }) => {
                                    if (profiles != undefined) {
                                        var parray = []
                                        for (var p = 0; p < profiles.length; p++) {
                                            var last_save = profiles[p].members[player.uuid].last_save;
                                            parray.push(last_save);
                                            parray.sort();
                                        }
                                        function getCataExp(last_save) {
                                            var profilesobject = profiles;
                                            for (var key of Object.keys(profilesobject)) {
                                                if (profilesobject[key].members[player.uuid].last_save === last_save) {
                                                    return profilesobject[key].members[player.uuid].dungeons.dungeon_types.catacombs.experience;
                                                }
                                            }
                                            console.log('Dieses Profil existiert nicht.');
                                            return;
                                        }
                                        console.log(player.displayname + " " + user.id + " " + getCataExp(parray[parray.length - 1]));
                                        var cataExp = getCataExp(parray[parray.length - 1]);
                                        if (cataExp >= 625 && cataExp < 4385) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809098153634168842'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 5 Rolle erhalten.');
                                        } else if (cataExp >= 4385 && cataExp < 25340) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809098918138740766'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 10 Rolle erhalten.');
                                        } else if (cataExp >= 25340 && cataExp < 135640) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809105824085180437'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 15 Rolle erhalten.');
                                        } else if (cataExp >= 135640 && cataExp < 668640) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809098718749523989'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 20 Rolle erhalten.');
                                        } else if (cataExp >= 668640 && cataExp < 3084640) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809105740207226921'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 25 Rolle erhalten.');
                                        } else if (cataExp >= 3084640 && cataExp < 13259640) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809098578916147293'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098632052604930')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 30 Rolle erhalten.');
                                        } else if (cataExp >= 13259640) {
                                            user.roles.add(msg.guild.roles.cache.find(role => role.id === '809098632052604930'));
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098153634168842')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105824085180437')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098718749523989')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809105740207226921')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098918138740766')); } catch { }
                                            try { user.roles.remove(msg.guild.roles.cache.find(role => role.id === '809098578916147293')); } catch { }
                                            msg.channel.send('Du hast die Catacombs 35 Rolle erhalten.');
                                        }
                                    } else {
                                        errorEmbed.addField('Error', 'Keine SkyBlock-Profile gefunden.');
                                        errorEmbed.addField('Information', 'Falls der Spieler Profile hat und diese trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        msg.channel.send(errorEmbed);
                                    }
                                }) } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status)
                                    channel.send(errorEmbed);
                                } } )
                        } else {
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            msg.channel.send(errorEmbed);
                        }
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status)
                        msg.channel.send(errorEmbed);
                    } } )
            }
        } else {
            msg.channel.send('Verifiziere dich bitte in <#808788152541642782>.');
        }
    })
}
async function gstats_cmd(msg, args) {
    var embed_i = new MessageEmbed()
        .setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
    if(args.length === 1) {
        if(isNumeric(args[0]))
        if(parseInt(args[0]) === 1) {
            var date = new Date();
    connection.query("SELECT * FROM gstatsUses;", function (err, result, fields) {
        function task(i, guild, msge) {
            setTimeout(function () {
                fetch("https://api.hypixel.net/skyblock/profiles?key=" + config.api_key + "&uuid=" + guild.members[i].uuid)
                .then(result => { if(result.status === 200) { result.json().then(({ profiles }) => {
                        console.log(i);
                        console.log(guild.members[i].uuid);
                        var parray = [];
                        if (profiles != undefined) {
                            for (var p = 0; p < profiles.length; p++) {
                                var last_save = profiles[p].members[guild.members[i].uuid].last_save;
                                parray.push(last_save);
                                parray.sort();
                            }
                            function getFarming(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_farming;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getMining(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_mining;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getCombat(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_combat;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getForaging(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_foraging;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getFishing(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_fishing;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getEnchanting(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_enchanting;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getAlchemy(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_alchemy;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getTaming(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].experience_skill_taming;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getZombie(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        if (profilesobject[key].members[guild.members[i].uuid].slayer_bosses != null) {
                                            return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.zombie.xp;
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
                                        return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.spider.xp;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }
                            function getWolf(last_save) {
                                var profilesobject = profiles;
                                for (var key of Object.keys(profilesobject)) {
                                    if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                        return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.wolf.xp;
                                    }
                                }
                                console.log('Dieses Profil existiert nicht.');
                                return;
                            }

                            if (getFarming(parray[parray.length - 1]) != undefined) {
                                total_farming_exp = total_farming_exp + getFarming(parray[parray.length - 1]);
                            }
                            if (getMining(parray[parray.length - 1]) != undefined) {
                                total_mining_exp = total_mining_exp + getMining(parray[parray.length - 1]);
                            }
                            if (getCombat(parray[parray.length - 1]) != undefined) {
                                total_combat_exp = total_combat_exp + getCombat(parray[parray.length - 1]);
                            }
                            if (getForaging(parray[parray.length - 1]) != undefined) {
                                total_foraging_exp = total_foraging_exp + getForaging(parray[parray.length - 1]);
                            }
                            if (getFishing(parray[parray.length - 1]) != undefined) {
                                total_fishing_exp = total_fishing_exp + getFishing(parray[parray.length - 1]);
                            }
                            if (getEnchanting(parray[parray.length - 1]) != undefined) {
                                total_enchanting_exp = total_enchanting_exp + getEnchanting(parray[parray.length - 1]);
                            }
                            if (getAlchemy(parray[parray.length - 1]) != undefined) {
                                total_alchemy_exp = total_alchemy_exp + getAlchemy(parray[parray.length - 1]);
                            }
                            if (getTaming(parray[parray.length - 1]) != undefined) {
                                total_taming_exp = total_taming_exp + getTaming(parray[parray.length - 1]);
                            }
                            if (getZombie(parray[parray.length - 1]) != undefined
                                && getTara(parray[parray.length - 1]) != undefined
                                && getWolf(parray[parray.length - 1]) != undefined) {
                                total_slayer_exp = total_slayer_exp + getWolf(parray[parray.length - 1]) + getTara(parray[parray.length - 1]) + getZombie(parray[parray.length - 1]);
                            }
                            if (i === guild.members.length - 1) {
                                connection.query(`DELETE FROM gstatsUses`);
                                connection.query(`INSERT INTO gstatsUses(Date, Members, FarmingExp, MiningExp, CombatExp, ForagingExp, FishingExp, EnchantingExp, AlchemyExp, TamingExp, SlayerExp) VALUES(${date.getTime()}, ${guild.members.length}, ${total_farming_exp}, ${total_mining_exp}, ${total_combat_exp}, ${total_foraging_exp}, ${total_fishing_exp}, ${total_enchanting_exp}, ${total_alchemy_exp}, ${total_taming_exp}, ${total_slayer_exp})`);
                                    embed_i.addFields(
                                    { name: ':seedling:Farming', value: 'Total XP: ' + (total_farming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_farming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_farming_exp / guild.members.length).level, inline: true },
                                    { name: ':pick:Mining', value: 'Total XP: ' + (total_mining_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_mining_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_mining_exp / guild.members.length).level, inline: true },
                                    { name: ':crossed_swords:Combat', value: 'Total XP: ' + (total_combat_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_combat_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_combat_exp / guild.members.length).level, inline: true },
                                    { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (total_foraging_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_foraging_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_foraging_exp / guild.members.length).level, inline: true },
                                    { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (total_fishing_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_fishing_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_fishing_exp / guild.members.length).level, inline: true },
                                    { name: ':book:Enchanting', value: 'Total XP: ' + (total_enchanting_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_enchanting_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_enchanting_exp / guild.members.length).level, inline: true },
                                    { name: ':alembic:Alchemy', value: 'Total XP: ' + (total_alchemy_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_alchemy_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_alchemy_exp / guild.members.length).level, inline: true },
                                    { name: ':dog:Taming', value: 'Total XP: ' + (total_taming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_taming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_taming_exp / guild.members.length).level, inline: true },
                                    { name: ':zombie:Slayer', value: 'Total XP: ' + (total_slayer_exp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(total_slayer_exp / 3 / guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(total_slayer_exp / 3 / guild.members.length), inline: true },
                                    {
                                        name: ':bar_chart:All Skills', value:
                                            'Total XP: '
                                            + ((total_farming_exp
                                                + total_mining_exp
                                                + total_combat_exp
                                                + total_foraging_exp
                                                + total_fishing_exp
                                                + total_enchanting_exp
                                                + total_taming_exp
                                                + total_alchemy_exp) / 1000000).toFixed(1) +
                                            "m\nAverage XP per Skill: "
                                            + ((
                                                ((total_farming_exp
                                                    + total_mining_exp
                                                    + total_combat_exp
                                                    + total_foraging_exp
                                                    + total_fishing_exp
                                                    + total_enchanting_exp
                                                    + total_alchemy_exp
                                                    + total_taming_exp)
                                                    / 8)
                                                / guild.members.length) / 1000000).toFixed(1) +
                                            "m\nAverage Level: " +
                                            getLevelByXp(((total_farming_exp
                                                + total_mining_exp
                                                + total_combat_exp
                                                + total_foraging_exp
                                                + total_fishing_exp
                                                + total_enchanting_exp
                                                + total_alchemy_exp
                                                + total_taming_exp)
                                                / 8)
                                                / guild.members.length).level
                                        , inline: true
                                    }
                                );
                                msge.edit(embed_i);
                            }
                        }
                        msge.edit(embed_i);
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status);
                        channel.send(errorEmbed);
                    } } );
            }, 1000 * i);
        }
        var string = JSON.stringify(result);
        var json = JSON.parse(string);
        for (var i = 0; i < json.length; i++) {
            if (json[0] != undefined) {
                console.log((date.getTime() - json[0].Date));
                if ((date.getTime() - json[0].Date) > 43200000) {
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
                    embed_i.setTitle('Guildstats-Tracker');
                    embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
                    today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                    today1 = dd2 - 7 + '/' + mm2 + '/' + yyyy2;
                    today = dd2 - 1 + '/' + mm2 + '/' + yyyy2;
                    console.log('.');
                    msg.channel.send(embed_i).then(msge => {
                        fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
                        .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                for (var i = 0; i < guild.members.length; i++) {
                                    task(i, guild, msge);
                                }
                                embed_i.addField(":busts_in_silhouette:Member", 'Heute: ' + guild.members.length);
                                msge.edit(embed_i);
                            
                            }) } else { 
                                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                errorEmbed.addField(':incoming_envelope:Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                errorEmbed.addField('Error: ', result.status);
                                channel.send(errorEmbed);
                            } } )
                        msge.edit(embed_i);
                    })
                } else {
                        msg.channel.send("Loading Data...").then(msge => {
                            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
                            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                    embed_i.setTitle('Guildstats-Tracker');
                                    embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
                                    embed_i.addField(":incoming_envelope:Information", "Die Gilden Statistiken werden maximal alle 12h geupdated");
                                    embed_i.setFooter("Der Durchschnitt der Level wurde anhand der durchschnittlichen XP berechnet.");
                                    embed_i.addField(":busts_in_silhouette:Member", 'Heute: ' + guild.members.length);
                                    embed_i.addFields(
                                        { name: ':seedling:Farming', value: 'Total XP: ' + (json[0].FarmingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FarmingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FarmingExp / guild.members.length).level, inline: true },
                                        { name: ':pick:Mining', value: 'Total XP: ' + (json[0].MiningExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].MiningExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].MiningExp / guild.members.length).level, inline: true },
                                        { name: ':crossed_swords:Combat', value: 'Total XP: ' + (json[0].CombatExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].CombatExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].CombatExp / guild.members.length).level, inline: true },
                                        { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (json[0].ForagingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].ForagingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].ForagingExp / guild.members.length).level, inline: true },
                                        { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (json[0].FishingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FishingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FishingExp / guild.members.length).level, inline: true },
                                        { name: ':book:Enchanting', value: 'Total XP: ' + (json[0].EnchantingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].EnchantingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].EnchantingExp / guild.members.length).level, inline: true },
                                        { name: ':alembic:Alchemy', value: 'Total XP: ' + (json[0].AlchemyExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].AlchemyExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].AlchemyExp / guild.members.length).level, inline: true },
                                        { name: ':dog:Taming', value: 'Total XP: ' + (json[0].TamingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].TamingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].TamingExp / guild.members.length).level, inline: true },
                                        { name: ':zombie:Slayer', value: 'Total XP: ' + (json[0].SlayerExp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(json[0].SlayerExp / 3 / guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(json[0].SlayerExp / 3 / guild.members.length), inline: true },
                                        {
                                            name: ':bar_chart:All Skills', value:
                                                'Total XP: '
                                                + ((json[0].FarmingExp
                                                    + json[0].MiningExp
                                                    + json[0].CombatExp
                                                    + json[0].ForagingExp
                                                    + json[0].FishingExp
                                                    + json[0].EnchantingExp
                                                    + json[0].AlchemyExp
                                                    + json[0].TamingExp) / 1000000).toFixed(1) +
                                                "m\nAverage XP per Skill: "
                                                + ((
                                                    ((json[0].FarmingExp
                                                        + json[0].MiningExp
                                                        + json[0].CombatExp
                                                        + json[0].ForagingExp
                                                        + json[0].FishingExp
                                                        + json[0].EnchantingExp
                                                        + json[0].AlchemyExp
                                                        + json[0].TamingExp)
                                                        / 8)
                                                    / guild.members.length) / 1000000).toFixed(1) +
                                                "m\nAverage Level: " +
                                                getLevelByXp(((json[0].FarmingExp
                                                    + json[0].MiningExp
                                                    + json[0].CombatExp
                                                    + json[0].ForagingExp
                                                    + json[0].FishingExp
                                                    + json[0].EnchantingExp
                                                    + json[0].AlchemyExp
                                                    + json[0].TamingExp)
                                                    / 8)
                                                    / guild.members.length).level
                                            , inline: true
                                        }
                                    );
                                    msge.edit(embed_i);
                                }); } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status);
                                    channel.send(errorEmbed);
                                } } );
                        })
                }
            }
        }
        if (json[0] === undefined) {
            if (msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
                var total_farming_exp = 0;
                var total_mining_exp = 0;
                var total_combat_exp = 0;
                var total_foraging_exp = 0;
                var total_fishing_exp = 0;
                var total_enchanting_exp = 0;
                var total_alchemy_exp = 0;
                var total_taming_exp = 0;
                var total_slayer_exp = 0;
                var today2 = new Date();
                var dd2 = String(today2.getDate()).padStart(2, '0');
                var mm2 = String(today2.getMonth() + 1).padStart(2, '0');
                var yyyy2 = today2.getFullYear();
                embed_i.setTitle('Guildstats-Tracker')
                embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
                today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                today1 = dd2 - 7 + '/' + mm2 + '/' + yyyy2;
                today = dd2 - 1 + '/' + mm2 + '/' + yyyy2;
                embed_i.addField("Information", "Die Gilden Statistiken werden maximal alle 12h geupdated");
                embed_i.setFooter("Der Druchschnitt der Level wurde anhand der durchschnittlichen Exp berechnet.");
                msg.channel.send("Loading Data...").then(msge => {
                    fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                            for (var i = 0; i < guild.members.length; i++) {
                                task(i, guild, msge);
                            }
                            embed_i.addField(":busts_in_silhouette:Member:", 'Heute: ' + guild.members.length);
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } )
                    msge.edit(embed_i);
                })
            } else {
                msg.channel.send('Dazu hast du keine Rechte');
            }
        }

    })
        } else if(parseInt(args[0]) === 2) {
            var date = new Date();
            connection.query("SELECT * FROM gstatsUses2;", function (err, result, fields) {
                if(err != null) {
                    console.log(err);
                }
                function task(i, guild, msge) {
                    setTimeout(function () {
                        fetch("https://api.hypixel.net/skyblock/profiles?key=" + config.api_key + "&uuid=" + guild.members[i].uuid)
                        .then(result => { if(result.status === 200) { result.json().then(({ profiles }) => {
                                console.log(i);
                                console.log(guild.members[i].uuid);
                                var parray = [];
                                if (profiles != undefined) {
                                    for (var p = 0; p < profiles.length; p++) {
                                        var last_save = profiles[p].members[guild.members[i].uuid].last_save;
                                        parray.push(last_save);
                                        parray.sort();
                                    }
                                    function getFarming(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_farming;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getMining(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_mining;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getCombat(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_combat;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getForaging(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_foraging;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getFishing(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_fishing;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getEnchanting(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_enchanting;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getAlchemy(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_alchemy;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getTaming(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].experience_skill_taming;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getZombie(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                if (profilesobject[key].members[guild.members[i].uuid].slayer_bosses != null) {
                                                    return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.zombie.xp;
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
                                                return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.spider.xp;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
                                    function getWolf(last_save) {
                                        var profilesobject = profiles;
                                        for (var key of Object.keys(profilesobject)) {
                                            if (profilesobject[key].members[guild.members[i].uuid].last_save === last_save) {
                                                return profilesobject[key].members[guild.members[i].uuid].slayer_bosses.wolf.xp;
                                            }
                                        }
                                        console.log('Dieses Profil existiert nicht.');
                                        return;
                                    }
        
                                    if (getFarming(parray[parray.length - 1]) != undefined) {
                                        total_farming_exp = total_farming_exp + getFarming(parray[parray.length - 1]);
                                    }
                                    if (getMining(parray[parray.length - 1]) != undefined) {
                                        total_mining_exp = total_mining_exp + getMining(parray[parray.length - 1]);
                                    }
                                    if (getCombat(parray[parray.length - 1]) != undefined) {
                                        total_combat_exp = total_combat_exp + getCombat(parray[parray.length - 1]);
                                    }
                                    if (getForaging(parray[parray.length - 1]) != undefined) {
                                        total_foraging_exp = total_foraging_exp + getForaging(parray[parray.length - 1]);
                                    }
                                    if (getFishing(parray[parray.length - 1]) != undefined) {
                                        total_fishing_exp = total_fishing_exp + getFishing(parray[parray.length - 1]);
                                    }
                                    if (getEnchanting(parray[parray.length - 1]) != undefined) {
                                        total_enchanting_exp = total_enchanting_exp + getEnchanting(parray[parray.length - 1]);
                                    }
                                    if (getAlchemy(parray[parray.length - 1]) != undefined) {
                                        total_alchemy_exp = total_alchemy_exp + getAlchemy(parray[parray.length - 1]);
                                    }
                                    if (getTaming(parray[parray.length - 1]) != undefined) {
                                        total_taming_exp = total_taming_exp + getTaming(parray[parray.length - 1]);
                                    }
                                    if (getZombie(parray[parray.length - 1]) != undefined
                                        && getTara(parray[parray.length - 1]) != undefined
                                        && getWolf(parray[parray.length - 1]) != undefined) {
                                        total_slayer_exp = total_slayer_exp + getWolf(parray[parray.length - 1]) + getTara(parray[parray.length - 1]) + getZombie(parray[parray.length - 1]);
                                    }
                                    if (i === guild.members.length - 1) {
                                        connection.query(`DELETE FROM gstatsUses2`);
                                        connection.query(`INSERT INTO gstatsUses2(Date, Members, FarmingExp, MiningExp, CombatExp, ForagingExp, FishingExp, EnchantingExp, AlchemyExp, TamingExp, SlayerExp) VALUES(${date.getTime()}, ${guild.members.length}, ${total_farming_exp}, ${total_mining_exp}, ${total_combat_exp}, ${total_foraging_exp}, ${total_fishing_exp}, ${total_enchanting_exp}, ${total_alchemy_exp}, ${total_taming_exp}, ${total_slayer_exp})`);
                                            embed_i.addFields(
                                            { name: ':seedling:Farming', value: 'Total XP: ' + (total_farming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_farming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_farming_exp / guild.members.length).level, inline: true },
                                            { name: ':pick:Mining', value: 'Total XP: ' + (total_mining_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_mining_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_mining_exp / guild.members.length).level, inline: true },
                                            { name: ':crossed_swords:Combat', value: 'Total XP: ' + (total_combat_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_combat_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_combat_exp / guild.members.length).level, inline: true },
                                            { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (total_foraging_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_foraging_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_foraging_exp / guild.members.length).level, inline: true },
                                            { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (total_fishing_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_fishing_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_fishing_exp / guild.members.length).level, inline: true },
                                            { name: ':book:Enchanting', value: 'Total XP: ' + (total_enchanting_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_enchanting_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_enchanting_exp / guild.members.length).level, inline: true },
                                            { name: ':alembic:Alchemy', value: 'Total XP: ' + (total_alchemy_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_alchemy_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_alchemy_exp / guild.members.length).level, inline: true },
                                            { name: ':dog:Taming', value: 'Total XP: ' + (total_taming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_taming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(total_taming_exp / guild.members.length).level, inline: true },
                                            { name: ':zombie:Slayer', value: 'Total XP: ' + (total_slayer_exp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(total_slayer_exp / 3 / guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(total_slayer_exp / 3 / guild.members.length), inline: true },
                                            {
                                                name: ':bar_chart:All Skills', value:
                                                    'Total XP: '
                                                    + ((total_farming_exp
                                                        + total_mining_exp
                                                        + total_combat_exp
                                                        + total_foraging_exp
                                                        + total_fishing_exp
                                                        + total_enchanting_exp
                                                        + total_taming_exp
                                                        + total_alchemy_exp) / 1000000).toFixed(1) +
                                                    "m\nAverage XP per Skill: "
                                                    + ((
                                                        ((total_farming_exp
                                                            + total_mining_exp
                                                            + total_combat_exp
                                                            + total_foraging_exp
                                                            + total_fishing_exp
                                                            + total_enchanting_exp
                                                            + total_alchemy_exp
                                                            + total_taming_exp)
                                                            / 8)
                                                        / guild.members.length) / 1000000).toFixed(1) +
                                                    "m\nAverage Level: " +
                                                    getLevelByXp(((total_farming_exp
                                                        + total_mining_exp
                                                        + total_combat_exp
                                                        + total_foraging_exp
                                                        + total_fishing_exp
                                                        + total_enchanting_exp
                                                        + total_alchemy_exp
                                                        + total_taming_exp)
                                                        / 8)
                                                        / guild.members.length).level
                                                , inline: true
                                            }
                                        );
                                        msge.edit(embed_i);
                                    }
                                }
                                msge.edit(embed_i);
                            }) } else { 
                                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                errorEmbed.addField('Error: ', result.status);
                                channel.send(errorEmbed);
                            } } );
                    }, 1000 * i);
                }
                var string = JSON.stringify(result);
                var json = JSON.parse(string);
                for (var i = 0; i < json.length; i++) {
                    if (json[0] != undefined) {
                        console.log((date.getTime() - json[0].Date));
                        if ((date.getTime() - json[0].Date) > 43200000) {
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
                            embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png')
                            today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                            today1 = dd2 - 7 + '/' + mm2 + '/' + yyyy2;
                            today = dd2 - 1 + '/' + mm2 + '/' + yyyy2;
                            console.log('.');
                            msg.channel.send(embed_i).then(msge => {
                                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438450f490ba04402f87fde6fb2")
                                .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                        for (var i = 0; i < guild.members.length; i++) {
                                            task(i, guild, msge);
                                        }
                                        embed_i.addField(":busts_in_silhouette:Member", 'Heute: ' + guild.members.length);
                                        msge.edit(embed_i);
                                    
                                    }) } else { 
                                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                        errorEmbed.addField(':incoming_envelope:Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        errorEmbed.addField('Error: ', result.status);
                                        channel.send(errorEmbed);
                                    } } )
                                msge.edit(embed_i);
                            })
                        } else {
                                msg.channel.send("Loading Data...").then(msge => {
                                    fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438450f490ba04402f87fde6fb2")
                                    .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                            embed_i.setTitle('Guildstats-Tracker');
                                            embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
                                            embed_i.addField(":incoming_envelope:Information", "Die Gilden Statistiken werden maximal alle 12h geupdated");
                                            embed_i.setFooter("Der Durchschnitt der Level wurde anhand der durchschnittlichen XP berechnet.");
                                            embed_i.addField(":busts_in_silhouette:Member", 'Heute: ' + guild.members.length);
                                            embed_i.addFields(
                                                { name: ':seedling:Farming', value: 'Total XP: ' + (json[0].FarmingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FarmingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FarmingExp / guild.members.length).level, inline: true },
                                                { name: ':pick:Mining', value: 'Total XP: ' + (json[0].MiningExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].MiningExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].MiningExp / guild.members.length).level, inline: true },
                                                { name: ':crossed_swords:Combat', value: 'Total XP: ' + (json[0].CombatExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].CombatExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].CombatExp / guild.members.length).level, inline: true },
                                                { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (json[0].ForagingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].ForagingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].ForagingExp / guild.members.length).level, inline: true },
                                                { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (json[0].FishingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FishingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].FishingExp / guild.members.length).level, inline: true },
                                                { name: ':book:Enchanting', value: 'Total XP: ' + (json[0].EnchantingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].EnchantingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].EnchantingExp / guild.members.length).level, inline: true },
                                                { name: ':alembic:Alchemy', value: 'Total XP: ' + (json[0].AlchemyExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].AlchemyExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].AlchemyExp / guild.members.length).level, inline: true },
                                                { name: ':dog:Taming', value: 'Total XP: ' + (json[0].TamingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].TamingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + getLevelByXp(json[0].TamingExp / guild.members.length).level, inline: true },
                                                { name: ':zombie:Slayer', value: 'Total XP: ' + (json[0].SlayerExp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(json[0].SlayerExp / 3 / guild.members.length) + "\nAverage Level: " + getSlayerLevelByXp(json[0].SlayerExp / 3 / guild.members.length), inline: true },
                                                {
                                                    name: ':bar_chart:All Skills', value:
                                                        'Total XP: '
                                                        + ((json[0].FarmingExp
                                                            + json[0].MiningExp
                                                            + json[0].CombatExp
                                                            + json[0].ForagingExp
                                                            + json[0].FishingExp
                                                            + json[0].EnchantingExp
                                                            + json[0].AlchemyExp
                                                            + json[0].TamingExp) / 1000000).toFixed(1) +
                                                        "m\nAverage XP per Skill: "
                                                        + ((
                                                            ((json[0].FarmingExp
                                                                + json[0].MiningExp
                                                                + json[0].CombatExp
                                                                + json[0].ForagingExp
                                                                + json[0].FishingExp
                                                                + json[0].EnchantingExp
                                                                + json[0].AlchemyExp
                                                                + json[0].TamingExp)
                                                                / 8)
                                                            / guild.members.length) / 1000000).toFixed(1) +
                                                        "m\nAverage Level: " +
                                                        getLevelByXp(((json[0].FarmingExp
                                                            + json[0].MiningExp
                                                            + json[0].CombatExp
                                                            + json[0].ForagingExp
                                                            + json[0].FishingExp
                                                            + json[0].EnchantingExp
                                                            + json[0].AlchemyExp
                                                            + json[0].TamingExp)
                                                            / 8)
                                                            / guild.members.length).level
                                                    , inline: true
                                                }
                                            );
                                            msge.edit(embed_i);
                                        }) } else { 
                                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                            errorEmbed.addField('Error: ', result.status);
                                            channel.send(errorEmbed);
                                        } } );
                                });
                        }
                    }
                }
                if (json[0] === undefined) {
                    if (msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
                        var total_farming_exp = 0;
                        var total_mining_exp = 0;
                        var total_combat_exp = 0;
                        var total_foraging_exp = 0;
                        var total_fishing_exp = 0;
                        var total_enchanting_exp = 0;
                        var total_alchemy_exp = 0;
                        var total_taming_exp = 0;
                        var total_slayer_exp = 0;
                        var today2 = new Date();
                        var dd2 = String(today2.getDate()).padStart(2, '0');
                        var mm2 = String(today2.getMonth() + 1).padStart(2, '0');
                        var yyyy2 = today2.getFullYear();
                        embed_i.setTitle('Guildstats-Tracker');
                        embed_i.setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
                        today2 = dd2 + '/' + mm2 + '/' + yyyy2;
                        today1 = dd2 - 7 + '/' + mm2 + '/' + yyyy2;
                        today = dd2 - 1 + '/' + mm2 + '/' + yyyy2;
                        embed_i.addField("Information", "Die Gilden Statistiken werden maximal alle 12h geupdated");
                        embed_i.setFooter("Der Druchschnitt der Level wurde anhand der durchschnittlichen Exp berechnet.");
                        msg.channel.send("Loading Data...").then(msge => {
                            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438450f490ba04402f87fde6fb2")
                            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                                    for (var i = 0; i < guild.members.length; i++) {
                                        task(i, guild, msge);
                                    }
                                    embed_i.addField(":busts_in_silhouette:Member:", 'Heute: ' + guild.members.length);
                                }) } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status);
                                    channel.send(errorEmbed);
                                } } )
                            msge.edit(embed_i);
                        })
                    } else {
                        msg.channel.send('Dazu hast du keine Rechte');
                    }
                }
        
            })
        } else {
            msg.channel.send('Bitte benutze den Befehl so: r!gstats <1|2>');
        }
    } else {
        msg.channel.send('Bitte benutze den Befehl so: r!gstats <1|2>');
    }
}
function gscammers_cmd(msg, args) {
    if (msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
        if(args.length === 1 && isNumeric(args[0])) { 
            if(parseInt(args[0]) === 1) {
        var embed_i = new MessageEmbed();
        embed_i.addField('Information', 'Wenn diese Nachricht leer bleibt, dann hat die Gilde 0 Scammer :).');
        msg.channel.send(embed_i).then(msge => {
            fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=64e008cbc99b4397ae670d4624acf9d7")
            .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                    function task(i) {
                        setTimeout(function () {
                            fetch("https://script.tftech.de/api/hggv2/?key=" + config.hgg_hey)
                            .then(result => { if(result.status === 200) { result.json().then(({ found }) => {
                                    console.log(i + '. UUID: ' + guild.members[i].uuid + ', Grund: Kein Report');
                                    if (found != undefined) {
                                        if (found === true) {
                                            fetch("https://script.tftech.de/api/hggv2/?key=" + config.hgg_hey)
                                            .then(result => { if(result.status === 200) { result.json().then(({ reports }) => {
                                                    for (var i2 = 0; i2 < reports.length; i2++) {
                                                        embed_i.addField(i + 1 + '. UUID: ' + reports[i2].uuid + ', Grund: ' + reports[i2].keyword);
                                                        msge.edit(embed_i);
                                                    }
                                                }) } else { 
                                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                    errorEmbed.addField('Error: ', result.status);
                                                    channel.send(errorEmbed);
                                                } } )
                                        }
                                    }
                                }) } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status);
                                    channel.send(errorEmbed);
                                } } );
                        }, 100 * i);
                    }
                    for (var i = 0; i < guild.members.length; i++) {
                        task(i);
                    }
                }) } else { 
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    errorEmbed.addField('Error: ', result.status);
                    channel.send(errorEmbed);
                } } )
            msge.edit(embed_i)
        })
        } else if(parseInt(args[0]) === 2) {
            var embed_i = new MessageEmbed();
            embed_i.addField('Information', 'Wenn diese Nachricht leer bleibt, dann hat die Gilde 0 Scammer :).');
            msg.channel.send(embed_i).then(msge => {
                fetch("https://api.hypixel.net/guild?key=" + config.api_key + "&player=ce65e438-450f-490b-a044-02f87fde6fb2")
                .then(result => { if(result.status === 200) { result.json().then(({ guild }) => {
                        function task(i) {
                            setTimeout(function () {
                                fetch("https://script.tftech.de/api/hggv2/?key=" + config.hgg_hey)
                                .then(result => { if(result.status === 200) { result.json().then(({ found }) => {
                                        console.log(i + '. UUID: ' + guild.members[i].uuid + ', Grund: Kein Report');
                                        if (found != undefined) {
                                            if (found === true) {
                                                fetch("https://script.tftech.de/api/hggv2/?key=" + config.hgg_hey)
                                                .then(result => { if(result.status === 200) { result.json().then(({ reports }) => {
                                                        for (var i2 = 0; i2 < reports.length; i2++) {
                                                            embed_i.addField(i + 1 + '. UUID: ' + reports[i2].uuid + ', Grund: ' + reports[i2].keyword)
                                                            msge.edit(embed_i);
                                                        }
                                                    }) } else { 
                                                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                        errorEmbed.addField('Error: ', result.status);
                                                        channel.send(errorEmbed);
                                                    } } )
                                            }
                                        }
                                    }) } else { 
                                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        errorEmbed.addField('Error: ', result.status);
                                        channel.send(errorEmbed);
                                    } } );
                            }, 100 * i);
                        }
                        for (var i = 0; i < guild.members.length; i++) {
                            task(i);
                        }
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuführen.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> für mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status);
                        channel.send(errorEmbed);
                    } } )
                msge.edit(embed_i);
            })
        } else {
            msg.channel.send('Bitte benutze den Befehl so: r!gscammers <1|2>');
        }
        }  else {
            msg.channel.send('Bitte benutze den Befehl so: r!gscammers <1|2>');
        }
    } else {
        msg.channel.send('Dazu hast du keine Rechte');
    }
}
function checkwarns(msg, args) {
    if(msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
        if(args.length === 2) {
            if(args[0] === "uuid") {
                connection.query(`SELECT * FROM Warns WHERE UUID = "${args[1]}"`, function (err, result, fields) {
                    if(err != null) {
                        console.log(err);
                    }
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    var WarnEmbed = new MessageEmbed();
                if(json.length > 0) {
                    for (var i = 0; i<json.length; i++) {
                        WarnEmbed.addField("WarnID: " + json[i]['WarnID'], "DiscordID: " + json[i]['DiscordID'] + ", \nUUID: " + json[i]['UUID'] + ", \nReason: " + json[i]['Reason'] + ", \nCreatorID: " + json[i]['CreaterID']);
                    }
                    msg.channel.send(WarnEmbed);
                } else {
                    msg.channel.send('Diese Person hat keine Warns.');
                }
                });
            } else if(args[0] === "discordid") {
                connection.query(`SELECT * FROM Warns WHERE DISCORDID = "${args[1]}"`, function (err, result, fields) {
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                if(json.length > 0) {
                    var WarnEmbed = new MessageEmbed();
                    for (var i = 0; i<json.length; i++) {
                        WarnEmbed.addField("WarnID: " + json[i]['WarnID'], "DiscordID: " + json[i]['DiscordID'] + ", \nUUID: " + json[i]['UUID'] + ", \nReason: " + json[i]['Reason'] + ", \nCreatorID: " + json[i]['CreaterID']);
                    }
                    msg.channel.send(WarnEmbed);
                } else {
                    msg.channel.send('Diese Person hat keine Warns.');
                }
                });
            }
        } else {
            msg.channel.send('Benutze den Befehl so: r!warns <uuid | discordid> <UUID der Person | DiscordID der Person>');
        }
    } else {
        msg.channel.send('Dazu hast du keine Rechte.');
    }
}
function  warns_cmd(msg, args) {
    if(msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
        if(args.length === 3) {
            if(isNumeric(args[2])) {
                if(args[2] < 10) {
                var DiscordID = args[0];
                var UUID = args[1];
                var Reason = args[2];
                var Creator = msg.member;
                var WarnID = new Date().getTime();
                if(isNumeric(args[0]) && args[1].length >= 32) {
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(${DiscordID}, "${UUID.split("-").join('')}", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** ${DiscordID}, **UUID:** ${UUID.split("-").join('')}, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                } else if(isNumeric(args[0]) && args[1].length <= 32) {
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(${DiscordID}, "-", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** ${DiscordID}, **UUID:** -, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`);
                } else if(!isNumeric(args[0]) && args[1].length >= 32) {
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** -, **UUID:** ${UUID.split("-").join('')}, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`);
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(0, "${UUID.split("-").join('')}", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                } else {
                    msg.channel.send('Du musst mindestens die DiscordID oder die UUID angeben.');
                }
            } else if(parseInt(args[2]) === 10 && (msg.member.roles.cache.some(role => role.id === '701919841111769088' || msg.member.roles.cache.some(role => role.id === '701919839559614466')))) {
                var DiscordID = args[0];
                var UUID = args[1];
                var Reason = args[2];
                var Creator = msg.member;
                var WarnID = new Date().getTime();
                if(isNumeric(args[0]) && args[1].length >= 32) {
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(${DiscordID}, "${UUID.split("-").join('')}", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** ${DiscordID}, **UUID:** ${UUID.split("-").join('')}, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`);
                } else if(isNumeric(args[0]) && args[1].length <= 32) {
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(${DiscordID}, "-", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** ${DiscordID}, **UUID:** -, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`);
                } else if(!isNumeric(args[0]) && args[1].length >= 32) {
                    msg.channel.send(`Die Person wurde gewarnt: **DiscordID:** -, **UUID:** ${UUID.split("-").join('')}, **Grund:** ${Reason}, **CreatorID:** ${Creator.id}, **WarnID:** ${WarnID}`);
                    connection.query(`INSERT INTO Warns(DiscordID, UUID, Reason, WarnID, CreaterID) VALUES(0, "${UUID.split("-").join('')}", ${Reason}, ${WarnID}, ${Creator.id})`, function(err, res, field) {
                        if(err != null) {
                            console.log(err);
                        }
                    });
                } else {
                    msg.channel.send('Du musst mindestens die DiscordID oder die UUID angeben.');
                }
            } else {
                msg.channel.send('Dieser Warn-Typ existiert nicht oder du kannst diesen Warn nicht vergeben!');
                var reasons = new MessageEmbed()
                    .setTitle('Warn-Gründe')
                    .addField('1', 'Caps', true)
                    .addField('2', 'Beleidigung', true)
                    .addField('3', 'Spam', true)
                    .addField('4', 'Werbung', true)
                    .addField('5', 'Provokation', true)
                    .addField('6', 'Respektlosigkeit', true)
                    .addField('7', 'Störgeräusche im Talk', true)
                    .addField('8', 'Betteln', true)
                    .addField('9', 'Verstoß gegen §1', true)
                    .addField('10', 'Team-Intern', true)
                    .addField('11', 'Falscher Channel', true);
                msg.channel.send(reasons);
            }
            } else {
                msg.channel.send('Gebe den Grund bitte als Zahl an. Die Gründe erhältst du wenn du **r!warn** ausführst, ohne Argumente anzugeben.');
            }
        } else if (args.length === 2 && args[0] === "delete") {
            if(isNumeric(args[1])) {
                connection.query(`SELECT Reason FROM Warns WHERE WarnID = "${args[1]}"`, function (err, result, fields) {
                    var string = JSON.stringify(result);
                    var json = JSON.parse(string);
                    if(json[0] != undefined) {
                    if(parseInt(json[0].Reason) != 10) {
                        connection.query(`DELETE FROM Warns WHERE WarnID = ${args[1]}`, function(err, res, field) {
                            if(err != null) {
                                console.log(err);
                            }
                        });
                        msg.channel.send('Der Warn mit der ID ' + args[1] + ' wurde gelöscht.');
                    } else if(json[0].Reason === 10 && (msg.member.roles.cache.some(role => role.id === '701919841111769088' || msg.member.roles.cache.some(role => role.id === '701919839559614466')))){
                        connection.query(`DELETE FROM Warns WHERE WarnID = ${args[1]}`, function(err, res, field) {
                            if(err != null) {
                                console.log(err);
                            }
                        });
                        msg.channel.send('Der Warn mit der ID ' + args[1] + ' wurde gelöscht.');
                    } else {
                        msg.channel.send('Du kannst diesen Report nicht löschen!');
                    }
                } else {
                    msg.channel.send('Dieser Warn existiert nicht!');
                }
                });
            }
        } else {
            msg.channel.send('Benutze den Befehl so: r!warn <DiscordID> <UUID> <Grund>');
            var reasons = new MessageEmbed()
                .setTitle('Warn-Gründe')
                .addField('1', 'Caps', true)
                .addField('2', 'Beleidigung', true)
                .addField('3', 'Spam', true)
                .addField('4', 'Werbung', true)
                .addField('5', 'Provokation', true)
                .addField('6', 'Respektlosigkeit', true)
                .addField('7', 'Störgeräusche im Talk', true)
                .addField('8', 'Betteln', true)
                .addField('9', 'Verstoß gegen §1', true)
                .addField('10', 'Team-Intern', true)
            msg.channel.send(reasons);
        }
    } else {
        msg.channel.send('Dazu hast du keine Rechte!');
    }
}
/*
* Util functions
*/
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
client.on('message', (msg) => {
    errorEmbed = new Discord.MessageEmbed();
    errorEmbed.setColor(COLORS.carrot);
    var cont = msg.content;
    var invoke = cont.split(' ')[0].substr(config.prefix.length);
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0');
    var yyyy2 = today2.getFullYear();
    today2 = dd2 + '/' + mm2 + '/' + yyyy2;
    args = cont.split(' ').slice(1);
    if (cont.startsWith('r!')) {
        if (invoke in cmdmap) {
            cmdmap[invoke](msg, args);
        }
    }
})
client.login(config.token);