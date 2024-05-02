import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectBaseState } from "@/store";
import { useRecoilState } from "recoil";
import { Button } from "./ui/button";
import { ArrowBigDown } from "lucide-react";

const Selector = () => {
  const [selection, setSelection] = useRecoilState(selectBaseState);
  return (
    <DropdownMenu>
      <div>Create a playground:</div>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-24 p-4 flex items-center gap-2"
          variant={"outline"}
        >
          <span>{selection}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => {
            setSelection("React");
          }}
        >
          React
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setSelection("Python");
          }}
          disabled
        >
          Python
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Selector;
