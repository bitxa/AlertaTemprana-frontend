const formatDate = (DateISOstring: string) => {
  const date = new Date(DateISOstring);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("es-ES", options);

  return formatter.format(date);
};

export default formatDate;
