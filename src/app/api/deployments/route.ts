import { createAccessPoint } from "@/services/EFSService";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const userId = "1";

export async function GET(req: NextRequest) {
  const deployments = await prisma.deployments.findMany({ where: { userId } });

  return NextResponse.json({ deployments });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const { baseImage, name, userId } = data;
    const count = await prisma.deployments.count({ where: { userId } });

    if (count > 9) {
      return NextResponse.json(
        { error: "too many container created." },
        { status: 400 }
      );
    }
    console.log("getting id for deployment:", name);

    const deployment = await prisma.deployments.create({
      data: { name, baseImage, userId },
    });

    const accessPointId = await createAccessPoint(deployment.id);

    console.log("attaching access point to:", deployment.id);

    await prisma.deployments.update({
      data: { NFSaccesspoint: accessPointId },
      where: { id: deployment.id },
    });

    return NextResponse.json({
      id: deployment.id,
      NFSaccesspoint: accessPointId,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
