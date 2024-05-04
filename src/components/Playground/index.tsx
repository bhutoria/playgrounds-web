"use client";
import Browser from "@/components/Browser";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import FolderTree from "@/components/Explorer/FolderTree";
import FolderNavbar from "@/components/Explorer/FolderNavbar";
import PlaygroundNavbar from "@/components/PlaygroundNavbar";
import Terminal from "@/components/Terminal";
import { memo, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Socket } from "socket.io-client";
import { filesState, pgNameState, socketState } from "@/store";
import { createSocket, fetchFolderContent } from "@/services/webSocketService";
import { useResizable } from "react-resizable-layout";
import Splitter from "@/components/Splitter";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const TerminalComponent = dynamic(() => import("@/components/Terminal"), {
  ssr: false,
});

const MemoBrowser = memo(Browser);

export default function Playground({ id }: { id: string }) {
  const [socket, setSocket] = useRecoilState<Socket | null>(socketState);

  const setFiles = useSetRecoilState(filesState);

  const [loading, setIsLoading] = useState(true);

  const {
    isDragging: isTerminalDragging,
    position: terminalH,
    separatorProps: terminalDragBarProps,
  } = useResizable({
    axis: "y",
    initial: 150,
    min: 50,
    reverse: true,
  });

  const {
    isDragging: isFileDragging,
    position: fileW,
    separatorProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 300,
    min: 240,
    max: 360,
  });
  const {
    isDragging: isPluginDragging,
    position: pluginW,
    separatorProps: pluginDragBarProps,
  } = useResizable({
    axis: "x",
    initial: 400,
    min: 200,
    max: 500,
    reverse: true,
  });

  const [EHeight, EWidth] = useMemo(() => {
    return [
      window.innerHeight - 56 - terminalH,
      window.innerWidth - pluginW - fileW,
    ];
  }, [terminalH, pluginW, fileW]);

  useEffect(() => {
    if (id) {
      const newSocket = createSocket(id);
      if (!newSocket) return;
      setSocket(newSocket);
      return () => {
        if (!newSocket) return;
        newSocket.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on("ready", () => {
        setIsLoading(false);
      });
      socket.on("refreshTree", async (dir) => {
        const receivedFiles = await fetchFolderContent(socket, dir);

        setFiles((files) => {
          const path = `${dir}/`;
          const pathLength = path.length;
          const filteredFiles = files.filter((f) => {
            if (!f.path.startsWith(path)) return true;
            const remainingPath = path.slice(pathLength);
            return remainingPath.includes("/");
          });

          return [...filteredFiles, ...receivedFiles];
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-800 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="bg-slate-900 min-h-14">
        <PlaygroundNavbar></PlaygroundNavbar>
      </div>
      <div
        className={
          "flex flex-grow w-full bg-gray-800 text-white font-mono overflow-hidden"
        }
      >
        <div className={"flex grow"}>
          <div className={cn("shrink-0")} style={{ width: fileW }}>
            <ExplorerComponent></ExplorerComponent>
          </div>
          <Splitter isDragging={isFileDragging} {...fileDragBarProps} />
          <div className={"grow flex flex-col"}>
            <div className={"grow"}>
              <CodeEditor height={EHeight} width={EWidth}></CodeEditor>
            </div>
            <Splitter
              dir={"horizontal"}
              isDragging={isTerminalDragging}
              {...terminalDragBarProps}
            />
            <div
              className="bg-black p-2"
              style={{ height: terminalH, width: EWidth }}
            >
              <TerminalComponent></TerminalComponent>
            </div>
          </div>
          <Splitter isDragging={isPluginDragging} {...pluginDragBarProps} />
          <div className={cn("shrink-0")} style={{ width: pluginW }}>
            <MemoBrowser></MemoBrowser>
          </div>
        </div>
      </div>
    </div>
  );
}

const ExplorerComponent = memo(function E() {
  return (
    <div className="flex-grow p-2 tracking-wider select-none">
      <FolderNavbar></FolderNavbar>
      <FolderTree path="/"></FolderTree>
    </div>
  );
});

// previous fixed layout:
/* <div className="bg-gray-800 w-full h-[calc(100%-64px)] text-white grid grid-cols-6">
        <div className="col-span-1 h-full w-full overflow-x-auto flex flex-row">
          <div className="flex-grow p-2 tracking-wider select-none">
            <FolderNavbar></FolderNavbar>
            <FolderTree path="/"></FolderTree>
          </div>
          <Splitter isDragging={isFileDragging} {...fileDragBarProps} />
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="h-[540px]">
            <CodeEditor></CodeEditor>
          </div>
          <div className="flex-grow">
            <Terminal></Terminal>
          </div>
        </div>
        <div className="col-span-2">
          <Browser></Browser>
        </div>
      </div> */
