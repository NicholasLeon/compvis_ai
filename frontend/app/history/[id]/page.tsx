import HistoryDetailPage from "./components/historyDetail";

type Params = Promise<{ id: string }>;

export default async function historyDetail(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  console.log(id);

  return (
    <main>
      <HistoryDetailPage id={id} />
    </main>
  );
}
