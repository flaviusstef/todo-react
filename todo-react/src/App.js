import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Modal,
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material';
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
        <Typography variant="h1" className="App-logo">ToDoDoDo</Typography>
        <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>Add task</Button>
        <Button variant="contained" color="secondary" onClick={() => setShowCategoryForm(true)}>Manage categories</Button>
        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          aria-labelledby="add-task-modal"
        >
          <Box className="ReactModal__Content">
            <form onSubmit={addTodo}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="todo">Task</InputLabel>
                <TextField id="todo" name="todo" placeholder="Add a new todo" required />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="dueDate">Due Date</InputLabel>
                <TextField id="dueDate" name="dueDate" type="date" placeholder="Due date (optional)" />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="category">Category</InputLabel>
                <Select id="category" name="category">
                  <MenuItem value="">None</MenuItem>
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">Add</Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={showCategoryForm}
          onClose={() => setShowCategoryForm(false)}
          aria-labelledby="manage-categories-modal"
        >
          <Box className="ReactModal__Content">
            <form onSubmit={addCategory}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="category">Category</InputLabel>
                <TextField id="category" name="category" placeholder="Add a new category" required />
              </FormControl>
              <Button type="submit" variant="contained" color="primary">Add</Button>
              <Button type="button" variant="contained" color="secondary" onClick={() => setShowCategoryForm(false)}>Cancel</Button>
            </form>
            <List>
              {categories.map((category, index) => (
                <ListItem key={index}>
                  <ListItemText primary={category} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => editCategory(index, prompt('Edit category', category))}>
                      Edit
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteCategory(index)}>
                      Delete
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>
        <section>
          <Typography variant="h2">Filter by Category</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="filter-category">Category</InputLabel>
            <Select id="filter-category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </section>
        <section>
          <Typography variant="h2">Tasks to do</Typography>
          <List className="todo-list">
            {todos.filter(todo => !todo.completed && (selectedCategory === '' || todo.category === selectedCategory)).map((todo, index) => (
              <ListItem key={index}>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                <ListItemText primary={todo.text} secondary={todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> ( due: {todo.dueDate})</span>} />
                {todo.category && <ListItemText secondary={`[Category: ${todo.category}]`} />}
              </ListItem>
            ))}
          </List>
        </section>
        <section>
          <Typography variant="h2">Completed</Typography>
          <List className="todo-list">
            {todos.filter(todo => todo.completed && (selectedCategory === '' || todo.category === selectedCategory)).map((todo, index) => (
              <ListItem key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                <ListItemText primary={todo.text} secondary={todo.dueDate && <span className={isPastDue(todo.dueDate) ? 'due-date-past-due' : ''}> ( due: {todo.dueDate})</span>} />
                {todo.category && <ListItemText secondary={`[Category: ${todo.category}]`} />}
              </ListItem>
            ))}
          </List>
        </section>
      </header>
    </div>
  );
}

export default App;
