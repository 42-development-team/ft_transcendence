import { faker } from '@faker-js/faker'
import { MessageModel } from './models'

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