import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { FileText, Replace } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

export function NoteEditForm({ open, onOpenChange, onSubmit, note, courses }) {
  const [title, setTitle] = useState(note?.title ?? "")
  const [type, setType] = useState(note?.type ?? "lecture")
  const [courseId, setCourseId] = useState(note?.course_id ?? "")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ title, type, courseId, file })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>Update note details or replace the file.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              dir="auto"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex rounded-md border text-sm overflow-hidden w-fit">
              <button
                type="button"
                onClick={() => setType("lecture")}
                className={`px-4 py-2 transition-colors cursor-pointer ${
                  type === "lecture"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Lecture
              </button>
              <button
                type="button"
                onClick={() => setType("tutorial")}
                className={`px-4 py-2 transition-colors cursor-pointer ${
                  type === "tutorial"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Tutorial
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>File</Label>
            {file ? (
              <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-destructive hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-muted-foreground">
                  Current file ({formatFileSize(note?.file_size ?? 0)})
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                >
                  <Replace className="h-3 w-3" />
                  Replace
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0] || null)
                e.target.value = ""
              }}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !title.trim() || !courseId}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
