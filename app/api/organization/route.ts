import {
  createOrganization,
  createorUpdateUserProfile,
  getOrganization,
} from "@/lib/organization";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { organizationId, name } = body;

  if (!organizationId)
    return new NextResponse("BAD REQUEST", {
      status: 400,
    });

  const org = await createOrganization(organizationId, name);
  const profile = await createorUpdateUserProfile(["admin"], org.id);

  return NextResponse.json({ organization: org, profile });
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) return new NextResponse("BAD REQUEST", { status: 400 });
  const org = await getOrganization(organizationId);

  if (!org) {
    return new NextResponse("Organization does not exist", {
      status: 404,
    });
  }

  return Response.json(org);
}
