import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AddressInput = Omit<Address, "id" | "createdAt" | "updatedAt">;

export function getAddresses() {
  return apiGet<{ addresses: Address[] }>("/addresses");
}

export function createAddress(data: AddressInput) {
  return apiPost<Address>("/addresses", data);
}

export function updateAddress(id: string, data: AddressInput) {
  return apiPatch<Address>(`/addresses/${id}`, data);
}

export function deleteAddress(id: string) {
  return apiDelete<void>(`/addresses/${id}`);
}

export function setDefaultAddress(id: string) {
  return apiPatch<Address>(`/addresses/${id}/default`);
}
