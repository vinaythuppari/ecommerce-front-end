import {useState, useEffect} from 'react'
import Header from '../Header'
import './index.css'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  const removeFromCart = id => {
    console.log('Removing item with id:', id)
    const updatedCart = cartItems.filter(item => item.id !== id)
    console.log('Updated cart:', updatedCart)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  return (
    <>
      <Header />
      <div className="cart-container">
        <h1 className="cart-heading">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-img.png"
              alt="cart"
              className="cart-img"
            />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <ul className="cart-items-list">
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="cart-thumb"
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>Brand: {item.brand}</p>
                  <p>Price: Rs {item.price}/-</p>
                  <p>Rating: {item.rating}</p>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default Cart
