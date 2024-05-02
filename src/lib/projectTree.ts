import { File } from "@/store";

const createProjectTree = (files: File[]) => {
  console.log("building project tree");

  const writeFiles = files.map((s) => s);

  writeFiles.sort((a, b) => (a.type === "file" ? 1 : -1));

  const projectTree = new Map<
    string,
    File & { parent: string; children: string[] | undefined }
  >();

  writeFiles.forEach((file) => {
    const parent = getParentFolderPath(file.path);
    if (file.type === "dir") {
      projectTree.set(file.path, { ...file, parent, children: [] });
    } else {
      projectTree.set(file.path, { ...file, parent, children: undefined });
    }
  });

  projectTree.forEach((file) => {
    if (projectTree.has(file.parent)) {
      const folder = projectTree.get(file.parent);
      folder?.children?.push(file.path);
      projectTree.set(file.parent, { ...folder! });
    }
  });

  return projectTree;
};

const getParentFolderPath = (filePath: string) => {
  const parts = filePath.split("/");
  parts.pop();
  const folderPath = parts.join("/");
  return folderPath;
};

export default createProjectTree;
