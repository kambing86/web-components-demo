export function getNameFromData(data) {
  const { modelClass, version } = data;
  return `${modelClass} ${version}`;
}
