export function sum(data: Array<number>): number {
  return data.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}
