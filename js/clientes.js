let modoEditar = false;

cargarEmpleados();
cargarClientes();

const formulario =
    document.getElementById("formCliente");

formulario.addEventListener(
    "submit",
    guardarCliente
);

document
    .getElementById("btnCancelar")
    .addEventListener(
        "click",
        limpiarFormulario
    );

async function cargarEmpleados()
{
    const response =
        await fetch(
            API_URL + "/employees",
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    let opciones =
        "<option value=''>Seleccione Empleado</option>";

    data.datos.forEach(emp => {

        opciones += `
            <option value="${emp.id}">
                ${emp.first_name}
                ${emp.last_name}
            </option>
        `;

    });

    document
        .getElementById("employee_id")
        .innerHTML = opciones;
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

    let filas = "";

    data.datos.forEach(cliente => {

        filas += `
        <tr>

            <td>${cliente.id}</td>

            <td>${cliente.first_name}</td>

            <td>${cliente.last_name}</td>

            <td>${cliente.phone}</td>

            <td>${cliente.address}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editarCliente(${cliente.id})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="eliminarCliente(${cliente.id})">

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

async function guardarCliente(e)
{
    e.preventDefault();

    const datos = {

        first_name:
            document.getElementById("first_name").value,

        last_name:
            document.getElementById("last_name").value,

        phone:
            document.getElementById("phone").value,

        address:
            document.getElementById("address").value,

        employee_id:
            document.getElementById("employee_id").value
    };

    let url =
        API_URL + "/customers";

    let metodo =
        "POST";

    const id =
        document.getElementById("cliente_id").value;

    if (modoEditar)
    {
        url =
            API_URL + "/customers/" + id;

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

        cargarClientes();

        alert(
            "Cliente guardado correctamente"
        );
    }
    else
    {
        const error =
            await response.json();

        console.log(error);

        alert(
            "Error al guardar cliente"
        );
    }
}

async function editarCliente(id)
{
    const response =
        await fetch(
            API_URL + "/customers/" + id,
            {
                headers: obtenerHeaders()
            }
        );

    const data =
        await response.json();

    const cliente =
        data.datos;

    document.getElementById("cliente_id").value =
        cliente.id;

    document.getElementById("first_name").value =
        cliente.first_name;

    document.getElementById("last_name").value =
        cliente.last_name;

    document.getElementById("phone").value =
        cliente.phone;

    document.getElementById("address").value =
        cliente.address;

    document.getElementById("employee_id").value =
        cliente.employee_id;

    modoEditar = true;
}

async function eliminarCliente(id)
{
    if (!confirm("¿Eliminar cliente?"))
    {
        return;
    }

    await fetch(
        API_URL + "/customers/" + id,
        {
            method: "DELETE",
            headers: obtenerHeaders()
        }
    );

    cargarClientes();
}

function limpiarFormulario()
{
    formulario.reset();

    document.getElementById("cliente_id").value =
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