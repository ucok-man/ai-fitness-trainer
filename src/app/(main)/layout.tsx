import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main className="pt-24 grow">{children}</main>
      <Footer />
    </div>
  );
}
