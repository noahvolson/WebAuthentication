function main() {
    console.log("Hello World!");
    document.getElementById("loginBtn").onclick = login;
}

function login() {
    console.log("Log in requested");
    return fetch("/login", {
        method:"POST",
        body:JSON.stringify({
            username: document.getElementById("usernameInput").value,
            password: document.getElementById("passwordInput").value
        }),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
}