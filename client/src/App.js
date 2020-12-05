import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    });
    this.socket.on('updateData', (tasks) => {
      this.updateData(tasks);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id)
    });
  }

  removeTask(id, isLocal) {
    const { tasks } = this.state;
    this.setState({
      tasks: tasks.filter((task) => task.id !== id)
    });
    if (isLocal) {
      this.socket.emit('removeTask', id);
    }
  }

  updateTask(value) {
    this.setState({ taskName: value });

  }

  submitForm(e) {
    e.preventDefault();
    const { taskName } = this.state;
    const newTask = { name: taskName, id: uuidv4() };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
  }

  addTask(newTask) {
    const { tasks } = this.state;
    this.setState({ tasks: [...tasks, newTask] });

  }
  updateData(tasksList) {
    this.setState({ tasks: tasksList });
  }
  render() {
    const { tasks } = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className="task" >
                {task.name}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(task.id, true)}>
                  Remove
                 </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={e => this.submitForm(e)}>
            <input
              className="text-input"
              autocomplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              onChange={(e) => this.updateTask(e.target.value)} />
            <button
              className="btn"
              type="submit"
            >
              Add
              </button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;
