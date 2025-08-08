'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function CreateProfile() {
    const [profileSynced, setProfileSynced] = useState(false)
    const { isSignedIn, user } = useUser();
    useEffect(() => {
      
      if (isSignedIn && user && !profileSynced) {
        fetch("/api/profile", { method: "GET" })
          .then((res) => res.json())
          .then(() => setProfileSynced(true))
          .catch(console.error);
      }
      console.log('hook called profile created successfullpy')
    }, [isSignedIn, user, profileSynced]);
  return (
    <></>
  )
}
