import { ShowroomEditLoader } from "./edit-loader";

export const metadata = { title: "Edit Showroom" };

export default async function EditShowroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShowroomEditLoader id={id} />;
}
