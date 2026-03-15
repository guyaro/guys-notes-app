import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Upload, X, FileText, GripVertical } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
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

function stripExtension(filename) {
  return filename.replace(/\.pdf$/i, "")
}

function SortableFileRow({ f, onUpdate, onRemove, standalone }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: f.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border p-3 bg-background"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Input
          value={f.title}
          onChange={(e) => onUpdate(f.id, "title", e.target.value)}
          placeholder="Title"
          className="h-8 text-sm"
          dir="auto"
        />
        <Input
          value={f.description || ""}
          onChange={(e) => onUpdate(f.id, "description", e.target.value)}
          placeholder="Description (optional)"
          className="h-8 text-sm"
          dir="auto"
        />
        <div className="flex items-center gap-2">
          {!standalone && (
            <div className="flex rounded-md border text-sm overflow-hidden">
              <button
                type="button"
                onClick={() => onUpdate(f.id, "type", "lecture")}
                className={`px-3 py-1 transition-colors cursor-pointer ${
                  f.type === "lecture"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Lecture
              </button>
              <button
                type="button"
                onClick={() => onUpdate(f.id, "type", "tutorial")}
                className={`px-3 py-1 transition-colors cursor-pointer ${
                  f.type === "tutorial"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Tutorial
              </button>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {formatFileSize(f.file.size)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(f.id)}
        className="shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function NoteUploadForm({ open, onOpenChange, onSubmit, courseId, standalone }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const addFiles = useCallback((newFiles) => {
    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    )
    setFiles((prev) => [
      ...prev,
      ...pdfFiles.map((f) => ({
        file: f,
        title: stripExtension(f.name),
        type: standalone ? "general" : "lecture",
        id: Math.random().toString(36).slice(2),
      })),
    ])
  }, [])

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFile = (id, field, value) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setFiles((prev) => {
      const oldIndex = prev.findIndex((f) => f.id === active.id)
      const newIndex = prev.findIndex((f) => f.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleSubmit = async () => {
    if (files.length === 0) return
    setLoading(true)
    try {
      for (const f of files) {
        await onSubmit({
          courseId,
          title: f.title || stripExtension(f.file.name),
          type: f.type,
          date: new Date().toISOString().split("T")[0],
          file: f.file,
          description: f.description || "",
        })
      }
      onOpenChange(false)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (open) => {
    if (!open) {
      setFiles([])
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{standalone ? "Upload General Notes" : "Upload Notes"}</DialogTitle>
          <DialogDescription>Drop PDF files or click to browse. Upload multiple at once.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop PDF files here or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </div>

          {files.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {files.map((f) => (
                    <SortableFileRow
                      key={f.id}
                      f={f}
                      onUpdate={updateFile}
                      onRemove={removeFile}
                      standalone={standalone}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={loading || files.length === 0}
        >
          {loading
            ? "Uploading..."
            : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
