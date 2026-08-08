export default function CategoriesLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 animate-pulse px-6 py-14">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-3 h-12 max-w-lg rounded bg-muted" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="min-h-52 rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
