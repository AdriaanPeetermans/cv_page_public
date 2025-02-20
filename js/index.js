function loadScript() {
    // Attach listener to email button:
    let emailButton = document.getElementById("show_email_box");
    emailButton.addEventListener("click", showEmail);
}

function showEmail() {
    let emailLink = document.getElementById("email_link");
    let emailBox = document.getElementById("email_box");
    let showEmailBox = document.getElementById("show_email_box");
    if (showEmailBox.innerHTML == "Show email") {
        emailLink.href = "mailto:adriaanpeetermans@live.be";
        emailLink.innerHTML = "adriaanpeetermans@live.be";
        emailBox.style.display = "flex";
        emailBox.style.opacity = 1;
        showEmailBox.innerHTML = "Hide email";
    }
    else {
        emailLink.href = "";
        emailLink.innerHTML = "";
        emailBox.style.display = "none";
        emailBox.style.opacity = 0;
        showEmailBox.innerHTML = "Show email";
    }
}