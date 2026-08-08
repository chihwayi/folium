export default function BooksLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 animate-pulse px-6 py-12">
      <div className="max-w-2xl">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-3 h-12 max-w-lg rounded bg-muted" />
        <div className="mt-4 h-4 w-72 rounded bg-muted" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="h-64 rounded-xl bg-muted lg:h-96" />
        <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index}>
              <div className="aspect-[2/3] rounded bg-muted" />
              <div className="mt-4 h-5 rounded bg-muted" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
