import { encrypt, generateKey } from "@/lib/security/cipher";
import { users } from "../db/models";
import { db } from "@/lib/db/connection";

export class UsersController {
  static async getUsers() {
    try {
      const key = await generateKey();
      const usersData = await db.select().from(users);

      return await Promise.all(
        usersData.map(async (user) => ({
          encrypted_id: await encrypt(user.id.toString(), key),
          email: user.email,
          createdAt: user.createdAt,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
