import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let userFind = null
    let updateUser = null
    console.log(query)
    if (query.id && query.city && query.mode) {
        await prisma.users.findFirst({
            where: {
                id: Number(query.id)
            }
        }).then((response) => {
            userFind = response
        })
        if (!userFind) {
            return { user: 'Пользователь не найден' }
        } else {
            var favorite = userFind.favorites
            if (query.mode == 'add') {
                if (favorite.includes(query.city)) {
                    return { user: "Город уже в избранном" }
                } else {
                    favorite.push(query.city)
                    await prisma.users.update({
                        where: {
                            id: Number(query.id),
                        },
                        data: {
                            favorites: favorite,
                        },
                    }).then((response) => {
                        updateUser = response
                    })
                    return { user: updateUser }
                }
            } else {
                if (!favorite.includes(query.city)) {
                    return { user: "Город не найден в избранном" }
                } else {
                    console.log(favorite)
                    favorite.splice(favorite.indexOf(query.city, 0), 1)
                    console.log(favorite)
                    await prisma.users.update({
                        where: {
                            id: Number(query.id),
                        },
                        data: {
                            favorites: favorite,
                        },
                    }).then((response) => {
                        updateUser = response
                    })
                    return { user: updateUser }
                }
            }
        }
    } else {
        return { user: 'данные не корректны' }
    }
})