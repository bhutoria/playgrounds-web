import { newItemState, selectedItemState } from "@/store";
import { FilePlusIcon, FolderPlusIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const FolderNavbar = () => {
  const selectedItem = useRecoilValue(selectedItemState);
  const setNewItem = useSetRecoilState(newItemState);

  const createNew = useCallback(
    (type: "dir" | "file") => {
      setNewItem({ type, name: "", path: selectedItem });
    },
    [setNewItem, selectedItem]
  );

  return (
    <div className="p-1">
      <div className="flex flex-row justify-between items-center">
        <span>EXPLORER</span>
        <div className="flex flex-row gap-2 items-center">
          <FolderPlusIcon
            onClick={() => {
              createNew("dir");
            }}
            height={20}
          ></FolderPlusIcon>
          <FilePlusIcon
            onClick={() => {
              createNew("file");
            }}
            height={18}
          ></FilePlusIcon>
        </div>
      </div>
    </div>
  );
};

export default FolderNavbar;
