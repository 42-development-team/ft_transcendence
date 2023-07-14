import { faker } from '@faker-js/faker'
import { MessageModel, ChannelModel, UserModel, UserStatus } from './models'

export const generateFakeMessage = (): MessageModel => {
    return {
        id: faker.string.uuid(),
        author: {
            rgbColor: faker.internet.color({redBase: 255, greenBase: 255, blueBase: 255}),
            username: faker.internet.userName(),
        },
        content: faker.lorem.sentence(),
    }
}

export const generateFakeChannel = (): ChannelModel => {
    return {
        id: faker.string.uuid(),
        name: faker.internet.userName(),
        icon: faker.image.avatarGitHub()
    }
}

export const generateFakeFriend = (): UserModel => {
    return {
        id: faker.string.uuid(),
        username: faker.internet.userName(),
        status: faker.helpers.arrayElement(Object.values(UserStatus)),
        avatar: faker.image.avatarGitHub()
    }
}