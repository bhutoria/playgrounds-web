import { cn } from "@/lib/utils";
import { miniBrowserState, socketState } from "@/store";
import { LucideSquareArrowOutUpRight, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useRecoilState, useRecoilValue } from "recoil";

const Browser = () => {
  const [url, setUrl] = useRecoilState(miniBrowserState);
  const [refresh, setRefresh] = useState(1);
  const socket = useRecoilValue(socketState);

  useEffect(() => {
    if (socket) {
      socket.emit("getUrl");
      socket.on("url", (ip: string) => {
        setUrl(`http://${ip}:5173`);
      });
    }
    return () => {
      if (socket) socket.off("url");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("getUrl");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div
      className={cn("h-full w-full flex flex-col border-l-2 border-slate-900")}
    >
      <div className="h-12 px-4 py-2 bg-black flex flex-row items-center gap-4">
        <RefreshCwIcon
          onClick={() => {
            setRefresh((r) => r + 1);
          }}
          className="hover:bg-gray-600 rounded-xl p-1"
        ></RefreshCwIcon>
        <div className="bg-slate-800/70 min-h-8 flex-grow text-clip p-1 px-2 rounded-sm shrink-0">
          {url || ""}
        </div>
        <Link target={"_blank"} href={url || ""}>
          <LucideSquareArrowOutUpRight className="hover:bg-gray-600 rounded-xl p-1"></LucideSquareArrowOutUpRight>
        </Link>
      </div>
      {url && (
        <div key={refresh.toString()} className="h-full w-full flex-grow">
          <Iframe url={url} className="h-full w-full"></Iframe>
        </div>
      )}
    </div>
  );
};

export default Browser;
