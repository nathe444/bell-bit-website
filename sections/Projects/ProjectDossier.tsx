import Image from "next/image";
import Link from "next/link";
import type { projects as projectsType } from "@/lib/content";
import { projectRegistryId } from "./project.config";

export type Project = (typeof projectsType)[number];

type ProjectDossierProps = {
  project: Project;
  index: number;
  className?: string;
  /** Enables battle-pass frame styling when used inside scroll claim animation. */
  claimed?: boolean;
};

export function ProjectDossier({ project, index, className, claimed }: ProjectDossierProps) {
  const registryId = projectRegistryId(index);
  const isPortrait = project.imageOrientation === "portrait";

  return (
    <article
      className={`grid h-full items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-14 ${className ?? ""}`}
    >
      <div
        className={`relative overflow-hidden border bg-surface ${
          claimed
            ? "border-signal/40 shadow-[0_0_40px_-8px_rgba(61,123,253,0.55)]"
            : "border-line"
        } ${isPortrait ? "mx-auto w-full max-w-[220px] md:mx-0 md:max-w-none" : "w-full"}`}
      >
        <div
          className={`relative w-full ${isPortrait ? "aspect-[9/16]" : "aspect-[16/10]"}`}
        >
          <Image
            src={project.image}
            alt={`${project.name} interface screenshot`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 45vw, 100vw"
            priority={index === 0}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs uppercase tracking-[0.2em] text-paper-faint">
          <span className="font-mono text-signal-soft">{registryId}</span>
          <span aria-hidden="true">·</span>
          <span>{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.industry}</span>
        </div>

        <h3 className="mt-4 font-display text-3xl font-medium leading-tight text-paper md:text-4xl">
          {project.name}
        </h3>

        <p className="mt-5 text-lg leading-relaxed text-paper-dim">{project.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-paper-faint md:text-base">
          {project.detail}
        </p>

        {project.clientId ? (
          <Link
            href="#trust"
            className="mt-8 inline-flex w-fit border-b border-line-strong pb-1 text-xs font-medium uppercase tracking-[0.2em] text-paper-dim transition-colors hover:border-signal-soft hover:text-paper"
          >
            View client in registry
          </Link>
        ) : null}
      </div>
    </article>
  );
}
