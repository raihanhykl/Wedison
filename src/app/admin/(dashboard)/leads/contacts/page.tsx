import { Suspense } from "react";
import { ContactsView } from "./contacts-view";

export const metadata = { title: "Contact Messages" };

export default function ContactsPage() {
  // useSearchParams (filter ?source=) butuh batas Suspense.
  return (
    <Suspense>
      <ContactsView />
    </Suspense>
  );
}
