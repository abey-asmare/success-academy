import { db } from "@/lib/db";
import { cache } from "react";

export const getProfileCount =  cache(async () => {       
return await db.profile.count()
})
