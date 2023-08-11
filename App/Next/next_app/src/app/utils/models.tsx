export interface ChannelModel {
    id: string
    name: string
    createdAt: string   //useful?
    creatorId: string   //useful?
    icon: string
    type: string
    joined: boolean
    messages?: MessageModel[]
    members?: ChannelMember[]
}

// Todo: use enum for channel type ?

export interface MessageModel {
    id: string
    author: Sender
    content: string
}

// Note: color depending on role (admin?) -> or custom color for everyone?
export interface Sender {
    id: string
    username: string
    rgbColor: string
}

// Todo: add avatar
export interface ChannelMember {
    id: string
    username: string
    isAdmin: boolean
}

export enum UserStatus {
    Online = "Online",
    Offline = "Offline",
    InGame = "InGame",
}

export interface UserModel {
    id: string
    username: string
    status: UserStatus
    avatar: string
}