 export function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

export function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}
