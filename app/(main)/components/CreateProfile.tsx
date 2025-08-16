'use client'
import { ProfileType } from "@/app/(dashboard)/dashboard/teacher/users/components/columns";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CreateProfile() {
  const { isLoaded, isSignedIn } = useUser();
  // const [profileSynced, setProfileSynced] = useState(false);
  useQuery<ProfileType>({
    queryKey: ["profile"],
    queryFn: () => axios.get("/api/profile").then((res) => res.data),
    enabled: isLoaded && isSignedIn,
    
  })

  // useEffect(() => {
  //   if (!isLoaded || !isSignedIn || !user || profileSynced) return;

  //   const syncProfile = async () => {
  //     try {
  //       const res = await fetch("/api/profile");
  //       if (res.ok) {
  //         setProfileSynced(true);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   syncProfile();
  // }, [isLoaded, isSignedIn, user, profileSynced]);

  return null;
}
