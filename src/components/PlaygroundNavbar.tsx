import { pgNameState } from "@/store";
import { ArrowLeftCircle, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRecoilValue } from "recoil";

const PlaygroundNavbar = () => {
  const pgName = useRecoilValue(pgNameState);

  return (
    <div className="h-full w-full px-4 py-1 text-white flex flex-row items-center justify-between">
      <Link href={"/"} className="flex flex-row items-center hover:underline">
        <ArrowLeftCircle height={20}></ArrowLeftCircle>
        <span className="text-xl">Home</span>
      </Link>
      <span className="pr-24">Coding Playgrounds</span>
      <span>{pgName}</span>
    </div>
  );
};

export default PlaygroundNavbar;
