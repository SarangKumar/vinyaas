export function NewIndicator() {
  return (
    <>
      <span
        aria-hidden="true"
        className="bg-primary ml-1.5 inline-block size-2 shrink-0 rounded-full"
      />
      <span className="sr-only">, new</span>
    </>
  );
}
