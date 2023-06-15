import React, { useState } from 'react'
import NoteContext from './noteContext'

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchalluser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3NjM0YmQyNDhhNTc1MmMyOWZmYWU5In0sImlhdCI6MTY4NTQ2OTIyMH0._jCYN-fSZq9Xxbg6sDGVXVOuW3xjaPP1MlLL_QBoMwg"
            }
        });

        const json = await response.json();
        setNotes(json);
    }
    // Add note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3NjM0YmQyNDhhNTc1MmMyOWZmYWU5In0sImlhdCI6MTY4NTQ2OTIyMH0._jCYN-fSZq9Xxbg6sDGVXVOuW3xjaPP1MlLL_QBoMwg"
            },
            body: JSON.stringify({ title, description, tag }),
        });
        const note = await response.json();
        setNotes(notes.concat(note))
    }
    // delete note
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3NjM0YmQyNDhhNTc1MmMyOWZmYWU5In0sImlhdCI6MTY4NTQ2OTIyMH0._jCYN-fSZq9Xxbg6sDGVXVOuW3xjaPP1MlLL_QBoMwg"
            }
        });
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote)
    }
    // edit note
    const editNote = async (id,title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ3NjM0YmQyNDhhNTc1MmMyOWZmYWU5In0sImlhdCI6MTY4NTQ2OTIyMH0._jCYN-fSZq9Xxbg6sDGVXVOuW3xjaPP1MlLL_QBoMwg"
            },
            body: JSON.stringify({ title, description, tag }),
        });
        // const json = response.json();
        let newNotes=JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id===id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
            setNotes(newNotes);
        }

    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;