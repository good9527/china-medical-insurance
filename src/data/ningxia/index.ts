import type { CityInsuranceData } from '../types';
import { yinchuanCityData } from './yinchuan';
import { shizuishanData } from './shizuishan';
import { wuzhongData } from './wuzhong';
import { guyuanData } from './guyuan';
import { zhongweiData } from './zhongwei';

export const ningxiaCities: CityInsuranceData[] = [
  yinchuanCityData,
  shizuishanData,
  wuzhongData,
  guyuanData,
  zhongweiData
];

export {
  yinchuanCityData,
  shizuishanData,
  wuzhongData,
  guyuanData,
  zhongweiData
};
