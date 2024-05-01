export const limitMaxMin = (val: number, max: number, min: number) => {
  return Math.max(min, Math.min(val, max))
}
