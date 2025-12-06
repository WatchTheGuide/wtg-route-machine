/**
 * Formatuje dystans (metry) na czytelny string
 * @param meters - Dystans w metrach
 * @returns Sformatowany string (np. "1.5 km" lub "500 m")
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

/**
 * Formatuje czas trwania (sekundy) na czytelny string
 * @param seconds - Czas w sekundach
 * @param t - Funkcja tłumaczenia z i18next
 * @returns Sformatowany string (np. "2 godz. 30 min" lub "45 min")
 */
export const formatDuration = (
  seconds: number,
  t?: (key: string) => string
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (t) {
    // Z tłumaczeniem
    if (hours > 0) {
      return `${hours} ${t('route.hours')} ${minutes} ${t('route.minutes')}`;
    }
    return `${minutes} ${t('route.minutes')}`;
  } else {
    // Bez tłumaczenia (fallback)
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }
};

/**
 * Formatuje datę na czytelny string
 * @param dateString - Data jako string (ISO format)
 * @returns Sformatowana data
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatuje datę i czas na czytelny string
 * @param dateString - Data jako string (ISO format)
 * @returns Sformatowana data i czas
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
