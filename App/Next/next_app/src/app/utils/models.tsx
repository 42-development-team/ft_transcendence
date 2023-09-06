export interface ChannelModel {
	id: string
	name: string
	createdAt: string   //useful?
	creatorId: string   //useful?
	type: ChannelType
	joined: boolean
	banned: boolean
	messages?: MessageModel[]
	members?: ChannelMember[]
	unreadMessages: number
	directMessageTargetUsername?: string
}

export enum ChannelType {
	Public = "public",
	Private = "private",
	Protected = "protected",
	DirectMessage = "direct_message",
}

export interface MessageModel {
	id: string
	createdAt: string
	content: string
	senderId: string
	senderUsername: string
}

export interface ChannelMember {
	id: string
	username: string
	isAdmin: boolean
	isOwner: boolean
	isBanned: boolean
	isMuted: boolean
	mutedUntil: string
	avatar: string
	currentStatus: UserStatus
}

export enum UserStatus {
	Online = "online",
	Offline = "offline",
	InGame = "in a game",
}

export interface UserModel {
	id: string
	username: string
	avatar: string
	currentStatus: UserStatus
}
