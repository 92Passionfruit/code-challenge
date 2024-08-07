import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingCart from "../context/ShoppingCart";
import productsData from "../assets/products.json";

// Core Functionality Tests
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

// Edge Cases
describe("ShoppingCart Component - Edge Cases", () => {
  // Edge Case: Empty Cart
  test("handles an empty cart", async () => {
    render(<ShoppingCart />);

    // Check cart starts empty
    const totalElement = await screen.findByText(/^Total:/);
    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));
      expect(total).toBeCloseTo(0, 2); // Total = $0 for an empty cart
    } else {
      throw new Error("Total text not found.");
    }
  });

  // Edge Case: Single Product
  test("displays correct total cost with a single product", async () => {
    render(<ShoppingCart />);

    const product = productsData[0];

    // Add 1 product to cart
    const addButton = await screen.findByTestId(`add-to-cart-${product.uuid}`);
    fireEvent.click(addButton);

    // Check product is in cart
    const cartItem = await screen.findByText(product.name);
    expect(cartItem).toBeInTheDocument();

    // Check display of total
    const totalElement = await screen.findByText(/^Total:/);
    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));
      const productPrice = parseFloat(product.price);

      expect(total).toBeCloseTo(productPrice, 2);
    } else {
      throw new Error("Total text not found.");
    }
  });

  //Edge Case: Cart items persist across page refreshes
  test("persists items in the cart across page refreshes", async () => {
    const { unmount } = render(<ShoppingCart />);

    const product = productsData[0];

    // Find and click 'Add to Cart'
    const addButton = await screen.findByTestId(`add-to-cart-${product.uuid}`);
    fireEvent.click(addButton);

    // Check product is added to cart
    const cartItem = await screen.findByText(product.name);
    expect(cartItem).toBeInTheDocument();

    // Simulate page refresh
    unmount();
    render(<ShoppingCart />);

    // Check product is still in cart after refresh
    const persistedCartItem = await screen.findByText(product.name);
    expect(persistedCartItem).toBeInTheDocument();
  });
});
