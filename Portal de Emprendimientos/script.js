let emprendimientos = [];
let indiceEditar = -1;

const formulario = document.getElementById("formEmprendimiento");

formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const responsable = document.getElementById("responsable").value.trim();
    const carrera = document.getElementById("carrera").value.trim();
    const categoria = document.getElementById("categoria").value;
    const producto = document.getElementById("producto").value.trim();
    const ventas = document.getElementById("ventas").value;
    const estado = document.getElementById("estado").value;

    if (
        codigo === "" ||
        nombre === "" ||
        responsable === "" ||
        carrera === "" ||
        categoria === "" ||
        producto === "" ||
        ventas === "" ||
        estado === ""
    ) {
        alert("Complete todos los campos");
        return;
    }

    const emprendimiento = {
        codigo,
        nombre,
        responsable,
        carrera,
        categoria,
        producto,
        ventas: Number(ventas),
        estado
    };

    if (indiceEditar >= 0) {
        emprendimientos[indiceEditar] = emprendimiento;
        indiceEditar = -1;
    } else {
        emprendimientos.push(emprendimiento);
    }

    formulario.reset();

    mostrarTabla();
    mostrarCards();
    actualizarEstadisticas();
});


function mostrarTabla(lista = emprendimientos) {

    const tbody = document.getElementById("tablaEmprendimientos");

    tbody.innerHTML = "";

    lista.forEach((emp, index) => {

        tbody.innerHTML += `
        <tr>
            <td>${emp.codigo}</td>
            <td>${emp.nombre}</td>
            <td>${emp.responsable}</td>
            <td>${emp.categoria}</td>
            <td>$${emp.ventas}</td>
            <td>${emp.estado}</td>

            <td>
                <button onclick="editar(${index})">
                    Editar
                </button>

                <button onclick="eliminar(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
        `;
    });
}


function mostrarCards(lista = emprendimientos) {

    const contenedor = document.getElementById("contenedorCards");

    contenedor.innerHTML = "";

    lista.forEach(emp => {

        contenedor.innerHTML += `
        <article class="card">

            <img 
            src="https://via.placeholder.com/250x150"
            alt="Emprendimiento">

            <h3>${emp.nombre}</h3>

            <p>
                <strong>Categoría:</strong>
                ${emp.categoria}
            </p>

            <p>
                <strong>Responsable:</strong>
                ${emp.responsable}
            </p>

            <p>
                ${emp.producto}
            </p>

        </article>
        `;
    });
}

function eliminar(index) {

    if (confirm("¿Eliminar emprendimiento?")) {

        emprendimientos.splice(index, 1);

        mostrarTabla();
        mostrarCards();
        actualizarEstadisticas();
    }
}

function editar(index) {

    const emp = emprendimientos[index];

    document.getElementById("codigo").value = emp.codigo;
    document.getElementById("nombre").value = emp.nombre;
    document.getElementById("responsable").value = emp.responsable;
    document.getElementById("carrera").value = emp.carrera;
    document.getElementById("categoria").value = emp.categoria;
    document.getElementById("producto").value = emp.producto;
    document.getElementById("ventas").value = emp.ventas;
    document.getElementById("estado").value = emp.estado;

    indiceEditar = index;
}

function actualizarEstadisticas() {

    document.getElementById("totalEmprendimientos").textContent =
        emprendimientos.length;

    let totalVentas = 0;

    for (let emp of emprendimientos) {
        totalVentas += emp.ventas;
    }

    document.getElementById("totalVentas").textContent =
        totalVentas;

    let promedio = 0;

    if (emprendimientos.length > 0) {
        promedio = totalVentas / emprendimientos.length;
    }

    document.getElementById("promedioVentas").textContent =
        promedio.toFixed(2);

    if (emprendimientos.length > 0) {

        let mayor = emprendimientos[0];

        for (let emp of emprendimientos) {

            if (emp.ventas > mayor.ventas) {
                mayor = emp;
            }
        }

        document.getElementById("mayorVenta").textContent =
            `${mayor.nombre} ($${mayor.ventas})`;

    } else {

        document.getElementById("mayorVenta").textContent =
            "Ninguno";
    }
}


document.getElementById("buscar")
.addEventListener("keyup", filtrarDatos);


document.getElementById("filtroCategoria")
.addEventListener("change", filtrarDatos);


function filtrarDatos() {

    const texto =
        document.getElementById("buscar")
        .value
        .toLowerCase();

    const categoria =
        document.getElementById("filtroCategoria")
        .value;

    const resultado = emprendimientos.filter(emp => {

        const coincideTexto =
            emp.nombre.toLowerCase().includes(texto) ||
            emp.codigo.toLowerCase().includes(texto);

        const coincideCategoria =
            categoria === "" ||
            emp.categoria === categoria;

        return coincideTexto && coincideCategoria;
    });

    mostrarTabla(resultado);
    mostrarCards(resultado);
}