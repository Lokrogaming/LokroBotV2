/* {
	"online": true,
	"ip": "127.0.0.1",
	"port": 25567,
	"hostname": "server.mymcserver.tld", //Only included when a hostname is detected
	"debug": { //See section below for information about the values
		"ping": true,
		"query": true,
		"bedrock": false,
		"srv": true,
		"querymismatch": false,
		"ipinsrv": false,
		"cnameinsrv": false,
		"animatedmotd": false,
		"cachehit": true,
		"cachetime": 1518553220,
		"cacheexpire": 1518553280,
		"apiversion": 3
	},
	"version": "1.12", //Could include multiple versions or additional text
	"protocol": { //Only included when ping is used
		"version": 340,
		"name": "1.12.2" //Only included if a version name is found
	},
	"icon": "data:image\/png;base64,iVBORw0KGgoAAAANSUhEU...dSk6AAAAAElFTkSuQmCC", //Only included when an icon is detected
	"software": "BungeeCord", //Only included when software is detected
	"map": {
		"raw": "MyMcWorld",
		"clean": "MyMcWorld",
		"html": "MyMcWorld"
	},
	"gamemode": "Survival", //Only included for Bedrock servers
	"serverid": "2438134582716697305", //Only included for Bedrock servers
	"eula_blocked": false, //Only included for Java servers
	"motd": {
		"raw": [
			"\u00a7cEver\u00a7r\u00a79PvP \u00a7r\u00a77- \u00a7r\u00a72\u00c9n server, for alle",
			"\u00a7r\u00a7fSe dine stats p\u00e5 \u00a7r\u00a76stats.everpvp.dk\u00a7r"
		],
		"clean": [
			"EverPvP - \u00c9n server, for alle",
			"Se dine stats p\u00e5 stats.everpvp.dk"
		],
		"html": [
			"<span style=\"color: #FF5555\">Ever<\/span><span style=\"color: #5555FF\">PvP <\/span><span style=\"color: #AAAAAA\">- <\/span><span style=\"color: #00AA00\">\u00c9n server, for alle<\/span>",
			"<span style=\"color: #FFFFFF\">Se dine stats p\u00e5 <\/span><span style=\"color: #FFAA00\">stats.everpvp.dk<\/span>"
		]
	},
	"players": {
		"online": 2,
		"max": 100,
		"list": [ //Only included when there are players
			{
				"name": "Spirit55555",
				"uuid": "f6792ad3-cbb4-4596-8296-749ee4158f97"
			},
			{
				"name": "sarsum33",
				"uuid": "d3512599-d4d9-4520-808f-a81f4cdfe8d0"
			}
		],
	},
	"plugins": [ //Only included when plugins are detected
		{
			"name": "WorldEdit",
			"version": "6.1.5"
		},
		{
			"name": "WorldGuard",
			"version": "6.2"
		}
	],
	"mods": [ //Only included when mods are detected
		{
			"name": "BiomesOPlenty",
			"version": "2.1.0"
		},
		{
			"name": "MoreFurnaces",
			"version": "1.3.9"
		}
	],
	"info": { //Only included when detecting that the player samples are used for information
		"raw": [
			"\u00a77\u00bb \u00a7cKitPvP \u00a77:: \u00a7f1 \u00a77online",
			"\u00a77\u00bb \u00a7bSurvivalGames \u00a77:: \u00a7f0 \u00a77online"
		],
		"clean": [
			"\u00bb KitPvP :: 1 online",
			"\u00bb SurvivalGames :: 0 online"
		],
		"html": [
			"<span style=\"color: #AAAAAA\">\u00bb <\/span><span style=\"color: #FF5555\">KitPvP <\/span><span style=\"color: #AAAAAA\">:: <\/span><span style=\"color: #FFFFFF\">1 <\/span><span style=\"color: #AAAAAA\">online<\/span>",
			"<span style=\"color: #AAAAAA\">\u00bb <\/span><span style=\"color: #55FFFF\">SurvivalGames <\/span><span style=\"color: #AAAAAA\">:: <\/span><span style=\"color: #FFFFFF\">0 <\/span><span style=\"color: #AAAAAA\">online<\/span>"
		]
	}
}

import { SlashCommandBuilder, version, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
export default {
    data: new SlashCommandBuilder()
    .setName("mysticvanilla")
    .setDescription("Infos about MysticVanilla")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("status")
            .setDescription("Server Status")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("discord")
            .setDescription("Get Discord link")
    ),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);
      const ip = "mysticvanilla.de";
      const { options, guild, member } = interaction;
      const subcommand = options.getSubcommand();

        if (subcommand === "status") {

    const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!data.online) {
        return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                createEmbed({
                    title: "🔴 Server Offline",
                    description: "MysticVanilla ist momentan nicht erreichbar.",
                    color: "error"
                })
            ]
        });
    }

    const embed = createEmbed({
        title: "MysticVanilla Status",
        description: "Aktuelle Serverinformationen",
        color: "#bfff00"
    }).addFields(
        {
            name: "Version",
            value: data.version ?? "Unbekannt",
            inline: true
        },
        {
            name: "Spieler",
            value: `${data.players.online}/${data.players.max}`,
            inline: true
        },
        {
            name: "Software",
            value: data.software ?? "Unbekannt",
            inline: true
        },
        {
            name: "MOTD",
            value: data.motd?.clean?.join("\n") || "Keine",
            inline: false
        }
    );

    return InteractionHelper.safeEditReply(interaction, {
        embeds: [embed]
    });
} else if (subcommand === "discord") {
            const embed = createEmbed({ title: "Mysticvanilla Discord", description: "**[Discord](<https://lgg.lovable.app/s/mysticvanilla**", color: "#bfff00" });
            
      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        }
    } catch (error) {
      logger.error('Stats command error:', error);
      return InteractionHelper.safeEditReply(interaction, {
        embeds: [createEmbed({ title: 'System Error', description: 'Could not fetch socials.', color: 'error' })],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};



