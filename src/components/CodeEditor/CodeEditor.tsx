"use client";

import { fetchFileContent, updateFile } from "@/services/webSocketService";
import {
  fileContentsState,
  openFileContentState,
  openFileState,
  socketState,
} from "@/store";
import { Editor } from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EditorNavbar from "./EditorNavbar";

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

  const language = useMemo(() => {
    if (openFile) {
      return findLanguage(openFile.split(".").pop()!);
    }
    return undefined;
  }, [openFile]);

  const onChange = (v: string | undefined) => {
    if (v) {
      setValue(v);
    }
  };

  return (
    <div className={"h-full w-full flex flex-col"}>
      <div style={{ width }}>
        <EditorNavbar></EditorNavbar>
      </div>
      {openFile ? (
        <Editor
          value={value}
          onChange={onChange}
          language={language}
          theme="vs-dark"
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            fontSize: 16,
            automaticLayout: true,
          }}
          height={height}
          width={width}
        ></Editor>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-slate-200 pr-10">
          Select a file to open editor.
        </div>
      )}
    </div>
  );
};

const findLanguage = (ext: string) => {
  let lang: string;
  switch (ext) {
    case "json":
      lang = "json";
      break;
    case "html":
      lang = "html";
      break;
    case "css":
      lang = "css";
      break;
    case "ts":
      lang = "typescript";
      break;
    case "js":
      lang = "javascript";
      break;
    case "md":
      lang = "markdown";
      break;
    default:
      lang = "";
  }
  return lang;
};

export default CodeEditor;
