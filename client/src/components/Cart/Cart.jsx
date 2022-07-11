import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { useSelector, useDispatch } from "react-redux";
import { getEvents, getCartDB, deleteCart, putCartDB, checkout } from "../../redux/actions";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Style from "./Cart.module.css";
// import redirectToCheckout from "stripe";
import { style } from "@mui/system";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //*Auth0 datos de usuario logeado y popUp de logeo
  const { user, loginWithPopup } = useAuth0();
  // const [flag, setFlag] = useState(false);
  //*datos de carrito
  const {
    isEmpty,
    totalUniqueItems,
    items,
    cartTotal,
    updateItemQuantity,
    removeItem,
    updateItem,
  } = useCart();
  
  let temporal = localStorage.getItem("user");

  let userStorage 
  if(temporal !== "nada"){
    userStorage = JSON.parse(temporal)
  }else{
    userStorage = ""
  }

  const {cartDB, sesion} = useSelector(state =>state);

  useEffect(() => {
    dispatch(getEvents());
    if(userStorage !== ""){
      dispatch(getCartDB(userStorage.id))
    }
  }, []);

  // useEffect(()=>{
  //   if(userStorage !== ""){
  //   dispatch(getCartDB(userStorage.id))
  //   }
  // },[flag])

  let ambos= [];
  if(userStorage !== ""){
    let data = [...cartDB]
    ambos = data.sort((a,b) => {
      return (a.variant - b.variant)
    })
   }else{
     ambos= [...items]
   }

   let cantidadEventos= 0;
   if(userStorage !== ""){
     cantidadEventos = cartDB.length
    }else{
     cantidadEventos = totalUniqueItems
    }

  if (userStorage !== "" && cartDB.length === 0){
    return <p className={Style.carritoVacio}>Sin eventos en el carrito </p>;
  }else if(userStorage === "" && isEmpty){
    return <p className={Style.carritoVacio}>Sin eventos en el carrito </p>;
  }

 const handleDelete = async (id) => {
  if(userStorage !== ""){
  await dispatch(deleteCart(id))
    // setFlag(!flag)
  }else{
    removeItem(id)
  }
 }

 const handleUpdate = async (item, operador) => {
  if(userStorage !== ""){
    if(operador === "-"){
     await dispatch(putCartDB({id:item.id, quantity:item.quantity- 1}))
      // setFlag(!flag)
    }else{
      await dispatch(putCartDB({id:item.id, quantity:item.quantity+ 1}))
      // setFlag(!flag)
    }
  }else{
    if(operador === "-"){
      updateItemQuantity(item.id, item.quantity - 1)
    }else{
      updateItemQuantity(item.id, item.quantity + 1)
    }
  }
}

const handleCheckout =async () => {
  let pago = []
  cartDB.map(e => pago.push({price: e.idPrice, quantity: e.quantity}))
   await dispatch(checkout(pago))
   navigate("/cart/checkout")
}

let totalTodos;
if(userStorage !== ""){
  totalTodos = cartDB.map(item => item.itemTotal).reduce((prev, curr) => prev + curr, 0);
 }else{
  totalTodos = cartTotal
 }
  return (
    <div className={Style.containerGeneral}>
      <div>Carrito ({cantidadEventos})</div>
      <ul>
        {ambos.map((item) => (
          
          <li key={item.id} className={Style.items}>
            <div>
            {item.quantity} x {item.nombre} 
            <img src={item.performerImage} alt={item.nombre} className={Style.image} />
            </div>
           <div className={Style.tipo}>
             
              <div >
                Tipo de entrada:{" "}
                {item.variant === "streamingPrice"
                  ? "Streaming"
                  : item.variant === "generalPrice"
                  ? "General"
                  : item.variant === "generalLateralPrice"
                  ? "General lateral"
                  : item.variant === "vipPrice"
                  ? "Vip"
                  : item.variant === "palcoPrice"
                  ? "Palco"
                  : null}
              </div>
            
            <div> {item.schedule.split("T")[0]} {'  '}
            {item.schedule.split("T")[1].split(":")[0] + ":" + item.schedule.split("T")[1].split(":")[1]} h</div>
            <div>Precio: ${item.price} Total: ${item.itemTotal === 0 ? null : item.itemTotal}</div>
            <div>
           
            <button
              className={Style.btn}
              onClick={() =>
                item.quantity > 1
                  ? handleUpdate(item, "-")
                  : null
              }
            >
              -
            </button>
            <button
              className={Style.btn}
              onClick={() => handleUpdate(item, "+")}
            >
              +
            </button>
            <button className={Style.btn} onClick={() => handleDelete(item.id)}>
              &times;
            </button>
            </div>
            </div>
          </li>
        ))}
      </ul>
        <div>
        Total final: ${totalTodos} ARS.
          </div>
        <button
          className={Style.btncomprar}
          onClick={() =>
            !user ? loginWithPopup() : handleCheckout()
          }
        >
          Ver detalle
        </button>
    </div>
  );
}

