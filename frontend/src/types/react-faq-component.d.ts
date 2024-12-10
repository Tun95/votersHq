// src/react-faq-component.d.ts
declare module "react-faq-component" {
  interface FAQData {
    title: string;
    rows: {
      title: string;
      content: string | React.ReactNode;
    }[];
  }

  export default Faq;
}
