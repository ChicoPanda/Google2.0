

/** global */

window.onload = ini();
var json;
var yeison2;

/**Para crear el market*/
var infowindow = [];
/**Para crear el market*/
var marker = [];

/**Funcion que cargará en memoria nuestras arrays, asi, si por un casual el json fuera 
 modificado (Siempre y cuando tenga la misma estructura) funcionaria sin problema
 el programa*/
function ini() {
    
     if (screen.width <= 450) {
        alert("Estas en un movil, Genial!") 
   
    } else if (screen.width <= 1025) {
        alert("Estas en un ipad Pro, ¿Te sobra la pasta no?") 

    } else {
        alert("Estas en un pc!") 
    }

    cargarMapaBase()
    infowindow = new google.maps.InfoWindow();
    todoPais = [];
    todoTipos = [];
    todoCiclos = [];

    ciclosSuperio = [];
    ciclosMedio = [];
    ciclosPro = [];

    paisSuperio = [];
    paisMedio = [];
    paisPro = [];


    prepararJson();
    rellenarArrays();
    darEventos();
}

/*---------------------------------------------------------------------------------------------------*/

/**
 * @async
 * NOTA IMPORTANTE EN ESTA FUNCION
Al final de esta funcion cerramos la "conexcion" del json ya que solo la quiero para pasar el json parseandolo a mi variable "json"*/
function prepararJson() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            json = xhttp.responseText;
        }
    };
    xhttp.open("GET", "json/json.json", false);
    xhttp.send();
    yeison = JSON.parse(json);
    xhttp.abort();
    xhttp = null;

}

/**Funcion que nos cargara los datos del json en arrays, para asi tenerlos todos cargados*/
 
function rellenarArrays() {


    todoPais = [];
    todoTipos = [];
    todoCiclos = [];

    ciclosSuperio = [];
    ciclosMedio = [];
    ciclosPro = [];

    paisSuperio = [];
    paisMedio = [];
    paisPro = [];

    for (var item in yeison) {

        if (!todoPais.includes(yeison[item].pais)) {
            todoPais.push(yeison[item].pais);
        }
        if (!todoTipos.includes(yeison[item].tipo)) {
            todoTipos.push(yeison[item].tipo);
        }
        if (!todoCiclos.includes(yeison[item].ciclo)) {
            todoCiclos.push(yeison[item].ciclo);
        }
        if (!ciclosSuperio.includes(yeison[item].ciclo) && yeison[item].tipo === "Grado Superior") {
            ciclosSuperio.push(yeison[item].ciclo);
        }
        if (!ciclosMedio.includes(yeison[item].ciclo) && yeison[item].tipo === "Grado Medio") {
            ciclosMedio.push(yeison[item].ciclo);
        }
        if (!ciclosPro.includes(yeison[item].ciclo) && yeison[item].tipo === "Profesorado") {
            ciclosPro.push(yeison[item].ciclo);
        }
        if (!paisSuperio.includes(yeison[item].pais) && yeison[item].tipo === "Grado Superior") {
            paisSuperio.push(yeison[item].pais);
        }
        if (!paisMedio.includes(yeison[item].pais) && yeison[item].tipo === "Grado Medio") {
            paisMedio.push(yeison[item].pais);
        }
        if (!paisPro.includes(yeison[item].pais) && yeison[item].tipo === "Profesorado") {
            paisPro.push(yeison[item].pais);
        }
    }
}

/**Mapa a mostrar*/
function cargarMapaBase() {
    var myCenter = new google.maps.LatLng(45.379433, 10.000000);
    var mapCanvas = document.getElementById("googleMap");
    var mapOptions = {center: myCenter, zoom: 5, mapTypeId: google.maps.MapTypeId.HYBRID};
    map = new google.maps.Map(mapCanvas, mapOptions);
    
     if (screen.width <= 450) { 
        map.setZoom(2) 
    } else if (screen.width <= 1025) { 
        map.setZoom(3)

    } else { 
        map.setZoom(5)
    }

   
}

/**Asignamos los eventos a los elementos de nuestro html*/
function darEventos() {

    document.getElementById("select").addEventListener("change", mostrarCiclos, false);
    document.getElementById("cuadradito").addEventListener("change", mostrarCiclos, false);
    document.getElementById("Buscar").addEventListener("click", buscarMapa, false);
    document.getElementById("Limpiar").addEventListener("click", cargarMapaBase, false);

    //Desmarcar todos
    document.getElementById("desmarkall").addEventListener("click", function () {

        var allChecks = document.getElementsByClassName("Check");
        for (var i = 0; i < allChecks.length; i++) {
            allChecks[i].checked = false;
        }
    });

    /**Marcar todos*/
    document.getElementById("markall").addEventListener("click", function () {

        var allChecks = document.getElementsByClassName("Check");

        for (var i = 0; i < allChecks.length; i++) {
            allChecks[i].checked = true;

        }
    });

}

/*---------------------------------------------------------------------------------------------------*/

/**Carga los checks en funcion de que campos hayan sido escogidos por el usuario*/
function comprobarInputs(seleccionado) {

    var checked = document.getElementById("cuadradito").checked;

    if (!checked) {

        if (seleccionado === "Grado Superior") {

            imprimirChecks(ciclosSuperio);
        }
        if (seleccionado === "Profesorado") {

            imprimirChecks(ciclosPro);
        }
        if (seleccionado === "Grado Medio") {

            imprimirChecks(ciclosMedio);
        }
        if (seleccionado === "Todos") {

            imprimirChecks(todoCiclos);
        }
    }

    if (checked) {

        if (seleccionado === "Grado Superior") {

            imprimirChecks(paisSuperio);
        }
        if (seleccionado === "Profesorado") {

            imprimirChecks(paisPro);
        }
        if (seleccionado === "Grado Medio") {

            imprimirChecks(paisMedio);
        }
        if (seleccionado === "Todos") {

            imprimirChecks(todoPais);
        }
    }
}

