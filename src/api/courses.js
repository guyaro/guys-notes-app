import { supabase } from "./supabase"

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getCourse(id) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data
}

export async function createCourse(course) {
  const { data, error } = await supabase
    .from("courses")
    .insert(course)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCourse(id, updates) {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCourse(id) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id)
  if (error) throw error
}
