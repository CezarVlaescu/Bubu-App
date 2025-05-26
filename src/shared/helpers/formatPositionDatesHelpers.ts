export function formatPositionDates(status: string, startDate: string, endDate: string): string {
  const formattedStart = formatDate(startDate);
  const isEndApprox = endDate?.toLowerCase().includes("approx") || endDate?.toLowerCase().includes("reported");
  const formattedEnd = !endDate || endDate.toLowerCase() === "present"
    ? "Present"
    : isEndApprox
      ? `expiration reported: ${formatDate(endDate)}`
      : `effective until ${formatDate(endDate)}`;

  const lowerStatus = status.toLowerCase();

  if (lowerStatus === "official") {
    return `(${formattedStart} - ${formattedEnd})`;
  }

  if (lowerStatus.includes("effective")) {
    return `Effective from ${formattedStart} - ${formattedEnd}`;
  }

  if (lowerStatus.includes("appointed") || lowerStatus.includes("elected")) {
    return `${capitalize(status)}: ${formattedStart} - ${formattedEnd}`;
  }

  if (lowerStatus.includes("as of") || lowerStatus.includes("expiration")) {
    return `${capitalize(status)}: ${formattedStart} - ${formattedEnd}`;
  }

  return `${formattedStart} - ${formattedEnd}`;
}


function formatDate(date: string): string {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  });
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
