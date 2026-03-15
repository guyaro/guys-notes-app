import { supabase } from "./supabase"

export async function getNotesByCourse(courseId) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("course_id", courseId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function reorderNotes(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabase.from("notes").update({ display_order: index }).eq("id", id)
  )
  await Promise.all(updates)
}

export async function getStandaloneNotes() {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .is("course_id", null)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
  if (error) throw error
  return data
}

export async function createNote({ courseId, title, type, date, file, description }) {
  // Get max display_order for this group so new note goes to bottom
  let query = supabase
    .from("notes")
    .select("display_order")
    .eq("type", type)
    .order("display_order", { ascending: false })
    .limit(1)
  if (courseId) {
    query = query.eq("course_id", courseId)
  } else {
    query = query.is("course_id", null)
  }
  const { data: existing } = await query
  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1

  const timestamp = Date.now()
  const prefix = courseId || "standalone"
  const filePath = `${prefix}/${timestamp}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from("notes")
    .upload(filePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from("notes")
    .insert({
      course_id: courseId || null,
      title,
      type,
      date,
      description: description || null,
      file_path: filePath,
      file_size: file.size,
      display_order: nextOrder,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNote(note, { title, type, courseId, file, description }) {
  const updates = { title, type, course_id: courseId || null, description: description || null }

  if (file) {
    // Remove old file
    await supabase.storage.from("notes").remove([note.file_path])

    // Upload new file
    const timestamp = Date.now()
    const prefix = courseId || "standalone"
    const filePath = `${prefix}/${timestamp}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filePath, file)
    if (uploadError) throw uploadError

    updates.file_path = filePath
    updates.file_size = file.size
  } else if (courseId !== note.course_id) {
    // Move file path reference if course changed (file stays in storage)
    // Storage path doesn't need to move — it still works
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", note.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNote(note) {
  const { error: storageError } = await supabase.storage
    .from("notes")
    .remove([note.file_path])
  if (storageError) throw storageError

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", note.id)
  if (error) throw error
}
