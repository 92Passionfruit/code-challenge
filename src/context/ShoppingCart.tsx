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
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
