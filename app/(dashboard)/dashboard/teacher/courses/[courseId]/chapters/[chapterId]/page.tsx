import Banner from '@/components/banner';
import IconBadge from '@/components/icon-badge';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ChapterAccessForm from './components/chapter-access-form';
import ChapterActions from './components/chapter-actions';
import ChapterDescriptionForm from './components/chapter-description-form';
import ChapterTitleForm from './components/chapter-title-form';
import ChapterVideoForm from './components/chapter-video-form';
import DeleteExamButton from './exam/components/DeleteExamButton';

export default async function ChpaterDetails({params}: {params: {chapterId: string, courseId: string}}) {
    const {chapterId, courseId} = params

    const {userId} = await auth();
    if(!userId){
        return redirect("/")
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId
        }, 
        include: {
            muxData: true,
            exams: true,
        }, 
    })
    if(!chapter){
        return redirect('/')
    } 


    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]
    
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isCompleted = requiredFields.every(Boolean)

  return (
<>

{!chapter.isPublished && (
    <Banner variant="warning" label="Please publish your chapter. It's unavilable for the students now."/>
)}
<div className='p-6'>
        <div className="flex items-center justify-between">
            <div className="w-full">
                <Link href={`/dashboard/teacher/courses/${courseId}`} className='flex items-center text-sm hover:opacity-75 transition mb-6'>
                <ArrowLeft className='w-4 h-4 mr-2'/>
                Back to course 
                </Link>
                <div className="flex itms-center justify-between w-full">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Chapter setup</h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <ChapterActions  
                    disabled={!isCompleted}
                    courseId={courseId}
                    chapterId={chapterId}
                    isPublished={chapter.isPublished}
                    />
                </div>
            </div>
        </div>
            <div className="grid-grid-cols-1 md:grid-cols 2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} /> 
                        <h2 className="text-xl">
                            Customize your chapter
                        </h2>
                    </div>
                    <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId}/>
                    <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId}  /> 
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Eye}/>
                            <h2 className='text-xl'>
                                Access Settings
                            </h2>
                    </div>
                    <ChapterAccessForm initialData={chapter} courseId={courseId} chapterId={chapterId}/>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Video}/>
                            <h2 className='text-xl'>
                                Add a video
                            </h2>
                    </div>
                    <ChapterVideoForm initialData={chapter} courseId={courseId} chapterId={chapterId}/>
                </div>
            </div>
    </div>
    {chapter.exams.length > 0 && (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">Exams</h2>
            <div className="mt-4">
                {chapter.exams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between">
                        <span className="font-medium">{exam.name}</span>
                        <Link href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/exam/${exam.id}`} className="text-blue-500 hover:underline">
                            View Exam
                        </Link>
                        <DeleteExamButton courseId={courseId} chapterId={chapterId} examId={exam.id}/>
                    </div>
                ))}
            </div>
        </div>
    )}
    <div className="mt-4">
            <Button variant='ghost'>
            <Link className="text-sky-500" href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/exam/`}>Create an Exam</Link>
              
            </Button>
          </div>
</>
  )
}
