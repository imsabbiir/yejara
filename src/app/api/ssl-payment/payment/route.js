import { NextResponse } from "next/server";

export async function POST(req) {
  // Added 'req' parameter here
  try {
    const body = await req.json();

    const { total_amount, cus_name, cus_phone, cus_add, cus_city, cus_zip } =
      body;
    const tran_id = Math.floor(100000 + Math.random() * 900000).toString();
    const init_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const formData = new FormData();
    formData.append("store_id", process.env.SSLCOMMERZ_STORE_ID);
    formData.append("store_passwd", process.env.SSLCOMMERZ_STORE_PASSWORD);

    formData.append("total_amount", Math.floor(total_amount).toString());
    formData.append("currency", "BDT");
    formData.append("tran_id", tran_id);
    formData.append("product_category", "Ecommerce");
    formData.append("cus_email", "customer@example.com"); // SSLCommerz requires a dummy fallback email

    formData.append(
      "success_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl-payment/success?id=${tran_id}`,
    );
    formData.append(
      "fail_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl-payment/fail?id=${tran_id}`,
    );
    formData.append(
      "cancel_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ssl-payment/cancel?id=${tran_id}`,
    );
    formData.append(
      "ipn_url",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ipn?id=${tran_id}`,
    );

    formData.append("cus_name", cus_name || "Guest User");
    formData.append("cus_phone", cus_phone || "01700000000");
    formData.append("cus_add1", cus_add || "Dhaka"); // SSLCommerz expects cus_add1
    formData.append("cus_city", cus_city || "Dhaka");
    formData.append("cus_zip", cus_zip || "1000");
    formData.append("cus_country", "Bangladesh");
    formData.append("shipping_method", "NO");

    const requestOptions = { method: "POST", body: formData };
    let SSLRes = await fetch(init_url, requestOptions);
    let SSLResJSON = await SSLRes.json();
    if (SSLResJSON.status !== "SUCCESS") {
      console.error(
        "SSLCommerz Initialization Failed Reason:",
        SSLResJSON.failedreason,
      );
    }
    return NextResponse.json({ SSLResJSON });
  } catch (error) {
    console.error("SSL API Route Error:", error);
    return NextResponse.json({
      message: error.message || "Failed to initiate transaction",
      status: 500,
    });
  }
}
