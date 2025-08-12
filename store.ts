import {create} from 'zustand'


type ProfileEnrollType = {
  open: boolean
  setOpen: () => void
}

export const useProfileEnroll = create<ProfileEnrollType>()(set => ({
   open: false, 
   setOpen: ()=>set((prev) => ({open: !prev.open})), 

}))
