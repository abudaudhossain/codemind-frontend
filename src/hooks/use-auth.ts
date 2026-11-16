"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { LoginFormValues, RegisterFormValues } from "@/types";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => authService.register(values),
  });
}
