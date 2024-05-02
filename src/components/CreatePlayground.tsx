import { createdPlaygroundsState, selectBaseState } from "@/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Selector from "./Selector";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const CreatePlayground = () => {
  const baseImage = useRecoilValue(selectBaseState);
  const setPlaygrounds = useSetRecoilState(createdPlaygroundsState);

  const { toast } = useToast();

  return (
    <div className="flex justify-center items-center gap-10 tracking-wide border-2 border-gray-200 rounded-lg px-8 py-4 bg-white">
      <Selector></Selector>
      <Button
        className="bg-sky-500 hover:bg-sky-800"
        onClick={async () => {
          const generatedName = generateName();
          try {
            const data = await axios.post<{
              id: string;
              NFSaccesspoint: string;
            }>("/api/deployments", {
              userId: "1",
              baseImage,
              name: generatedName,
            });
            const id = data.data.id;
            const NFSaccesspoint = data.data.NFSaccesspoint;
            setPlaygrounds((p) => [
              ...p,
              { id, baseImage, name: generatedName, NFSaccesspoint },
            ]);
          } catch (e) {
            toast({ title: "Error occurred. Check console." });
          }
        }}
      >
        Create
      </Button>
    </div>
  );
};

const adjectives: string[] = [
  "Radiant",
  "Crimson",
  "Serene",
  "Thunderous",
  "Luminous",
  "Mystic",
  "Velvet",
  "Celestial",
  "Emerald",
  "Azure",
];

// List of object options
const objects: string[] = [
  "Star",
  "Ocean",
  "Whisper",
  "Breeze",
  "Symphony",
  "Essence",
  "Sonata",
  "Mirage",
  "Tapestry",
  "Quill",
];

// Function to generate a random name
function generateName(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomObject = objects[Math.floor(Math.random() * objects.length)];
  return `${randomAdjective} ${randomObject}`;
}

export default CreatePlayground;
