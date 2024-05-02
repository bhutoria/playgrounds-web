import { filesTabsState } from "@/store";
import { useRecoilState } from "recoil";
import FileTab from "./FileTab";
import { memo } from "react";

const EditorNavbar = () => {
  const [files, setFiles] = useRecoilState(filesTabsState);

  if (files.length === 0) return;

  return (
    <div className="flex flex-row items-center justify-start overflow-x-auto h-12 p-2">
      {files.map((file) => (
        <FileTab key={file} filePath={file}></FileTab>
      ))}
    </div>
  );
};

const MemoizedNavbar = memo(EditorNavbar);

export default MemoizedNavbar;

//export default EditorNavbar;
