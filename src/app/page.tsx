"use client";
import CreatePlayground from "@/components/CreatePlayground";
import CreatedPlaygrounds from "@/components/CreatedPlaygrounds";
import Selector from "@/components/Selector";

import { RecoilRoot } from "recoil";

export default function Home() {
  return (
    <RecoilRoot>
      <main className="flex flex-col justify-center items-center gap-10 h-screen font-mono bg-slate-100">
        <div className="text-xl">Welcome to coding playgrounds!</div>
        <CreatePlayground></CreatePlayground>
        <div className="text-lg">After creating, select to launch:</div>
        <CreatedPlaygrounds></CreatedPlaygrounds>
      </main>
    </RecoilRoot>
  );
}
