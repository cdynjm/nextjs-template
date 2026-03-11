export function database(): "postgres" | "mysql" {
  return process.env.DATABASE === "postgres" ? "postgres" : "mysql";
}