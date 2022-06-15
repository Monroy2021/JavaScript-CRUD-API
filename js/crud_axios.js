import {
    d,
    $table,
    $form,
    $title,
    $template,
    $fragment,
} from "./variables_dom.js";

/**
 * Funcion para traer y listar la data
 */
const getAll = async () => {
    try {
        let res = await axios.get("http://localhost:3000/santos"),
            json = res.data;
        json.forEach((el) => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".constellation").textContent = el.constelacion;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.constellation = el.constelacion;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML(
            "afterend",
            `<p><b>Error ${err.status} : ${message}</b></p>`
        );
    }
};

/**
 * llamada de la funcion para utilizar apenas cargue el documento
 */
getAll();

/**
 * Envento al envio del formulario
 */
d.addEventListener("submit", async (e) => {
    if (e.target === $form) {
        e.preventDefault();
        if (!e.target.id.value) {
            //CREATE POST
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value,
                    }),
                },
                    res = await axios("http://localhost:3000/santos", options),
                    json = res.data;

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML(
                    "afterend",
                    `<p><b>Error ${err.status} : ${message}</b></p>`
                );
            }
        } else {
            //UPDATE PUT
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value,
                    }),
                },
                    res = await axios(
                        `http://localhost:3000/santos/${e.target.id.value}`,
                        options
                    ),
                    json = res.data;

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML(
                    "afterend",
                    `<p><b>Error ${err.status} : ${message}</b></p>`
                );
            }
        }
    }
});

/**
 * Evento click de los botones
 */
d.addEventListener("click", async (e) => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        //Delete DELETE
        try {
            let isDelete = confirm(
                `¿Estás seguro de eliminar el id ${e.target.dataset.id}?`
            );
            if (isDelete) {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                },
                    res = await axios(
                        `http://localhost:3000/santos/${e.target.dataset.id}`,
                        options
                    ),
                    json = res.data;

                location.reload();
            }
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
            alert(`Error ${err.status} : ${message}`);
        }
    }
});
