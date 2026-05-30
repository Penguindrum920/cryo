import { notFound } from "next/navigation";

import { ARExperience } from "@/slices/AR/ARExperience";
import { CRYO_FLAVORS, getFlavorBySlug } from "@/data/flavors";

type ARPageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    launch?: string | string[];
  };
};

export function generateStaticParams() {
  return CRYO_FLAVORS.map((flavor) => ({
    slug: flavor.slug,
  }));
}

export default function ARPage({ params, searchParams }: ARPageProps) {
  const flavor = getFlavorBySlug(params.slug);

  if (flavor.slug !== params.slug) {
    notFound();
  }

  const launchValue = Array.isArray(searchParams?.launch)
    ? searchParams?.launch[0]
    : searchParams?.launch;

  return <ARExperience autoLaunch={launchValue === "1"} flavor={flavor} />;
}
