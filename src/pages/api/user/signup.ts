// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ name: "Missing email or password" });
    return;
  }

  const client = await connectToDB();
  const db = client.db();

  // Check if user with the given email already exists
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    res.status(409).json({ name: "User with this email already exists" });
    await client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);
  console.log({ hashedPassword });
  const result = await db.collection("users").insertOne({
    email,
    password: hashedPassword,
  });
  console.log(result);
  await client.close();
  if (result.acknowledged) {
    res.status(201).json({ name: "User created" });
  } else {
    res.status(500).json({ name: "Failed to create user" });
  }
}
