import type { CityInsuranceData } from '../types';
import { xianCityData } from './xian';
import { xianyangCityData } from './xianyang';
import { baojiCityData } from './baoji';
import { weinanCityData } from './weinan';
import { yulinCityData } from './yulin';
import { yananCityData } from './yanan';
import { hanzhongCityData } from './hanzhong';
import { ankangCityData } from './ankang';
import { shangluoCityData } from './shangluo';
import { tongchuanCityData } from './tongchuan';
import { yanglingCityData } from './yangling';

// 陕西省全部已录入地级市/示范区医保数据注册表
export const shaanxiCities: CityInsuranceData[] = [
  xianCityData,
  xianyangCityData,
  baojiCityData,
  weinanCityData,
  yulinCityData,
  yananCityData,
  hanzhongCityData,
  ankangCityData,
  shangluoCityData,
  tongchuanCityData,
  yanglingCityData
];

export function getCityDataByCode(cityCode: string): CityInsuranceData | undefined {
  return shaanxiCities.find(c => c.cityCode === cityCode);
}

// 导出各个统筹区数据实体
export {
  xianCityData,
  xianyangCityData,
  baojiCityData,
  weinanCityData,
  yulinCityData,
  yananCityData,
  hanzhongCityData,
  ankangCityData,
  shangluoCityData,
  tongchuanCityData,
  yanglingCityData
};
