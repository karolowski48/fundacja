import { JsonLd } from "@/components/JsonLd";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Donate } from "@/components/sections/Donate";
import { Faq } from "@/components/sections/Faq";
import { Help } from "@/components/sections/Help";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Stories } from "@/components/sections/Stories";
import { faq, getStories, settings } from "@/lib/content";
import { buildMetadata, faqJsonLd, webPageJsonLd } from "@/lib/seo";
import { buildDate } from "@/lib/site";

export const metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  const stories = getStories();
  return (
    <>
      <Hero />
      <Stats storyCount={stories.length} />
      <About />
      <Help />
      <Stories stories={stories} />
      <Donate />
      <Faq />
      <Contact />
      <JsonLd
        data={webPageJsonLd({
          path: "/",
          name: settings.seo.defaultTitle,
          description: settings.seo.defaultDescription,
          dateModified: buildDate,
        })}
      />
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
