import { OcpiContainer } from "@/features/ocpi/containers/OcpiContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OCPI Management",
    description: "Manage OCPI credentials, tokens, and sessions with the Scale EV ecosystem.",
};

export default function OcpiPage() {
    return <OcpiContainer />;
}
