import { saveNotes, getNotes } from './storage.js';
export function createNoteElement(note, onDelete) {
  const div = document.createElement('div');
  div.className = 'note';
  div.innerText = note.text;
const btn = document.createElement('button');
  btn.innerText = 'Delete';
  btn.className = 'delete';
  btn.addEventListener('click', () => onDelete(note.id));
  div.appendChild(btn);
  return div;
}
export function renderNotes(container) {
  container.innerHTML = '';
  const notes = getNotes();
  notes.forEach(note => {
    const noteEl = createNoteElement(note, (id) => {
      const filtered = notes.filter(n => n.id !== id);
      saveNotes(filtered);
      renderNotes(container);
    });
    container.appendChild(noteEl);
  });
}
