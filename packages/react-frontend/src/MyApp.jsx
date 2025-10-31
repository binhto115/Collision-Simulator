// src/MyApp.jsx
import Table from "./Table";
import Form from "./Form";
import React, {useState, useEffect} from "react";

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



export default MyApp;