import Hero from "./hero";
import UserPrograms from "./user-program";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <Hero />
      <UserPrograms />
    </div>
  );
}
