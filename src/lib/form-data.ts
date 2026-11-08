export function formFields(formData: FormData, names: readonly string[]): Record<string, FormDataEntryValue> {
  return Object.fromEntries(names.map((name) => [name, formData.get(name) ?? '']));
}
