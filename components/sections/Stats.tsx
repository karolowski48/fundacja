import { Container } from "@/components/ui/Container";
import { home } from "@/lib/content";

export function Stats({ storyCount }: { storyCount: number }) {
  const { stats } = home;
  return (
    <section aria-labelledby="stats-title" className="relative z-10 -mt-16 sm:-mt-20">
      <Container>
        <div className="rounded-[2rem] bg-white px-5 py-7 shadow-xl shadow-plum-900/10 ring-1 ring-plum-100 sm:px-8">
          <h2 id="stats-title" className="sr-only">
            Nasza pomoc w liczbach
          </h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-4 lg:divide-x lg:divide-plum-100" data-reveal-stagger>
            {stats.items.map((item) => {
              const value = item.value.replace("{stories}", String(storyCount));
              const number = value.match(/\d+/)?.[0];
              return (
                <div key={item.label} className="group flex flex-col-reverse items-center justify-end text-center lg:px-4">
                  <dt className="mt-1 text-sm font-semibold text-plum-700 sm:text-base">{item.label}</dt>
                  <dd className="font-display text-4xl font-bold text-plum-600 transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
                    <span aria-hidden="true" data-count={number}>
                      {value}
                    </span>
                    <span className="sr-only">{value}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-6 text-center text-sm text-plum-700">Stan na {stats.asOf}.</p>
        </div>
      </Container>
    </section>
  );
}
