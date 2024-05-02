import { FolderClosed, FolderOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import FileComponent from "./FileComponent";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  filesState,
  newItemState,
  projectTreeState,
  selectedItemState,
  socketState,
  File,
} from "@/store";
import AddNewInput from "./AddNewInput";
import { fetchFolderContent } from "@/services/webSocketService";

interface FolderTreeProps {
  path: string;
  name?: string;
}

const FolderTree = ({ path, name }: FolderTreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState);
  const socket = useRecoilValue(socketState);
  const setFiles = useSetRecoilState(filesState);

  const tree = useRecoilValue(projectTreeState);

  const newItem = useRecoilValue(newItemState);

  useEffect(() => {
    if (!socket) return;

    getDirectoryContent("/code");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const getDirectoryContent = useCallback(
    async (dir: string) => {
      if (!socket) return;
      if (tree.get(dir)!.children!.length > 0) {
        return;
      }
      const newFiles: File[] = [];
      const receivedFiles = await fetchFolderContent(socket, dir);
      receivedFiles.forEach((file) => {
        if (!tree.has(file.path)) {
          newFiles.push(file);
        }
      });
      if (newFiles.length > 0) {
        setFiles((f) => [...f, ...newFiles]);
      }
    },
    [tree, socket, setFiles]
  );

  const children = useMemo(() => {
    if (path === "/") {
      setIsOpen(true);
      return ["/code"];
    } else {
      if (path === "/code") {
        setIsOpen(true);
      }
      return tree.get(path)?.children;
    }
  }, [path, tree]);

  return (
    <div>
      {name && (
        <div
          className={`flex flex-row gap-1 items-center hover:underline cursor-pointer px-1 mr-4 rounded-sm ${
            selectedItem === path && "bg-slate-600"
          }`}
          onClick={() => {
            if (!isOpen) {
              getDirectoryContent(path);
            }
            setSelectedItem(path);
            setIsOpen((o) => !o);
          }}
        >
          {isOpen ? (
            <FolderOpen height={16}></FolderOpen>
          ) : (
            <FolderClosed height={16}></FolderClosed>
          )}

          {name}
        </div>
      )}

      {isOpen && (
        <div className="flex flex-col pl-3 border-l-2 border-gray-500">
          {newItem && newItem.path === path && (
            <AddNewInput item={newItem}></AddNewInput>
          )}
          {children!.map((child) => {
            const { type, path, name } = tree.get(child)!;

            if (type === "dir") {
              return (
                <FolderTree key={path} path={path} name={name}></FolderTree>
              );
            } else if (type === "file") {
              return (
                <FileComponent
                  key={path}
                  file={{ type, path, name }}
                ></FileComponent>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default FolderTree;
