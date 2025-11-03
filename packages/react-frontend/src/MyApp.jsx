// src/MyApp.jsx
import React, {useState, useEffect} from "react";
import Table from "./Components/Table";
import Form from "./Components/Form";
import LoginForm from './LoginPage/LoginForm';
import SignUpForm from "./LoginPage/SignUpForm";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Dashboard Page (Form.jsx + Table.jsx)
function DashBoard({ characters, removeOneCharacter, updateList}) {
    return (
        <div className="container">
            <Table 
            characterData={characters}
            removeCharacter={removeOneCharacter}
            />
        
            <Form handleSubmit={updateList}/>
        </div>
    );
}

function MyApp() {
    const [characters, setCharacters] = useState([]);
    
    function removeOneCharacter(index) {
        const userToDelete = characters[index];

        fetch(`http://localhost:8000/users/${userToDelete._id}`, {
            method: "DELETE"
        })
        .then((res) => {
            if (res.status == 204) {
                const updated = characters.filter((_, i) => i !== index);
                setCharacters(updated);
            } else if (res.status == 404) {
                alert("Resource not found\n");
            } else {
                throw new Error("Failed to delete user\n");
            }
        })
        .catch((error) => console.log(error));
    }

    function updateList(person) { 
        postUser(person)
            .then((res) => {
                if (res.status == 201) {
                    return res.json(); // gets the created object
                } else {
                    throw new Error(`Failed to add new user. Status: ${res.status}\n`)
                }
            })
            .then((newUser) => setCharacters([...characters, newUser]))
            .catch((error) => {
                console.log(error);
            })
    }

    function fetchUsers() {
        console.log("Fetching users from backend...\n");
        const promise = fetch("http://localhost:8000/users");
        return promise;

    }

    useEffect(() => { 
        fetchUsers()
                .then((res) => res.json())
                .then((json) => setCharacters(json["users_list"]))
                .catch((error) => {console.log(error);});
    }, []);

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        }
    );

    return promise;
    }

    // --- Render the routes ---
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />

                <Route path="/signup" element={<SignUpForm />} />

                <Route
                path="/dashboard"
                element={
                    <DashBoard
                    characters={characters}
                    removeOneCharacter={removeOneCharacter}
                    updateList={updateList}
                    />
                }
                />
            </Routes>
        </BrowserRouter>
    );
}



export default MyApp;