import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Note {
  id: number;
  title: string;
  content: string;
}

const StudyNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState<number | null>(null);

  const handleAddNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      toast.error("Both title and content are required.");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
    };

    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
    toast.success("Note added successfully!");
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setEditMode(id);
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    }
  };

  const handleSaveEdit = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title, content } : note,
    );
    setNotes(updatedNotes);
    setEditMode(null);
    setTitle("");
    setContent("");
    toast.success("Note updated successfully!");
  };

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    toast.success("Note deleted successfully!");
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-1/2">
      <h2 className="text-xl font-semibold">Study Notes</h2>

      <div className="flex flex-col gap-2">
        <Input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-2"
          style={{
            maxHeight: "200px",
          }}
        />

        {editMode === null ? (
          <Button onClick={handleAddNote} className="mt-2">
            Add Note
          </Button>
        ) : (
          <Button onClick={() => handleSaveEdit(editMode)} className="mt-2">
            Save Changes
          </Button>
        )}
      </div>

      {/* Render Notes */}
      <div className="mt-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="border p-4 mb-2 rounded shadow-sm bg-blend-darken"
            >
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="text-sm">{note.content}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => handleEditNote(note.id)}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteNote(note.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No notes available. Start adding some!</p>
        )}
      </div>
    </div>
  );
};

export default StudyNotes;
