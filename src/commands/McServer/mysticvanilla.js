import { SlashCommandBuilder, version, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { BotConfig } from '../../config/bot.js';

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
    )
    .addSubcommand((subcommand) =>
    subcommand
        .setName("playerlist")
        .setDescription("Shows the online players")
),
  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);
      const ip = "mysticvanilla.de";
      const { options, guild, member } = interaction;
      const subcommand = options.getSubcommand();

        if (subcommand === "status") {
        if (!BotConfig.mcSrvrs.mysticvanilla) {
            return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                createEmbed({
                    title: "Server disabled",
                    description: "MysticVanilla is currently disabled by default using ˋ../../config/bot.jsˋ.",
                    color: "error"
                })
            ]
        });
      }
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
                    description: "MysticVanilla is currently offline.",
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
            if (!BotConfig.mcSrvrs.mysticvanilla) {
            return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                createEmbed({
                    title: "Server disabled",
                    description: "MysticVanilla is currently disabled by default using ˋ../../config/bot.jsˋ.",
                    color: "error"
                })
            ]
        });
      }
            const embed = createEmbed({ title: "Mysticvanilla Discord", description: "**[Discord](<https://lgg.lovable.app/s/mysticvanilla>)**", color: "#bfff00" });
            
      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        } else if (subcommand === "playerlist") {
          if (!BotConfig.mcSrvrs.mysticvanilla) {
            return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                createEmbed({
                    title: "Server disabled",
                    description: "MysticVanilla is currently disabled by default using ˋ../../config/bot.jsˋ.",
                    color: "error"
                })
            ]
        });
      }
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
                    description: "MysticVanilla is currently offline.",
                    color: "error"
                })
            ]
        });
    }

    const playerList =
        data.players?.list?.length
            ? data.players.list
                  .map((player) => `• **${player.name}**`)
                  .join("\n")
            : "No players are currently online.";

    const embed = createEmbed({
        title: "👥 Online Players",
        description: playerList,
        color: "#bfff00",
    }).addFields(
        {
            name: "Players",
            value: `${data.players.online}/${data.players.max}`,
            inline: true,
        }
    );

    return InteractionHelper.safeEditReply(interaction, {
        embeds: [embed],
    });
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



