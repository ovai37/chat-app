import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-112px)] items-center justify-center">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
          ShareRoom
        </h1>

        <p className="mt-6 text-base leading-relaxed text-gray-400 sm:text-lg lg:text-xl">
          End-to-End Encrypted collaboration platform for chat, file sharing,
          collaborative notes, code editing, and meetings.
        </p>

        <Link
          to="/create"
          className="mt-10 inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-medium transition hover:bg-blue-700 sm:px-8 sm:py-4 sm:text-lg"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
