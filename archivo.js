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

   
    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}


const lista = document.querySelector("#contenedor")
const mostrarError = document.getElementById("error")
contenedor.innerHTML = "";

const pedirDatos = async ()=>{
    try {
        // Link relativo en relacion al HTML donde se llama
        // const datosIniciales = await fetch("./productos.json"
        // Link absoluto en relacion a la raiz
        const datosIniciales = await fetch("./articulos.json")
        const datosProcesados = await datosIniciales.json()
        datosProcesados.forEach(articulo => {
          
        // Creo el contendor individual para cada card
        let card = document.createElement("div");

        // Agrego el contenido a la card
        
        card.innerHTML = `
        <div class="card text-center" style="width: 18rem;">
        <div class="card-body">
        <img src="${articulo.img}" id="" class="card-img-top img-fluid" alt="">
        <h4 class="card-title">${articulo.tipo}</h4>
        <h5 class="card-subtitle mb-2 text-muted">${articulo.descripcion}</h5>
        <p class="card-text">$${articulo.precio}</p>
        
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button id="agregar${articulo.id}" type="button" class="btn btn-dark"> Agregar </button>
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
        
        let boton = document.getElementById(`agregar${articulo.id}`);
       
         boton.addEventListener("click", function() {
             agregarAlCarrito(articulo);
            })
        //***************************** */
        });
    } catch (error) {
        console.warn(error)
        mostrarError.innerText="Se produjo un error"
    }
}


// ----- Chequea que esta en el Storage ----- //
function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

    // Si existe el array del carrito, lo retornará
    // y actualizará los datos de compras
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

function agregarAlCarrito(producto) {
    // Verifico si esa pieza ya se encuentra en el array
    console.log("entro")
    let piezaEnCarrito = carrito.find((articulo) => articulo.id === producto.id);

    if (piezaEnCarrito) {
        // Si se encuentra la pieza  se le sumará uno a la cantidad de esa marca en el carrito
        let index = carrito.findIndex((elemento) => elemento.id === piezaEnCarrito.id);

        // Al obtener el index donde se halla el elemento ya agregado al carrito, 
        //llamo a los métodos que actualizaran unidades y precio total
        // De unidades repetidas
        carrito[index].agregarPieza();
        carrito[index].actualizarPrecioTotal();
    } else {
        // Si la pieza no se encuentra en el carrito
        let cantidad = 1;
        carrito.push(new Pieza(producto, cantidad));
    }

    // Actualizo el storage y el contenido de la tabla
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

    // obtengo el id del body 
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


const finalizarCompra = ()=>{
    eliminarCarrito()
    let mensaje = document.getElementById("MensajeFinal")
    mensaje.innerHTML = "Muchas gracias por su compra, los esperamos pronto"
    Swal.fire({
        title: 'Muchas gracias!',
        text: 'Su compra fue realizada con exito.',
        imageUrl: '../img/logo.jpeg',
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })

}

// DOM
const compraFinal = document.getElementById("formDatosCliente")
compraFinal.addEventListener("submit",(event)=>{
    event.preventDefault()
    if(carrito.length>0){
        finalizarCompra(event)
    } else {
        Swal.fire('No hay productos cargado')
    }
})


// Ejecución del código
// --- Invocación de funciones ---
pedirDatos()
// Consulta al Storage para saber si hay información almacenada
// Si hay datos, se imprimen en el HTML al refrescar la página
const carrito = chequearCarritoEnStorage();
