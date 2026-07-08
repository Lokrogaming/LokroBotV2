import { SlashCommandBuilder, version, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';

import { InteractionHelper } from '../../utils/interactionHelper.js';
export default {
    data: new SlashCommandBuilder()
    .setName("socials")
    .setDescription("View Lokro's Socials"),

  async execute(interaction) {
    try {
      await InteractionHelper.safeDefer(interaction);
      
      const totalGuilds = interaction.client.guilds.cache.size;
      const totalMembers = interaction.client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0,
      );
      const nodeVersion = process.version;

      const embed = createEmbed({ title: "📊 System Statistics", description: "Real-time performance metrics." }).addFields(
        { name: "Twitch", value: `<https://twitch.tv/lokrogamer>`, inline: true },
        { name: "Youtube", value: `<https://youtube.com/c/lokrogamer>`, inline: true },
        { name: "Guns.lol", value: `<https://guns.lol/lokrogamer>`, inline: true },
        { name: "Website", value: `<https://lokrogaming.github.io>`, inline: true },
        
      );

      await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    } catch (error) {
      logger.error('Stats command error:', error);
      return InteractionHelper.safeEditReply(interaction, {
        embeds: [createEmbed({ title: 'System Error', description: 'Could not fetch system statistics.', color: 'error' })],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};



