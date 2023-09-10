class Pieza {
    constructor(pieza, cantidad) {
        this.id = pieza.id;
        this.tipo = pieza.tipo;
        this.precio = pieza.precio;
        this.cantidad = cantidad;
        this.precioTotal = pieza.precio;
    }

    agregarPieza() {
        this.cantidad++;
    }

   // quitarUnidad() {
    //    this.cantidad--;
    //}

    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}

// Constantes y variables
const piezas = [
    {
        id: 0,
        tipo: "Ceramica_bandejas",
        descripcion: "Bandejas",
        precio: 1000,
        img: "./img/ceramica1.jpeg",
    },
    {
        id: 1,
        tipo: "Ceramica_cuenco",
        descripcion: "Cuenco",
        precio: 900,
        img: "./img/ceramica2.jpeg",
    },
    {
        id: 2,
        tipo: "Ceramica_cazuela",
        descripcion: "Cazuelas",
        precio: 1500,
        img: "./img/ceramica4.jpeg",
    },
    {
        id: 3,
        tipo: "Mosaiquismo_tutor",
        descripcion: "Tutor en disco de arado",
        precio: 2800,
        img: "./img/mosaiquismo1.jpeg",
    },
    {
        id: 4,
        tipo: "Mosaiquismo_30",
        descripcion: "Maceta de 30 x 30",
        precio: 1900,
        img: "./img/mosaiquismo2.jpeg",
    },
    {
        id: 5,
        tipo: "Mosaiquismo_30Azul",
        descripcion: "Maceta de 30 x 30 Azul",
        precio: 2000,
        img: "./img/mosaiquismo3.jpeg",
    },
    {
        id: 6,
        tipo: "Mosaiquismo_jardinera",
        descripcion: "Maceta jardinera",
        precio: 2000,
        img: "./img/mosaiquismo5.jpeg",
    },
];

// ----- Chequea que esta en el Storage ----- //
function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

    // Si existe el array del carrito, lo retornará
    // y actualizará la tabla de compras
    if (contenidoEnStorage) {
        // Para recuperarla la instancias de clase que se pierden en el Storage
        // instanciando la clase en cada objeto del array
        let array = [];

        for (const objeto of contenidoEnStorage) {
            // Recibo los datos del objeto del storage
            // los guardo en la variable pieza con la instancia de clase
            let pieza = new Pieza(objeto, objeto.cantidad);
            pieza.actualizarPrecioTotal();

            // Envio ese objeto al arrray
            array.push(pieza);
        }

        imprimirTabla(array);

        // retorna ese nuevo array con los datos recuperados
        return array;
    }

    // Si no existe ese array, devolverá un array vacío
    return [];
}

function imprimirProductosEnHTML(array) {
    // div que contendrá nuestras cards
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    // Recorremos el array y por cada item imprimimos una card
    for (const pieza of array) {
        // Creamos el contendor individual para cada card
        let card = document.createElement("div");

        // Agregamos el contenido a la card
        
        card.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
        <div class="card-body">
        <img src="${pieza.img}" id="" class="card-img-top img-fluid" alt="">
        <h4 class="card-title">${pieza.tipo}</h4>
        <h5 class="card-subtitle mb-2 text-muted">${pieza.descripcion}</h5>
        <p class="card-text">$${pieza.precio}</p>
        
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button id="agregar${pieza.id}" type="button" class="btn btn-dark"> Agregar </button>
        </div>
        </div>
        </div>      
        `;

        contenedor.appendChild(card);
        // Una vez que tengo creada la card, la agrego al contenedor
        // que obtuve desde el HTML

        // Luego de agregar la card al DOM,
        // asigno el evento al botón correspondiente, habiendo nombrado su id de manera
        // dinámica
        let boton = document.getElementById(`agregar${pieza.id}`);
        
       
         boton.addEventListener("click", function() {
             agregarAlCarrito(pieza.id);
         })
    }
}


function agregarAlCarrito(idProducto) {
    // Verifico si esa pieza ya se encuentra en el array
    
    let piezaEnCarrito = carrito.find((pieza) => pieza.id === idProducto);

    if (piezaEnCarrito) {
        // Si se encuentra la pieza  se le sumará uno a la cantidad de esa marca en el carrito
        let index = carrito.findIndex((elemento) => elemento.id === piezaEnCarrito.id);

        // Al obtener el index donde se halla el elemento ya agregadoal carrito, 
        //llamo a los métodos que actualizaran unidades y precio total
        // De unidades repetidas
        carrito[index].agregarPieza();
        carrito[index].actualizarPrecioTotal();
    } else {
        // Si la pieza no se encuentra en el carrito
        let cantidad = 1;
        carrito.push(new Pieza(piezas[idProducto], cantidad));
    }

    // Actualizo el storage y el contenido de la tabla
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    // Busco el item en el carrito
    // Primero busco que coincida el ID recibido con el ID del objeto
    // a eleminar en el carrito
    let pieza = carrito.find((pieza) => pieza.id === id);

    // busco el índice del producto en el carrito a eliminar
    let index = carrito.findIndex((element) => element.id === pieza.id);

    // Se revisa el stock para saber si hay que restarle 1
    // al stock o quitar el elemento del array
    if (pieza.cantidad > 1) {
        // Si hay más de una unidad de ese producto
        carrito[index].quitarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        // Si queda solo una unidad, se elimina del array
        
        carrito.splice(index, 1);
    }

    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarCarrito() {
    carrito.length = 0;
    localStorage.removeItem("carritoEnStorage");

    document.getElementById("carrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
    return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

// Recibe el contenido del carrito y lo imprime en el html
// en una tabla
function imprimirTabla(array) {
    let precioTotal = obtenerPrecioTotal(array);
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    // Creamos el div que contendrá la tabla
    let mostrar = document.createElement("div");

    // A ese div le agregaremos todos los datos de la tabla
    mostrar.innerHTML = `
        <section id="bodyCarrito" class="table table-striped">
            
        </section>
    `;

    contenedor.appendChild(mostrar);

    // Despues de dibujar la tabla, obtengo el id del body de la tabla
    // donde imprimp los datos del array
    let bodyCarrito = document.getElementById("bodyCarrito");

    for (let pieza of array) {
        let datos = document.createElement("section");
        datos.innerHTML = `
                <p>Tipo: ${pieza.tipo} --- Cantidad: ${pieza.cantidad} --- Precio: $${pieza.precioTotal} </p>
                <p>---------------------------<p>
      `;
  
      bodyCarrito.appendChild(datos);

      
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML = `
		<h5>PrecioTotal: $${precioTotal}</h5></br>
		<button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
	`;
}

function filtrarBusqueda(e) {
    e.preventDefault();

    // Tomo el value del input y le agrego toLowerCase para que la búsqueda no sea
    // case sensitive
    let ingreso = document.getElementById("busqueda").value.toLowerCase();
    let arrayFiltrado = piezas.filter((elemento) => elemento.tipo.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

// --- Eventos
let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

// Ejecución del código
// --- Invocación de funciones ---
imprimirProductosEnHTML(piezas);

// Consulta al Storage para saber si hay información almacenada
// Si hay datos, se imprimen en el HTML al refrescar la página
const carrito = chequearCarritoEnStorage();
