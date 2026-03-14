import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="block group">
      <Card className="transition-shadow hover:shadow-md h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg" dir="auto">{course.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0">{course.semester}</Badge>
          </div>
          <CardDescription>Click to view notes</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
