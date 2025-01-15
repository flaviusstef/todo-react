import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    const newTodo = {
      text: event.target.elements.todo.value,
      completed: false,
      dueDate: event.target.elements.dueDate.value || null,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    event.target.reset();
  };

  const toggleTodo = (index) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const isPastDue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-logo">ToDoDoDo</h1>
        <form onSubmit={addTodo}>
          <input type="text" name="todo" placeholder="Add a new todo" required />
          <input type="date" name="dueDate" placeholder="Due date (optional)" />
          <button type="submit">Add</button>
        </form>
        <section>
          <h2>Tasks to do</h2>
          <ul className="todo-list">
            {todos.filter(todo => !todo.completed).map((todo, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text} {todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> (due: {todo.dueDate})</span>}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Completed</h2>
          <ul className="todo-list">
            {todos.filter(todo => todo.completed).map((todo, index) => (
              <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text} {todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> (due: {todo.dueDate})</span>}
              </li>
            ))}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
