import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getCourse } from "@/api/courses"
import { getNotesByCourse } from "@/api/notes"
import { NoteRow } from "@/components/NoteRow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"

export default function CoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCourse(id), getNotesByCourse(id)])
      .then(([c, n]) => {
        setCourse(c)
        setNotes(n)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!course) {
    return <p className="text-center py-20 text-muted-foreground">Course not found.</p>
  }

  const lectures = notes.filter((n) => n.type === "lecture")
  const tutorials = notes.filter((n) => n.type === "tutorial")

  const NoteList = ({ items }) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <p className="text-sm">No notes yet</p>
        </div>
      )
    }
    return (
      <div className="space-y-2">
        {items.map((note) => (
          <NoteRow key={note.id} note={note} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold" dir="auto">{course.name}</h1>
        <Badge variant="secondary">{course.semester}</Badge>
      </div>

      <Tabs defaultValue="lecture">
        <TabsList>
          <TabsTrigger value="lecture">Lectures ({lectures.length})</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorials ({tutorials.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="lecture">
          <NoteList items={lectures} />
        </TabsContent>
        <TabsContent value="tutorial">
          <NoteList items={tutorials} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
