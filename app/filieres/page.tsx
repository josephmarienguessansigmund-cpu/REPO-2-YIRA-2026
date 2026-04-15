import { getFilieres } from "@/lib/api";

export default async function FilieresPage() {
  const filieres = await getFilieres("CI");

  return (
    <div>
      <h1>Filières</h1>

      {filieres.map((f: any) => (
        <div key={f.id}>
          <p>{f.nom}</p>
        </div>
      ))}
    </div>
  );
}