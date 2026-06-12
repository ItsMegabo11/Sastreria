let modoEditar = false;

const ESTADOS_ENTREGA = [
    { id: 1, nombre: "Pending" },
    { id: 2, nombre: "On The Way" },
    { id: 3, nombre: "Delivered" }
];

cargarCombos();
cargarEntregas();

const formulario =
    document.getElementById("formEntrega");

formulario.addEventListener(
    "submit",
    guardarEntrega
);

document
    .getElementById("btnCancelar")
    .addEventListener(
        "click",
        limpiarFormulario
    );

async function cargarCombos()
{
    await cargarPedidos();

    let opciones =
        "<option value=''>Seleccione Estado</option>";

    ESTADOS_ENTREGA.forEach(estado => {

        opciones += `
            <option value="${estado.id}">
                ${estado.nombre}
            </option>
        `;

    });

    document
        .getElementById("delivery_status_id")
        .innerHTML = opciones;
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

    let opciones =
        "<option value=''>Seleccione Pedido</option>";

    data.datos.forEach(pedido => {

        opciones += `
            <option value="${pedido.id}">
                Pedido #${pedido.id}
                - Bs. ${pedido.price}
            </option>
        `;

    });

    document
        .getElementById("order_id")
        .innerHTML = opciones;
}

async function cargarEntregas()
{
    const response =
        await fetch(
            API_URL + "/deliveries",
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    let filas = "";

    data.datos.forEach(entrega => {

        filas += `
        <tr>

            <td>${entrega.id}</td>

            <td>${entrega.final_delivery_date}</td>

            <td>${entrega.delivery_address}</td>

            <td>${entrega.phone}</td>

            <td>${entrega.order.id}</td>

            <td>${entrega.delivery_status.name}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarEntrega(${entrega.id})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarEntrega(${entrega.id})">

                    Eliminar

                </button>

            </td>

        </tr>
        `;

    });

    document
        .getElementById("tabla")
        .innerHTML = filas;
}

async function guardarEntrega(e)
{
    e.preventDefault();

    const datos = {

        final_delivery_date:
            document.getElementById("final_delivery_date").value,

        delivery_address:
            document.getElementById("delivery_address").value,

        phone:
            document.getElementById("phone").value,

        order_id:
            document.getElementById("order_id").value,

        delivery_status_id:
            document.getElementById("delivery_status_id").value
    };

    let url =
        API_URL + "/deliveries";

    let metodo =
        "POST";

    const id =
        document.getElementById("entrega_id").value;

    if (modoEditar)
    {
        url =
            API_URL + "/deliveries/" + id;

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

        cargarEntregas();

        alert(
            "Entrega guardada correctamente"
        );
    }
}

async function editarEntrega(id)
{
    const response =
        await fetch(
            API_URL + "/deliveries/" + id,
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    const entrega =
        data.datos;

    document.getElementById("entrega_id").value =
        entrega.id;

    document.getElementById("final_delivery_date").value =
        entrega.final_delivery_date;

    document.getElementById("delivery_address").value =
        entrega.delivery_address;

    document.getElementById("phone").value =
        entrega.phone;

    document.getElementById("order_id").value =
        entrega.order_id;

    document.getElementById("delivery_status_id").value =
        entrega.delivery_status_id;

    modoEditar = true;
}

async function eliminarEntrega(id)
{
    if (!confirm("¿Eliminar entrega?"))
    {
        return;
    }

    await fetch(
        API_URL + "/deliveries/" + id,
        {
            method: "DELETE",
            headers: obtenerHeaders()
        }
    );

    cargarEntregas();
}

function limpiarFormulario()
{
    formulario.reset();

    document.getElementById("entrega_id").value =
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