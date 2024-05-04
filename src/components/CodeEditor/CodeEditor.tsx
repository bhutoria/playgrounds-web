"use client";

import { fetchFileContent, updateFile } from "@/services/webSocketService";
import {
  fileContentsState,
  openFileContentState,
  openFileState,
  socketState,
} from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EditorNavbar from "./EditorNavbar";

import dynamic from "next/dynamic";

const EditorComponent = dynamic(
  () => import("@/components/CodeEditor/MonacoEditor"),
  { ssr: false }
);

const CodeEditor = ({ height, width }: { height: number; width: number }) => {
  const openFile = useRecoilValue(openFileState);
  const [value, setValue] = useRecoilState(openFileContentState);
  const socket = useRecoilValue(socketState);
  const contents = useRecoilValue(fileContentsState);

  useEffect(() => {
    if (socket && openFile) {
      if (!contents.has(openFile)) {
        fetchFileContent(socket, openFile).then((content) => {
          if (content) {
            setValue(content);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFile]);

  const saveFile = useCallback(
    async (filePath: string) => {
      if (socket && contents.has(filePath)) {
        await updateFile(socket, filePath, contents.get(filePath));
      }
    },
    [contents, socket]
  );

  useEffect(() => {
    const id = setTimeout(() => {
      if (openFile) {
        saveFile(openFile);
      }
    }, 2000);
    return () => {
      clearTimeout(id);
    };
  }, [value, openFile, saveFile]);

  return (
    <div className={"h-full w-full flex flex-col"}>
      <div style={{ width }}>
        <EditorNavbar></EditorNavbar>
      </div>
      {openFile ? (
        <EditorComponent height={height} width={width}></EditorComponent>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-slate-200 pr-10">
          Select a file to open editor.
        </div>
      )}
    </div>
  );
};
export default CodeEditor;
