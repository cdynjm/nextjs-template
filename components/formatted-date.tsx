export interface FormattedDateProps {
  date: string | Date;
  endDate?: string | Date;
  variant?: "datetime" | "date" | "age" | "month-year" | "date-range";
}

export default function FormattedDate({
  date,
  endDate,
  variant = "datetime",
}: FormattedDateProps) {
  // Treat string as PH-local time, not UTC
  const parsePHDate = (d: string | Date) => {
    if (typeof d === "string") {
      // Remove the Z at the end if present
      const localString = d.endsWith("Z") ? d.slice(0, -1) : d;
      return new Date(localString);
    }
    return d;
  };

  const d = parsePHDate(date);
  const d2 = endDate ? parsePHDate(endDate) : undefined;

  // AGE
  if (variant === "age") {
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > d.getMonth() ||
      (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate());
    if (!hasHadBirthdayThisYear) age--;
    return (
      <>
        {age >= 58 ? (
          <div className="text-red-600">{age}</div>
        ) : (
          <div>{age}</div>
        )}
      </>
    );
  }

  // MONTH-YEAR
  if (variant === "month-year") {
    return (
      <>{d.toLocaleString("en-US", { month: "short", year: "numeric" })}</>
    );
  }

  // DATE RANGE
  if (variant === "date-range" && d2) {
    return (
      <>
        {d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}{" "}
        -{" "}
        {d2.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </>
    );
  }

  // DEFAULT
  const options: Intl.DateTimeFormatOptions =
    variant === "date"
      ? { year: "numeric", month: "short", day: "numeric" }
      : {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };

  return <>{d.toLocaleString("en-US", options)}</>;
}
