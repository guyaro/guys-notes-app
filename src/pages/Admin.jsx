import { useEffect, useState } from "react"
import { getCourses, createCourse, updateCourse, deleteCourse } from "@/api/courses"
import { getNotesByCourse, getStandaloneNotes, createNote, updateNote, deleteNote, reorderNotes } from "@/api/notes"
import { CourseForm } from "@/components/CourseForm"
import { NoteUploadForm } from "@/components/NoteUploadForm"
import { NoteEditForm } from "@/components/NoteEditForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/lib/auth"
import { formatDate, formatFileSize } from "@/lib/utils"
import {
  Plus, Pencil, Trash2, Upload, LogOut, SquarePen,
  ChevronDown, ChevronRight, GripVertical, FileText,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableNoteRow({ note, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between text-sm py-2 px-2 rounded-md hover:bg-muted/50 bg-background"
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="truncate" dir="auto">{note.title}</span>
        <span className="text-muted-foreground shrink-0 text-xs">
          {formatDate(note.created_at)} &middot; {formatFileSize(note.file_size)}
        </span>
      </div>
      <div className="flex gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(note)}
        >
          <SquarePen className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onDelete(note)}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  )
}

export default function Admin() {
  const { user, signOut } = useAuth()
  const toast = useToast()
  const [courses, setCourses] = useState([])
  const [notes, setNotes] = useState({})
  const [standaloneNotes, setStandaloneNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseFormOpen, setCourseFormOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [uploadCourseId, setUploadCourseId] = useState(null)
  const [uploadStandalone, setUploadStandalone] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [activeSemester, setActiveSemester] = useState("all")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const toggleExpanded = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const loadData = async () => {
    try {
      const [coursesData, standaloneData] = await Promise.all([
        getCourses(),
        getStandaloneNotes(),
      ])
      setCourses(coursesData)
      setStandaloneNotes(standaloneData)
      const notesMap = {}
      await Promise.all(
        coursesData.map(async (c) => {
          notesMap[c.id] = await getNotesByCourse(c.id)
        })
      )
      setNotes(notesMap)
      setExpanded((prev) => {
        const next = { ...prev }
        coursesData.forEach((c) => {
          if (next[c.id] === undefined) next[c.id] = false
        })
        return next
      })
    } catch (err) {
      toast({ title: "Error loading data", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleCreateCourse = async (data) => {
    try {
      await createCourse(data)
      toast({ title: "Course created" })
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleUpdateCourse = async (data) => {
    try {
      await updateCourse(editingCourse.id, data)
      toast({ title: "Course updated" })
      setEditingCourse(null)
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete "${course.name}"? This will also delete all its notes.`)) return
    try {
      await deleteCourse(course.id)
      toast({ title: "Course deleted" })
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleUploadNote = async (data) => {
    try {
      await createNote(data)
      toast({ title: "Note uploaded" })
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleUpdateNote = async (note, data) => {
    try {
      await updateNote(note, data)
      toast({ title: "Note updated" })
      setEditingNote(null)
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleDeleteNote = async (note) => {
    if (!window.confirm(`Delete "${note.title}"?`)) return
    try {
      await deleteNote(note)
      toast({ title: "Note deleted" })
      loadData()
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleDragEnd = async (courseId, type, event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    if (courseId === null) {
      // Standalone notes reorder
      const oldIndex = standaloneNotes.findIndex((n) => n.id === active.id)
      const newIndex = standaloneNotes.findIndex((n) => n.id === over.id)
      const reordered = arrayMove(standaloneNotes, oldIndex, newIndex)
      setStandaloneNotes(reordered)
      try {
        await reorderNotes(reordered.map((n) => n.id))
      } catch (err) {
        toast({ title: "Error reordering", description: err.message, variant: "destructive" })
        loadData()
      }
      return
    }

    const typeNotes = (notes[courseId] || []).filter((n) => n.type === type)
    const oldIndex = typeNotes.findIndex((n) => n.id === active.id)
    const newIndex = typeNotes.findIndex((n) => n.id === over.id)
    const reordered = arrayMove(typeNotes, oldIndex, newIndex)

    // Optimistic update
    const otherNotes = (notes[courseId] || []).filter((n) => n.type !== type)
    setNotes((prev) => ({ ...prev, [courseId]: [...reordered, ...otherNotes] }))

    try {
      await reorderNotes(reordered.map((n) => n.id))
    } catch (err) {
      toast({ title: "Error reordering", description: err.message, variant: "destructive" })
      loadData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const NoteList = ({ courseId, type }) => {
    const typeNotes = (notes[courseId] || []).filter((n) => n.type === type)
    if (typeNotes.length === 0) {
      return <p className="text-sm text-muted-foreground py-4 text-center">No {type}s yet</p>
    }
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(courseId, type, event)}
      >
        <SortableContext items={typeNotes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {typeNotes.map((note) => (
              <SortableNoteRow
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={() => setCourseFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
        <Button variant="outline" onClick={() => setUploadStandalone(true)}>
          <Upload className="h-4 w-4" />
          Upload General Notes
        </Button>
      </div>

      {/* Standalone Notes Section */}
      {standaloneNotes.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">General Notes</CardTitle>
              <Badge variant="secondary">{standaloneNotes.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(null, "general", event)}
            >
              <SortableContext items={standaloneNotes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {standaloneNotes.map((note) => (
                    <SortableNoteRow
                      key={note.id}
                      note={note}
                      onEdit={setEditingNote}
                      onDelete={handleDeleteNote}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      {(() => {
        const semesters = [...new Set(courses.map((c) => c.semester))].sort()
        if (semesters.length > 1) {
          return (
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
          )
        }
        return null
      })()}

      <div className="space-y-3">
        {courses.filter((c) => activeSemester === "all" || c.semester === activeSemester).map((course) => {
          const isExpanded = expanded[course.id] ?? false
          const courseNotes = notes[course.id] || []
          const lectureCount = courseNotes.filter((n) => n.type === "lecture").length
          const tutorialCount = courseNotes.filter((n) => n.type === "tutorial").length

          return (
            <Card key={course.id}>
              <CardHeader className="pb-0 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpanded(course.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer text-left"
                  >
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    }
                    <CardTitle className="text-base truncate" dir="auto">{course.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">{course.semester}</Badge>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {lectureCount}L / {tutorialCount}T
                    </span>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setUploadCourseId(course.id)}
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteCourse(course)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-3 px-4 pb-4">
                  <Tabs defaultValue="lecture">
                    <TabsList>
                      <TabsTrigger value="lecture">Lectures ({lectureCount})</TabsTrigger>
                      <TabsTrigger value="tutorial">Tutorials ({tutorialCount})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lecture">
                      <NoteList courseId={course.id} type="lecture" />
                    </TabsContent>
                    <TabsContent value="tutorial">
                      <NoteList courseId={course.id} type="tutorial" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <CourseForm
        open={courseFormOpen}
        onOpenChange={setCourseFormOpen}
        onSubmit={handleCreateCourse}
      />

      {editingCourse && (
        <CourseForm
          open={true}
          onOpenChange={(open) => !open && setEditingCourse(null)}
          onSubmit={handleUpdateCourse}
          initial={editingCourse}
        />
      )}

      {uploadCourseId && (
        <NoteUploadForm
          open={true}
          onOpenChange={(open) => !open && setUploadCourseId(null)}
          onSubmit={handleUploadNote}
          courseId={uploadCourseId}
        />
      )}

      {uploadStandalone && (
        <NoteUploadForm
          open={true}
          onOpenChange={(open) => !open && setUploadStandalone(false)}
          onSubmit={handleUploadNote}
          courseId={null}
          standalone
        />
      )}

      {editingNote && (
        <NoteEditForm
          open={true}
          onOpenChange={(open) => !open && setEditingNote(null)}
          onSubmit={(data) => handleUpdateNote(editingNote, data)}
          note={editingNote}
          courses={courses}
        />
      )}
    </div>
  )
}
