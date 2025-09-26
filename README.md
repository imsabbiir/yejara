account delete completely but after account delete the user drop down menu show the userMenu but i want when i delete the account it show login menu 


password change field auto fill password


pagination
















































"use client";
import { addToCart } from "@/utils/cartActions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

function ProductVACard({
  productImage,
  name,
  ratting,
  category,
  regularPrice,
  offerPrice,
  categorySlug,
  subCategorySlug,
  productId,
  onWishlistUpdate, 
}) {
  const route = useRouter();
  const [user, setUser] = useState();
  const [wishLists, setWishLists] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/wishlists");
      const data = await response.json();
      setWishLists(data);
    };
    fetchData();
  }, []);

  const isWishlisted = wishLists.some(
    (item) => item.productId === productId && item.userId === user?._id
  );

  

  const handleWishLists = async () => {
    if (!user) return;

    const alreadyInWishlist = wishLists.some(
      (item) => item.productId === productId && item.userId === user._id
    );

    try {
      if (alreadyInWishlist) {
        const res = await fetch(
          `/api/wishlists?userId=${user._id}&productId=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          setWishLists((prev) => {
            const updated = prev.filter(
              (item) =>
                !(item.productId === productId && item.userId === user._id)
            );
            console.log("Updated wishlist after delete:", updated);
            return updated;
          });
          window.dispatchEvent(new Event("wishlistUpdated"));
          onWishlistUpdate?.(productId);
        }
      } else {
        const res = await fetch("/api/wishlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, productId }),
        });

        if (res.ok) {
          const newItem = await res.json();
          setWishLists((prev) => [...prev, newItem]);
          window.dispatchEvent(new Event("wishlistUpdated"));
          onWishlistUpdate?.(null);
        }
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };

  return (
    <div className="bg-[#fff] border border-[#f0f0f0] rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl group w-full">
      <div className="w-full h-[270px] bg-[rgba(0,0,0,0.3)] rounded overflow-hidden relative">
        <Image
          src={productImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full object-top group-hover:scale-105 group-hover:transition-all duration-300 cursor-pointer"
          onClick={() => {
            route.push(`/products/${categorySlug}/${subCategorySlug}/${productId}`);
          }}
        />
        <div className="h-full px-4 absolute top-0 -right-full flex flex-col gap-3 justify-center items-center group-hover:right-0 group-hover:transition-all duration-300 ease-in-out">
          <div
            className={`h-8 w-8 rounded flex justify-center items-center text-lg cursor-pointer ${
              isWishlisted ? "bg-red-400 text-white" : "bg-white text-gray-800"
            }`}
            onClick={handleWishLists}
          >
            <CiHeart />
          </div>

          <div
            className="border border-[#ededed] h-8 w-8 bg-white rounded flex justify-center items-center text-lg cursor-pointer"
            onClick={handleAddToCart}
          >
            <CiShoppingCart />
          </div>
        </div>
      </div>
      <div className="p-5">
        <span
          className="text-red-400 text-xs font-light cursor-pointer hover:underline"
          onClick={() => {
            route.push(`/products/${categorySlug}`);
          }}
        >
          {category}
        </span>
        <h2
          className="text-[#757575] leading-5 mb-2 cursor-pointer hover:text-[#333]"
          onClick={() => {
            route.push(`/products/${categorySlug}/${subCategorySlug}/${productId}`);
          }}
        >
          {name.length > 25 ? `${name.slice(0, 25)}...` : name}
        </h2>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${
                i < ratting ? "text-yellow-500" : "text-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="flex items-end gap-3">
          <del className="text-[#787878] font-light">${regularPrice}</del>
          <span className="font-bold text-red-400">${offerPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductVACard;








































// export async function GET() {
//     try {
//     await dbConnect();

//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const cartItems = await CartItems.find({ userId });
//     return NextResponse.json(cartItems);
//   }catch(error){
//         return NextResponse.json(
//             {message: "cart item fatch failed"},
//             {status : 500}
//         )
//     }
// }