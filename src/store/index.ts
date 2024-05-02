import { atom, selector } from "recoil";
import { Socket } from "socket.io-client";
import createProjectTree from "@/lib/projectTree";

export const pgNameState = atom({
  key: "PGName",
  default: "",
});

export type File = {
  type: "file" | "dir";
  name: string;
  path: string;
};

export type PlayGround = {
  name: string;
  baseImage: string;
  id: string;
  NFSaccesspoint: string;
};

export const createdPlaygroundsState = atom<PlayGround[]>({
  key: "CreatedPlaygrounds",
  default: [],
});

export const miniBrowserState = atom<string | undefined>({
  key: "MiniBrowser",
  default: undefined,
});

export const newItemState = atom<File | null>({
  key: "NewItem",
  default: null,
});

export const socketState = atom<Socket | null>({
  key: "Socket",
  default: null,
  dangerouslyAllowMutability: true,
});

export const selectedItemState = atom({
  key: "SelectedItem",
  default: "",
});

export const fileContentsState = atom<Map<string, string>>({
  key: "FileContents",
  default: new Map<string, string>(),
});

export const filesState = atom<File[]>({
  key: "Files",
  default: [{ type: "dir", name: "code", path: "/code" }],
});

export const projectTreeState = selector({
  key: "ProjectTree",
  get: ({ get }) => {
    const files = get(filesState);
    return createProjectTree(files);
  },
});

export const openFileState = atom<string | null>({
  key: "OpenFile",
  default: null,
});

export const filesTabsState = atom<string[]>({
  key: "FilesTabs",
  default: [],
});

export const selectBaseState = atom<string>({
  key: "SelectBase",
  default: "React",
});

export const openFileContentState = selector({
  key: "OpenFileContent",

  get: ({ get }) => {
    const filePath = get(openFileState);
    const contents = get(fileContentsState);

    if (filePath) {
      return contents.get(filePath);
    } else {
      return undefined;
    }
  },
  set: ({ set, get }, value) => {
    const filePath = get(openFileState);

    if (filePath && value) {
      set(fileContentsState, (s) => {
        const newContents = new Map(s);
        newContents.set(filePath, value.toString());
        return newContents;
      });
    }
  },
});
