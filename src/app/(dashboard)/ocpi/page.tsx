import { OcpiContainer } from "@/features/ocpi/containers/OcpiContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OCPI Management | Charlie Charging",
    description: "Manage OCPI credentials, tokens, and sessions.",
};

export default function OcpiPage() {
    return <OcpiContainer />;
}
