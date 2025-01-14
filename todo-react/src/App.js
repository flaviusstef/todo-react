import React, { useState, useEffect } from 'react';

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

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={addTodo}>
          <input type="text" name="todo" placeholder="Add a new todo" required />
          <button type="submit">Add</button>
        </form>
        <section>
          <h2>Tasks to do</h2>
          <ul>
            {todos.filter(todo => !todo.completed).map((todo, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Completed</h2>
          <ul>
            {todos.filter(todo => todo.completed).map((todo, index) => (
              <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text}
              </li>
            ))}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
