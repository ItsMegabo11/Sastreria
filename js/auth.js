const API = "http://127.0.0.1:8000/api";

/* ==========================
LOGIN
========================== */

const loginForm =
document.getElementById("loginForm");

if (loginForm)
{
loginForm.addEventListener(
"submit",
async (e) =>
{
e.preventDefault();


        const respuesta =
            await fetch(
                API + "/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email:
                            document.getElementById("email").value,

                        password:
                            document.getElementById("password").value
                    })
                }
            );

        const data =
            await respuesta.json();

        if (data.access_token)
        {
            localStorage.setItem(
                "token",
                data.access_token
            );

            localStorage.setItem(
                "nombreUsuario",
                document.getElementById("email").value
            );

            window.location.href =
                "dashboard.html";
        }
        else
        {
            alert(
                "Correo o contraseña incorrectos"
            );
        }
    }
);


}

/* ==========================
REGISTRO
========================== */

const registroForm =
document.getElementById("registroForm");

if (registroForm)
{
registroForm.addEventListener(
"submit",
async (e) =>
{
e.preventDefault();


        const respuesta =
            await fetch(
                API + "/auth/registro",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            document.getElementById("name").value,

                        email:
                            document.getElementById("email").value,

                        password:
                            document.getElementById("password").value,

                        password_confirmation:
                            document.getElementById(
                                "password_confirmation"
                            ).value,

                        first_name:
                            document.getElementById(
                                "first_name"
                            ).value,

                        last_name:
                            document.getElementById(
                                "last_name"
                            ).value,

                        phone:
                            document.getElementById(
                                "phone"
                            ).value,

                        hire_date:
                            document.getElementById(
                                "hire_date"
                            ).value,

                        salary:
                            document.getElementById(
                                "salary"
                            ).value
                    })
                }
            );

        const data =
            await respuesta.json();

        if (respuesta.ok)
        {
            if (data.access_token)
            {
                localStorage.setItem(
                    "token",
                    data.access_token
                );
            }

            localStorage.setItem(
                "nombreUsuario",
                document.getElementById("name").value
            );

            alert(
                "Usuario registrado correctamente"
            );

            window.location.href =
                "dashboard.html";
        }
        else
        {
            console.log(data);

            alert(
                "Error al registrar usuario"
            );
        }
    }
);
}