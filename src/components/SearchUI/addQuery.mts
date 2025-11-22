type Params = Record<string, string | number | boolean>;

export default function addQuery(baseUrl: string, params: Params): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}