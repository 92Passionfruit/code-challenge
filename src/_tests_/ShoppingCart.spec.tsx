import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingCart from "../context/ShoppingCart";
import productsData from "../assets/products.json";

describe("ShoppingCart Component", () => {
  test("adds products to the shopping cart", async () => {
    render(<ShoppingCart />);

    const product = productsData[0];

    // Find and click 'Add to Cart' (uuid identifies product being added)
    const addButton = await screen.findByTestId(`add-to-cart-${product.uuid}`);
    fireEvent.click(addButton);

    // Check product has been added to cart
    const cartItem = await screen.findByText(product.name);
    expect(cartItem).toBeInTheDocument();
  });

  test("calculates and displays total cost (with and without discounts)", async () => {
    render(<ShoppingCart />);

    // Add all products to cart
    for (const product of productsData) {
      const addButton = await screen.findByTestId(
        `add-to-cart-${product.uuid}`
      );
      fireEvent.click(addButton);
    }

    // Check total is displayed correctly
    const totalElement = await screen.findByText(/^Total:/);

    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));

      // Calculate expected total
      const subtotal = productsData.reduce(
        (sum, product) => sum + parseFloat(product.price),
        0
      );
      let expectedTotal = subtotal;

      // Apply discount logic
      if (subtotal > 100) {
        expectedTotal = subtotal - subtotal * 0.2;
      } else if (subtotal > 50) {
        expectedTotal = subtotal - subtotal * 0.15;
      } else if (subtotal > 20) {
        expectedTotal = subtotal - subtotal * 0.1;
      }

      if (subtotal <= 20) {
        expectedTotal = subtotal;
      }

      expect(total).toBeCloseTo(expectedTotal, 2);
    } else {
      throw new Error("Total text not found.");
    }
  });
});
