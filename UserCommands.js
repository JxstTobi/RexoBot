const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const fetch = require("node-fetch");
const mysql = require('mysql');
var errorEmbed = new Discord.MessageEmbed();
const { RichEmbed, Channel, MessageEmbed } = require('discord.js');
const utility = require('./Utility')
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
                                        { name: 'Momentan online: ', value: '' + utility.getOnline(uuid, session) });
                                    if (guild != undefined) {
                                        var guildName = guild.name,
                                            preferredGames = guild.preferredGames;
                                        playerInfoEmbed.addFields(
                                            { name: '\u200B', value: '\u200B' },
                                            { name: 'Gilde:', value: '' + guildName },
                                            { name: 'Rang in der Gilde:', value: '' + utility.getGuildMemberRank(uuid, guild) },
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
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status);
                                    channel.send(errorEmbed);
                                } } );
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } );
                } else {
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    channel.send(errorEmbed);
                }
            }) } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status)
                channel.send(errorEmbed);
            }} );
    } else {
        errorEmbed.addField('Error', 'Bitte gebe einen Namen an.');
        channel.send(errorEmbed);
    }
}
function stamm_cmd(msg, args, client) {
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
                    errorEmbed.addField('Information', 'Versuche es in ca 2 Minuten nochmal, falls der Spieler existiert.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                    var time_difference = today - utility.getGuildMemberJoined(uuid, guild);
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
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } )
                }
            }) } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                channel.send(errorEmbed);
            } } )
    } else {
        channel.send("Bitte gebe einen Namen an.");
    }
}
function urlaub_cmd(msg, args, connection) {
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
                                    if (utility.isNumeric(args[1])) {
                                        var millis = parseInt(args[1]) * 1000 * 60 * 60 * 24
                                        var today = new Date();
                                        console.log(today);
                                        connection.query(`INSERT INTO urlaub (Name, Zeit, Grund, AbgemeldetBisMilis) VALUES ('${args[0]}','${args[1]}','-','${today.getTime() + millis}');`, function (err, result, fields) {
                                            if(err != null) {
                                                console.log(err);
                                            }
                                         });
                                        msg.reply(args[0] + ' wurde f??r ' + args[1] + ' Tage abgemeldet.')
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
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status)
                            channel.send(errorEmbed);
                        } } ) 
                } else {
                    errorEmbed.addField('Error', 'Spieler wurde nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    msg.channel.send(errorEmbed);
                }
            }) ;
            } else { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                msg.channel.send(errorEmbed);
            } } );
    } else {
        msg.channel.send('Benutze den Befehl bitte so: **r!urlaub <name> <Zeit in Tagen>**');
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
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                    channel.send(errorEmbed);
                } else if (player != undefined && player != null) {
                    var uuid = player.uuid,
                        profiles = player.stats.SkyBlock.profiles;
                    fetch("https://api.hypixel.net/skyblock/profile?key=" + config.api_key + "&profile=" + utility.getProfileID(args[1], profiles))
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
                                                        guildEmbed.addField('Gilden Rolle', "Gilde 1 hinzugef??gt");
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
                                                        if (foragingExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isForaging50(foragingExp) {
                                                        if (foragingExp >= 50172425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isCombat25(combatExp) {
                                                        if (combatExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isCombat60(combatExp) {
                                                        if (combatExp >= 111672425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isMining25(miningExp) {
                                                        if (miningExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isMining60(miningExp) {
                                                        if(miningExp >= 111672425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFarming25(farmingExp) {
                                                        if (farmingExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFarming60(farmingExp) {
                                                        if(farmingExp >= 111672425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isAlchemy25(alchemyExp) {
                                                        if (alchemyExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isAlchemy50(alchemyExp) {
                                                        if(alchemyExp >= 50172425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isTaming25(tamingExp) {
                                                        if (tamingExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isTaming50(tamingExp) {
                                                        if(tamingExp >= 50172425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isEnchanting25(enchantingExp) {
                                                        if (enchantingExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isEnchanting60(enchantingExp) {
                                                        if(enchantingExp >= 111672425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFishing25(fishingExp) {
                                                        if (fishingExp >= 3022425) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    function isFishing50(fishingExp) {
                                                        if(fishingExp >= 50172425) {
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
                                                        { name: 'Skill Rollen', value: 'F??gt dir eine Skill Rolle hinzu, wenn du in diesem Skill Level 25 bist.' });
                                                    if (isForaging25(foragingExp) && !isForaging50(foragingExp)) {
                                                        roleEmbed.addField('Foraging 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556162320597008'));
                                                    } else if(isForaging50(foragingExp)) {
                                                        roleEmbed.addField('Foraging 50', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556162320597008'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '868817923538558976'));
                                                    } else {
                                                        roleEmbed.addField('Foraging 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556162320597008'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '868817923538558976'));
                                                    }
                                                    if (isCombat25(combatExp) && !isCombat60(combatExp)) {
                                                        roleEmbed.addField('Combat 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727508450254258237'));
                                                    } else if(isCombat60(combatExp)) {
                                                        roleEmbed.addField('Combat 60', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727508450254258237'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '867874058997989396'));
                                                    } else {
                                                        roleEmbed.addField('Combat 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727508450254258237'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '867874058997989396'));
                                                    }
                                                    if (isMining25(miningExp) && !isMining60(miningExp)) {
                                                        roleEmbed.addField('Mining 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727555564284149762'));
                                                    } else if(isMining60(miningExp)) {
                                                        roleEmbed.addField('Mining 60', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727555564284149762'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '867869085203300403'));
                                                    } else {
                                                        roleEmbed.addField('Mining 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727555564284149762'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '867869085203300403'));
                                                    }
                                                    if (isFarming25(farmingExp) && !isFarming60(farmingExp)) {
                                                        roleEmbed.addField('Farming 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556040887107584'));
                                                    } else if(isFarming60(farmingExp)) {
                                                        roleEmbed.addField('Farming 60', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556040887107584'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '867872755432947753'));
                                                    } else {
                                                        roleEmbed.addField('Farming 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556040887107584'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '867872755432947753'));
                                                    }
                                                    if (isAlchemy25(alchemyExp) && !isAlchemy50(alchemyExp)) {
                                                        roleEmbed.addField('Alchemy 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '810135337648259072'));
                                                    } else if(isAlchemy50(alchemyExp)) {
                                                        roleEmbed.addField('Alchemy 50', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '810135337648259072'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '868819467075981335'));
                                                    } else {
                                                        roleEmbed.addField('Alchemy 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '810135337648259072'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '868819467075981335'));
                                                    }
                                                    if (isTaming25(tamingExp) && !isTaming50(tamingExp)) {
                                                        roleEmbed.addField('Taming 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556988543959040'));
                                                    } else if(isTaming50(tamingExp)) {
                                                        roleEmbed.addField('Taming 50', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556988543959040'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '868820753573883904'));
                                                    } else {
                                                        roleEmbed.addField('Taming 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556988543959040'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '868820753573883904'));
                                                    }
                                                    if (isEnchanting25(enchantingExp) && !isEnchanting60(enchantingExp)) {
                                                        roleEmbed.addField('Enchanting 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556734490771486'));
                                                    } else if(isEnchanting60(enchantingExp)) {
                                                        roleEmbed.addField('Enchanting 60', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556734490771486'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '867853537681604628'));
                                                    } else {
                                                        roleEmbed.addField('Enchanting 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556734490771486'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '867853537681604628'));
                                                    }
                                                    if (isFishing25(fishingExp) && !isFishing50(fishingExp)) {
                                                        roleEmbed.addField('Fishing 25', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '727556252527230986'));
                                                    } else if(isFishing50(fishingExp)) {
                                                        roleEmbed.addField('Fishing 50', ':green_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556252527230986'));
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '867868358359515156'));
                                                    } else {
                                                        roleEmbed.addField('Fishing 25', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '727556252527230986'));
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '867868358359515156'));
                                                    }
                                                    roleEmbed.addFields( { name: 'Slayer Rollen', value: 'F??gt dir eine Slayer Rolle hinzu, wenn du bei diesem Slayer Level 7 bist.' } );
                                                    //868826384804483082
                                                    if (isRev7(slayer_exp_zombie)) {
                                                        roleEmbed.addField('Revenant Horror 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888340511260752'));
                                                    } else {
                                                        roleEmbed.addField('Revenant Horror 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888340511260752'));
                                                    }
                                                    //868826508389662760
                                                    if (isTara7(slayer_exp_spider)) {
                                                        roleEmbed.addField('Tarantula Broodfather 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888342289907744'));
                                                    } else {
                                                        roleEmbed.addField('Tarantula Broodfather 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888342289907744'));
                                                    }
                                                    //868826607392026634
                                                    if (isSven7(slayer_exp_wolf)) {
                                                        roleEmbed.addField('Sven Packmaster 7', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '734888338376622092'));
                                                    } else {
                                                        roleEmbed.addField('Sven Packmaster 7', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '734888338376622092'));
                                                    }
                                                    //868826757162221608
                                                    if (isEnderman3(slayer_exp_zombie)) {
                                                        roleEmbed.addField('Voidgloom Seraph 3', ':green_square:');
                                                        author.roles.add(msgGuild.roles.cache.find(role => role.id === '849369703063355422'));
                                                    } else {
                                                        roleEmbed.addField('Voidgloom Seraph 3', ':red_square:');
                                                        author.roles.remove(msgGuild.roles.cache.find(role => role.id === '849369703063355422'));
                                                    }
                                                    roleEmbed.addField('Collections', 'Dir wurden ' + maxedCollections + ' Collection-Rollen hinzugef??gt.');
                                                    channel.send(roleEmbed);
                                                } else {
                                                    errorEmbed.addField('Error', 'Deine API ist nicht eingeschalten oder du hast nicht alle Skills freigeschalten!');
                                                    errorEmbed.addField('Information', 'So aktivierst du deine API: \nHypixel SkyBlock -> SkyBlock Menu -> Einstellungen -> API\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                                    channel.send(errorEmbed);
                                                }
                                            } else {
                                                errorEmbed.addField('Error', 'Dieses Profil wurde nicht gefunden!')
                                                errorEmbed.addField('Information', 'Falls dieses Profil existiert und es trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                                channel.send(errorEmbed);
                                            }
                                        } else {
                                            errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                            errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                            channel.send(errorEmbed);
                                        }
                                    } else {
                                        errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                        errorEmbed.addField('Information', 'So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.');
                                        channel.send(errorEmbed);
                                    }
                                } else {
                                    errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                    errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                    channel.send(errorEmbed);
                                }
                            } else {
                                errorEmbed.addField('Error', 'Dieser Minecraft Account ist nicht mit deinem Discord Account verbunden!');
                                errorEmbed.addField('So verbindest du deinen Minecraft Account mit deinem Discord Account: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.');
                                channel.send(errorEmbed);
                            }
                        }) } else { 
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            errorEmbed.addField('Error: ', result.status);
                            channel.send(errorEmbed);
                        } } );
                }
            }) } else if (result) { 
                errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                errorEmbed.addField('Error: ', result.status);
                channel.send(errorEmbed);
            } } );
    } else {
        channel.send("Nutze den Befehl so: r!roleclaim <name> <profile>");
    }
}
function dverify_cmd(msg, args, connection, client) {
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
                                        errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                        user.send(errorEmbed);
                                    }
                                } else {
                                    const user = client.users.cache.get(msg.member.user.id);
                                    errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                                    errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                    user.send(errorEmbed);
                                }
                            } else {
                                const user = client.users.cache.get(msg.member.user.id);
                                errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                                errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                                user.send(errorEmbed);
                            }
                        } else {
                            const user = client.users.cache.get(msg.member.user.id);
                            errorEmbed.addField('Error', 'Dein Discord Account ist nicht auf Hypixel verbunden!');
                            errorEmbed.addField('Information', 'Um dich in <#808788152541642782> zu verifizieren, musst du deinen Discord Account auf Hypixel verbinden: \nHypixel Main Lobby -> Profile -> Social Menu -> Discord\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                            user.send(errorEmbed);
                        }
                    } else {
                        const user = client.users.cache.get(msg.member.user.id);
                        errorEmbed.addField('Error', 'Spieler f??r die Verifizierung in <#808788152541642782> konnte nicht gefunden werden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche dich bitte in 2-3 Minuten erneut zu verifizieren.\n \nFalls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe.\nBugs des Bots bitte bei den Developern des Servers melden.');
                        user.send(errorEmbed);
                    }
                }) } else { 
                    const user = client.users.cache.get(msg.member.user.id);
                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
function cata_cmd(msg, args, connection) {
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
                                        errorEmbed.addField('Information', 'Falls der Spieler Profile hat und diese trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                        msg.channel.send(errorEmbed);
                                    }
                                }) } else { 
                                    errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                                    errorEmbed.addField('Error: ', result.status)
                                    channel.send(errorEmbed);
                                } } )
                        } else {
                            errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                            msg.channel.send(errorEmbed);
                        }
                    }) } else { 
                        errorEmbed.addField('Error', 'Spieler nicht gefunden.');
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
                        errorEmbed.addField('Error: ', result.status)
                        msg.channel.send(errorEmbed);
                    } } )
            }
        } else {
            msg.channel.send('Verifiziere dich bitte in <#808788152541642782>.');
        }
    })
}
async function gstats_cmd(msg, args, connection) {
    var embed_i = new MessageEmbed()
        .setThumbnail('https://cdn.discordapp.com/attachments/830201421680082985/837282723726360606/9281a9b1c7e1652edae3a8f0805440cb.png');
    if(args.length === 1) {
        if(utility.isNumeric(args[0]))
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
                                    { name: ':seedling:Farming', value: 'Total XP: ' + (total_farming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_farming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_farming_exp / guild.members.length).level, inline: true },
                                    { name: ':pick:Mining', value: 'Total XP: ' + (total_mining_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_mining_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_mining_exp / guild.members.length).level, inline: true },
                                    { name: ':crossed_swords:Combat', value: 'Total XP: ' + (total_combat_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_combat_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_combat_exp / guild.members.length).level, inline: true },
                                    { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (total_foraging_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_foraging_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_foraging_exp / guild.members.length).level, inline: true },
                                    { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (total_fishing_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_fishing_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_fishing_exp / guild.members.length).level, inline: true },
                                    { name: ':book:Enchanting', value: 'Total XP: ' + (total_enchanting_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_enchanting_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_enchanting_exp / guild.members.length).level, inline: true },
                                    { name: ':alembic:Alchemy', value: 'Total XP: ' + (total_alchemy_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_alchemy_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_alchemy_exp / guild.members.length).level, inline: true },
                                    { name: ':dog:Taming', value: 'Total XP: ' + (total_taming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_taming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_taming_exp / guild.members.length).level, inline: true },
                                    { name: ':zombie:Slayer', value: 'Total XP: ' + (total_slayer_exp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(total_slayer_exp / 3 / guild.members.length) + "\nAverage Level: " + utility.getSlayerLevelByXp(total_slayer_exp / 3 / guild.members.length), inline: true },
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
                                            utility.getLevelByXp(((total_farming_exp
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
                        errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                errorEmbed.addField(':incoming_envelope:Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                        { name: ':seedling:Farming', value: 'Total XP: ' + (json[0].FarmingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FarmingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].FarmingExp / guild.members.length).level, inline: true },
                                        { name: ':pick:Mining', value: 'Total XP: ' + (json[0].MiningExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].MiningExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].MiningExp / guild.members.length).level, inline: true },
                                        { name: ':crossed_swords:Combat', value: 'Total XP: ' + (json[0].CombatExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].CombatExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].CombatExp / guild.members.length).level, inline: true },
                                        { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (json[0].ForagingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].ForagingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].ForagingExp / guild.members.length).level, inline: true },
                                        { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (json[0].FishingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FishingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].FishingExp / guild.members.length).level, inline: true },
                                        { name: ':book:Enchanting', value: 'Total XP: ' + (json[0].EnchantingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].EnchantingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].EnchantingExp / guild.members.length).level, inline: true },
                                        { name: ':alembic:Alchemy', value: 'Total XP: ' + (json[0].AlchemyExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].AlchemyExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].AlchemyExp / guild.members.length).level, inline: true },
                                        { name: ':dog:Taming', value: 'Total XP: ' + (json[0].TamingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].TamingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].TamingExp / guild.members.length).level, inline: true },
                                        { name: ':zombie:Slayer', value: 'Total XP: ' + (json[0].SlayerExp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(json[0].SlayerExp / 3 / guild.members.length) + "\nAverage Level: " + utility.getSlayerLevelByXp(json[0].SlayerExp / 3 / guild.members.length), inline: true },
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
                                                utility.getLevelByXp(((json[0].FarmingExp
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
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                            { name: ':seedling:Farming', value: 'Total XP: ' + (total_farming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_farming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_farming_exp / guild.members.length).level, inline: true },
                                            { name: ':pick:Mining', value: 'Total XP: ' + (total_mining_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_mining_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_mining_exp / guild.members.length).level, inline: true },
                                            { name: ':crossed_swords:Combat', value: 'Total XP: ' + (total_combat_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_combat_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_combat_exp / guild.members.length).level, inline: true },
                                            { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (total_foraging_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_foraging_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_foraging_exp / guild.members.length).level, inline: true },
                                            { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (total_fishing_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_fishing_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_fishing_exp / guild.members.length).level, inline: true },
                                            { name: ':book:Enchanting', value: 'Total XP: ' + (total_enchanting_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_enchanting_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_enchanting_exp / guild.members.length).level, inline: true },
                                            { name: ':alembic:Alchemy', value: 'Total XP: ' + (total_alchemy_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_alchemy_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_alchemy_exp / guild.members.length).level, inline: true },
                                            { name: ':dog:Taming', value: 'Total XP: ' + (total_taming_exp / 1000000).toFixed(1) + "m\nAverage XP: " + ((total_taming_exp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(total_taming_exp / guild.members.length).level, inline: true },
                                            { name: ':zombie:Slayer', value: 'Total XP: ' + (total_slayer_exp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(total_slayer_exp / 3 / guild.members.length) + "\nAverage Level: " + utility.getSlayerLevelByXp(total_slayer_exp / 3 / guild.members.length), inline: true },
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
                                                    utility.getLevelByXp(((total_farming_exp
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
                                errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                        errorEmbed.addField(':incoming_envelope:Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                                { name: ':seedling:Farming', value: 'Total XP: ' + (json[0].FarmingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FarmingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].FarmingExp / guild.members.length).level, inline: true },
                                                { name: ':pick:Mining', value: 'Total XP: ' + (json[0].MiningExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].MiningExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].MiningExp / guild.members.length).level, inline: true },
                                                { name: ':crossed_swords:Combat', value: 'Total XP: ' + (json[0].CombatExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].CombatExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].CombatExp / guild.members.length).level, inline: true },
                                                { name: ':deciduous_tree:Foraging', value: 'Total XP: ' + (json[0].ForagingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].ForagingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].ForagingExp / guild.members.length).level, inline: true },
                                                { name: ':fishing_pole_and_fish:Fishing', value: 'Total XP: ' + (json[0].FishingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].FishingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].FishingExp / guild.members.length).level, inline: true },
                                                { name: ':book:Enchanting', value: 'Total XP: ' + (json[0].EnchantingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].EnchantingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].EnchantingExp / guild.members.length).level, inline: true },
                                                { name: ':alembic:Alchemy', value: 'Total XP: ' + (json[0].AlchemyExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].AlchemyExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].AlchemyExp / guild.members.length).level, inline: true },
                                                { name: ':dog:Taming', value: 'Total XP: ' + (json[0].TamingExp / 1000000).toFixed(1) + "m\nAverage XP: " + ((json[0].TamingExp / guild.members.length) / 1000000).toFixed(1) + "m\nAverage Level: " + utility.getLevelByXp(json[0].TamingExp / guild.members.length).level, inline: true },
                                                { name: ':zombie:Slayer', value: 'Total XP: ' + (json[0].SlayerExp / 1000000).toFixed(1) + "m\nAverage XP: " + Math.round(json[0].SlayerExp / 3 / guild.members.length) + "\nAverage Level: " + utility.getSlayerLevelByXp(json[0].SlayerExp / 3 / guild.members.length), inline: true },
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
                                                        utility.getLevelByXp(((json[0].FarmingExp
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
                                            errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
                                    errorEmbed.addField('Information', 'Falls der Spieler existiert und trotzdem nicht gefunden wurde, dann versuche diesen Befehl in 2-3 Minuten erneut auszuf??hren.\n\n Falls dir diese Informationen nicht weiterhelfen konnten melde dich bitte in <#702109633157791745> f??r mehr Hilfe. \nBugs des Bots bitte bei den Developern des Servers melden.');
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
module.exports.player = player_cmd
module.exports.stamm = stamm_cmd
module.exports.urlaub = urlaub_cmd
module.exports.roleclaim = role_cmd
module.exports.dverify = dverify_cmd
module.exports.cata = cata_cmd
module.exports.gstats = gstats_cmd