import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Input from './components/input';
import Todo from './components/todo';

function App() {

  const baseURL = "http://localhost:8080"

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");


  useEffect(() => {
    getTodos();
  }, [])

  async function getTodos() {
    await axios
      .get(baseURL + "/todo")
      .then((response) => { setTodos(response.data) })
      .catch((error) => { console.log(error) })
  }

  function changeText(e) {
    e.preventDefault();
    setInput(e.target.value);
    console.log(input);
  }

  function insertTodo(e) {
    e.preventDefault();

    const insertTodo = async () => {
      await axios
        .post(baseURL + "/todo", {
          todoName: input
        })
        .then((response) => {
          console.log(response);
          setInput("");
          getTodos();
        })
        .catch((error) => {
          console.log(error);
        })
    }
    insertTodo();
    console.log("할 일 추가됨");
  }

  function updateTodo(id) {
    const updateTodo = async () => {
      await axios
        .put(baseURL + "/todo/" + id, {})
        .then((response) => {
          console.log(response.data)
          // 화면에서 바꾸자. 디비까지 접근하기에는 너무 비용이 크다.
          setTodos(
            todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
          )
        })
        .catch((error) => {
          console.log(error);
        })
    }
    updateTodo();
  }

  function deleteTodo(id) {
    const deleteTodo = async () => {
      await axios
        .delete(baseURL + "/todo/" + id, {})
        .then((response) => {
          console.log(response);
          setTodos(
            todos.filter((todo) => todo.id !== id)
          )
        })
        .catch((error) => {
          console.log(error);
        })
    }
    deleteTodo();
  }

  return (
    <div className="App">
      <h1>To Do List</h1>
      <Input handleChange={changeText} input={input} handlesubmit={insertTodo} />
      {
        todos
          ? todos.map((todo) => {
            return (
              <Todo key={todo.id} todo={todo} handleClick={()=>updateTodo(todo.id)} handleDelete={() => deleteTodo(todo.id)}/>
            )
          }) : null
      }

    </div>
  );
}

export default App;
