import { encrypt, generateKey } from "@/lib/security/cipher";
import { prisma } from '@/lib/db/prisma'

export class UsersController {
  static async getUsers() {
    try {
      const key = await generateKey();
      const usersData = await prisma.user.findMany();

      return await Promise.all(
        usersData.map(async (user) => ({
          encrypted_id: await encrypt(user.id.toString(), key),
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at
        })),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
