import type { CityInsuranceData } from './types';
import { shaanxiCities } from './shaanxi';
import { beijingCityData } from './beijing';
import { tianjinCityData } from './tianjin';
import { shanghaiCityData } from './shanghai';
import { chongqingCityData } from './chongqing';
import { sichuanCities } from './sichuan';
import { guangdongCities } from './guangdong';
import { zhejiangCities } from './zhejiang';
import { jiangsuCities } from './jiangsu';
import { hubeiCities } from './hubei';
import { henanCities } from './henan';
import { shandongCities } from './shandong';
import { gansuCities } from './gansu';
import { hebeiCities } from './hebei';
import { hunanCities } from './hunan';
import { anhuiCities } from './anhui';
import { fujianCities } from './fujian';
import { liaoningCities } from './liaoning';
import { jiangxiCities } from './jiangxi';
import { heilongjiangCities } from './heilongjiang';
import { jilinCities } from './jilin';
import { shanxiCities } from './shanxi';
import { yunnanCities } from './yunnan';
import { guizhouCities } from './guizhou';
import { guangxiCities } from './guangxi';
import { hainanCities } from './hainan';
import { neimengguCities } from './neimenggu';
import { ningxiaCities } from './ningxia';
import { xinjiangCities } from './xinjiang';
import { qinghaiCities } from './qinghai';
import { xizangCities } from './xizang';

// 全国所有已录入统筹区全量池
export const allCities: CityInsuranceData[] = [
  ...shaanxiCities,
  beijingCityData,
  tianjinCityData,
  shanghaiCityData,
  chongqingCityData,
  ...sichuanCities,
  ...guangdongCities,
  ...zhejiangCities,
  ...jiangsuCities,
  ...hubeiCities,
  ...henanCities,
  ...shandongCities,
  ...gansuCities,
  ...hebeiCities,
  ...hunanCities,
  ...anhuiCities,
  ...fujianCities,
  ...liaoningCities,
  ...jiangxiCities,
  ...heilongjiangCities,
  ...jilinCities,
  ...shanxiCities,
  ...yunnanCities,
  ...guizhouCities,
  ...guangxiCities,
  ...hainanCities,
  ...neimengguCities,
  ...ningxiaCities,
  ...xinjiangCities,
  ...qinghaiCities,
  ...xizangCities
];

// 统一数据安全规整 (彻底杜绝 undefined)
for (const city of allCities) {
  if (city.resident?.outpatient && city.resident.outpatient.annualDeductible === undefined) {
    city.resident.outpatient.annualDeductible = 0;
  }
  if (city.employee?.outpatient && city.employee.outpatient.annualDeductible === undefined) {
    city.employee.outpatient.annualDeductible = 0;
  }
}

// 根据统筹区编码检索医保数据
export function getCityDataByCode(cityCode: string): CityInsuranceData | undefined {
  return allCities.find(c => c.cityCode === cityCode);
}

export * from './types';
export * from './shaanxi';
export * from './beijing';
export * from './tianjin';
export * from './shanghai';
export * from './chongqing';
export * from './sichuan';
export * from './guangdong';
export * from './zhejiang';
export * from './jiangsu';
export * from './hubei';
export * from './henan';
export * from './shandong';
export * from './gansu';
export * from './hebei';
export * from './hunan';
export * from './anhui';
export * from './fujian';
export * from './liaoning';
export * from './jiangxi';
export * from './heilongjiang';
export * from './jilin';
export * from './shanxi';
export * from './yunnan';
export * from './guizhou';
export * from './guangxi';
export * from './hainan';
export * from './neimenggu';
export * from './ningxia';
export * from './xinjiang';
export * from './qinghai';
export * from './xizang';




