import { LegalPage } from "@/components/layout/LegalPage";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("polityka-prywatnosci");
const path = "/polityka-prywatnosci/";

export const metadata = buildMetadata({ title: page.title, description: page.description, path });

export default function PrivacyPage() {
  return <LegalPage page={page} path={path} />;
}
