import {
	type APIApplicationCommandBasicOption,
	type APIApplicationCommandSubcommandGroupOption,
	type APIApplicationCommandSubcommandOption,
	ApplicationCommandOptionType
} from "discord-api-types/v10"
import type { Command } from "./Command.js"
import { CommandWithSubcommands } from "./CommandWithSubcommands.js"

/**
 * Represents a subcommand group command that the user creates.
 * You make this instead of a {@link Command} class when you want to have subcommand groups in your options.
 */
export abstract class CommandWithSubcommandGroups extends CommandWithSubcommands {
	/**
	 * The subcommands that the user can use
	 */
	subcommands: Command[] = []

	/**
	 * The subcommands that the user can use
	 */
	abstract subcommandGroups: CommandWithSubcommands[]

	/**
	 * @internal
	 */
	serializeOptions() {
		const subcommands = this.subcommands.map((subcommand) => ({
			name: subcommand.name,
			description: subcommand.description,
			type: ApplicationCommandOptionType.Subcommand,
			options:
				subcommand.serializeOptions() as APIApplicationCommandBasicOption[]
		})) as APIApplicationCommandSubcommandOption[]

		const subcommandGroups = this.subcommandGroups.map((subcommandGroup) => ({
			name: subcommandGroup.name,
			description: subcommandGroup.description,
			type: ApplicationCommandOptionType.SubcommandGroup,
			options:
				subcommandGroup.serializeOptions() as APIApplicationCommandSubcommandOption[]
		})) as APIApplicationCommandSubcommandGroupOption[]

		return [...subcommands, ...subcommandGroups]
	}
}
