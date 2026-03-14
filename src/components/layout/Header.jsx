import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-5xl">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
          <BookOpen className="h-5 w-5" />
          <span>Guy's Notes</span>
        </Link>
        <span className="text-xs text-muted-foreground">By Guy Aronowitz</span>
      </div>
    </header>
  )
}
