// * Initialize localStorage for users by using an array of user objects to stored it 
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));}

// In order to show or hide errorDisplay, you must modify its display style attribute.
function showError(message) {
    errorDisplay.style.display = "block";
    const errorItem = document.createElement("p");
    errorItem.textContent = message;
    errorDisplay.appendChild(errorItem);
    
}



function hideError() {
    // Clear all error messages
    errorDisplay.innerHTML = "";
    errorDisplay.style.display = "none";
}


// Part 3: Registration Form Validation Requirements
//I added the validation on both HTML and JavaScript it depend on what easier for me

const registrationForm = document.getElementById("registration");
const userName = registrationForm.elements["username"];
const email = registrationForm.elements["email"];
const password = registrationForm.elements["password"];
const confirmPassword = registrationForm.elements["passwordCheck"];
const terms = registrationForm.elements["terms"];
const errorDisplay = document.getElementById("errorDisplay");

// I used the "Inpute" event listener because it provide immediate feedback to the user while they’re filling out the form
registrationForm.addEventListener("input", function (e) {
    const field = e.target;
    hideError(); // Clear previous error message

    const uName = userName.value.trim();
    const uniqueChar = new Set(uName).size;
    const uEmail = email.value.trim();
    const pwd = password.value.trim();
    const confPwd = confirmPassword.value.trim();

    

    // 1- Registration Form - Username Validation:
    if (field === userName) {
        // * The username must be at least four characters long
        if (uName.length < 4) {
            showError("Username must be at least 4 characters long.");
            return;
        }

        // * The username must contain at least two unique characters.
        if (uniqueChar < 2) {
            showError("The username must contain at least two unique characters.");
            return;
        }

        // * The username cannot contain any special characters or whitespace
        if (!/^[a-zA-Z0-9]+$/.test(uName)) {
            showError("The username cannot contain any special characters or whitespace.");
            return;
        }
        if (!isUsernameUnique(uName)) {
        showError("That username is already taken.");
        return;
        }
    } else if (field === email) {
        ///////////////////////////////////////
        // 2- Registration Form - Email Validation:
        // * The email must be a valid email address.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uEmail)) {
            showError("The email must be a valid email address : abc123@example.com ");
            return;
        }

        // * The email must not be from the domain "example.com."

        if (uEmail.toLowerCase().endsWith("example.com")) {
            showError(" Emails from 'example.com' are not allowed.");
            return;
        }
    } else if (field === password || field === confirmPassword) {
        ///////////////////////////////////////
        // 3- Registration Form - Password Validation:   
        // * Passwords must be at least 12 characters long.
        if (pwd.length < 12) {
            showError("Passwords must be at least 12 characters long");
            return;
        }
        // * Passwords must have at least one uppercase and one lowercase letter, one number and one special character
        if (!(/[a-z]/.test(pwd)) || !(/[A-Z]/.test(pwd)) || !(/[0-9]/.test(pwd)) || !(/[^A-Za-z0-9]/.test(pwd))) {
            showError("Passwords must have at least one uppercase and one lowercase letter, one number and one special character ");
            return;
        }
        // * Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).
        if (pwd.toLowerCase().includes("password")) {
            showError("Passwords cannot contain the word `Password` ");
            return;
        }
        // * Passwords cannot contain the username.
        if (pwd.toLowerCase().includes(uName.toLowerCase())) {
            showError("Passwords cannot contain the username");
            return;
        }
        // * Both passwords must match.
        if (pwd !== confPwd) {
            showError("Passwords do not match");
            return;
        }
    } else if (field === terms) {
        ///////////////////////////////////////
        //4-  Registration Form - Terms and Conditions:
        // * The terms and conditions must be accepted.
        if (!(terms.checked)) {
            showError("You must accept the terms and conditions");
            terms.focus();
            return;
        }
    }
    
});


///////////////////////////////////////
//Registration Form - Form Submission:
//5-  Registration Form - Terms and Conditions:
// * check if the username already exists in localStorage:  
function isUsernameUnique(username) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return !users.some(user => user.username === username.toLowerCase()); 
}

