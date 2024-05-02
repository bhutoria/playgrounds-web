import { socketState } from "@/store";
import { Terminal as ContainerTerminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

function uint8ArrayToString(buffer: ArrayBuffer): string {
  return new TextDecoder().decode(buffer);
}

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  const [terminal, setTerminal] = useState<ContainerTerminal>();

  const socket = useRecoilValue(socketState);

  useEffect(() => {
    console.log("creating terminal");

    const newTerm = new ContainerTerminal({
      cursorBlink: true,
      theme: { background: "slate" },
      scrollOnUserInput: true,
    });
    setTerminal(newTerm);

    return () => {
      if (socket) socket.off("terminal");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminal && socket && terminalRef.current) {
      console.log("attaching terminal");
      socket.on("terminal", ({ data }) => {
        if (data instanceof ArrayBuffer) {
          const parseData = uint8ArrayToString(data);
          terminal.write(parseData);
        }
      });

      const fit = new FitAddon();
      terminal.open(terminalRef.current);
      terminal.loadAddon(fit);
      terminal.onData((data) => {
        socket.emit("terminalData", { data });
      });

      socket.emit("terminalData", { data: "\r" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      ref={terminalRef}
    ></div>
  );
};

export default Terminal;
