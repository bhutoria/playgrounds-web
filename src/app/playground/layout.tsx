"use client";
import { RecoilRoot } from "recoil";

export default function PlaygroundLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilRoot>
      <div className="overflow-hidden h-screen">{children}</div>
    </RecoilRoot>
  );
}
