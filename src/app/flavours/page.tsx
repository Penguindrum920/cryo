import { FlavorExperience } from "@/slices/Flavours/FlavorExperience";
import { getFlavorVideoSequence } from "@/data/flavorVideos";
import { getFlavorByRouteValue } from "@/data/flavors";

type FlavoursPageProps = {
  searchParams?: {
    flavor?: string | string[];
    flavour?: string | string[];
  };
};

export default function FlavoursPage({ searchParams }: FlavoursPageProps) {
  const routeValue =
    getSingleValue(searchParams?.flavor) ??
    getSingleValue(searchParams?.flavour);
  const flavor = getFlavorByRouteValue(routeValue);
  const videoSequence = getFlavorVideoSequence(flavor);

  return (
    <FlavorExperience
      initialFlavorId={flavor.id}
      videoSequence={videoSequence}
    />
  );
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
