import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShoppingCart from "../context/ShoppingCart";
import productsData from "../assets/products.json";
import Store from "../pages/Store";

// Mock data
const mockCart = productsData.slice(0, 1); // No discount
const mockCartTwo = productsData.slice(0, 2); // Discount applicable
const mockEmptyCart = productsData.slice(0, 0); // Empty

describe("ShoppingCart Component", () => {
  test("adds products to the shopping cart", async () => {
    render(<Store />);

    const product = productsData.find((p) => p.uuid === 1411);

    if (product) {
      // Find and click 'Add to Cart' (uuid identifies product being added)
      const addButton = await screen.findByTestId(
        `add-to-cart-${product.uuid}`
      );
      fireEvent.click(addButton);

      // Check product has been added to cart
      const cartItem = await screen.findByText(product.name);
      expect(cartItem).toBeInTheDocument();
    } else {
      throw new Error("Product not found in productsData");
    }
  });

  test("calculates and displays total cost without discount", async () => {
    render(<ShoppingCart cart={mockCart} />);

    // Check total is displayed correctly
    const totalElement = await screen.findByText(/^Total:/);
    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));

      // Calculate expected total without discount
      const expectedTotal = mockCart.reduce(
        (sum, product) => sum + product.price,
        0
      );

      // Check total matches expected value without discount
      expect(total).toBeCloseTo(expectedTotal, 2);
    } else {
      throw new Error("Total text not found.");
    }
  });

  test("calculates and displays total cost with discount", async () => {
    render(<ShoppingCart cart={mockCartTwo} />);

    // Check total is displayed correctly
    const totalElement = await screen.findByText(/^Total:/);
    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));

      // Calculate expected subtotal
      const subtotal = mockCartTwo.reduce(
        (sum, product) => sum + product.price,
        0
      );

      // Apply discount logic
      let expectedTotal = subtotal;
      if (subtotal > 100) {
        expectedTotal = subtotal - subtotal * 0.2;
      } else if (subtotal > 50) {
        expectedTotal = subtotal - subtotal * 0.15;
      } else if (subtotal > 20) {
        expectedTotal = subtotal - subtotal * 0.1;
      }

      // Check total matches expected value with discount
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
    render(<ShoppingCart cart={mockEmptyCart} />);

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
    render(<ShoppingCart cart={mockCart} />);

    const product = mockCart[0];

    // Check product is in cart
    const cartItem = await screen.findByText(new RegExp(product.name)); //regular expression to account for ':' added to end of item name in ShoppingCart

    expect(cartItem).toBeInTheDocument();

    // Check display of total
    const totalElement = await screen.findByText(/^Total:/);
    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));

      expect(total).toBeCloseTo(product.price, 2);
    } else {
      throw new Error("Total text not found.");
    }
  });

  //Edge Case: Cart items persist across page refreshes
  test("persists items in the cart across page refreshes", () => {
    // Clear localStorage
    localStorage.clear();

    // Render the ShoppingCart with mockCartTwo
    render(<ShoppingCart cart={mockCartTwo} />);

    // Simulate page refresh
    localStorage.setItem("cart", JSON.stringify(mockCartTwo));
    // Clear and re-render ShoppingCart
    const { unmount } = render(<ShoppingCart cart={mockCartTwo} />);
    unmount();
    render(<ShoppingCart cart={mockCartTwo} />);

    // Check products from mockCartTwo are still in cart after refresh
    mockCartTwo.forEach((product) => {
      const cartItem = screen.getByText(new RegExp(`${product.name}:`));
      expect(cartItem).toBeInTheDocument();
    });
  });

  // Edge Case: Multiples of same item are added to cart
  test("handles multiple quantities of the same item in cart", async () => {
    render(<ShoppingCart cart={mockCart} />);

    const product = mockCart[0];

    // Simulate adding same product multiple times (3) with loop
    for (let i = 0; i < 3; i++) {
      const addButton = await screen.findByTestId(
        `add-to-cart-${product.uuid}`
      );
      fireEvent.click(addButton);
    }

    // Check product is in cart with correct quantity
    const cartItem = await screen.findByText(
      new RegExp(`${product.name} \\(3\\)`)
    );
    expect(cartItem).toBeInTheDocument();

    // Check total price calculation/display
    const totalElement = await screen.findByText(/^Total:/);
    expect(totalElement).toBeVisible();

    const totalText = totalElement.textContent;

    if (totalText) {
      const total = parseFloat(totalText.replace("Total: $", ""));
      const expectedTotal = product.price * 3; // 3 items in cart

      expect(total).toBeCloseTo(expectedTotal, 2);
    } else {
      throw new Error("Total text not found.");
    }
  });
});
