import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const bdtAmount = Number(amount);

    // validation
    if (!bdtAmount || bdtAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // 💱 FIXED CONVERSION (BDT → USD)
    // You should later replace this with live exchange API
    const USD_RATE = 0.0091;
    const usdAmount = bdtAmount * USD_RATE;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(usdAmount * 100), // USD cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}