import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, name, total } = await req.json();

    // Format phone to international standard (e.g., 8801XXXXXXXX)
    const formattedPhone = phone.startsWith("+")
      ? phone.replace("+", "")
      : `88${phone.replace(/^0/, "")}`;

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "template",
          template: {
            name: "order_confirmation", // Must be approved in Meta Dashboard
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: `৳${total}` },
                ],
              },
            ],
          },
        }),
      },
    );

    const data = await response.json();
    return NextResponse.json({ success: response.ok, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
