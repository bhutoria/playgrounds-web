import { File } from "@/store";

import { Socket, io } from "socket.io-client";

export const createSocket = (id: string) => {
  try {
    const newSocket = io(process.env.NEXT_PUBLIC_CNC_SERVER!, {
      transports: ["websocket"],
      query: { id, type: "client" },
      autoConnect: false,
    });
    return newSocket;
  } catch (e) {
    return undefined;
  }
};

export const closeSocket = (socket: Socket | undefined) => {
  try {
    if (socket) socket.close();
  } catch (e) {
    console.log(e);
  }
};

export const fetchFolderContent = (socket: Socket, dir: string) => {
  return new Promise<File[]>((res) => {
    try {
      socket.emit("fetchDir", dir, (response: File[]) => {
        res(response);
      });
    } catch (e) {
      console.log(e);
      res([]);
    }
  });
};

export const fetchFileContent = (socket: Socket, filePath: string) => {
  return new Promise<string | undefined>((res) => {
    try {
      socket.emit("fetchContent", filePath, (response: string) => {
        res(response);
      });
    } catch (e) {
      console.log(e);
      res(undefined);
    }
  });
};

export const updateFile = (
  socket: Socket,
  filePath: string,
  content: string | undefined
) => {
  return new Promise<boolean>((res) => {
    try {
      socket.emit("updateContent", {
        filePath,
        content: content || "",
      });
      res(true);
    } catch (e) {
      console.log(e);
      res(false);
    }
  });
};

export const addNewItem = (
  socket: Socket,
  type: "dir" | "file",
  path: string
) => {
  return new Promise<boolean>((res) => {
    try {
      if (type === "dir") {
        socket.emit("newDir", path);
      } else if (type === "file") {
        socket.emit("newFile", path);
      }
      res(true);
    } catch (e) {
      console.log(e);
      res(false);
    }
  });
};
