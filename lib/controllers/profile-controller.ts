import { prisma } from "@/lib/db/prisma";
import { decrypt, generateKey } from "@/lib/security/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../errors/toast-error";

export class ProfileController {
  static async updateProfile(data: User) {
    if (!data.encrypted_id) {
      throw new Error("encrypted_id is required");
    }

    const key = await generateKey();
    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const updateData: { email?: string; name?: string; password?: string } = {};
    
    if (data.email && data.name) {
      const emailTrimmed = data.email.trim();

      const existingUser = await prisma.user.findFirst({
        where: {
          email: emailTrimmed,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ToastError("Username is already taken");
      }

      updateData.email = emailTrimmed;
      updateData.name = data.name;
    }

    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password.trim(), 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid data to update");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        name: true,
        email: true,
        created_at: true,
        updated_at: true, 
      },
    });

    return {
      user: updatedUser,
      toastDescription: "Profile has been updated successfully.",
    };
  }
}