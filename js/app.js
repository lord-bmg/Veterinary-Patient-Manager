// Global variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI Container form for the appointment
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando = false;

// Class Citas and UI
class Citas {
    constructor() {
        this.citas = [];
    }    

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Create the div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // If it is an error type, add a class
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Error message
        divMensaje.textContent = mensaje;

        // Insert into the DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Get off the alert after 5 seconds
        setTimeout( () => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas({citas}) {
        this.limpiarHTML(); // Clean the HTML before each new appointment
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scRIPTING DE LOS ELEMENTOS...
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Owner: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Phone: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Date: </span> ${fecha}`;   

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hour: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Symptoms: </span> ${sintomas}`;

            // Button to delete...
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Delete <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>';   
            btnEliminar.onclick = () => eliminarCita(id); // We need to pass the id to the function

            // Add Button to update...
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = 'Editar <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);

            // Add the paragraphs into the div
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
            

            // Add the divs into the HTML
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI({citas: []});

const administrarCitas = new Citas();

// Events Listeners
evenListeners();
function evenListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita); 
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    // Form submit
    formulario.addEventListener('submit', nuevaCita);
}

// Object for the appointment
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Add data to the object with the information of the appointment
function datosCita(e) {
    console.log(e.target.name) // Get the Input
    citaObj[e.target.name] = e.target.value;
}

// Validation of the form and add the appointment to the class Citas
function nuevaCita(e) {
    e.preventDefault();
    
    // Get the values from the object Citas and add it to the class Citas
    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validation
    if(mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '') {
        ui.imprimirAlerta('All fields are required', 'error');
        return;
    }

    if(editando) {
        // Update the appointment
        administrarCitas.editarCita({...citaObj});

        // Show success message - Show HTML of Citas
        ui.imprimirAlerta('Appointment updated');   

        // Comeback to normal mode - State of Button
        formulario.querySelector('button[type="submit"]').textContent = 'Create Appointment';

        // Change the state
        editando = false;
    } else {

        // Create a new unic Id
        citaObj.id = Date.now();

        // Add new appointment
        administrarCitas.agregarCita({...citaObj});

        // Show success message - Show HTML of Citas
        ui.imprimirAlerta('Appointment added');
    }


    // Reinitialize the object for validation
    reiniciarObjeto();      

    // Reset the form
    formulario.reset();

    // Show success message - Show HTML of Citas
    ui.imprimirCitas(administrarCitas);
}

// Reintialize the object
function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// Delete appointment
function eliminarCita(id) {
    // Delete appointment
    administrarCitas.eliminarCita(id);

    // Show success message - Show HTML of Citas
    ui.imprimirAlerta('Appointment removed');

    // Refresh the HTML of Citas
    ui.imprimirCitas(administrarCitas);
}

// Edit appointment
function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Fill the form
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Fill the object
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;    
    citaObj.id = id;

    // Change the state
    formulario.querySelector('button[type="submit"]').textContent = 'Update Appointment';

    editando = true;
}
