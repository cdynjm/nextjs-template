import { prisma } from "@/lib/db/prisma";
import { decrypt, generateKey } from "@/lib/security/cipher";

interface UpdateProfileData {
  encrypted_id?: string;
  email?: string;
  password?: string;
}

export class ProfileController {
  static async updateProfile(data: UpdateProfileData) {

    if (!data.encrypted_id) {
      throw new Error("encrypted_id is required");
    }

    const key = await generateKey();
    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const updateData: { email?: string; password?: string } = {};

    if (data.email) updateData.email = data.email.trim();
    

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid data to update");
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        created_at: true,
      },
    });
  }
}