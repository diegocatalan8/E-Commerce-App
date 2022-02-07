/*********************Parte 1**************************/
/****************************************/
/* variable global que se utilizara como key para referirse al valor
que tenemos en el localStorage*/
const CART_PRODUCTOS = "cartProductsId";
/* en este evento metemos las funciones que se ejecutaran cuando 
se cargue la pagina*/
document.addEventListener("DOMContentLoaded", () => {
  loadProducts(); //funcion para cargar los productos en el DOM
  loadProductCart(); //funcion para cargar los productos en el carrito
});
/*Funcion Asyncrona que retorna una peticion de un archivo 
json*/
function getProductsDb() {
  const url = "../dbProducts.json"; //obtenemos la direccion del json
  return fetch(url) //peticion fetch
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
}

/*********************Parte 2**************************/
/****************************************/

/*funcion que recibe una funcion asyncrona, y usamos async/await para 
volverla sincronica*/
//esta funcion carga los productos en el body html
async function loadProducts() {
  //constante que espera a que termine la asyncronia de la funcion de la peticion de los datos
  const products = await getProductsDb();
  /*variable llamada html para almacenar los productos y meterlos 
    al body del html*/
  let html = "";
  //forEach para recorrer la constante productos
  products.forEach((product) => {
    html += `
        <div class="col-3 product-container">
            <div class="card product">
                <img
                    src="${product.image}"
                    class="card-img-top"
                    alt="${product.name}"
                />
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.extraInfo}</p>
                    <p class="card-text">${product.price} € / Unidad</p>
                    <button type="button" class="btn btn-primary btn-cart" onclick=(addProductCart(${product.id}))>Añadir al carrito</button>
                </div>
            </div>
        </div>
      `;
  }); //termina el forEach
  //metemos la variable html, en un elemento con clase products
  /*******aqui paractimente se cargan todos los productos en el documento*****/
  document.getElementsByClassName("products")[0].innerHTML = html;
}

/*********************Parte 3**************************/
/****************************************/

/*Funcion para abrir y cerrar carrito*/
function openCloseCart() {
  /* constante para tomar el elemento donde meteremos todos los productos
    que escojamos en el carrito*/
  const containerCart = document.getElementsByClassName("cart-products")[0];
  /* la propiedad classList nos devuelve un objeto con todas las
clases del elemento*/
  containerCart.classList.forEach((item) => {
    if (item === "hidden") {
      containerCart.classList.remove("hidden");
      containerCart.classList.add("active");
    } //termina el if

    if (item === "active") {
      containerCart.classList.remove("active");
      containerCart.classList.add("hidden");
    } //termina if
  });
}

/*********************Parte 4**************************/
/****************************************/
/*funcion que agrega un producto al carrito*/
//se le agrega al boton de añadir a carrito
//en la funcion loadProducts() que carga los productos en el body
function addProductCart(idProduct) {
  /*array para todos los id de los productos que se van añadir*/
  let arrayProductsId = [];
  /*variable para obtener los id del localStorage*/
  //usamos la constante CART_PRODUCTOS como referencia
  let localStorageItems = localStorage.getItem(CART_PRODUCTOS);

  if (localStorageItems === null) {
    /* si en localStorage no esta definido con ningun valor con el key CART_PRODUCTOS
    utilizando la variable localStorageItems*/
    arrayProductsId.push(idProduct); // metemos en el arrayProducts el id ingresado
    localStorage.setItem(CART_PRODUCTOS, arrayProductsId); // seteamos un valor en el local storge
    //con el key CART_PRODUCTOS y con el valor del arrayProductsId
    /////////////
  } //fin del if
  else {
    /*variable para obtener los id del localStorage*/
    //usamos la constante CART_PRODUCTOS como referencia
    let productsId = localStorage.getItem(CART_PRODUCTOS);
    if (productsId.length > 0) {
      productsId +=
        "," +
        idProduct; /* si el contenido en el localStorage es mayor a 0,
          productsId va ser igual a los elementos que contiene, mas el id ingresado*/
    } //final del if
    else {
      productsId = productsId;
    } //final del else
    localStorage.setItem(CART_PRODUCTOS, productsId);
  } //final del else
  loadProductCart();
}
/*Funcion que se llama siempre que se agrega un producto al carrito*/
//sera la funcion que los cargue en la parte del carrito
//esta funcion va anidada en la funcion addProductCart();
/*funcion que recibe una funcion asyncrona, y usamos async/await para 
volverla sincronica*/
async function loadProductCart() {
  //constante que espera a que termine la asyncronia de la funcion de la peticion de los datos
  const products = await getProductsDb();
  //convertimos el resultado del LocalStorage en un array
  const localStorageItems = localStorage.getItem(CART_PRODUCTOS);
  //variable contenedora del html que vamos a insertar en el carrito
  let html = "";
  if (!localStorageItems) {
    html = `
        <div class="cart-product empty">
        <p>El carrito esta vacío...</p>
        </div>
        `;
  } else {
    /*split es una funcion que convierte una
          cadena de texto en un array separando cada elemento por un caracter especifico.*/
    const idProductsSplit = localStorageItems.split(",");

    //ahora eliminamos los ids duplicados del array idProductsSplit
    const idProductsCart = Array.from(new Set(idProductsSplit));

    //hacemos un forEach dentro de otro ForEach para verificar
    idProductsCart.forEach((id) => {
      products.forEach((product) => {
        //products es la variable donde retorna una peticion
        //en este caso retornara una matriz de todos los productos
        if (id == product.id) {
          const quantity = countDuplicatesId(id, idProductsSplit); //funcion que retorna el numero de ids repetidos
          const totalPrice = product.price * quantity;
          /* en este templated  estructuramos con el html todos los productos dentro
                            del carrito*/
          html += `
                    <div class="cart-product">
                            <img src="${product.image}" alt="${product.name}"/>
                            <div class="cart-product-info">
                                 <span class="quantity">${quantity}</span> 
                                 <p>${product.name}</p>
                                 <p>${totalPrice.toFixed(2)}</p>
                                 <p class="change-quantity">
                                    <button onclick="decreaseQuantity(${
                                      product.id
                                    })">-</button>
                                    <button onclick="increaseQuantity(${
                                      product.id
                                    })">+</button>
                                 </p>
                                 <p class="cart-product-delete">
                                    <button onclick=(deleteProductCart(${
                                      product.id
                                    }))>Eliminar</button>
                                 </p>
                            
                            </div>
                    </div>
                `;
        } //termina el if
      }); //termina el forEach anidado
    }); //termina el forEach padre}
  }
  /*ingresamos todo el html en el div del carrito de nuestro documento html*/
  document.getElementsByClassName("cart-products")[0].innerHTML = html;
}

