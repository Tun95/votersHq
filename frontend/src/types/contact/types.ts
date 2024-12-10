// Define the form values interface
export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

// Initial form values
export const initialContactValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
};
