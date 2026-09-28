export function NewIndicator() {
  return (
    <>
      <span
        aria-hidden="true"
        className="bg-new ml-2 inline-block size-1.5 shrink-0 rounded-full"
      />
      <span className="sr-only">, new</span>
    </>
  );
}
