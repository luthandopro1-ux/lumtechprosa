import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { SERVICES } from "@/lib/marketing-content";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = SERVICES[params.slug];
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} · Lum Tech Pro SA` },
          { name: "description", content: loaderData.page.intro },
        ]
      : [],
  }),
  notFoundComponent: () => <div className="p-10">Service not found.</div>,
  errorComponent: ({ error }) => <div className="p-10">Error: {error.message}</div>,
  component: () => <ContentPage page={Route.useLoaderData().page} />,
});
