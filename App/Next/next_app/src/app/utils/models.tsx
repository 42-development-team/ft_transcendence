export interface ChannelModel {
    id: string
    name: string
    messages?: MessageModel[]
    icon: string
}

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