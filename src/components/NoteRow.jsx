import { FileText } from "lucide-react"
import { formatDate, formatFileSize, getPublicUrl } from "@/lib/utils"

export function NoteRow({ note }) {
  const url = getPublicUrl(note.file_path)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-3 px-3 rounded-lg border bg-card hover:bg-muted/60 transition-colors"
    >
      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" dir="auto">{note.title}</p>
        <p className="text-xs text-muted-foreground">
          Uploaded {formatDate(note.created_at)} &middot; {formatFileSize(note.file_size)}
        </p>
      </div>
    </a>
  )
}
