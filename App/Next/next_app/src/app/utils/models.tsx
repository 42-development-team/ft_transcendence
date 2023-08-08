export interface ChannelModel {
    id: string
    name: string
    createdAt: string
    creatorId: string
    messages?: MessageModel[]
    icon: string
    type: string
    password?: string
    joined: boolean
}

// Todo: use enum for channel type ?

export interface MessageModel {
    id: string
    author: Author
    content: string
}

// Note: color depending on role (admin?) -> or custom color for everyone?
export interface Author {
    rgbColor: string
    username: string
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