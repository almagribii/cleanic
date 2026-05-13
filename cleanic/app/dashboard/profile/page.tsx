import { type Metadata } from "next";
import ProfileContent from "./(component)/ProfileContent";

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Kelola data profil, foto, dan keamanan akun Cleanic kamu pada halaman profil.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