// * Store Validated Data Locally, store the username, email, and password 
function saveUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ username: username.toLowerCase(), email: email.toLowerCase(), password });
    localStorage.setItem("users", JSON.stringify(users)); // Update localStorage
}

// * Clear all form fields after successful submission and show a success message.
function clearForm() {
    registrationForm.reset(); 
    loginForm.reset();
}

// * show a success message 
function showSuccess(message) {
    errorDisplay.style.display = "block";
    errorDisplay.innerHTML = `<p style="color: green;">${message}</p>`;
}

// And here i used the "submit" event listener to validate all fields befor the regestration
registrationForm.addEventListener("submit", function (event){
    event.preventDefault(); 
    hideError();

    const uName = userName.value.trim();
    const uEmail = email.value.trim();
    const pwd = password.value.trim();
    const confPwd = confirmPassword.value.trim();

     //Username validation
    if ((uName.length < 4 )|| (new Set(uName).size < 2)|| (!/^[a-zA-Z0-9]+$/.test(uName))) {
        showError("Invalid username. Please check the requirements.");
        return;
    }
    if (!isUsernameUnique(uName)) {
        showError("That username is already taken.");
        return;
    }
     // Email validation 
    if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uEmail)) || (uEmail.toLowerCase().endsWith("example.com")) ) {
        showError("Invalid email address.");
        return;
    }
    // Password validation
    if ((pwd.length < 12) || !(/[a-z]/.test(pwd)) || !(/[A-Z]/.test(pwd)) || !(/[0-9]/.test(pwd)) || !(/[^A-Za-z0-9]/.test(pwd)) || (pwd.toLowerCase().includes("password")) ||(pwd.toLowerCase().includes(uName.toLowerCase())) || (pwd !== confPwd)) {
        showError("Invalid password. Please check the requirements.");
        return;
    }
    // Terms and conditions validation
    if (!terms.checked) {
       // console.log("Terms accepted:", terms.checked); 
        showError("You must accept the terms and conditions.");
        terms.focus();
        return;
    }
    // Save user data , clear form and show success msg
    saveUser(uName, uEmail, pwd);
    clearForm();
    showSuccess("Registration successful!");

});

//Part 4: Login Form Validation Requirements
const loginForm = document.getElementById("login");
const loginUsername = loginForm.elements["username"];
const loginPassword = loginForm.elements["password"];
const keepLogged = loginForm.elements["persist"];



//1 -  Login Form - Username Validation:
// * The username must exist (within localStorage).
function logginUsername(username){

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const lowercaseUsername = username.toLowerCase();
    if (!users.some(user => user.username === lowercaseUsername)) {
        return false; //Username does not exist
    }
    return true; // Username is valid
};

//2 -  Login Form - Password Validation:
// * The password must be correct (validate against localStorage)
function logginPassword(username , password ){

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username.toLowerCase());
    if (!user || user.password !== password) {
        return false; //Invalid password
    }
    return true; // Password is valid
};

//3 -  Login Form - Form Submission:


loginForm.addEventListener("submit" , function(e){
    e.preventDefault();
    hideError();

    const userName = loginUsername.value.trim();
    const passWord = loginPassword.value.trim();
    //username validation
    const verifUser = logginUsername(userName);
    if (!verifUser) {
        showError("User name doesn't exist! please try again");
        loginUsername.focus();
        return;
    }
    //Password validation
    const verifPwd = logginPassword(userName , passWord );
    if (!verifPwd) {
        showError("Wrong password ! please try again");
        loginPassword.focus();
        return;
    }

    // * If all validation is successful, clear all form fields and show a success message.
    clearForm();
    // * If "Keep me logged in" is checked, modify the success message to indicate this (normally, 
    //   this would be handled by a variety of persistent login tools and technologies).
    if (keepLogged.checked) {
        showSuccess("Login successful! You are now logged in and will stay logged in.");
    } else {
        showSuccess("Login successful!");
    }

});
