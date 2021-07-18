const Discord = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const fetch = require("node-fetch");
const mysql = require('mysql');
var CronJob = require('cron').CronJob;
var errorEmbed = new Discord.MessageEmbed();
const { RichEmbed, Channel, MessageEmbed } = require('discord.js');
const utilCommands = require('./UtilCommands')
const teamCommands = require('./TeamCommands')
const userCommands = require('./UserCommands')
const utility = require('./Utility')

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
        if(msg.content == "r!help") {
            utilCommands.help(msg)
            msg.delete()
        }
        if(msg.content == "r!botinfo") {
            utilCommands.botinfo(msg, null, client)
            msg.delete()
        }
        if(msg.content.startsWith("r!icheck")) {
            teamCommands.icheck(msg, args, connection)
            msg.delete()
        }
        if(msg.content.startsWith("r!gscammers")) {
            teamCommands.gscammers(msg, args)
            msg.delete()
        }
        if(msg.content.startsWith("r!warn")) {
            teamCommands.warns(msg, args, connection)
            msg.delete()
        }
        if(msg.content.startsWith("r!checkuser")) {
            teamCommands.checkuser(msg, args)
            msg.delete()
        }
        if(msg.content.startsWith("r!pinfo")) {
            userCommands.player(msg, args)
            msg.delete()
        }
        if(msg.content.startsWith("r!itemembed")) {
            teamCommands.itemembed(msg, args)
            msg.delete()
        }
        if(msg.content.startsWith("r!stamm")) {
            userCommands.stamm(msg, args, client)
            msg.delete()
        }
        if(msg.content.startsWith("r!urlaub")) {
            userCommands.urlaub(msg, args, connection)
            msg.delete()
        }
        if(msg.content.startsWith("r!roleclaim")) {
            userCommands.roleclaim(msg, args)
            msg.delete()
        }
        if(msg.content.startsWith("r!dverify")) {
            userCommands.dverify(msg, args, connection, client)
            msg.delete()
        }
        if(msg.content.startsWith("r!cata")) {
            userCommands.cata(msg, args, connection)
            msg.delete()
        }
        if(msg.content.startsWith("r!gstats")) {
            msg.delete()
            userCommands.gstats(msg, args, connection)
        }
        if(msg.content.starts)
        if (invoke in cmdmap) {
            cmdmap[invoke](msg, args);
        }
    }
})
client.login(config.token);