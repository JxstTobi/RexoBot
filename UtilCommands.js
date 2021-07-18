const Discord = require("discord.js");
const { RichEmbed, Channel, MessageEmbed } = require('discord.js');

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
function botinfo_cmd(msg, args, client) {
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
        .setFooter('Offizieller Rexo-Tools Bot');
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
module.exports.help = help_cmd
module.exports.botinfo = botinfo_cmd