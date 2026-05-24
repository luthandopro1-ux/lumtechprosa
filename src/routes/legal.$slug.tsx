import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { LEGAL } from "@/lib/marketing-content";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const page = LEGAL[params.slug];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} · LUM TECH PRO SA` },
          { name: "description", content: loaderData.page.intro },
        ]
      : [],
  }),
  notFoundComponent: () => <div className="p-10">Page not found.</div>,
  errorComponent: ({ error }) => <div className="p-10">Error: {error.message}</div>,
  component: () => <ContentPage page={Route.useLoaderData().page} />,
});
