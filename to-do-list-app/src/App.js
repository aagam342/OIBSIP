import React, { useState } from "react";
import "./App.css";
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTask, setEditedTask] = useState({ task: "", priority: "" });
  const [taskCount, setTaskCount] = useState(tasks.length);
  const [newDueDate, setNewDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [taskNotes, setTaskNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "task") {
      setNewTask(value);
      setEditedTask((prevEditedTask) => ({
        ...prevEditedTask,
        task: value,
      }));
    } else if (name === "dueDate") {
      setNewDueDate(value);
    } else if (name === "note") {
      setNewNote(value);
    } else if (name === "priority") {
      setNewPriority(value);
      setEditedTask((prevEditedTask) => ({
        ...prevEditedTask,
        priority: value,
      }));
    }
    setSearchTerm("");
  };

  const handleAddTasks = () => {
    if (newTask.trim() !== "" && newDueDate.trim() !== "") {
      setTasks([
        ...tasks,
        {
          task: newTask,
          completed: false,
          dueDate: newDueDate,
          notes: newNote,
          priority: newPriority,
        },
      ]);
      setNewTask("");
      setTaskCount(taskCount + 1);
      setNewDueDate("");
      setNewNote("");
      setNewPriority("");
    }
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setTaskCount(taskCount - 1);
  };

  const handleSaveTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex].task = editedTask.task;
    updatedTasks[editingIndex].priority = editedTask.priority;
    setTasks(updatedTasks);
    setEditedTask({ task: "", priority: "" });
    setEditingIndex(-1);
    setNewTask("");
  };

  const handleEditTask = (index) => {
    setEditingIndex(index);
    // Set editedTask as an object with the task and priority properties
    setEditedTask({
      task: tasks[index].task,
      priority: tasks[index].priority,
    });
    // setNewDueDate(tasks[index].dueDate);
    setTaskNotes((prevNotes) => {
      const updatedTaskNotes = [...prevNotes];
      updatedTaskNotes[index] = tasks[index].notes || "";
      return updatedTaskNotes;
    });
    // setNewPriority(tasks[index].priority);
  };

  const handleToggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleClearTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
      setTaskCount(0);
    }
  };

  const handleAddNotes = (index, note) => {
    const updatedTaskNotes = [...taskNotes];
    updatedTaskNotes[index] = note;
    setTaskNotes(updatedTaskNotes);
  };

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortCriteria = (event) => {
    setSortCriteria(event.target.value);
  };

  const sortedTasks = [...tasks];

  if (sortCriteria === "dueDate") {
    sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortCriteria === "priority") {
    sortedTasks.sort((a, b) => a.priority.localeCompare(b.priority));
  }

  const filteredTasks = Array.from(
    sortedTasks.filter((task) => {
      const taskName =
        typeof task.task === "string" ? task.task.toLowerCase() : "";
      const taskNotes =
        typeof task.notes === "string" ? task.notes.toLowerCase() : "";
      const taskPriority =
        typeof task.priority === "string" ? task.priority.toLowerCase() : "";

      return (
        taskName.includes(searchTerm.toLowerCase()) ||
        taskNotes.includes(searchTerm.toLowerCase()) ||
        taskPriority.includes(searchTerm.toLowerCase())
      );
    })
  );

  const completionFilter = filteredTasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    } else if (filter === "incomplete") {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="container">
      <div className="top-section">
        <h1>To-Do List</h1>
        <div className="search-section">
          <input
            type="text"
            value={searchTerm}
            className="search-bar"
            onChange={handleSearchTerm}
            placeholder="Search Task"
          />
        </div>
      </div>
      <div className="input-container">
        <input
          type="text"
          name="task"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Task"
        />
        <input
          type="date"
          name="dueDate"
          value={newDueDate}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="note"
          value={newNote}
          onChange={handleInputChange}
          placeholder="Add a note"
        />
        <select
          name="priority"
          value={newPriority}
          onChange={handleInputChange}
          placeholder="Priority (e.g., high, medium, low)"
        >
          <option value="">Select Priority</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
        <button
          onClick={handleAddTasks}
          disabled={newTask.trim() === "" || newDueDate.trim() === ""}
        >
          Add Task
        </button>{" "}
      </div>
      <div className="header">
        <div class="categories">
          <span>Categories:</span>
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={handleFilterChange}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="completed"
              checked={filter === "completed"}
              onChange={handleFilterChange}
            />
            Completed
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="incomplete"
              checked={filter === "incomplete"}
              onChange={handleFilterChange}
            />
            Incomplete
          </label>
        </div>

        <div className="sorting">
          <span>Sorting:</span>
          <label>
            <input
              type="radio"
              name="sort"
              value="none"
              checked={sortCriteria === "none"}
              onChange={handleSortCriteria}
            />
            None
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="priority"
              checked={sortCriteria === "priority"}
              onChange={handleSortCriteria}
            />
            Priority
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="dueDate"
              checked={sortCriteria === "dueDate"}
              onChange={handleSortCriteria}
            />
            Due-Date
          </label>
        </div>
      </div>

      <div className="task-list-section">
        <ul className="task-list">
          {completionFilter.map((task, index) => (
            <li key={index} className={task.completed ? "completed" : ""}>
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    name="task"
                    value={editedTask.task} 
                    onChange={handleInputChange}
                  />

                  <input
                    type="date"
                    name="dueDate"
                    value={editedTask.dueDate}
                    onChange={(event) =>
                      setEditedTask({
                        ...editedTask,
                        dueDate: event.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    name="note"
                    value={taskNotes[index] || ""}
                    onChange={(event) =>
                      handleAddNotes(index, event.target.value)
                    }
                  />
                  <select
                    name="priority"
                    value={editedTask.priority}
                    onChange={(event) =>
                      setEditedTask({
                        ...editedTask,
                        priority: event.target.value,
                      })
                    }
                  >
                    <option value="">Select Priority</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                  <button
                    onClick={handleSaveTask}
                    disabled={
                      editedTask.task.trim() === "" ||
                      editedTask.priority.trim() === ""
                    }
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{task.task || ""}</span>
                  <span>{task.dueDate}</span>
                  <span>{task.notes}</span>
                  <span>{task.priority}</span>
                  <button
                    onClick={() => handleEditTask(index)}
                    disabled={editingIndex !== -1}
                  >
                    Edit
                  </button>
                </>
              )}

              <button onClick={() => handleRemoveTask(index)}>Remove</button>
              <button onClick={() => handleToggleCompletion(index)}>
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bottom-section">
        <span className="total-task-count">Total Task Count: {taskCount}</span>
        <button onClick={handleClearTasks} className="clear-button">
          Clear All Tasks
        </button>
      </div>
    </div>
  );
}

export default App;
