import { ChangeEvent, FormEvent, useState } from "react";
import TimeField from "react-simple-timefield";
import "./App.css";

interface TaskType {
  title: string;
  description: string;
  time: string,
  isCompleted: boolean
}

interface TaskListProps {
  tasks: TaskType[];
  roleChoice: string;
  removeTask: Function;
}

interface TaskFormProps {
  addTask: Function;
}

function TaskForm({ addTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("00:00");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !time) {
      return;
    }

    const task: TaskType = {
      title: title,
      description: description,
      time: time,
      isCompleted: isCompleted
    };

    if (title !== "" && description !== "" && time !== "00:00") {
      addTask(task);
    }
    setTitle("");
    setDescription("");
    setIsCompleted(false);
    setTime("00:00");
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <p style={{
        textDecoration: task.isCompleted ?
          "line-through"
          :
          "none"
      }}>{task.title}</p>
      <p style={{
        textDecoration: task.isCompleted ?
          "line-through"
          :
          "none"
      }}>{task.description}</p>
      <p>{task.time}</p>
    </div>
  );
}

function TaskList({ tasks, roleChoice, removeTask }: TaskListProps) {
  return (
    <ul className="task-list" style={{
      listStyleType: "none",
      backgroundColor: "lightblue",
      marginRight: "100px",
      marginLeft: "70px"
    }}>
      {tasks.map((task, index) => (
        <>
          <li key={index}>
            <>
              <input type="checkbox" onChange={(e:ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  task.isCompleted = true;
                }
              }}
              />
              <Task
                task={task}
              />
              {roleChoice === "parent" ?
                <button onClick={() => removeTask(index)}>Delete</button>
                :
                <></>}
            </>
          </li>
        </>
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
    time: "00:00",
    isCompleted: false
  }]);

  console.log(`tasks: ${tasks.map(task => console.log(task))}`);

  const addTask = (task: TaskType) => {
    const newTasks: TaskType[] = [...tasks, {
      title: task.title,
      description: task.description,
      time: task.time,
      isCompleted: task.isCompleted
    }];
    setTasks(newTasks);
  };

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSelected({
      value: e.target.value
    });
  };

  const removeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  }

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
        <>
          <TaskForm addTask={addTask} />
          <TaskList tasks={tasks} roleChoice="parent" removeTask={removeTask} />
        </>
        :
        <TaskList tasks={tasks} roleChoice="child" removeTask={removeTask} />
      }
    </>
  );
}

export default App;
