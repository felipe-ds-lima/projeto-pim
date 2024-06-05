document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('note-form');
    const noteIdInput = document.getElementById('note-id');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const notesList = document.getElementById('notes-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const noteId = noteIdInput.value;
        const title = noteTitleInput.value;
        const content = noteContentInput.value;
        if (noteId) {
            updateNote(noteId, title, content);
        } else {
            createNote(title, content);
        }
        form.reset();
    });

    function fetchNotes() {
        fetch('http://localhost:3000/api/notes', {headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }})
            .then(response => response.json())
            .then(data => renderNotes(data))
            .catch(error => console.error('Error fetching notes:', error));
    }

    function renderNotes(notes) {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <div class="actions">
                    <button onclick="editNote(${note.noteId}, '${note.title}', '${note.content}')">Edit</button>
                    <button onclick="deleteNote(${note.noteId})">Delete</button>
                </div>
            `;
            notesList.appendChild(noteElement);
        });
    }

    window.editNote = (noteId, title, content) => {
        noteIdInput.value = noteId;
        noteTitleInput.value = title;
        noteContentInput.value = content;
        console.log()
    };

    window.deleteNote = (noteId) => {
        fetch(`http://localhost:3000/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => fetchNotes())
            .catch(error => console.error('Error deleting note:', error));
    };

    function createNote(title, content) {
        fetch('http://localhost:3000/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content }),
        })
            .then(() => fetchNotes())
            .catch(error => console.error('Error creating note:', error));
    }

    function updateNote(noteId, title, content) {
        fetch(`http://localhost:3000/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content }),
        })
            .then(() => fetchNotes())
            .catch(error => console.error('Error updating note:', error));
    }

    fetchNotes();
});
