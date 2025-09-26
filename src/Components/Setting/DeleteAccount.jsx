import React from "react";

function DeleteAccount() {
  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch("/api/deleteAccount", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deleted successfully");
        window.location.href = "/";
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (err) {
      alert("An error occurred while deleting account");
    }
  };
  return (
    <button
      onClick={handleDeleteAccount}
      className="px-10 mt-10 py-2 rounded cursor-pointer bg-red-500 font-semibold text-white hover:bg-red-600 transition-all duration-100 w-fit"
    >
      Delete
    </button>
  );
}

export default DeleteAccount;
