import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    //BLL:
    const todolistId_1 = v1()
    const todolistId_2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodolistType>>([
        {id: todolistId_1, title: "What to learn", filter: 'all'},
        {id: todolistId_2, title: "What to buy", filter: 'all'}
    ])
    const [tasks, setTasks] = useState<TasksStateType>({
        [todolistId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistId_2]: [
            {id: v1(), title: "Water", isDone: true},
            {id: v1(), title: "Beer", isDone: false},
            {id: v1(), title: "Toilet pepper", isDone: false},
            {id: v1(), title: "Buckwheat", isDone: true},
            {id: v1(), title: "Meat", isDone: true},
        ]
    })

    function removeTask(id: string, todolistId: string) {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== id)})

        // 2-ой вариант        const copyTask = {...tasks}
        //  более простой      copyTask[todolistId] = copyTask[todolistId].filter( t => t.id !== id)
        //                     setTasks(copyTask)
    }

    function addTask(title: string, todolistId: string) {
        const newTask: TaskType = {id: v1(), title: title, isDone: false}

        setTasks({...tasks, [todolistId]: [newTask, ...tasks[todolistId]]})
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        });
    }

    function changeTodolistFilter(value: FilterValuesType, todolistId: string) {
        setTodoLists(todoLists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl))
    }

    // GUI:
    const getFilteredTasks = (tasks: Array<TaskType>, filter: FilterValuesType) => {
        let tasksForTodolist = tasks
        if (filter === "active") {
            tasksForTodolist = tasks.filter(t => !t.isDone);
        }
        if (filter === "completed") {
            tasksForTodolist = tasks.filter(t => t.isDone);
        }
        return tasksForTodolist
    }

    const removeTodoList = (todolistId: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todolistId))
        delete tasks[todolistId]
    }

    const todoListComponents = todoLists.map(tl => {
        return (
            <Todolist key={tl.id}
                      todolistId={tl.id}
                      title={tl.title}
                      filter={tl.filter}
                      tasks={getFilteredTasks(tasks[tl.id], tl.filter)}
                      removeTask={removeTask}
                      changeTodolistFilter={changeTodolistFilter}
                      addTask={addTask}
                      changeTaskStatus={changeStatus}
                      removeTodoList={removeTodoList}

            />
        )
    })

    return (
        <div className="App">
            {todoListComponents}
        </div>
    );
}

export default App;
