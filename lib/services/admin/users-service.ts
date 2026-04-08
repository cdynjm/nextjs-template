import { prisma } from "@/lib/database/prisma";
import { generateKey } from "@/lib/crypto/cipher";
import bcrypt from "bcryptjs";
import { User } from "@/types";
import { ToastError } from "../../exceptions/toast-error";
import { getAuth } from "../../auth/session/server-use-auth";
import { Prisma } from "@/prisma/generated/prisma/client";
import { UserUpdateInput } from "@/prisma/generated/prisma/models";
import { Page, Limit } from "@/lib/helpers/pagination";
export class UsersService {
  private static async getContext() {
    const key = await generateKey();
    const { user } = await getAuth();
    return { key, user };
  }

  public static async getUsers(page = Page, limit = Limit) {
    const skip = (page - 1) * limit;
    const [usersData, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,

        orderBy: { updated_at: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: usersData,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async createUser(data: User) {
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

  public static async updateUser(data: User) {
    const { user } = await this.getContext();
    let updateSession = false as boolean;
    
    if (!data.id) {
      throw new ToastError("encrypted_id is required");
    }

    const updateData: Partial<UserUpdateInput> = {};

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
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (user?.id === data.id) {
      updateSession = true;
    }

    return {
      user: updatedUser,
      toastDescription: "User has been updated successfully.",
      updateSession,
    };
  }

  public static async deleteUser(data: User) {
    const { user } = await this.getContext();

    if (!data.id) {
      throw new ToastError("encrypted_id is required");
    }

    if (user?.id === data.id) {
      throw new ToastError("Authenticated user cannot be deleted.");
    }

    await prisma.user.delete({ id: data.id });

    return {
      toastDescription: "User has been deleted successfully.",
    };
  }
}
