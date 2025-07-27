
export const isTeacher = (userId: string | null | undefined) => {
    console.log('is teacher', userId, process.env.NEXT_PUBLIC_TEACHER_ID)
    return userId === process.env.NEXT_PUBLIC_TEACHER_ID!
}