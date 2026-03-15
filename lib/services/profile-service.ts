import { prisma } from "@/lib/database/prisma";
import { decrypt, generateKey } from "@/lib/crypto/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../exceptions/toast-error";
import { Prisma } from "@/prisma/generated/prisma/client";
export class ProfileService {

  private static async getContext() {

    const key = await generateKey();
    return { key };

  }

  static async updateProfile(data: User) {

    const { key } = await this.getContext();

    if (!data.encrypted_id) {
      throw new Error("encrypted_id is required");
    }

    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const updateData: Partial<Prisma.UserUpdateInput> = {};
    
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData as Prisma.UserUpdateInput,
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