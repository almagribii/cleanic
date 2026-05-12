import Nav  from "@/components/Nav";
import {PublicFooter}  from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main >{children}</main>
      <PublicFooter />
    </>
  );
}