// lib/alert.ts
import Swal from "sweetalert2";

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};
export const showWarning = (message: string) => {
  Swal.fire({
    icon: "warning",
    title: "Warning",
    text: message,
  });
};