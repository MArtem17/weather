import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    let user = null
    let userFind = null
    if (body.login && body.password && body.password1 && (body.password == body.password1)) {
        await prisma.users.findFirst({
            where: {
                login: body.login
            }
        }).then((response) => {
            userFind = response
        })
        if (userFind) {
            return { user: 'этот логин занят' }
        } else {
            await prisma.users.create({
                data: {
                    login: body.login,
                    password: body.password.toString(),
                    favorites: []
                }
            }).then((response) => {
                user = response
            })
            return { user: user }
        }
    } else {
        return { user: 'данные не корректны' }
    }
})