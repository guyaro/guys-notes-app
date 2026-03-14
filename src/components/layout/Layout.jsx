import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
