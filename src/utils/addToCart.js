export async function addToCart({ userId, productId, quantity = 1 }) {
  if (!userId || !productId) {
    console.error("Missing userId or productId");
    return { success: false, message: "Missing userId or productId" };
  }

  try {
    const res = await fetch("/api/cart-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add to cart");
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return { success: false, message: error.message };
  }
}