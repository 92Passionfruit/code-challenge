// Define a type or interface for product if not already defined
interface Product {
  uuid: number;
  name: string;
  price: number;
}

interface ShoppingCartProps {
  cart: Product[]; // Define the type of cart items
}

const ShoppingCart = ({ cart }: ShoppingCartProps) => {
  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.uuid}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingCart;
