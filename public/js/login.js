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
        .catch(() => window.alert("You have reached your daily attempt limit!\n\nPlease try again in 24 hours\n "))
        .then(authenticated => {
            console.log(authenticated);
        })
}