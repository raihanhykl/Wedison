import { TeaserEditLoader } from "./edit-loader";

export const metadata = { title: "Edit Opening Teaser" };

export default async function EditTeaserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeaserEditLoader id={id} />;
}