//funcion que cuenta cuantos duplicados hay en el LocalStorage
function countDuplicatesId(value, arrayIds) {
  let count = 0;
  arrayIds.forEach((id) => {
    if (value == id) {
      count++;
    }
  });
  return count;
}

/*********************Parte 5**************************/
/****************************************/

/*funcion que elimina un producto del carrito*/
//se le agrega al boton de eliminar producto
//en la funcion loadProductCart() que carga los productos en el body
function deleteProductCart(idProduct) {
  //creamos una variable para obtener los valores de la key CART_PRODUCTOS();
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  /*split es una funcion que convierte una
  cadena de texto en un array separando cada elemento por un caracter especifico.*/
  //en este caso es el valor en el localStorage
  const arrayIdProductsCart = idProductsCart.split(",");
  //creamos una variable donde le asignamos el valor de la funcion deleteAllIds
  const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);
  if (resultIdDelete) {
    let count = 0;
    let idsString = "";
    resultIdDelete.forEach((id) => {
      count++;
      if (count < resultIdDelete.length) {
        idsString += id + ",";
      } else {
        idsString += id;
      }
    });
    localStorage.setItem(CART_PRODUCTOS, idsString);
  }
  const idsLocalStorage = localStorage.getItem(CART_PRODUCTOS);
  if (!idsLocalStorage) {
    localStorage.removeItem(CART_PRODUCTOS);
  }
  loadProductCart();
}

/*creamos una funcion especifica para quitar elementos de un array*/
//esta funcion se anida en deleteProductsCart
function deleteAllIds(id, arrayIds) {
  return arrayIds.filter((itemId) => {
    return itemId != id;
  });
}

/*********************Parte 6**************************/
/****************************************/

//Funcion para incrementar la cantidad del producto en el carrito
function increaseQuantity(idProduct) {
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  const arrayIdProductsCart = idProductsCart.split(",");
  arrayIdProductsCart.push(idProduct);

  let count = 0;
  let idsString = "";
  arrayIdProductsCart.forEach((id) => {
    count++;
    if (count < arrayIdProductsCart.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(CART_PRODUCTOS, idsString);
  loadProductCart();
}
//Funcion para decrementar la cantidad del producto en el carrito
function decreaseQuantity(idProduct) {
  const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
  const arrayIdProductsCart = idProductsCart.split(",");

  const deleteItem = idProduct.toString();
  let index = arrayIdProductsCart.indexOf(deleteItem);
  if (index > -1) {
    arrayIdProductsCart.splice(index, 1);
  }

  let count = 0;
  let idsString = "";
  arrayIdProductsCart.forEach((id) => {
    count++;
    if (count < arrayIdProductsCart.length) {
      idsString += id + ",";
    } else {
      idsString += id;
    }
  });
  localStorage.setItem(CART_PRODUCTOS, idsString);
  loadProductCart();
}
