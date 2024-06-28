document.getElementById('noteForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const color = document.getElementById('color').value;
  const index = document.getElementById('noteIndex').value;

  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let note;

  if (index !== '') {
      note = notes[parseInt(index)];
      note.title = title;
      note.content = content;
      note.color = color;
      note.date = new Date().toISOString();
      document.getElementById('noteIndex').value = '';
  } else {
      note = {
          title: title,
          content: content,
          color: color,
          pinned: false,
          date: new Date().toISOString(),
          noteIndex: notes.length
      };
      notes.push(note);
  }

  localStorage.setItem('notes', JSON.stringify(notes));

  displayNotes();
  resetForm();
});

document.getElementById('saveButton').addEventListener('click', function() {
  document.getElementById('noteForm').dispatchEvent(new Event('submit'));
});

document.getElementById('cancelButton').addEventListener('click', function() {
  resetForm();
});

document.getElementById('searchInput').addEventListener('input', function() {
  displayNotes(this.value);
});

function resetForm() {
  document.getElementById('title').value = '';
  document.getElementById('content').value = '';
  document.getElementById('color').value = '#ffffff';
  document.getElementById('noteIndex').value = '';
  document.getElementById('addButton').style.display = 'inline-block';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('cancelButton').style.display = 'none';
}

function displayNotes(searchText = '') {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];

  notes.sort((a, b) => {
      if (a.pinned === b.pinned) {
          return new Date(b.date) - new Date(a.date);
      }
      return a.pinned ? -1 : 1;
  });

  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';

  notes.forEach(function(note, index) {
      if (!note) return;

      if (searchText && !note.title.toLowerCase().includes(searchText.toLowerCase()) &&
          !note.content.toLowerCase().includes(searchText.toLowerCase()) &&
          !note.color.toLowerCase().includes(searchText.toLowerCase())) {
          return;
      }

      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      if (note.pinned) {
          noteElement.classList.add('pinned');
      }
      noteElement.style.backgroundColor = note.color;

      const titleElement = document.createElement('h2');
      titleElement.textContent = note.title;

      const contentElement = document.createElement('p');
      contentElement.textContent = note.content;

      const dateElement = document.createElement('p');
      dateElement.textContent = new Date(note.date).toLocaleString();

      const editButton = document.createElement('button');
      editButton.textContent = 'Edytuj';
      editButton.addEventListener('click', function() {
          editNote(note.noteIndex);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Usuń';
      deleteButton.addEventListener('click', function() {
          deleteNote(note.noteIndex);
      });

      const pinButton = document.createElement('button');
      pinButton.textContent = note.pinned ? 'X' : 'Pin';
      pinButton.className = note.pinned ? 'pinButton pinned' : 'pinButton unpinned';
      pinButton.addEventListener('click', function() {
          note.pinned = !note.pinned;
          localStorage.setItem('notes', JSON.stringify(notes));
          displayNotes();
      });

      noteElement.appendChild(titleElement);
      noteElement.appendChild(contentElement);
      noteElement.appendChild(dateElement);
      noteElement.appendChild(editButton);
      noteElement.appendChild(deleteButton);
      noteElement.appendChild(pinButton);

      notesList.appendChild(noteElement);
  });
}

function editNote(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let note = notes[index];
  document.getElementById('title').value = note.title;
  document.getElementById('content').value = note.content;
  document.getElementById('color').value = note.color;
  document.getElementById('noteIndex').value = index;
  document.getElementById('addButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'inline-block';
  document.getElementById('cancelButton').style.display = 'inline-block';
}

function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  // Zaktualizuj indeksy notatek
  notes.forEach((note, idx) => {
      note.noteIndex = idx;
  });
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

displayNotes();
