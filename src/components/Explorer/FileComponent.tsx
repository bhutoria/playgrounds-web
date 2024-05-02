import {
  filesTabsState,
  openFileState,
  selectedItemState,
  File,
} from "@/store";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getIconForFile } from "vscode-icons-js";
import Image from "next/image";

interface FileProps {
  file: File;
}

const FileComponent = ({ file }: FileProps) => {
  const setOpenFile = useSetRecoilState(openFileState);
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemState);
  const setTabs = useSetRecoilState(filesTabsState);

  return (
    <div
      className={`flex flex-row gap-2.5 cursor-pointer items-center hover:underline px-2.5 mr-4 rounded-sm ${
        selectedItem === file.path && "bg-slate-600"
      }`}
      onClick={async () => {
        setOpenFile(file.path);
        setSelectedItem(file.path);
        setTabs((s) => {
          if (s.includes(file.path)) {
            return s;
          } else {
            return [...s, file.path];
          }
        });
      }}
    >
      <div>
        <Image
          src={`/icons/${getIconForFile(file.path)}` || ""}
          alt={""}
          width={16}
          height={16}
        ></Image>
      </div>
      {file.name}
    </div>
  );
};

export default FileComponent;
