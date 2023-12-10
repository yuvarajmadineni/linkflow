import { PageNodeEditor } from "@/components/workflow/page-node-editor";
import { db } from "@/lib/db";
import { pageNode } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function PageNode({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const [pageNodeProperties] = await db
    .select()
    .from(pageNode)
    .where(eq(pageNode.id, params.slug));

  return (
    <PageNodeEditor params={params} pageNodeProperties={pageNodeProperties} />
  );
}
