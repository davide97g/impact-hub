import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = req.body;

    // Log repository and user information
    console.log("Repository Info:", payload.repository);
    console.log("User Info:", payload.sender);

    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
