
import Discord from "~/components/auth/Discord/page";
import { ModeToggle } from "./ui/mode-toggle";

export function Navbar() {
    return <div className="px-16 h-16 justify-between items-center flex">
        <h1 className="" >Feelink</h1>
       <div className="flex gap-5  items-center">
       <Discord />
       <ModeToggle />
       </div>
    </div>
}