import { useEffect, useState } from "react"
import { getCourses } from "@/api/courses"
import { CourseCard } from "@/components/CourseCard"
import { BookOpen } from "lucide-react"

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSemester, setActiveSemester] = useState("all")

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No courses yet</p>
        <p className="text-sm">Courses will appear here once added.</p>
      </div>
    )
  }

  const semesters = [...new Set(courses.map((c) => c.semester))].sort()
  const filtered = activeSemester === "all"
    ? courses
    : courses.filter((c) => c.semester === activeSemester)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      {semesters.length > 1 && (
        <div className="flex gap-1 mb-6 rounded-lg bg-muted p-1 w-fit border">
          <button
            onClick={() => setActiveSemester("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeSemester === "all"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSemester(sem)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeSemester === sem
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sem}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
