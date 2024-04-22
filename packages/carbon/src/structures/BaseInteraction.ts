import {
	type APIInteraction,
	type InteractionType,
	Routes
} from "discord-api-types/v10"
import type { Client } from "../classes/Client.js"
import { Base } from "./Base.js"
import type { Row } from "../classes/Row.js"

/**
 * The data to reply to an interaction
 */
export type InteractionReplyData = {
	/**
	 * The content of the message
	 */
	content?: string
	/**
	 * The components to send in the message, listed in rows
	 */
	components?: Row[]
}

/**
 * Additional options for replying to an interaction
 */
export type InteractionReplyOptions = {
	/**
	 * The files to send in the interaction
	 */
	files?: InteractionFileData[]
}

/**
 * The data for a file to send in an interaction
 */
export type InteractionFileData = {
	/**
	 * The name of the file that will be given to Discord
	 */
	name: string
	/**
	 * The data of the file in a Blob
	 */
	data: Blob
	/**
	 * The alt text of the file, shown for accessibility
	 * @alpha This isn't implemented yet
	 */
	description?: string
}

/**
 * This is the base type interaction, all interaction types extend from this
 * @abstract
 */
export abstract class BaseInteraction extends Base {
	/**
	 * The type of interaction
	 */
	type: InteractionType
	/**
	 * The raw data of the interaction
	 */
	rawData: APIInteraction
	/**
	 * The user who sent the interaction
	 */
	userId: string | undefined

	constructor(client: Client, data: APIInteraction) {
		super(client)
		this.rawData = data
		this.type = data.type
		this.userId =
			this.rawData.user?.id || this.rawData.member?.user.id || undefined
	}

	/**
	 * Reply to an interaction.
	 * If the interaction is deferred, this will edit the original response.
	 * @param data The response data
	 */
	async reply(
		data: InteractionReplyData,
		options: InteractionReplyOptions = {}
	) {
		data.components?.map((row) =>
			row.components.map((component) => {
				this.client.componentHandler.registerComponent(component)
			})
		)
		// TODO: Handle non-deferred
		this.client.rest.patch(
			Routes.webhookMessage(
				this.rawData.application_id,
				this.rawData.token,
				"@original"
			),
			{
				body: {
					...data,
					components: data.components?.map((row) => row.serialize())
				},
				files: options.files
			}
		)
	}
}
