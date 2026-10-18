export const generateAutoAddress = (cityVal: string, stateVal: string, countryVal: string, zipVal: string) => {
    const parts = [countryVal, stateVal, cityVal].filter(Boolean);
    let result = parts.join(', ');
    if (zipVal) result += ` - ${zipVal}`;
    return result;
};
