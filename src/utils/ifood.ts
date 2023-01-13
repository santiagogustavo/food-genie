export const getSearchResultsFromPayload = (payload: any) => {
  if (!payload?.sections?.at(0)?.cards?.at(0)) {
    return [];
  }
  return payload.sections[0].cards[0].data.contents;
};
