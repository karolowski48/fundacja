import { HeartHandshake, Phone } from "lucide-react";
import { Gallery } from "@/components/gallery/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Paw } from "@/components/ui/Paw";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { settings, team, type TeamMember } from "@/lib/content";
import { toGalleryItem } from "@/lib/gallery";
import { contentIcon } from "@/lib/icons";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";
import { buildDate, telHref } from "@/lib/site";
import { cn, nbsp } from "@/lib/typography";

const path = "/nasza-ekipa/";
export const metadata = buildMetadata({ title: team.seo.title, description: team.seo.description, path });

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const titleId = `ekipa-${index}`;
  return (
    <li>
      <article aria-labelledby={titleId} className="group flex h-full flex-col rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-plum-100 transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10">
        <div className="overflow-hidden rounded-[1.4rem]">
          <Picture
            name={member.image}
            alt={member.imageAlt}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <p className="self-start rounded-full bg-sun-400 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider text-plum-950">{member.role}</p>
          <h3 id={titleId} className="mt-3 font-display text-2xl font-semibold uppercase tracking-wide text-plum-800">
            {member.name}
          </h3>
          <p className="mt-2 text-plum-900">{nbsp(member.description)}</p>
        </div>
      </article>
    </li>
  );
}

export default function TeamPage() {
  const { intro, roles, membersSection, members, fairsSection, fairs, join, volunteerFormUrl } = team;
  const fairItems = fairs.map((photo, i) => toGalleryItem(photo, i));

  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.title} lead={intro.lead} crumb={intro.crumb} />

      {/* How volunteers help */}
      <section aria-labelledby="roles-title" className="py-20 sm:py-28">
        <Container>
          <SectionHeading id="roles-title" eyebrow={roles.eyebrow} title={roles.title} align="center" />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {roles.items.map((role) => {
              const Icon = contentIcon(role.icon);
              return (
                <li key={role.title} className="group rounded-[1.75rem] bg-white p-7 shadow-sm ring-1 ring-plum-100 transition-[transform,translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-plum-900/10">
                  <span className="grid size-14 place-items-center rounded-2xl bg-plum-100 text-plum-700 transition-[rotate,scale,background-color,color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-plum-600 group-hover:text-white">
                    <Icon aria-hidden="true" className="size-7" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-plum-800">{role.title}</h3>
                  <p className="mt-2 text-plum-900">{nbsp(role.text)}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Volunteers (only people who agreed to be published) */}
      <section id="ekipa" aria-labelledby="members-title" className="bg-plum-50 py-20 sm:py-28">
        <Container>
          <SectionHeading id="members-title" eyebrow={membersSection.eyebrow} title={membersSection.title} align="center" />
          {members.length > 0 ? (
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
              {members.map((member, i) => (
                <MemberCard key={`${member.name}-${i}`} member={member} index={i} />
              ))}
            </ul>
          ) : (
            <div data-reveal data-empty-state className="relative isolate mx-auto mt-12 max-w-2xl overflow-hidden rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm ring-1 ring-plum-100 sm:px-12">
              <Paw className="absolute -left-6 -top-6 -z-10 size-28 -rotate-12 text-plum-100" />
              <Paw className="absolute -bottom-8 -right-4 -z-10 size-32 rotate-12 text-cream-200" />
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-plum-600 text-white shadow-lg ring-4 ring-plum-100">
                <HeartHandshake aria-hidden="true" className="size-8" />
              </span>
              <h3 className="mt-6 font-display text-[clamp(1.5rem,3vw,2rem)] font-bold uppercase leading-tight tracking-wide text-plum-800">
                {nbsp(membersSection.emptyTitle)}
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-lg text-plum-700">{nbsp(membersSection.emptyText)}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href={settings.social.instagram} variant="outlinePlum" external>
                  <BrandIcon name="instagram" className="size-5" />
                  Instagram
                </ButtonLink>
                <ButtonLink href={settings.social.facebook} variant="outlinePlum" external>
                  <BrandIcon name="facebook" className="size-5" />
                  Facebook
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Photos from charity fairs - shown once there are any */}
      {fairItems.length > 0 && (
        <section id="kiermasze" aria-labelledby="fairs-title" className="py-20 sm:py-28">
          <Container>
            <SectionHeading id="fairs-title" eyebrow={fairsSection.eyebrow} title={fairsSection.title} lead={fairsSection.lead} align="center" className="mb-12" />
            <Gallery items={fairItems} categories={[]} />
          </Container>
        </section>
      )}

      {/* Join */}
      <section id="dolacz" aria-labelledby="join-title" className={cn("pb-20 sm:pb-28", fairItems.length === 0 && "pt-20 sm:pt-28")}>
        <Container>
          <div data-reveal className="on-dark group relative isolate overflow-hidden rounded-[2.25rem] bg-plum-800 px-6 py-12 text-cream-50 shadow-xl shadow-plum-900/15 sm:px-12 sm:py-16">
            <div aria-hidden="true" className="bg-paws absolute inset-0 -z-10" />
            <Paw className="paw-float absolute -right-8 -top-10 -z-10 size-44 rotate-12 text-plum-700" />
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 id="join-title" className="font-display text-[clamp(1.875rem,3.6vw,2.75rem)] font-bold uppercase leading-[1.08]">
                  {join.title}
                </h2>
                <p className="mt-4 max-w-xl text-lg text-cream-100">{nbsp(join.text)}</p>
                {!volunteerFormUrl && <p className="mt-4 max-w-xl text-cream-100">{nbsp(join.fallbackNote)}</p>}
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {volunteerFormUrl ? (
                  <ButtonLink href={volunteerFormUrl} variant="sun" external>
                    <HeartHandshake aria-hidden="true" className="size-5" />
                    {join.cta}
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="/#kontakt" variant="sun">
                      <HeartHandshake aria-hidden="true" className="size-5" />
                      {join.cta}
                    </ButtonLink>
                    <ButtonLink href={telHref(settings.phone)} variant="outlineLight">
                      <Phone aria-hidden="true" className="ring-on-hover size-5" />
                      {settings.phone}
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={webPageJsonLd({ path, name: team.seo.title, description: team.seo.description, dateModified: buildDate })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: intro.title, path }])} />
    </>
  );
}
