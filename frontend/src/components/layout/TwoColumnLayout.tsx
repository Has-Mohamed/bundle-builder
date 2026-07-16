import type { ReactNode } from "react";

export function TwoColumnLayout({
  builder,
  review,
}: {
  builder: ReactNode;
  review: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[1320px] grid-cols-1 md:gap-7 md:p-6 xl:grid-cols-[1fr_400px] lg:items-start lg:p-10">
      <div className="min-w-0">{builder}</div>
      <div className="min-w-0 max-md:border-t">{review}</div>
    </div>
  );
}
