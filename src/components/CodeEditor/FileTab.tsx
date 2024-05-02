import { filesTabsState, openFileState } from "@/store";
import { X } from "lucide-react";
import { useRecoilState, useSetRecoilState } from "recoil";

const FileTab = ({ filePath }: { filePath: string }) => {
  const [open, setOpen] = useRecoilState(openFileState);
  const [tabs, setTabs] = useRecoilState(filesTabsState);

  return (
    <div
      className={`flex flex-row gap-1 min-w-fit items-center py-1 px-2  ${
        open === filePath ? "bg-slate-600" : "bg-slate-800 hover:bg-slate-600"
      }`}
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpen(filePath);
        }}
      >
        {filePath.split("/").pop()}
      </div>
      <div>
        <X
          className="cursor-pointer"
          onClick={() => {
            setOpen(
              tabs[tabs.indexOf(filePath) - 1] ||
                tabs[tabs.indexOf(filePath) + 1]
            );
            setTabs((tabs) => tabs.filter((s) => s !== filePath));
          }}
          height={14}
        ></X>
      </div>
    </div>
  );
};

export default FileTab;
