import { Router } from "express";
import { createNote, deleteAllNotes, deleteNote, getAggregatedNotes, getNote, getNoteByContent, getNotesWithUser, getPaginatedNotes, replaceNote, updateAllNotes, updateNote } from "./notes.service.js";
const notesRouter  = Router()
export default notesRouter;

notesRouter.post('/:id',createNote)
notesRouter.get('/paginate-sort',getPaginatedNotes)
notesRouter.get('/note-by-content',getNoteByContent)
notesRouter.get('/note-with-user',getNotesWithUser)
notesRouter.get('/aggregate',getAggregatedNotes)
notesRouter.get('/:id',getNote)
notesRouter.patch('/all',updateAllNotes)
notesRouter.delete('/',deleteAllNotes)
notesRouter.delete('/:noteId',deleteNote)
notesRouter.put('/replace/:noteId',replaceNote)
notesRouter.put('/:noteId',updateNote)