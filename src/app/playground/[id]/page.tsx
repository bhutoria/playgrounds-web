import dynamic from "next/dynamic";

const PlaygroundComponent = dynamic(() => import("@/components/Playground"), {
  ssr: false,
});

export default function Page({ params: { id } }: { params: { id: string } }) {
  return <PlaygroundComponent id={id}></PlaygroundComponent>;
}
