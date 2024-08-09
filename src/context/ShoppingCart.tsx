import React, { useEffect, useState } from "react";
interface Product {
  uuid: number;
  name: string;
  price: number;
}

interface ShoppingCartProps {
  cart: Product[];
}

const ShoppingCart = ({ cart }: ShoppingCartProps) => {
  // TO DO:
  // Logic for aggregated items (multiples of same product added to cart)

  // State to store cart items
  const [cartItems, setCartItems] = useState<Product[]>(cart);

  useEffect(() => {
    // Retrieve cart from localStorage on mount (initial render only)
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Store cart items in localStorage whenever cartItems changes
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Apply discount logic
  let discount = 0;
  if (subtotal > 100) {
    discount = 0.2; // 20% set as discount subtotal meets/passes $100 threshold
  } else if (subtotal > 50) {
    discount = 0.15; // 15% set as discount if meet/pass $50
  } else if (subtotal > 20) {
    discount = 0.1; // 10% set as discount if meet/pass $20
  }

  // Calculate total price after discount
  const totalPrice = subtotal * (1 - discount);

  // Display
  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.uuid}>
            <div>{`${item.name}:`}</div>{" "}
            {/* ':' = temp fix to prevent duplication of item name in Store.tsx (TO DO: permanent fix) */}
            <div>${item.price}</div>
          </li>
        ))}
      </ul>
      {/* Display total price */}
      <div>Total: ${totalPrice.toFixed(2)}</div>{" "}
      {/* TO DO: display subtotal and discount applied before rendering total price */}
    </div>
  );
};

export default ShoppingCart;

//TO DO:
// logic/display for item removal/increase/decrease from cart (TDD - write tests first)
