import CreateExamForm from "./components/CreateExamForm";

// interface CreateExamPageProps {
//   params: {
//     courseId: string;
//     chapterId: string;
//   };
// }

export default async function CreateExamPage({params}: {params: Promise<{courseId: string, chapterId: string}>}) {
  const {courseId, chapterId} = await params

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Exam</h1>
        <p className="text-gray-600 mt-2">
          Create an exam with questions and multiple choice answers for your course.
        </p>
      </div>

      <CreateExamForm courseId={courseId} chapterId={chapterId} />
    </div>
  );
}
