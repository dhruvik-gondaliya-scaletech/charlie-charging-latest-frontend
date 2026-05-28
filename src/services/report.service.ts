import { API_CONFIG, AUTH_CONFIG } from '@/constants/constants';

export async function downloadCalstartReport(params: {
  stationIds: string[];
  startDate?: Date;
  endDate?: Date;
  timeSeparator?: 'colon' | 'slash';
}): Promise<void> {
  const { stationIds, startDate, endDate, timeSeparator = 'colon' } = params;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const query = new URLSearchParams({
    stationIds: stationIds.join(','),
    timeSeparator,
    timezone,
  });

  if (startDate) {
    query.append('startDate', startDate.toISOString());
  }
  if (endDate) {
    query.append('endDate', endDate.toISOString());
  }

  const token = localStorage.getItem(AUTH_CONFIG.tokenKey);

  const response = await fetch(`${API_CONFIG.baseUrl}/reports/export?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate report');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Custom filename with current timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `calstart_report_${timestamp}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
