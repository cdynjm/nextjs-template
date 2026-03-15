import { prisma } from "@/lib/database/prisma";
import { encrypt, decrypt, generateKey } from "@/lib/crypto/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../exceptions/toast-error";
import { getAuth } from "../auth/session/server-use-auth";
import { Prisma } from "@/prisma/generated/prisma/client";
import { UserUpdateInput } from "@/prisma/generated/prisma/models";
export class UsersService {

  private static async getContext() {

    const key = await generateKey();
    const { user } = await getAuth();
    return { key, user };

  }

  static async getUsers() {

    const { key } = await this.getContext();
    const usersData = await prisma.user.findMany();

    return await Promise.all(
      usersData.map(async ({ id, ...rest }) => ({
        encrypted_id: await encrypt(id.toString(), key),
        ...Object.fromEntries(
          Object.entries(rest).filter(([key]) => key !== "password")
        ),
      }))
    );
  }

  static async createUser(data: User) {

    if (!data.email || !data.name || !data.password) {
      throw new ToastError("Email, name, and password are required");
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

    const createData: Partial<Prisma.UserCreateInput> = {
      email: data.email.trim(),
      name: data.name.trim(),
      password: await bcrypt.hash(data.password.trim(), 10),
    };

    await prisma.user.create({
      data: createData as Prisma.UserCreateInput,
    });

    return {
      toastDescription: "User has been created successfully.",
    };
  }

  static async updateUser(data: User) {

    const { key, user } = await this.getContext();
    let updateSession = false as boolean;

    if (!data.encrypted_id) {
      throw new ToastError("encrypted_id is required");
    }

    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    const updateData: Partial<UserUpdateInput> = {};

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
    });

    if (user?.encrypted_id) {
      const authUserIdString = await decrypt(user.encrypted_id, key);
      const authUserId = parseInt(authUserIdString, 10);

      if (authUserId === userId) {
        updateSession = true;
      }
    }

    return {
      user: updatedUser,
      toastDescription: "User has been updated successfully.",
      updateSession,
    };
  }

  static async deleteUser(data: User) {

    const { key, user } = await this.getContext();

    if (!data.encrypted_id) {
      throw new ToastError("encrypted_id is required");
    }
    
    const userIdString = await decrypt(data.encrypted_id, key);
    const userId = parseInt(userIdString, 10);

    if (user?.encrypted_id) {
      const authUserIdString = await decrypt(user.encrypted_id, key);
      const authUserId = parseInt(authUserIdString, 10);

      if(authUserId === userId) {
        throw new ToastError("Authenticated user cannot be deleted.");
      }
    }

    await prisma.user.delete({ id: userId });

    return {
      toastDescription: "User has been deleted successfully.",
    };
  }
}
