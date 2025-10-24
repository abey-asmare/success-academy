'use cache'
import { db } from "@/lib/db"
import { cacheLife } from "next/dist/server/use-cache/cache-life"

export const getProfileCount = async ()=> {
    cacheLife('weeks')
    return await db.profile.count() + 11900
}