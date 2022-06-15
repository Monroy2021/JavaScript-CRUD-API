import {
    d,
    $table,
    $form,
    $title,
    $template,
    $fragment,
} from "./variables_dom.js";

const ajax = (options) => {
    //Destructuracion
    let { url, method, success, error, data } = options;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", (e) => {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);
            success(json);
        } else {
            let message = xhr.statusText || "Ocurrio un error";
            error(`Error ${xhr.status} : ${message}`);
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
};

const getAll = () => {
    ajax({
        //method: "GET",
        url: "http://localhost:3000/santos",
        success: (res) => {
            res.forEach((el) => {
                $template.querySelector(".name").textContent = el.nombre;
                $template.querySelector(".constellation").textContent = el.constelacion;
                $template.querySelector(".edit").dataset.id = el.id;
                $template.querySelector(".edit").dataset.name = el.nombre;
                $template.querySelector(".edit").dataset.constellation =
                    el.constelacion;
                $template.querySelector(".delete").dataset.id = el.id;

                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });

            $table.querySelector("tbody").appendChild($fragment);
        },
        error: (err) => {
            $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
        },
        //data: null
    });
};

getAll();

d.addEventListener("submit", (e) => {
    if (e.target === $form) {
        e.preventDefault();
        if (!e.target.id.value) {
            //create post
            ajax({
                url: "http://localhost:3000/santos",
                method: "POST",
                success: (res) => location.reload(),
                error: (err) =>
                    $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value,
                },
            });
        } else {
            //Update put
            ajax({
                url: `http://localhost:3000/santos/${e.target.id.value}`,
                method: "PUT",
                success: (res) => location.reload(),
                error: (err) =>
                    $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value,
                },
            });
        }
    }
});

d.addEventListener("click", (e) => {
    //e.target.matches -> busca el elemento que origina el evento
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
            ajax({
                url: `http://localhost:3000/santos/${e.target.dataset.id}`,
                method: "DELETE",
                success: (res) => location.reload(),
                error: (err) => alert(err),
                //$form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
            });
        }
    }
});
