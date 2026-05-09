import FormClient from "./FormClient";

type FormPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function FormPage({ searchParams }: FormPageProps) {
  const params = await searchParams;
  const orderId = firstParam(params.orderId) ?? "";

  return <FormClient orderId={orderId} />;
}
