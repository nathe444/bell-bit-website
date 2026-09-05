import Image from "next/image";
import Link from "next/link";
import type { projects as projectsType } from "@/lib/content";
import { cn } from "@/lib/utils";

export type Project = (typeof projectsType)[number];

type ProjectDossierProps = {
  project: Project;
  index: number;
  className?: string;
  /** Enables battle-pass frame styling when used inside scroll claim animation. */
  claimed?: boolean;
};

export function ProjectDossier({ project, index, className, claimed }: ProjectDossierProps) {
  return (
    <article
      className={`grid h-full items-center gap-5 max-md:content-start md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-14 ${className ?? ""}`}
    >
      <div className="flex w-full items-center justify-center">
        <div
          className={cn(
            "relative w-fit max-w-full",
            claimed && "drop-shadow-[0_0_48px_color-mix(in_srgb,var(--color-signal)_35%,transparent)]",
          )}
        >
          <div
            className="relative h-[min(40vh,300px)] overflow-hidden rounded-lg sm:h-[min(44vh,340px)] md:h-[min(48vh,380px)]"
            style={{
              aspectRatio: project.imageAspect,
              maxWidth: "100%",
              width: "auto",
            }}
          >
            <Image
              src={project.image}
              alt={`${project.name} interface screenshot`}
              fill
              className="object-contain object-center"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority={index === 0}
            />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center max-md:pt-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-paper-faint max-md:tracking-[0.16em] md:gap-x-3 md:text-xs md:tracking-[0.2em]">
          <span>{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.industry}</span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-paper max-md:text-balance md:mt-4 md:text-3xl lg:text-4xl">
          {project.name}
        </h3>

        <p className="mt-3 text-base leading-relaxed text-paper-dim max-md:text-pretty md:mt-5 md:text-lg">
          {project.summary}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-paper-faint max-md:text-pretty md:mt-3 md:text-base">
          {project.detail}
        </p>

        {project.clientId ? (
          <Link
            href="#trust"
            className="mt-5 inline-flex w-fit border-b border-line-strong pb-1 text-xs font-medium uppercase tracking-[0.2em] text-paper-dim transition-colors hover:border-signal-soft hover:text-paper md:mt-8"
          >
            View client in registry
          </Link>
        ) : null}
      </div>
    </article>
  );
}
