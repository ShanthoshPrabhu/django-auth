import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getSession();
  }, []);

  const getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const nameChange = (event) => {
    setUsername(event.target.value);
  };

  const isResponseOk = (response) => {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  };

  const login = (event) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUsername("");
        setPassword("");
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError("Wrong username or password.");
      });
  };

  const logout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!isAuthenticated) {
    return (
      <div >
        <h1>Django Auth</h1>
        <br />
        <h2>Login</h2>
        <form onSubmit={login}>
          <div >
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={nameChange}
            />
          </div>
          <div >
            <label htmlFor="username">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={passwordChange}
            />
            <div>
              {error && <small >{error}</small>}
            </div>
          </div>
          <button type="submit" >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div >
      <h1>React Cookie Auth</h1>
      <p>You are logged in!</p>
      <button onClick={whoami}>
        Who Am I
      </button>
      <button onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default App;
