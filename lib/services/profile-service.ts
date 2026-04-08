import { prisma } from "@/lib/database/prisma";
import { generateKey } from "@/lib/crypto/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../exceptions/toast-error";
import { Prisma } from "@/prisma/generated/prisma/client";
export class ProfileService {

  private static async getContext() {

    const key = await generateKey();
    return { key };

  }

  public static async updateProfile(data: User) {

    if (!data.id) {
      throw new Error("id is required");
    }

    const updateData: Partial<Prisma.UserUpdateInput> = {};
    
    if (data.email && data.name) {
      const emailTrimmed = data.email.trim();

      const existingUser = await prisma.user.findFirst({
        where: {
          email: emailTrimmed,
          NOT: { id: data.id },
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
      where: { id: data.id },
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