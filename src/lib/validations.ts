export interface PatientInput {
  name: string;
  email: string;
  phone: string;
  age: number | string;
  condition: string;
  notes?: string;
  status?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePatient(data: PatientInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }
  if (data.name && data.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
if (!data.email || typeof data.email !== "string" || !emailRegex.test(data.email.trim())) {
  errors.push({ field: "email", message: "Please enter a valid email address" });
}

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-s.]?[0-9]{3,14}$/;
  if (!data.phone || !phoneRegex.test(data.phone.replace(/s/g, ""))) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" });
  }

  const age = Number(data.age);
  if (!data.age || isNaN(age) || age < 0 || age > 150) {
    errors.push({ field: "age", message: "Age must be between 0 and 150" });
  }

  if (!data.condition || data.condition.trim().length < 2) {
    errors.push({ field: "condition", message: "Medical condition is required" });
  }

  return errors;
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}
