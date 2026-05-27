export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);

export const formatStringDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "full"
  }).format(new Date(value));