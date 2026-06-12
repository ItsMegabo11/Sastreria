let modoEditar = false;

const TALLAS = [
    { id: 1, nombre: "S" },
    { id: 2, nombre: "M" },
    { id: 3, nombre: "L" },
    { id: 4, nombre: "XL" },
    { id: 5, nombre: "XXL" }
];

const COLORES = [
    { id: 1, nombre: "Black" },
    { id: 2, nombre: "White" },
    { id: 3, nombre: "Blue" },
    { id: 4, nombre: "Red" },
    { id: 5, nombre: "Green" },
    { id: 6, nombre: "Brown" },
    { id: 7, nombre: "Gray" },
    { id: 8, nombre: "Yellow" },
    { id: 9, nombre: "Purple" },
    { id: 10, nombre: "Pink" }
];

const ESTADOS = [
    { id: 1, nombre: "Pending" },
    { id: 2, nombre: "In Progress" },
    { id: 3, nombre: "Finished" },
    { id: 4, nombre: "Delivered" }
];

cargarCombos();
cargarPedidos();

const formulario =
    document.getElementById("formPedido");

formulario.addEventListener(
    "submit",
    guardarPedido
);

document
    .getElementById("btnCancelar")
    .addEventListener(
        "click",
        limpiarFormulario
    );

async function cargarCombos()
{
    await cargarClientes();

    cargarTallas();
    cargarColores();
    cargarEstados();
}

async function cargarClientes()
{
    const response =
        await fetch(
            API_URL + "/customers",
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    let opciones =
        "<option value=''>Seleccione Cliente</option>";

    data.datos.forEach(cliente => {

        opciones += `
            <option value="${cliente.id}">
                ${cliente.first_name}
                ${cliente.last_name}
            </option>
        `;

    });

    document.getElementById("customer_id").innerHTML =
        opciones;
}

function cargarTallas()
{
    let opciones =
        "<option value=''>Seleccione Talla</option>";

    TALLAS.forEach(talla => {

        opciones += `
            <option value="${talla.id}">
                ${talla.nombre}
            </option>
        `;

    });

    document.getElementById("size_id").innerHTML =
        opciones;
}

function cargarColores()
{
    let opciones =
        "<option value=''>Seleccione Color</option>";

    COLORES.forEach(color => {

        opciones += `
            <option value="${color.id}">
                ${color.nombre}
            </option>
        `;

    });

    document.getElementById("color_id").innerHTML =
        opciones;
}

function cargarEstados()
{
    let opciones =
        "<option value=''>Seleccione Estado</option>";

    ESTADOS.forEach(estado => {

        opciones += `
            <option value="${estado.id}">
                ${estado.nombre}
            </option>
        `;

    });

    document.getElementById("order_status_id").innerHTML =
        opciones;
}

async function cargarPedidos()
{
    const response =
        await fetch(
            API_URL + "/orders",
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    let filas = "";

    data.datos.forEach(pedido => {

        filas += `
        <tr>

            <td>${pedido.id}</td>

            <td>
                ${pedido.customer.first_name}
                ${pedido.customer.last_name}
            </td>

            <td>${pedido.order_date}</td>

            <td>${pedido.delivery_date}</td>

            <td>${pedido.price}</td>

            <td>${pedido.order_status.name}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarPedido(${pedido.id})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarPedido(${pedido.id})">

                    Eliminar

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("tabla").innerHTML =
        filas;
}

async function guardarPedido(e)
{
    e.preventDefault();

    const datos = {

        order_date:
            document.getElementById("order_date").value,

        delivery_date:
            document.getElementById("delivery_date").value,

        price:
            document.getElementById("price").value,

        customer_id:
            document.getElementById("customer_id").value,

        size_id:
            document.getElementById("size_id").value,

        color_id:
            document.getElementById("color_id").value,

        order_status_id:
            document.getElementById("order_status_id").value
    };

    let url =
        API_URL + "/orders";

    let metodo =
        "POST";

    const id =
        document.getElementById("pedido_id").value;

    if (modoEditar)
    {
        url =
            API_URL + "/orders/" + id;

        metodo =
            "PUT";
    }

    const response =
        await fetch(
            url,
            {
                method: metodo,
                headers: obtenerHeaders(),
                body: JSON.stringify(datos)
            }
        );

    if (response.ok)
    {
        limpiarFormulario();

        cargarPedidos();

        alert("Guardado correctamente");
    }
}

async function editarPedido(id)
{
    const response =
        await fetch(
            API_URL + "/orders/" + id,
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    const pedido =
        data.datos;

    document.getElementById("pedido_id").value =
        pedido.id;

    document.getElementById("order_date").value =
        pedido.order_date;

    document.getElementById("delivery_date").value =
        pedido.delivery_date;

    document.getElementById("price").value =
        pedido.price;

    document.getElementById("customer_id").value =
        pedido.customer_id;

    document.getElementById("size_id").value =
        pedido.size_id;

    document.getElementById("color_id").value =
        pedido.color_id;

    document.getElementById("order_status_id").value =
        pedido.order_status_id;

    modoEditar = true;
}

async function eliminarPedido(id)
{
    if (!confirm("¿Eliminar pedido?"))
    {
        return;
    }

    await fetch(
        API_URL + "/orders/" + id,
        {
            method: "DELETE",
            headers: obtenerHeaders()
        }
    );

    cargarPedidos();
}

function limpiarFormulario()
{
    formulario.reset();

    document.getElementById("pedido_id").value =
        "";

    modoEditar = false;
}
document
    .getElementById("buscador")
    .addEventListener(
        "keyup",
        function ()
        {
            const texto =
                this.value.toLowerCase();

            const filas =
                document.querySelectorAll(
                    "#tabla tr"
                );

            filas.forEach(fila => {

                const contenido =
                    fila.textContent.toLowerCase();

                fila.style.display =
                    contenido.includes(texto)
                    ? ""
                    : "none";

            });
        }
    );