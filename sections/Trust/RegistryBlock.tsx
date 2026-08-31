import { RegistryRow } from "./RegistryRow";

type ClientEntry = {
  name: string;
  logo: string | null;
  sector: string;
  projectId?: string | null;
};

type PartnerEntry = {
  name: string;
  logo: string | null;
  focus: string;
};

type RegistryBlockProps =
  | {
      title: string;
      variant: "client";
      entries: readonly ClientEntry[];
      idPrefix: string;
      subordinate?: boolean;
    }
  | {
      title: string;
      variant: "partner";
      entries: readonly PartnerEntry[];
      idPrefix: string;
      subordinate?: boolean;
    };

export function RegistryBlock(props: RegistryBlockProps) {
  const { title, variant, entries, idPrefix, subordinate = false } = props;

  return (
    <div className={subordinate ? "mt-14 md:mt-16" : undefined}>
      <h3
        className={`mb-2 border-b border-line-strong pb-3 font-mono uppercase tracking-[0.25em] text-paper-faint ${
          subordinate ? "text-[10px]" : "text-xs"
        }`}
      >
        {title}
      </h3>

      <ul className="registry-block">
        {variant === "client"
          ? entries.map((entry, index) => (
              <RegistryRow
                key={entry.name}
                registryId={`${idPrefix}-${String(index + 1).padStart(2, "0")}`}
                name={entry.name}
                label={entry.sector}
                logo={entry.logo}
                projectId={entry.projectId}
                variant="client"
              />
            ))
          : entries.map((entry, index) => (
              <RegistryRow
                key={entry.name}
                registryId={`${idPrefix}-${String(index + 1).padStart(2, "0")}`}
                name={entry.name}
                label={entry.focus}
                logo={entry.logo}
                variant="partner"
              />
            ))}
      </ul>
    </div>
  );
}
