import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import TimeField from "react-simple-timefield";
import "./App.css";

interface TaskType {
  title: string;
  description: string;
  time: string,
  isCompleted: boolean
}

interface TaskProps {
  task: TaskType;
  roleChoice: string;
  removeTask: Function;
  completeTask: Function;
  index: number;
}

interface TaskListProps {
  tasks: TaskType[];
  roleChoice: string;
  removeTask: Function;
  completeTask: Function;
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

    addTask(task);
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

function Task({ task, roleChoice, removeTask, completeTask, index }: TaskProps) {
  return (
    <div className="task">
      <button onClick={() => completeTask(index)}>Complete</button>
      <p style={{
        textDecoration: task.isCompleted ? "line-through" : "none"
      }}>{task.title}</p>
      <p style={{
        textDecoration: task.isCompleted ? "line-through" : "none"
      }}>{task.description}</p>
      <p>{task.time}</p>
      {roleChoice === "parent" ?
        <button onClick={() => removeTask(index)}>Delete</button>
        :
        <button disabled>Delete</button>}
    </div>
  );
}

function TaskList({ tasks, roleChoice, removeTask, completeTask }: TaskListProps) {
  return (
    <ul className="task-list" style={{
      listStyleType: "none",
      marginRight: "100px",
      marginLeft: "70px"
    }}>
      {tasks.map((task, index) => (
        <li key={index}>
          <Task
            task={task}
            roleChoice={roleChoice}
            removeTask={removeTask}
            index={index}
            completeTask={completeTask}
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

  const [tasks, setTasks] = useState<TaskType[]>([]);

  const calculateTimesLeft = useCallback(() => {
    const destinationTimes: Date[] = tasks.map(task => new Date(task.time));
    const timeDifferences: number[] = destinationTimes.map(destTime => (
      Number(destTime) - Number(new Date())
    ));

    const timesLeft = timeDifferences.map(difference => {
      let result;
      if (difference > 0) {
        result =  {
          hours: Math.floor((difference / (1000 * 60 * 60 * 24)) % 24),
          minutes: Math.floor((difference / 1000 * 60) % 60)
        };
      }
      return result;
    });

    return timesLeft;
  }, [tasks]);

  const [timesLeft, setTimesLeft] = useState(calculateTimesLeft());

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

  const completeTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = true;
    setTasks(newTasks);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimesLeft(calculateTimesLeft());
      let newTasks:TaskType[] = [...tasks];
      newTasks = newTasks.map(task => {
        task.time = timesLeft.toString();
        return {
          title: task.title,
          description: task.description,
          time: task.time,
          isCompleted: task.isCompleted
        };
      });
      setTasks(newTasks);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tasks, timesLeft, calculateTimesLeft]);

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
          <TaskList
            tasks={tasks}
            roleChoice="parent"
            removeTask={removeTask}
            completeTask={completeTask}
          />
        </>
        :
        <TaskList
          tasks={tasks}
          roleChoice="child"
          removeTask={removeTask}
          completeTask={completeTask}
        />
      }
    </>
  );
}

export default App;
