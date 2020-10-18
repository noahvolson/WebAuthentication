function main() {
    document.getElementById("submitBtn").onclick = addUser;
}

async function addUser() {

    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    let error = document.getElementById("createError");


    let lowerAlphabetical = new RegExp("^(?=.*[a-z])");
    let upperAlphabetical = new RegExp("^(?=.*[A-Z])");
    let numericCharacter = new RegExp("^(?=.*[0-9])");
    let specialCharacter = new RegExp("^(?=.*[!@#\$%\^&\*])");

    if (username.length === 0) {
        error.innerText = "Invalid username.";
    }
    else if (password.length < 8) {
        error.innerText = "Password must eight characters or longer";
    }
    else if (!lowerAlphabetical.test(password)) {
        error.innerText = "Password must contain at least one lowercase letter";
    }
    else if (!upperAlphabetical.test(password)) {
        error.innerText = "Password must contain at least one uppercase letter";
    }
    else if (!numericCharacter.test(password)) {
        error.innerText = "Password must contain at least one number";
    }
    else if (!specialCharacter.test(password)) {
        error.innerText = "Password must contain at least one special character (!@#$%^&*)";
    }
    else {
        error.innerText = "";
    }

    console.log(await userExists())

    console.log("Adding user...")
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