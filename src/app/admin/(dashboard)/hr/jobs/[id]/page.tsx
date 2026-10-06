import { JobEditLoader } from "./edit-loader";

export const metadata = { title: "Edit Job Opening" };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobEditLoader id={id} />;
}
