import React from 'react';

interface FormattedDateProps {
  date: Date | string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  // Permite recibir tanto Date como string ISO
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Control de fecha inválida
  if (isNaN(dateObj.getTime())) {
    return <time>Invalid date</time>;
  }

  return (
    <time dateTime={dateObj.toISOString()}>
      {dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  );
}