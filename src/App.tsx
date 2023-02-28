import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
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

interface CountDownTimerProps {
  startDateMs: number;
  targetDateMs: number;
  isTaskCompleted: boolean;
}

interface ShowCounterProps {
  hours: number;
  minutes: number;
  seconds: number;
}

const TaskForm = ({ addTask }: TaskFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<string>("00:00");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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
};

const getReturnValues = (countDown: number) => {
  const hours: number = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes: number = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds: number = Math.floor((countDown % (1000 * 60)) / 1000);

  return [hours, minutes, seconds];
};

const useCountdown = (targetDateMs: number): number[] => {
  const countDownDateMs: number = new Date(targetDateMs).getTime();

  const [countDown, setCountDown] = useState<number>(
    countDownDateMs - new Date().getTime()
  );

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountDown(countDownDateMs - new Date().getTime());
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [countDownDateMs]);

  return getReturnValues(countDown);
};

const ShowCounter = ({ hours, minutes, seconds }: ShowCounterProps) => {
  const paddedHourStr: string = hours.toString().padStart(2, "0");
  const paddedMinStr: string = minutes.toString().padStart(2, "0");
  const paddedSecStr: string = seconds.toString().padStart(2, "0");
  return <span>{`${paddedHourStr}:${paddedMinStr}:${paddedSecStr}`}</span>;
};

const CountdownTimer = ({ startDateMs, targetDateMs, isTaskCompleted }: CountDownTimerProps) => {
  const [hours, minutes, seconds]: number[] = useCountdown(targetDateMs);

  const leastPercent: number = 10;
  const totalTime: number = targetDateMs - startDateMs;
  const currentTime: number = new Date().getTime();
  const progress: number = currentTime - startDateMs;
  const currentPercentage: number = (progress / totalTime) * 100;

  if (hours <= 0 && minutes <= 0 && seconds <= 0) {
    return <span>Time for this task is up!</span>;
  } else if (currentPercentage <= leastPercent && !isTaskCompleted) {
    return (
      <span style={{
        backgroundColor: "red"
      }}>
        You have very little time left! Complete this task quickly, as you
        are taking time away from the next task (if any)!
      </span>
    );
  } else {
    return (
      <ShowCounter
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

const Task = ({ task, roleChoice, removeTask, completeTask, index }: TaskProps) => {
  const currentDate: Date = new Date();
  const [targetHoursStr, targetMinutesStr]: string[] = task.time.split(":");
  const targetHours: number = Number(targetHoursStr);
  const targetMinutes: number = Number(targetMinutesStr);
  const targetDate: Date = currentDate;
  targetDate.setHours(currentDate.getHours() + targetHours);
  targetDate.setMinutes(currentDate.getMinutes() + targetMinutes);
  targetDate.setSeconds(currentDate.getSeconds());
  const targetDateMs: number = targetDate.getTime();

  const taskWritingStyle: { textDecoration: string } = {
    textDecoration: task.isCompleted ? "line-through" : "none"
  };

  return (
    <div className="task">
      <button onClick={() => completeTask(index)}>Complete</button>
      <p style={taskWritingStyle}>{task.title}</p>
      <p style={taskWritingStyle}>{task.description}</p>
      <p>
        <CountdownTimer
          startDateMs={currentDate.getTime()}
          targetDateMs={targetDateMs}
          isTaskCompleted={task.isCompleted}
        />
      </p>
      {roleChoice === "parent" ?
        <button onClick={() => removeTask(index)}>Delete</button>
        :
        <button disabled>Delete</button>}
    </div>
  );
}

const TaskList = ({ tasks, roleChoice, removeTask, completeTask }: TaskListProps) => {
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

const App = () => {
  const [selected, setSelected] = useState({
    value: "child"
  });

  const [tasks, setTasks] = useState<TaskType[]>([]);

  const addTask = (task: TaskType) => {
    const newTasks: TaskType[] = [...tasks, {
      ...task
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
