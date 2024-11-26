document.addEventListener("DOMContentLoaded", () => {
    console.log("Loginjs");
    const mensajeError = document.getElementsByClassName("error")[0];
    const loginForm = document.getElementById("login-form");
    
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const user = e.target.elements.user.value;
            const password = e.target.elements.password.value;
            const tokenaccess = e.target.elements.tokenaccess.value;
            
            const res = await fetch("http://localhost:4000/api/loginroot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, password, tokenaccess })
            });
            
            if (!res.ok) {
                return mensajeError.classList.toggle("display", false);
            }
            
            const resJson = await res.json();
            if (resJson.redirect) {
                window.location.href = resJson.redirect;
            }
        });
    }
});
