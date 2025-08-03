import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type CourseDropdownProps = {
  courses: { id: string; name: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (courseId: string) => void;
};

export function CourseDropdown({courses, placeholder, value, onChange}: CourseDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder || "select an option"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Courses</SelectLabel>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
