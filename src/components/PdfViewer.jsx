import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getPublicUrl } from "@/lib/utils"

export function PdfViewer({ note, open, onOpenChange }) {
  if (!note) return null

  const url = getPublicUrl(note.file_path)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle dir="auto">{note.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 pt-4">
          <iframe
            src={url}
            className="w-full h-full rounded-md border"
            title={note.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
