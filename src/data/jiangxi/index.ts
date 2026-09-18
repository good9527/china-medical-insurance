import { nanchangCityData } from './nanchang';
import { jingdezhenData } from './jingdezhen';
import { pingxiangData } from './pingxiang';
import { jiujiangData } from './jiujiang';
import { xinyuData } from './xinyu';
import { yingtanData } from './yingtan';
import { ganzhouData } from './ganzhou';
import { jianData } from './jian';
import { yichunData } from './yichun';
import { fuzhouData } from './fuzhou';
import { shangraoData } from './shangrao';
import type { CityInsuranceData } from '../types';

export const jiangxiCities: CityInsuranceData[] = [
  nanchangCityData,
  jingdezhenData,
  pingxiangData,
  jiujiangData,
  xinyuData,
  yingtanData,
  ganzhouData,
  jianData,
  yichunData,
  fuzhouData,
  shangraoData
];

export {
  nanchangCityData,
  jingdezhenData,
  pingxiangData,
  jiujiangData,
  xinyuData,
  yingtanData,
  ganzhouData,
  jianData,
  yichunData,
  fuzhouData,
  shangraoData
};
