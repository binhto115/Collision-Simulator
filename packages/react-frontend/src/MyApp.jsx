import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

export default function MyApp() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [job, setJob] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/users`)
      .then(r => r.json())
      .then(j => setRows(j.users_list ?? []))
      .catch(console.error);
  }, []);

  function addUser(e) {
    e.preventDefault();
    fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, job })
    })
      .then(r => {
        if (r.status !== 201) throw new Error(`Expected 201, got ${r.status}`);
        return r.json();
      })
      .then(created => setRows(prev => [...prev, created]))
      .then(() => { setName(""); setJob(""); })
      .catch(console.error);
  }

  function remove(id) {
    fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" })
      .then(r => {
        if (r.status === 204) setRows(prev => prev.filter(x => x.id !== id));
      })
      .catch(console.error);
  }

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Collision Simulator (demo)</h1>

      <form onSubmit={addUser} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input placeholder="name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="job" value={job} onChange={e => setJob(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Job</th><th>Remove</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.job}</td>
              <td><button onClick={() => remove(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
