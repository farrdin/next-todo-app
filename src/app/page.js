import TODO from "@/components/Todo";
import bg from "../../public/bg1.jpg";

export default function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <TODO />
    </div>
  );
}
