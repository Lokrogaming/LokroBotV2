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



