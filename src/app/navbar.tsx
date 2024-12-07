
import { ModeToggle } from "../components/ui/mode-toggle";

export function Navbar() {
    return <div className="bg-gray-300 px-10 h-16 justify-between  items-center flex">
        <h1>Feelink</h1>
        <ModeToggle />
    </div>
}