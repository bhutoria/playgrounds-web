import { addNewItem } from "@/services/webSocketService";
import { filesState, newItemState, socketState, File } from "@/store";
import { File as FileIcon, FolderClosed } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const AddNewInput = ({ item }: { item: File }) => {
  const setNewItem = useSetRecoilState(newItemState);
  const setFiles = useSetRecoilState(filesState);
  const socket = useRecoilValue(socketState);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const addNew = async () => {
    if (!socket) return;
    const itemName = inputRef.current!.value;
    const success = await addNewItem(
      socket,
      item.type,
      `${item.path}/${itemName}`
    );
    if (!success) return;
    setFiles((f) => [
      ...f,
      {
        type: item.type,
        name: itemName,
        path: `${item.path}/${itemName}`,
      },
    ]);
    setNewItem(null);
  };

  return (
    <div className="flex flex-row items-center">
      {item.type === "dir" ? (
        <FolderClosed height={16}></FolderClosed>
      ) : (
        <FileIcon height={16}></FileIcon>
      )}
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addNew();
          }
        }}
        onBlur={(e) => {
          if (e.target.value.length < 1) {
            setNewItem(null);
          } else {
            addNew();
          }
        }}
        ref={inputRef}
        className="rounded-sm bg-gray-500 text-white mx-2 w-36 outline-none"
      ></input>
    </div>
  );
};

export default AddNewInput;
