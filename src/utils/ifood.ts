export const getSearchResultsFromPayload = (payload: any) => {
  if (!payload?.sections?.at(0)?.cards?.at(0)) {
    return [];
  }
  return payload.sections[0].cards[0].data.contents;
};

export const getBrandsFromResults = (results: any) => results.map((result: any) => result.name);

export const getBrandIdFromName = (results: any, name: string) =>
  results.find((result: any) => result.name === name)?.id;

export const getMerchantFromId = (results: any, id: string) =>
  results.find((result: any) => result.id === id);
