import { TeaserForm } from "../teaser-form";

export const metadata = { title: "New Opening Teaser" };

export default async function NewTeaserPage({ searchParams }: { searchParams: Promise<{ showroom?: string }> }) {
  const { showroom } = await searchParams;
  return <TeaserForm presetShowroom={showroom} />;
}
