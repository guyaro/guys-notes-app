import { useState } from "react"
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
import { SEMESTERS, getCurrentSemester } from "@/lib/constants"

export function CourseForm({ open, onOpenChange, onSubmit, initial = null }) {
  const [name, setName] = useState(initial?.name ?? "")
  const [semester, setSemester] = useState(initial?.semester ?? getCurrentSemester())
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ name, semester })
      onOpenChange(false)
      setName("")
      setSemester(getCurrentSemester())
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Course" : "Add Course"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update the course details." : "Create a new course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linear Algebra"
              dir="auto"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
            {loading ? "Saving..." : initial ? "Update Course" : "Add Course"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
