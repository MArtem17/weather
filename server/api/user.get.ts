import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let userFind = null
    console.log(query)
    if (query.login && query.password) {
        await prisma.users.findFirst({
            where: {
                login: String(query.login)
            }
        }).then((response) => {
            userFind = response
        })
        if (!userFind) {
            return { user: 'Пользователя с таким логином не найдено' }
        } else {
            if (userFind.password == query.password) {
                return { user: userFind }
            } else {
                return { user: 'Не правильный пароль' }
            }
        }
    } else {
        return { user: 'данные не корректны' }
    }
})