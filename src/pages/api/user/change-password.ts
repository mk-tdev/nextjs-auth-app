// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "../../../../lib/db";
import { hashPassword, verifyPassword } from "../../../../lib/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  console.log({ session });

  if (req.method !== "PATCH") {
    res.status(405).json({ name: "Method Not Allowed" });
    return;
  }

  if (!session) {
    res.status(401).json({ name: "Unauthorized" });
    return;
  }

  const { newPassword, oldPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ name: "Missing email or password" });
    return;
  }

  const userEmail = session?.user?.email;
  if (!userEmail) {
    res.status(500).json({ name: "Internal Server Error" });
    return;
  }

  const client = await connectToDB();
  const db = client.db();
  const existingUser = await db
    .collection("users")
    .findOne({ email: userEmail });

  if (!existingUser) {
    res.status(404).json({ name: "User not found" });
    await client.close();
    return;
  }

  const isPasswordValid = await verifyPassword(
    oldPassword,
    existingUser.password
  );

  if (!isPasswordValid) {
    res.status(401).json({ name: "Invalid old password" });
    await client.close();
    return;
  }

  const hashedNewPassword = await hashPassword(newPassword);
  const result = await db
    .collection("users")
    .updateOne({ email: userEmail }, { $set: { password: hashedNewPassword } });

  if (result.modifiedCount === 1) {
    res.status(200).json({ name: "Password updated successfully" });
  } else {
    res.status(500).json({ name: "Failed to update password" });
  }
  await client.close();
}
