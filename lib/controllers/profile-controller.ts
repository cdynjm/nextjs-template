import { prisma } from "@/lib/db/prisma";
import { decrypt, generateKey } from "@/lib/security/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
export class ProfileController {
  static async updateProfile(data: User) {
    if (!data.encrypted_id) {
      throw new Error("encrypted_id is required");
    }

    const key = await generateKey();
    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const updateData: { email?: string; name?: string; password?: string; } = {};

    if (data.email && data.name) {
      updateData.email = data.email.trim();
      updateData.name = data.name;
    }

    if (data.password && data.password.trim() !== "")
      updateData.password = await bcrypt.hash(data.password.trim(), 10);

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid data to update");
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        name: true,
        email: true,
        created_at: true,
      },
    });
  }
}
