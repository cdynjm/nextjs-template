import { encrypt, decrypt, generateKey } from "@/lib/security/cipher";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../errors/toast-error";
export class UsersController {
  static async getUsers() {
    try {
      const key = await generateKey();
      const usersData = await prisma.user.findMany({
        where: { deleted_at: null }
      });

      return await Promise.all(
        usersData.map(async (user) => ({
          encrypted_id: await encrypt(user.id.toString(), key),
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }

  static async createUser(data: User) {
    if (!data.email || !data.name || !data.password) {
      throw new Error("Email, name, and password are required");
    }

    const emailTrimmed = data.email.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        email: emailTrimmed,
      },
    });

    if (existingUser) {
      throw new ToastError("Username is already taken");
    }

    const createData = {
      email: data.email.trim(),
      name: data.name.trim(),
      password: await bcrypt.hash(data.password.trim(), 10),
    };

    const createdUser = await prisma.user.create({
      data: createData
    });

    return {
      user: createdUser,
      toastDescription: "User has been created successfully.",
    };
  }

  static async updateUser(data: User) {
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      user: updatedUser,
      toastDescription: "User has been updated successfully.",
    };
  }

  static async deleteUser(data: User) {
    if (!data.encrypted_id) {
      throw new Error("encrypted_id is required");
    }

    const key = await generateKey();
    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const deleteData = {
      deleted_at: new Date()
    };

    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: deleteData
    });

    return {
      user: deletedUser,
      toastDescription: "User has been updated successfully.",
    };
  }
}
