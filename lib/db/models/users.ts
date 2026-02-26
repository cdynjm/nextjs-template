import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
    id: varchar("id", { length: 255 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow()
})