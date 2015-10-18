import AltContainer from 'alt/AltContainer';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
// import connect from '../decorators/connect';

// @connect(NoteStore)
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.storeChanged = this.storeChanged.bind(this);
    this.state = NoteStore.getState();

    this.addNote = this.addNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }
  componentDidMount() {
    NoteStore.listen(this.storeChanged);
  }
  componentWillUnmount() {
    NoteStore.unlisten(this.storeChanged);
  }
  storeChanged(state) {
    this.setState(state);
  }
  render() {
  	const notes = this.state.notes;

    return (
      <div>
        <button className="add-note" onClick={this.addNote}>+</button>
        <AltContainer
          stores={[NoteStore]}
          inject={ {
            items: () => NoteStore.getState().notes
          } }
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  findNote(id) {
    const notes = this.state.notes;
    const noteIndex = notes.findIndex((note) => note.id === id);

    if(noteIndex < 0) {
      console.warn('Failed to find note', notes, id);
    }

    return noteIndex;
  }
  addNote() {
    NoteActions.create({task: 'New task'});
  }
  editNote(id, task) {
    NoteActions.update({id, task});
  }
  deleteNote(id) {
    NoteActions.delete(id);
  }
}