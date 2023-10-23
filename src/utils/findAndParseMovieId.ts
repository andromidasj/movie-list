export function findAndParseMovieId(
  guidList: { id: string }[],
  prefix: string
) {
  return guidList.find((e) => e.id.startsWith(prefix))?.id.split(prefix)[1];
}
