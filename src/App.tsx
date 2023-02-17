import React, { ChangeEvent, useState } from "react";
import TimeField from "react-simple-timefield";
import "./App.css";

interface TaskType {
  title: string;
  description: string;
  time: string
}

interface TaskFormProps {
  addTask: Function;
}

function TaskForm({ addTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("00:00");

  const handleSubmit = (e:SubmitEvent) => {
    e.preventDefault();
    if (!title || !description || !time) {
      return;
    }

    const task: TaskType = {
      title: title,
      description: description,
      time: time
    };

    addTask(task);
    setTitle("");
    setDescription("");
    setTime("00:00");
  };

  return (
    <form onSubmit={() => handleSubmit}>
      <br />
      <label htmlFor="title">Task Title:</label>
      <input
        type="text"
        name="title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label htmlFor="description">Task Description:</label>
      <input
        type="text"
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label htmlFor="time">Task Completion Time:</label>
      <TimeField
        value={time}
        onChange={e => setTime(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

function Task({ task }: { task: TaskType }) {
  return (
    <div className="task">
      {task.title}
    </div>
  );
}

function TaskList({ tasks }: { tasks: TaskType[] }) {
  return (
    <ul className="task-list" style={{
      listStyleType: "none"
    }}>
      {tasks.map((task, index) => (
        <li key={index}>
          <Task
            task={task}
          />
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [selected, setSelected] = useState({
    value: "child"
  });

  const [tasks, setTasks] = useState([{
    title: "",
    description: "",
    time: "00:00"
  }]);

  const addTask = (task: TaskType) => {
    const newTasks = [...tasks, {
      title: task.title,
      description: task.description,
      time: task.time
    }];
    setTasks(newTasks);
  };

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSelected({
      value: e.target.value
    });
  };

  return (
    <>
      <form>
        <label>
          <input
            type="radio"
            name="child"
            checked={selected.value === "child"}
            onChange={handleChange}
            value="child"
          />
          Child
        </label>
        <br />

        <label>
          <input
            type="radio"
            name="parent"
            checked={selected.value === "parent"}
            onChange={handleChange}
            value="parent"
          />
          Parent
        </label>
      </form>

      {selected.value === "parent" ?
        <TaskForm addTask={addTask} />
        :
        <TaskList tasks={tasks} />
      }
    </>
  );
}

export default App;
