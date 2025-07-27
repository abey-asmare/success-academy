import { PrismaClient } from "../prisma/app/generated/prisma/client/index.js"

const database = new PrismaClient() 


async function main() {
    try{
        await database.category.createMany({
            data: [
                {name: 'Web Development'},
                {name: 'Mobile Development'},
                {name: 'Data Science'},
                {name: 'Business'},
                {name: 'Finance'},
                {name: 'Design'},
            ]
        })  
        console.log('success')

    }  catch(error){
        console.log(error)

    }finally{
        await database.$disconnect()
    }
}

main();


