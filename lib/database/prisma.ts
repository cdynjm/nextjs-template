import { database } from "@/lib/helpers/database-name";
import { Prisma } from "@/prisma/generated/prisma/client";
import { getPHTodayUTC } from "../helpers/date";

let prismaClient;

if (database() === "mysql") {
  const { prisma } = await import("@/prisma/mysql-prisma");
  prismaClient = prisma;
} else {
  const { prisma } = await import("@/prisma/postgres-prisma");
  prismaClient = prisma;
}

const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = {
          ...args.where,
          deleted_at: null,
        };
        return query(args);
      },

      async findFirst({ args, query }) {
        args.where = {
          ...args.where,
          deleted_at: null,
        };
        return query(args);
      },

      async findUnique({ args, query }) {
        args.where = {
          ...args.where,
          deleted_at: null,
        };
        return query(args);
      },

      async count({ args, query }) {
        args.where = {
          ...args.where,
          deleted_at: null,
        };
        return query(args);
      },

      async create({ args, query }) {
        args.data = {
          ...args.data,
          created_at: getPHTodayUTC(),
          updated_at: getPHTodayUTC(),
        };
        return query(args);
      },

      async createMany({ args, query }) {
        args.data = {
          ...args.data,
          created_at: getPHTodayUTC(),
          updated_at: getPHTodayUTC(),
        };
        return query(args);
      },

      async update({ args, query }) {
        args.data = {
          ...args.data,
          updated_at: getPHTodayUTC(),
        };
        return query(args);
      },

      async updateMany({ args, query }) {
        args.data = {
          ...args.data,
          updated_at: getPHTodayUTC(),
        };
        return query(args);
      },
    },
  },

  model: {
    $allModels: {
      async delete<T>(
        this: T,
        where: Prisma.Args<T, "update">["where"],
      ): Promise<
        Prisma.Result<
          T,
          {
            where: Prisma.Args<T, "update">["where"];
            data: { deleted_at: Date };
          },
          "update"
        >
      > {
        const context = Prisma.getExtensionContext(this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (context as any).update({
          where,
          data: {
            deleted_at: getPHTodayUTC(),
          },
        });
      },
      async deleteMany<T>(
        this: T,
        where: Prisma.Args<T, "updateMany">["where"],
      ): Promise<
        Prisma.Result<
          T,
          {
            where: Prisma.Args<T, "updateMany">["where"];
            data: { deleted_at: Date };
          },
          "updateMany"
        >
      > {
        const context = Prisma.getExtensionContext(this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (context as any).updateMany({
          where,
          data: {
            deleted_at: getPHTodayUTC(),
          },
        });
      },
    },
  },
});

export { prisma };
