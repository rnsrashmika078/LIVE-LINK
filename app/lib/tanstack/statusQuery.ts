/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  deleteStatus,
  getStatus,
  getStatusSeenUsers,
  setStatus,
  updateStatus,
} from "@/app/actions/status_action";
import { SeenByUserType, StatusType } from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useSetStatus(onSuccess: (result: any) => void) {
  return useMutation({
    mutationFn: ({ payload }: { payload: StatusType }) => setStatus(payload),
    onSuccess,
  });
}
type DeletePayload = {
  statusId?: string | undefined;
  public_id?: string | undefined;
};
export function useDeleteStatus(onSuccess: (result: any) => void) {
  return useMutation({
    mutationFn: ({ payload }: { payload: DeletePayload }) =>
      deleteStatus(payload),
    onSuccess,
  });
}
export function useUpdateStatus(onSuccess?: (result: any) => void) {
  return useMutation({
    mutationFn: ({ payload }: { payload: SeenByUserType }) =>
      updateStatus(payload),
    onSuccess,
  });
}
export function useGetStatus(uid: string) {
  return useQuery({
    queryKey: ["get-status", uid],
    queryFn: () => getStatus(uid),
    enabled: !!uid,
    refetchOnWindowFocus: false,
  });
}
export function useGetSeenUsers(statusId: string) {
  return useQuery({
    queryKey: ["get-status-seen-users", statusId],
    queryFn: () => getStatusSeenUsers(statusId),
    enabled: !!statusId,
    refetchOnWindowFocus: false,
  });
}
