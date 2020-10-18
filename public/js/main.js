function main() {
    document.getElementById("loginBtn").onclick = login;
}

function login() {

    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    let error = document.getElementById("loginError");

    if (username.length === 0 || password.length === 0) {
        error.innerText = "Incorrect username or password."
        return;
    }

    return fetch("/login", {
        method:"POST",
        body:JSON.stringify({
            username: username,
            password: password
        }),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            console.log(json.authenticated);
        })
}