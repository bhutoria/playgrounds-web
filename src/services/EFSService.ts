import { CreateAccessPointCommand, EFSClient } from "@aws-sdk/client-efs";

const client = new EFSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export const createAccessPoint = async (id: string) => {
  return new Promise<string>(async (res, rej) => {
    try {
      console.log("creating efs access point for:", id);
      const command = new CreateAccessPointCommand({
        FileSystemId: process.env.AWS_NFS!,
        PosixUser: {
          Uid: 1001,
          Gid: 1001,
        },
        RootDirectory: {
          Path: `/${id}`,
          CreationInfo: {
            OwnerGid: 1001,
            OwnerUid: 1001,
            Permissions: "777",
          },
        },
      });
      const data = await client.send(command);
      if (data.AccessPointId) {
        console.log("access point created");
        res(data.AccessPointId);
      } else {
        rej("unable to create access point");
      }
    } catch (e) {
      console.log(e);
      rej("unable to create access point");
    }
  });
};

const runCommand = async (command: any) => {
  try {
    const data = await client.send(command);
    return data;
  } catch (e) {
    console.log(e);
  }
};
