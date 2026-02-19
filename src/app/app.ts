import { CommonModule } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  notes = signal<string[]>([]);
  newNote = signal('');
  editIndex = signal<number | null>(null);
  darkMode = signal(false);
  constructor() {
    const savedNotes = localStorage.getItem('notes');
    const savedTheme = localStorage.getItem('darkMode');
    if (savedNotes){
      this.notes.set(JSON.parse(savedNotes));
    }
    if (savedTheme){
      this.darkMode.set(JSON.parse(savedTheme));
    }
    effect(()=>{
      localStorage.setItem('notes', JSON.stringify(this.notes()));
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode()));

    });
  }
  addNote() {
    if(!this.newNote().trim()) return; 
    if(this.editIndex() !== null){
      const updated = [...this.notes()];
      updated[this.editIndex()!] = this.newNote();
      this.notes.set(updated);
      this.editIndex.set(null);
    }
    else{
      this.notes.set([...this.notes(), this.newNote()]);
    }
    this.newNote.set('');
  }
  editNote(index:number){
    this.newNote.set(this.notes()[index]);
    this.editIndex.set(index);
  }
  deleteNote(index:number) {
    const updated = [...this.notes()];
    updated.splice(index, 1);
    this.notes.set(updated);
  }
  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
  }
  //protected readonly title = signal('Notes-App');
}
