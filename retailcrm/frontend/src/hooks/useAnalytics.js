import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsService.summary().then(r => r.data),
  });
}

export function useSegments() {
  return useQuery({
    queryKey: ['analytics', 'segments'],
    queryFn: () => analyticsService.segments().then(r => r.data),
  });
}
