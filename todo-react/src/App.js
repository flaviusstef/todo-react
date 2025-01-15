import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    const newTodo = {
      text: event.target.elements.todo.value,
      completed: false,
      dueDate: event.target.elements.dueDate.value || null,
      category: event.target.elements.category.value || '',
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    event.target.reset();
    setShowForm(false);
  };

  const addCategory = (event) => {
    event.preventDefault();
    const newCategory = event.target.elements.category.value;
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    event.target.reset();
    setShowCategoryForm(false);
  };

  const editCategory = (index, newCategory) => {
    const updatedCategories = categories.map((category, i) => {
      if (i === index) {
        return newCategory;
      }
      return category;
    });
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const deleteCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
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
        <button onClick={() => setShowForm(true)}>Add task</button>
        <button onClick={() => setShowCategoryForm(true)}>Manage categories</button>
        <Modal
          isOpen={showForm}
          onRequestClose={() => setShowForm(false)}
          contentLabel="Add Task"
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <form onSubmit={addTodo}>
            <label htmlFor="todo">Task</label>
            <input type="text" name="todo" placeholder="Add a new todo" required />
            <label htmlFor="dueDate">Due Date</label>
            <input type="date" name="dueDate" placeholder="Due date (optional)" />
            <label htmlFor="category">Category</label>
            <select name="category">
              <option value="">None</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <button type="submit" className="primary">Add</button>
            <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </Modal>
        <Modal
          isOpen={showCategoryForm}
          onRequestClose={() => setShowCategoryForm(false)}
          contentLabel="Manage Categories"
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <form onSubmit={addCategory}>
            <label htmlFor="category">Category</label>
            <input type="text" name="category" placeholder="Add a new category" required />
            <button type="submit" className="primary">Add</button>
            <button type="button" className="secondary" onClick={() => setShowCategoryForm(false)}>Cancel</button>
          </form>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                {category}
                <button onClick={() => editCategory(index, prompt('Edit category', category))}>Edit</button>
                <button onClick={() => deleteCategory(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </Modal>
        <section>
          <h2>Filter by Category</h2>
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="">All</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </section>
        <section>
          <h2>Tasks to do</h2>
          <ul className="todo-list">
            {todos.filter(todo => !todo.completed && (selectedCategory === '' || todo.category === selectedCategory)).map((todo, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text} {todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> ( due: {todo.dueDate})</span>}
                {todo.category && <span> [Category: {todo.category}]</span>}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Completed</h2>
          <ul className="todo-list">
            {todos.filter(todo => todo.completed && (selectedCategory === '' || todo.category === selectedCategory)).map((todo, index) => (
              <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                {todo.text} {todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> ( due: {todo.dueDate})</span>}
                {todo.category && <span> [Category: {todo.category}]</span>}
              </li>
            ))}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
