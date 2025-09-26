

export async function wishlists({ userId, productId }) {
  if (!userId || !productId) {
    console.error("Missing userId or productId");
    return { success: false, message: "Missing userId or productId" };
  }

  try {
    const res = await fetch("/api/wishlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }), // ✅ Corrected here
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add to wishlists");
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Add to wishlists error:", error.message);
    return { success: false, message: error.message };
  }
}