/**Aqui imprimimos dependiendo de lo que hemos seleccionado
  * @param {Array} array - Texto a comparar. 
 */
function imprimirChecks(array) {

    borrarTodos("spanCheck");
    borrarTodos("Check");

    var divChecks = document.getElementById("cajaChecks");
    for (var i = 0; i < array.length; i++) {

        var span = generarNodo("span", array[i], ["class"], ["spanCheck"]);
        var check = generarNodo("input", "", ["class", "type"], ["Check", "checkbox"]);

        var br = generarNodo("br", "", [], []);
        divChecks.appendChild(span);
        span.appendChild(check);
        span.appendChild(br);
    }
}

/**Funcion que usaran los inputs, para así comprobar cuando estos hayan sido cambiados sin tener que cargar los checks primero*/
function mostrarCiclos() {

    comprobarInputs(document.getElementById("select").value);
}

/**Asignacion de valores al market y comprobacion de cuando crearlos (Probablemente la mas liosa)*/
function buscarMapa() {
    
    cargarMapaBase()
    var checked = document.getElementById("cuadradito").checked;
    var listaSpan = document.getElementsByClassName("spanCheck");

    for (var i = 0; i < listaSpan.length; i++) {

        var spanActual = listaSpan[i].children;
        var estadoDelCheck = spanActual[0].checked;
        var textoSpan = listaSpan[i].textContent;
        var inputCiclo = document.getElementById("select").value;

        //para paises
        if (estadoDelCheck && checked) {

            for (var item in yeison) {

                if (textoSpan === yeison[item].pais && yeison[item].tipo === inputCiclo) {

                    var texto =
                            '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            `<h1> ${yeison[item].ciclo} </h1>` +
                            `<h2> ${yeison[item].tipo} </h2>` +
                            '<div id="bodyContent">' +
                            `<p>En <b>${yeison[item].pais}</b>, mas concretamente en <b>${yeison[item].ciudad}</b> ` +
                            '</div>' +
                            '</div>';

                    var myCenter = new google.maps.LatLng(yeison[item].X, yeison[item].Y);
                    createMarker(myCenter, texto);
                }
            }

            //para nombres
        } else if (estadoDelCheck && !checked) {
            for (var item in yeison) {

                if (textoSpan === yeison[item].ciclo && yeison[item].tipo === inputCiclo) {

                    var texto =
                            '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            `<h1> ${yeison[item].ciclo} </h1>` +
                            `<h2> ${yeison[item].tipo} </h2>` +
                            '<div id="bodyContent">' +
                            `<p>En <b>${yeison[item].pais}</b>, mas concretamente en <b>${yeison[item].ciudad}</b> ` +
                            '</div>' +
                            '</div>';

                    var myCenter = new google.maps.LatLng(yeison[item].X, yeison[item].Y);
                    createMarker(myCenter, texto);
                }
            }
        }
        if (estadoDelCheck && inputCiclo === "Todos" && !checked) {
            for (var item in yeison) {
                if (textoSpan === yeison[item].ciclo) {

                    var texto =
                            '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            `<h1> ${yeison[item].ciclo} </h1>` +
                            `<h2> ${yeison[item].tipo} </h2>` +
                            '<div id="bodyContent">' +
                            `<p>En <b>${yeison[item].pais}</b>, mas concretamente en <b>${yeison[item].ciudad}</b> ` +
                            '</div>' +
                            '</div>';

                    var myCenter = new google.maps.LatLng(yeison[item].X, yeison[item].Y);
                    createMarker(myCenter, texto);
                }

            }
        }
        if (estadoDelCheck && inputCiclo === "Todos" && checked) {
            for (var item in yeison) {
                if (textoSpan === yeison[item].pais) {

                    var texto =
                            '<div id="content">' +
                            '<div id="siteNotice">' +
                            '</div>' +
                            `<h1> ${yeison[item].ciclo} </h1>` +
                            `<h2> ${yeison[item].tipo} </h2>` +
                            '<div id="bodyContent">' +
                            `<p>En <b>${yeison[item].pais}</b>, mas concretamente en <b>${yeison[item].ciudad}</b> ` +
                            '</div>' +
                            '</div>';

                    var myCenter = new google.maps.LatLng(yeison[item].X, yeison[item].Y);
                    createMarker(myCenter, texto);
                }

            }
        }
    }
}

/**Funcion para poner los marcadores
 * @param {latlng} posi - Cordenadas. 
 * @param {string} html - Un texto simple con formato HTML.
 */
function createMarker(posi, html) {

    var newmarker = new google.maps.Marker({
        position: posi,
        map: map,
        title: html,
        animation: google.maps.Animation.BOUNCE,
    });

    newmarker['infowindow'] = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(newmarker, 'click', function () {

        this['infowindow'].open(map, this);

    });

    marker.push(newmarker);
}

/*---------------------------------------------------------------------------------------------------*/

/**Funcion de ayuda para imprimir etiquetas en el html*/
function generarNodo(tipo, texto, atributo, valores) {

    var nodoTexto;
    var nodoP = document.createElement(tipo);
    if (texto) {
        nodoTexto = document.createTextNode(texto);
        nodoP.appendChild(nodoTexto);
    }
    for (var i in atributo) {
        nodoP.setAttribute(atributo[i], valores[i]);
    }
    return nodoP;
}

/**Funcion de ayuda para borrar elementos del html*/
function borrarTodos(elem) {

    var elements = document.getElementsByClassName(elem);

    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}