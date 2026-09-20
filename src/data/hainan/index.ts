import { haikouCityData } from './haikou';
import { sanyaCityData } from './sanya';
import { danzhouCityData } from './danzhou';
import { sanshaCityData } from './sansha';
import type { CityInsuranceData } from '../types';

export const hainanCities: CityInsuranceData[] = [
  haikouCityData,
  sanyaCityData,
  danzhouCityData,
  sanshaCityData
];

export {
  haikouCityData,
  sanyaCityData,
  danzhouCityData,
  sanshaCityData
};
