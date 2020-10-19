function main() {
    fetch("/mydata")
        .then(response => response.json())
        .then(json => {
            document.getElementById("welcomeMsg").innerText = "Welcome " + json.username;
            document.getElementById("yourSecretMsg").innerText = json.message;
        })
}