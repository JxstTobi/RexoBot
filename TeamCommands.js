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
function icheck_cmd(msg, args, connection) {
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
function gscammers_cmd(msg, args) {
    if (msg.member.roles.cache.some(role => role.id === '705790132833353739')) {
        if(args.length === 1 && utility.isNumeric(args[0])) { 
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
function  warns_cmd(msg, args, connection) {
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
function checkwarns(msg, args, connection) {
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
module.exports.icheck = icheck_cmd
module.exports.gscammers = gscammers_cmd
module.exports.warns = warns_cmd
module.exports.checkwarns = checkwarns
module.exports.checkuser = checkuser_cmd
module.exports.itemembed = itemembed_cmd