
// --------------------------------------------------------
// Elemente aus dem DOM referenzieren (Login- und Register-Formulare + Button)
// --------------------------------------------------------
var loginForm = document.getElementById('login');
var registerForm = document.getElementById('register');
var btn = document.getElementById('btn');

// --------------------------------------------------------
// Funktion: Wechselt zur Registrierungsansicht
// --------------------------------------------------------
function registered() {
    loginForm.style.left ="-400px";
    registerForm.style.left= "50px";
    btn.style.left = "110px";
}

// --------------------------------------------------------
// Funktion: Wechselt zurück zur Login-Ansicht
// --------------------------------------------------------
function logined() {
    loginForm.style.left ="50px";
    registerForm.style.left= "450px";
    btn.style.left = "0";
}

// --------------------------------------------------------
// Event Listener für das Registrierungsformular
// --------------------------------------------------------
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('#pw1').value;
    const password2 = registerForm.querySelector('#pw2').value;

    if (password !== password2) {
        alert("Passwörter müssen gleich sein!");
        return;
    }

    const query = `
        mutation CreateUser($email: String!, $password: String!) {
            createUser(input: {
                email: $email,
                password: $password
            }) {
                id
                email
            }
        }
    `;

    fetch('https://budgetweiser-a9722999c31d.herokuapp.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            query,
            variables: {
                email,
                password
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            alert('Fehler bei der Registrierung: ' + data.errors[0].message);
        } else {
            alert('Registrierung erfolgreich! Sie können sich jetzt anmelden.');
            logined(); // Zurück zum Login-Formular
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
});

// --------------------------------------------------------
// Event Listener für das Login-Formular
// --------------------------------------------------------
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const query = `
        mutation Login($email: String!, $password: String!) {
            login(input: {
                email: $email,
                password: $password
            }) {
                token
            }
        }
    `;

    fetch('https://budgetweiser-a9722999c31d.herokuapp.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            query,
            variables: {
                email,
                password
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            alert('Fehler beim Login: ' + data.errors[0].message);
        } else {
            const token = data.data.login.token;
            localStorage.setItem('authToken', token);
            alert('Login erfolgreich!');
            window.location.href = '/app'; // Weiterleitung zur SPA
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
});
