// ================================================
// Form Validation
// ================================================

export interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

export function validateVoucherForm(data: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  contact_method: 'phone' | 'email';
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.first_name.trim()) {
    errors.first_name = 'Il nome è obbligatorio';
  } else if (data.first_name.trim().length < 2) {
    errors.first_name = 'Il nome deve avere almeno 2 caratteri';
  }

  if (!data.last_name.trim()) {
    errors.last_name = 'Il cognome è obbligatorio';
  } else if (data.last_name.trim().length < 2) {
    errors.last_name = 'Il cognome deve avere almeno 2 caratteri';
  }

  if (data.contact_method === 'phone') {
    if (!data.phone.trim()) {
      errors.phone = 'Il numero di telefono è obbligatorio';
    } else if (!/^[+]?[\d\s()-]{7,20}$/.test(data.phone.trim())) {
      errors.phone = 'Inserisci un numero di telefono valido';
    }
  } else {
    if (!data.email.trim()) {
      errors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Inserisci un indirizzo email valido';
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
