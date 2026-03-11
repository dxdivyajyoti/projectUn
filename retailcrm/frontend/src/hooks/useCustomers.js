import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';

export function useCustomers(page = 0, tag = null) {
  return useQuery({
    queryKey: ['customers', page, tag],
    queryFn: () => customerService.list(page, tag).then(r => r.data),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.get(id).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['customer'] });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useSearchCustomers(query) {
  return useQuery({
    queryKey: ['customers-search', query],
    queryFn: () => customerService.search(query).then(r => r.data),
    enabled: !!query && query.length >= 2,
  });
}
