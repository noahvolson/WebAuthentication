function main() {
    document.getElementById("createBtn").onclick = createClicked;
}

async function createClicked() {

    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    let message = document.getElementById("messageInput").value;

    console.log("Adding user...")
    addUser({username: username, password: password, message: message}).then((result) => {
        if (result.error) {
            document.getElementById("createError").innerText = result.error;
        }
        else {
            window.location.href = "index.html";
            sessionStorage.setItem("newlyCreated", "true")
        }
    })
}

function addUser(user) {
    return fetch("/adduser", {
        method:"POST",
        body:JSON.stringify(user),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
}