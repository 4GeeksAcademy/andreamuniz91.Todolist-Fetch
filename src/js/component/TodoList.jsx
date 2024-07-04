import React, { useEffect, useState } from "react";


export const TodoList = () => {

    const [valueInput, setValueInput] = useState('');
    const [todo, setTodo] = useState([]);
    //editar una tarea

    const host = 'https://playground.4geeks.com/todo';
    const user = 'Andrea';



    const handleSubmit = (event) => {
        event.preventDefault();
        if (valueInput.trim() !== "") {
            const dataToSend = {
                label: valueInput,
                is_done: false,
            }
            createTask(dataToSend);
            setValueInput('');
        }
    }


    const getList = async () => {
        const uri = `${host}/users/${user}`;
        const options = {
            method: 'GET'
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return
        }
        const data = await response.json()
        console.log(data);
        setTodo(data.todos);
        return data
    }
    const createUser = async () => {
        const uri = `${host}/users/${user}`;
        const createNewUser = {
            username: { user }
        };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createNewUser)
        };
        try {
            const response = await fetch(uri, options);
            const data = await response.json()
            
            if (!response.ok) {
                console.log('Error:', response.status, response.statusText);
                if (response.status === 404) {
                    console.log("Creando user");
                    return data;
                }else if(response.status === 400){
                    console.log("Usuario ya existe");
                    return data;
                }
                return;
            }
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
            return;
        }
    }

    const createTask = async (data) => {
        const uri = `${host}/todos/${user}`;
        const options = {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(uri, options)
        console.log(response);
        const data2 = await response.json()       
        getList();
    };

    const deleteTask = async (id) => {
        const uri = `${host}/todos/${id}`;
        const opstions = {
            method: 'DELETE'
        }
        const response = await fetch(uri, opstions);
        if (!response.ok) {
            console.log('Error', response.status, response.statusText);
        }
        getList()
    }

    const updateTask = async (id) => {
        const uri = `${host}/todos/${id}`
        const change = {
            "label": valueInput,
            "is_done": false
        }
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(change),
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return
        }
        const data = await fetch(uri, options);
        getList()
        return data;
    }

    useEffect(() => {
        createUser();
        getList();
    }, [])

    return (
        <div className="container">
          <h1 clasName="fs 5 m-5">Las tareas de clase</h1>
            <form className="justify-content-center" onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center">
                    <input type="text" className="form-control" id="exampleInputEmail1" value={valueInput} onChange={(event) => setValueInput(event.target.value)} placeholder="Task" />
                </div>
                    <h4 className={todo.length == 0 ? "" : "d-none"}>La alumna {user}, no tiene tareas pendiente.</h4>

                    <ul className="list-group mt-3">
                        {todo.map((item) =>
                            <li className="list-group-item d-flex justify-content-between" key={item.id}>
                                {item.label}
                                {/* <input type="text" className="form-control" id="exampleInputEmail1" value={valueInput} onChange={(event) => setValueInput(event.target.value)} placeholder="Task"/> */}
                                <div className="d-flex">
                                <button type="button" onClick={() => updateTask(item.id)} className="btn btn-primary me-3"><i className="fas fa-edit"></i></button>
                                <button type="button" onClick={() => deleteTask(item.id)} className="btn btn-primary"><i className="fas fa-trash"></i></button>

                                </div>
                            </li>
                        )

                        }
                    </ul>

                <div className="row d-flex justify-content-center">
                    <div className="col-xs-auto col-md-6 text-end mt-3">{todo.length} task</div>
                </div>
            </form>
        </div>
    );
};