import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/lib/auth"
import { ToastProvider } from "@/components/ui/toast"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Home from "@/pages/Home"
import CoursePage from "@/pages/CoursePage"
import Login from "@/pages/Login"
import Admin from "@/pages/Admin"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/course/:id" element={<CoursePage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
