document.addEventListener('DOMContentLoaded', () => {
    const newServiceButton = document.getElementById('new-service');
    const serviceForm = document.getElementById('service-form');
    const cancelButton = document.getElementById('cancel-button');

    // Mostrar el formulario al hacer clic en el botón
    newServiceButton.addEventListener('click', () => {
        serviceForm.style.display = 'flex'; // Muestra el formulario
    });

    // Ocultar el formulario al hacer clic en el botón de cancelar
    cancelButton.addEventListener('click', () => {
        serviceForm.style.display = 'none'; // Oculta el formulario
        serviceForm.reset(); // Reinicia los campos del formulario
    });
    serviceForm.addEventListener("submit",(event) =>{
        event.preventDefault()
        let servicename= document.getElementById("service-name").value
        let serviceactive= document.getElementById("service-active").value === "true";
        let servicemodality= document.getElementById("service-modality").value
        let serviceprice = parseFloat(document.getElementById("service-price").value)
        let servicecontent= document.getElementById("service-content").value
        let serviceintroduction= document.getElementById("service-introduction").value
        let service= {
            name: servicename,active:serviceactive,modality:servicemodality,price:serviceprice,content:servicecontent,introduction:serviceintroduction
        }
        let serviceJSON = JSON.stringify(service)
        console.log(serviceJSON)
        fetch('http://localhost:4000/services',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serviceJSON
        })
    })
});
async function fetchServices() {
    try {
        const response = await fetch("http://localhost:4000/api/services");
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const services = await response.json();
        displayServices(services);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar los servicios en el HTML
function displayServices(services) {
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    services.forEach(service => {
        // Crear un elemento li
        const li = document.createElement('li');

        // Agregar contenido al li
        li.innerHTML = `
            <strong>Nombre:</strong> ${service.name} <br>
            <strong>Activo:</strong> ${service.isactive ? 'Sí' : 'No'} <br>
            <strong>Precio:</strong> ${service.price} <br>
            <strong>Contenido:</strong> ${service.content} <br>
            <strong>Introducción:</strong> ${service.introduction}
        `;

        // Agregar el li a la lista
        servicesList.appendChild(li);
    });
}

// Llamar a la función para obtener los servicios al cargar la página
fetchServices();
