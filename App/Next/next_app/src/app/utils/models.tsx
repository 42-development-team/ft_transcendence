export interface ChannelModel {
    id: string
    name: string
    createdAt: string   //useful?
    creatorId: string   //useful?
    icon: string
    type: string
    joined: boolean
    banned: boolean
    messages?: MessageModel[]
    members?: ChannelMember[]
    unreadMessages: number
}

// Todo: use enum for channel type ?

export interface MessageModel {
    id: string
    createdAt: string
    content: string
    senderId: string
    senderUsername: string
}

// Todo: add avatar
export interface ChannelMember {
    id: string
    username: string
    isAdmin: boolean
    isOwner: boolean
    isBanned: boolean
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
    status: UserStatus
    avatar: string
}
