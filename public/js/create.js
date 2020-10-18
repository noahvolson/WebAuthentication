function main() {
    document.getElementById("createBtn").onclick = createUser;
}

async function createUser() {

    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    let error = document.getElementById("createError");

    let lowerAlphabetical = new RegExp("^(?=.*[a-z])");
    let upperAlphabetical = new RegExp("^(?=.*[A-Z])");
    let numericCharacter = new RegExp("^(?=.*[0-9])");
    let specialCharacter = new RegExp("^(?=.*[!@#\$%\^&\*])");

    let taken = false;
    await userExists(username).then(result => {
        if (result.userexists) {
            taken = true;
        }
    })

    if (taken) {
        error.innerText = "Username taken.";
    }
    else if (username.length === 0) {
        error.innerText = "Invalid username.";
    }
    else if (password.length < 8) {
        error.innerText = "Password must eight characters or longer.";
    }
    else if (password.length > 24) {
        error.innerText = "Password must be less than 24 characters.";
    }
    else if (!lowerAlphabetical.test(password)) {
        error.innerText = "Password must contain at least one lowercase letter.";
    }
    else if (!upperAlphabetical.test(password)) {
        error.innerText = "Password must contain at least one uppercase letter.";
    }
    else if (!numericCharacter.test(password)) {
        error.innerText = "Password must contain at least one number.";
    }
    else if (!specialCharacter.test(password)) {
        error.innerText = "Password must contain at least one special character (!@#$%^&*).";
    }
    else {
        error.innerText = "";
    }

    if (error.innerText !== "") { //Error has been set by something else
        return;
    }

    console.log("Adding user...")
    addUser({username: username, password: password}).then((result) => {
        window.location.href = "index.html";
    })
}

function userExists(username) {

    return fetch("/userexists", {
        method:"POST",
        body:JSON.stringify({ username: username }),
        headers: { "Content-Type": "application/json"}
    })
        .then(response => response.json())
        .catch(() => window.alert("You have reached your daily attempt limit!\n\nPlease try again in 24 hours\n "))
        .then(json => {
            return json
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