import React from "react";
interface Product {
  uuid: number;
  name: string;
  price: number;
}

interface ShoppingCartProps {
  cart: Product[];
}

const ShoppingCart = ({ cart }: ShoppingCartProps) => {
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
            {/* ':' = temp fix to prevent duplication of item name in Store.tsx */}
            <div>${item.price}</div>
          </li>
        ))}
      </ul>
      {/* Display total price */}
      <div>Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
};

export default ShoppingCart;
