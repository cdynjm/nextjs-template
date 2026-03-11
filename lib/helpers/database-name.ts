export function database() {
   if(process.env.DATABASE === "postgres")
    return "postgres";
   else
    return "mysql";
}