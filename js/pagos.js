let modoEditar = false;

const METODOS_PAGO = [
    { id: 1, nombre: "Cash" },
    { id: 2, nombre: "Transfer" },
    { id: 3, nombre: "QR" },
    { id: 4, nombre: "Card" }
];

cargarCombos();
cargarPagos();

const formulario =
    document.getElementById("formPago");

formulario.addEventListener(
    "submit",
    guardarPago
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
        "<option value=''>Seleccione Método</option>";

    METODOS_PAGO.forEach(metodo => {

        opciones += `
            <option value="${metodo.id}">
                ${metodo.nombre}
            </option>
        `;

    });

    document
        .getElementById("payment_method_id")
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

async function cargarPagos()
{
    const response =
        await fetch(
            API_URL + "/payments",
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    let filas = "";

    data.datos.forEach(pago => {

        filas += `
        <tr>

            <td>${pago.id}</td>

            <td>${pago.amount}</td>

            <td>${pago.payment_date}</td>

            <td>
                ${pago.order.id}
            </td>

            <td>
                ${pago.payment_method.name}
            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarPago(${pago.id})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarPago(${pago.id})">

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

async function guardarPago(e)
{
    e.preventDefault();

    const datos = {

        amount:
            document.getElementById("amount").value,

        payment_date:
            document.getElementById("payment_date").value,

        order_id:
            document.getElementById("order_id").value,

        payment_method_id:
            document.getElementById("payment_method_id").value
    };

    let url =
        API_URL + "/payments";

    let metodo =
        "POST";

    const id =
        document.getElementById("pago_id").value;

    if(modoEditar)
    {
        url =
            API_URL + "/payments/" + id;

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

    if(response.ok)
    {
        limpiarFormulario();
        cargarPagos();

        alert(
            "Pago guardado correctamente"
        );
    }
}

async function editarPago(id)
{
    const response =
        await fetch(
            API_URL + "/payments/" + id,
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    const pago =
        data.datos;

    document.getElementById("pago_id").value =
        pago.id;

    document.getElementById("amount").value =
        pago.amount;

    document.getElementById("payment_date").value =
        pago.payment_date;

    document.getElementById("order_id").value =
        pago.order_id;

    document.getElementById("payment_method_id").value =
        pago.payment_method_id;

    modoEditar = true;
}

async function eliminarPago(id)
{
    if(!confirm("¿Eliminar pago?"))
    {
        return;
    }

    await fetch(
        API_URL + "/payments/" + id,
        {
            method: "DELETE",
            headers: obtenerHeaders()
        }
    );

    cargarPagos();
}

function limpiarFormulario()
{
    formulario.reset();

    document.getElementById("pago_id").value =
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