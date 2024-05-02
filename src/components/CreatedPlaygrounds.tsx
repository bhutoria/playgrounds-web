import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useRecoilState, useSetRecoilState } from "recoil";
import { createdPlaygroundsState, pgNameState } from "@/store";

const CreatedPlaygrounds = () => {
  const router = useRouter();
  const [playgrounds, setPlaygrounds] = useRecoilState(createdPlaygroundsState);
  const [loading, setIsLoading] = useState(false);
  const setPgName = useSetRecoilState(pgNameState);

  useEffect(() => {
    axios
      .get("/api/deployments")
      .then((data) => {
        setPlaygrounds(data.data.deployments);
      })
      .catch((e) => {
        setPlaygrounds([]);
      });
  }, [setPlaygrounds]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {playgrounds.length > 0 &&
        playgrounds.map((pg, index) => {
          const { id, name: dName, baseImage, NFSaccesspoint } = pg;
          return (
            <Button
              className="p-10 rounded-lg flex flex-col gap-2 items-center justify-center w-48 h-30 text-wrap tracking-wider"
              key={index}
              disabled={loading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_CNC_SERVER}/deploy`,
                    { id, baseImage, NFSaccesspoint }
                  );
                  console.log(response.data);
                  setIsLoading(false);
                  setPgName(dName);
                  router.push(`/playground/${id}`);
                } catch (e) {
                  setIsLoading(false);
                  console.log(e);
                }
              }}
              variant={"outline"}
            >
              <span className="text-xl">{dName}</span>
              <span>{baseImage}</span>
            </Button>
          );
        })}
    </div>
  );
};

export default CreatedPlaygrounds;
