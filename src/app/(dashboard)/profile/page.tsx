'use client';

import { UserProfileContainer } from "@/features/users/containers/UserProfileContainer";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-full"
    >
      <UserProfileContainer />
    </motion.div>
  );
}
