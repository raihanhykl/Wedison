import { ArticleEditLoader } from "./edit-loader";

export const metadata = { title: "Edit Artikel" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleEditLoader id={id} />;
}
