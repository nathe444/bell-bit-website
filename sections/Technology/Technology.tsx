import { technologyGroups, technologySection } from "@/lib/content";
import { TechnologyStage } from "./TechnologyStage";

export function Technology() {
  return (
    <TechnologyStage groups={technologyGroups} title={technologySection.title} />
  );
}
