/*document.getElementById('register-form').addEventListener('submit',async (e) => {
    e.preventDefault();
    console.log(e.target.elements.user.value);
    const res = await fetch('http://localhost:4000/admin/new-client',{
    method:"POST",
    headers:{
        "Content-type" : "application/json"
    },
    body: JSON.stringify({
        user: e.target.elements.user.value,
        name: e.target.elements.name.value,
        password: e.target.elements.password.value,
        dni: e.target.elements.dni.value,
        genre: e.target.elements.genre.value,
        phone: e.target.elements.phone.value,
        adress: e.target.elements.adress.value,
    })
})
if(!res.ok) return mensajeError.classList.toggle("display",false);
const resJson = await res.json()
if(resJson.redirect){
    window.location.href = resJson.redirect;
}
});*/
