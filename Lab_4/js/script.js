document.getElementById('noteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;
    const pinned = false;
    const date = new Date().toISOString();

    const note = {
      title: title,
      content: content,
      color: color,
      pinned: pinned,
      date: date
    };

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    displayNotes();
    document.getElementById('noteForm').reset();
  });

  function displayNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.date) - new Date(a.date);
      }
      return a.pinned ? -1 : 1;
    });

    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(function(note, index) {
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
        editNote(index);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Usuń';
      deleteButton.addEventListener('click', function() {
        deleteNote(index);
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
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes[index];
    document.getElementById('title').value = note.title;
    document.getElementById('content').value = note.content;
    document.getElementById('color').value = note.color;

    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));

    displayNotes();
  }

  function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
  }

  displayNotes();