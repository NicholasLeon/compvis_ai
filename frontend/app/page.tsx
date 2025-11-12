import { scanImage } from "@/lib/scan";

export default async function Page() {
  const result = await scanImage();

  return (
    <main>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
