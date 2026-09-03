import { format, parseISO, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP p');
};

export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDuration = (startDate: string | Date, endDate?: string | Date): string => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : new Date();
  
  const minutes = differenceInMinutes(end, start);
  const hours = differenceInHours(end, start);
  const days = differenceInDays(end, start);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'p');
};

export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PP');
};

export function getDashboardDateRange(
  selectedRange: string,
  customRange?: { from: Date | undefined; to: Date | undefined },
  options?: { forReports?: boolean }
): { from: Date | undefined; to: Date | undefined } {
  const now = new Date();
  switch (selectedRange) {
    case 'Today': {
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return { from, to };
    }
    case '48hrs': {
      const from = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      return { from, to: now };
    }
    case 'This Month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { from, to };
    }
    case 'Last Month': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { from, to };
    }
    case 'Custom': {
      if (customRange?.from) {
        const from = new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate(), 0, 0, 0, 0);
        const to = customRange.to
          ? new Date(customRange.to.getFullYear(), customRange.to.getMonth(), customRange.to.getDate(), 23, 59, 59, 999)
          : new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate(), 23, 59, 59, 999);
        return { from, to };
      }
      return { from: undefined, to: undefined };
    }
    case 'All Time': {
      if (options?.forReports) {
        const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { from, to };
      }
      return { from: undefined, to: undefined };
    }
    default:
      return { from: undefined, to: undefined };
  }
}

export function getDashboardSavedDateRange(options?: { forReports?: boolean }): { from: Date | undefined; to: Date | undefined } {
  if (typeof window === 'undefined') {
    return getDashboardDateRange('Today', undefined, options);
  }

  const savedRange = localStorage.getItem('dashboard_selected_range') || 'Today';
  let customRange: { from: Date | undefined; to: Date | undefined } | undefined = undefined;

  if (savedRange === 'Custom') {
    const savedCustom = localStorage.getItem('dashboard_custom_range');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        customRange = {
          from: parsed.from ? new Date(parsed.from) : undefined,
          to: parsed.to ? new Date(parsed.to) : undefined,
        };
      } catch (e) {
        // ignore
      }
    }
  }

  return getDashboardDateRange(savedRange, customRange, options);
}

