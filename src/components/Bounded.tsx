import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export function Bounded({
  as: Comp = "div",
  className,
  children,
  ...restProps
}: BoundedProps) {
  return (
    <Comp
      className={clsx("mx-auto w-full max-w-7xl px-5 md:px-8", className)}
      {...restProps}
    >
      {children}
    </Comp>
  );
}
