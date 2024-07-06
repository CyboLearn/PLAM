"use client";

import { Subheading } from "./heading";
import { Link } from "./link";
import { Text } from "./text";
import { Button } from "./button";
import clsx from "clsx";

export function Card({
  title = "",
  description = "",
  href = "",
  ...props
}: {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly className?: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx(
        "flex flex-row bg-zinc-800 px-4 py-6 border border-zinc-700 rounded-lg",
        props?.className
      )}
      {...props}
    >
      <div className="flex flex-col">
        <Subheading>{title}</Subheading>
        <Text>{description}</Text>
      </div>
      <div className="ml-auto flex flex-col justify-center">
        <Button href={href}>
          View Course
        </Button>
      </div>
    </Link>
  );
}
