export function useCase(fn) {
  return (req) => fn({ ...req.body, ...req.query, ...req.params });
}
