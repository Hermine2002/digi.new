import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | DigiBase",
  description:
    "Talk to DIGIBASE about data centers, Oracle, or mission-critical infrastructure. Yerevan, Armenia · info@digibase.am",
};

export default function ContactPage() {
  return <ContactForm />;
}