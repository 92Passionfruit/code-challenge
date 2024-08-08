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
    </div>
  );
};

export default ShoppingCart;
