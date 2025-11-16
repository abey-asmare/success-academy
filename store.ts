import {create} from 'zustand'


type ProfileEnrollType = {
  open: boolean
  setOpen: () => void
}

export const useProfileEnroll = create<ProfileEnrollType>()(set => ({
   open: false, 
   setOpen: ()=>set((prev) => ({open: !prev.open})), 

}))




type VideoPlayerType = {
  shouldCurrentlyPlaying: string
  setShouldCurrentlyPlay: (value: string) => void
}

export const useVideoPlayer = create<VideoPlayerType>(set => ({
  shouldCurrentlyPlaying: '', 
  setShouldCurrentlyPlay: (value) => set({ shouldCurrentlyPlaying: value }),
}))