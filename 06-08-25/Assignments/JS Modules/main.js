 import { getNotes, saveNotes } from './storage.js';
import { renderNotes } from './note.js';

const addBtn = document.getElementById('add-note');
const container = document.getElementById('notes-container');

addBtn.addEventListener('click', () => {
  const text = prompt('Enter note text:');
  if (text) {
    const notes = getNotes();
    notes.push({ id: Date.now(), text });
    saveNotes(notes);
    renderNotes(container);
  }
});
renderNotes(container);
