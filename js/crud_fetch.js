import {
    d,
    $table,
    $form,
    $title,
    $template,
    $fragment,
} from "./variables_dom.js";

const getAll = async () => {
    try {
        let res = await fetch("http://localhost:3000/santos"),
            json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
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
            `<p><b>${err.status} : ${err.message}</b></p>`
        );
    }
};

getAll();

d.addEventListener("submit", async (e) => {
    if (e.target === $form) {
        e.preventDefault();
        if (!e.target.id.value) {
            //create Post
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value,
                    }),
                },
                    res = await fetch("http://localhost:3000/santos", options),
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML(
                    "afterend",
                    `<p><b>${err.status} : ${err.message}</b></p>`
                );
            }
        } else {
            //update Put
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value,
                    }),
                },
                    res = await fetch(
                        `http://localhost:3000/santos/${e.target.id.value}`,
                        options
                    ),
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML(
                    "afterend",
                    `<p><b>${err.status} : ${err.message}</b></p>`
                );
            }
        }
    }
});
d.addEventListener("click", async (e) => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(
            `¿Estás seguro de eliminar el id ${e.target.dataset.id}?`
        );

        if (isDelete) {
            //delete DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8",
                    },
                },
                    res = await fetch(
                        `http://localhost:3000/santos/${e.target.dataset.id}`,
                        options
                    ),
                    json = await res.json();

                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status} : ${err.message}`);
            }
        }
    }
});
