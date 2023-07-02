import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function formatSpanish(date: Date, formatString: string) {
  return format(date, formatString, { locale: es });
}
