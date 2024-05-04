"use client";
import {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  getHighlighter,
} from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";
import { openFileContentState, openFileState } from "@/store";
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const MonacoEditor = ({ height, width }: { height: number; width: number }) => {
  const monaco = useMonaco();
  const [value, setValue] = useRecoilState(openFileContentState);

  const [highlighter, setHighlighter] =
    useState<HighlighterGeneric<BundledLanguage, BundledTheme>>();

  useEffect(() => {
    const initializeHighlighter = async () => {
      try {
        const h = await getHighlighter({
          themes: ["vitesse-dark", "vitesse-light"],
          langs: ["javascript", "jsx", "typescript"],
        });
        setHighlighter(h);
      } catch (error) {
        console.log(error);
      }
    };

    initializeHighlighter();
  }, []);

  useEffect(() => {
    if (monaco && highlighter) {
      monaco.languages.register({ id: "jsx" });
      monaco.languages.register({ id: "typescript" });
      monaco.languages.register({ id: "javascript" });
      shikiToMonaco(highlighter, monaco);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco]);

  const openFile = useRecoilValue(openFileState);

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
    <div>
      <Editor
        value={value}
        onChange={onChange}
        language={language}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 16,
          automaticLayout: true,
        }}
        height={height}
        width={width}
      ></Editor>
    </div>
  );
};

export default MonacoEditor;

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
    case "jsx":
      lang = "jsx";
      break;
    case "cjs":
      lang = "javascript";
      break;
    default:
      lang = ext;
  }
  return lang;
};
