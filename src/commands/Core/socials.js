import { SlashCommandBuilder, version, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
export default {
    data: new SlashCommandBuilder()
    .setName("socials")
    .setDescription("View Lokro's Socials")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("lokrogamer")
            .setDescription("Lokro's socials")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("ls-leon-sprenger")
            .setDescription("View LS|Leon Sprenger's Socials")
    ),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);
      
      const { options, guild, member } = interaction;
      const subcommand = options.getSubcommand();

        if (subcommand === "lokrogamer") {
      const embed = createEmbed({ title: "Viewing Lokrogamer's socials", description: "Socials:" }).addFields(
        { name: "Twitch", value: `<https://twitch.tv/lokrogamer>`, inline: true },
        { name: "Youtube", value: `<https://youtube.com/c/lokrogamer>`, inline: true },
        { name: "Guns.lol", value: `<https://guns.lol/lokrogamer>`, inline: true },
        { name: "Website", value: `<https://lokrogaming.github.io>`, inline: true },
        
      );
            
      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        } else if (subcommand === "ls-leon-sprenger") {
            const embed = createEmbed({ title: "Viewing Ls|Leon Sprenger's socials", description: "Failed to execute /socials. **No links specified**", color: "#ff0000" });
            
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



