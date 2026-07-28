import { HomeActions } from "@/components/home/home-actions";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-16 text-center sm:items-start sm:text-left">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <h1 className="max-w-xs text-4xl font-bold tracking-tight text-foreground">
            Naviora
          </h1>
          <p className="max-w-sm text-muted-foreground">
            Plan and optimize your trips with interactive maps.
          </p>
        </div>
        <HomeActions />
      </main>
    </div>
  );
}
