import { useEffect, useState } from "react"
import { getCourses } from "@/api/courses"
import { getStandaloneNotes } from "@/api/notes"
import { CourseCard } from "@/components/CourseCard"
import { NoteRow } from "@/components/NoteRow"
import { BookOpen, FileText } from "lucide-react"

export default function Home() {
  const [courses, setCourses] = useState([])
  const [standaloneNotes, setStandaloneNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    Promise.all([getCourses(), getStandaloneNotes()])
      .then(([c, sn]) => {
        setCourses(c)
        setStandaloneNotes(sn)
      })
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

  if (courses.length === 0 && standaloneNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No courses yet</p>
        <p className="text-sm">Courses will appear here once added.</p>
      </div>
    )
  }

  const semesters = [...new Set(courses.map((c) => c.semester))].sort()
  const hasGeneralNotes = standaloneNotes.length > 0
  const showTabs = semesters.length > 1 || hasGeneralNotes

  const filteredCourses = activeTab === "all"
    ? courses
    : courses.filter((c) => c.semester === activeTab)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Courses</h1>

      {showTabs && (
        <div className="flex flex-wrap gap-1 mb-6 rounded-lg bg-muted p-1 w-fit border">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveTab(sem)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === sem
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sem}
            </button>
          ))}
          {hasGeneralNotes && (
            <button
              onClick={() => setActiveTab("general")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "general"
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              General
            </button>
          )}
        </div>
      )}

      {activeTab === "general" ? (
        <div className="space-y-2">
          {standaloneNotes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
