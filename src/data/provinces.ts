import type { CityInsuranceData } from './types';
import { allCities, getCityDataByCode } from './index';

export interface ProvinceItem {
  code: string;
  name: string;
  enabled: boolean;
}

export interface CityOption {
  cityCode: string;
  cityName: string;
  hasData: boolean;
}

// 全国省份/直辖市列表
export const provinceList: ProvinceItem[] = [
  { code: '610000', name: '陕西省', enabled: true },
  { code: '110000', name: '北京市', enabled: true },
  { code: '120000', name: '天津市', enabled: true },
  { code: '310000', name: '上海市', enabled: true },
  { code: '500000', name: '重庆市', enabled: true },
  { code: '440000', name: '广东省', enabled: true },
  { code: '330000', name: '浙江省', enabled: true },
  { code: '320000', name: '江苏省', enabled: true },
  { code: '420000', name: '湖北省', enabled: true },
  { code: '410000', name: '河南省', enabled: true },
  { code: '370000', name: '山东省', enabled: true },
  { code: '510000', name: '四川省', enabled: true },
  { code: '620000', name: '甘肃省', enabled: true },
  { code: '130000', name: '河北省', enabled: true },
  { code: '430000', name: '湖南省', enabled: true },
  { code: '340000', name: '安徽省', enabled: true },
  { code: '350000', name: '福建省', enabled: true },
  { code: '210000', name: '辽宁省', enabled: true },
  { code: '360000', name: '江西省', enabled: true },
  { code: '230000', name: '黑龙江省', enabled: true },
  { code: '220000', name: '吉林省', enabled: true },
  { code: '140000', name: '山西省', enabled: true },
  { code: '530000', name: '云南省', enabled: true },
  { code: '520000', name: '贵州省', enabled: true },
  { code: '450000', name: '广西壮族自治区', enabled: true },
  { code: '460000', name: '海南省', enabled: true },
  { code: '150000', name: '内蒙古自治区', enabled: true },
  { code: '640000', name: '宁夏回族自治区', enabled: true },
  { code: '650000', name: '新疆维吾尔自治区', enabled: true },
  { code: '630000', name: '青海省', enabled: true },
  { code: '540000', name: '西藏自治区', enabled: true }
];





// 根据省份获取地级市列表
export function getCitiesByProvinceCode(provinceCode: string): CityOption[] {
  if (provinceCode === '610000') {
    return [
      { cityCode: '610100', cityName: '西安市', hasData: true },
      { cityCode: '610400', cityName: '咸阳市', hasData: true },
      { cityCode: '610300', cityName: '宝鸡市', hasData: true },
      { cityCode: '610500', cityName: '渭南市', hasData: true },
      { cityCode: '610800', cityName: '榆林市', hasData: true },
      { cityCode: '610600', cityName: '延安市', hasData: true },
      { cityCode: '610700', cityName: '汉中市', hasData: true },
      { cityCode: '610900', cityName: '安康市', hasData: true },
      { cityCode: '611000', cityName: '商洛市', hasData: true },
      { cityCode: '610200', cityName: '铜川市', hasData: true },
      { cityCode: '610403', cityName: '杨凌示范区', hasData: true }
    ];
  }
  if (provinceCode === '110000') {
    return [
      { cityCode: '110100', cityName: '北京市(全市统筹)', hasData: true }
    ];
  }
  if (provinceCode === '120000') {
    return [
      { cityCode: '120100', cityName: '天津市(全市统筹)', hasData: true }
    ];
  }
  if (provinceCode === '310000') {
    return [
      { cityCode: '310100', cityName: '上海市(全市统筹)', hasData: true }
    ];
  }
  if (provinceCode === '500000') {
    return [
      { cityCode: '500100', cityName: '重庆市(全市统筹)', hasData: true }
    ];
  }
  if (provinceCode === '440000') {
    return [
      { cityCode: '440100', cityName: '广州市', hasData: true },
      { cityCode: '440300', cityName: '深圳市', hasData: true },
      { cityCode: '440400', cityName: '珠海市', hasData: true },
      { cityCode: '440600', cityName: '佛山市', hasData: true },
      { cityCode: '441900', cityName: '东莞市', hasData: true },
      { cityCode: '441300', cityName: '惠州市', hasData: true },
      { cityCode: '442000', cityName: '中山市', hasData: true },
      { cityCode: '440700', cityName: '江门市', hasData: true },
      { cityCode: '441200', cityName: '肇庆市', hasData: true },
      { cityCode: '440500', cityName: '汕头市', hasData: true },
      { cityCode: '440800', cityName: '湛江市', hasData: true },
      { cityCode: '440900', cityName: '茂名市', hasData: true },
      { cityCode: '441700', cityName: '阳江市', hasData: true },
      { cityCode: '440200', cityName: '韶关市', hasData: true },
      { cityCode: '441800', cityName: '清远市', hasData: true },
      { cityCode: '441400', cityName: '梅州市', hasData: true },
      { cityCode: '441600', cityName: '河源市', hasData: true },
      { cityCode: '441500', cityName: '汕尾市', hasData: true },
      { cityCode: '445100', cityName: '潮州市', hasData: true },
      { cityCode: '445200', cityName: '揭阳市', hasData: true },
      { cityCode: '445300', cityName: '云浮市', hasData: true }
    ];
  }
  if (provinceCode === '330000') {
    return [
      { cityCode: '330100', cityName: '杭州市', hasData: true },
      { cityCode: '330200', cityName: '宁波市', hasData: true },
      { cityCode: '330300', cityName: '温州市', hasData: true },
      { cityCode: '330400', cityName: '嘉兴市', hasData: true },
      { cityCode: '330500', cityName: '湖州市', hasData: true },
      { cityCode: '330600', cityName: '绍兴市', hasData: true },
      { cityCode: '330700', cityName: '金华市', hasData: true },
      { cityCode: '330800', cityName: '衢州市', hasData: true },
      { cityCode: '330900', cityName: '舟山市', hasData: true },
      { cityCode: '331000', cityName: '台州市', hasData: true },
      { cityCode: '331100', cityName: '丽水市', hasData: true }
    ];
  }
  if (provinceCode === '320000') {
    return [
      { cityCode: '320100', cityName: '南京市', hasData: true },
      { cityCode: '320500', cityName: '苏州市', hasData: true },
      { cityCode: '320200', cityName: '无锡市', hasData: true },
      { cityCode: '320400', cityName: '常州市', hasData: true },
      { cityCode: '320600', cityName: '南通市', hasData: true },
      { cityCode: '320300', cityName: '徐州市', hasData: true },
      { cityCode: '320900', cityName: '盐城市', hasData: true },
      { cityCode: '321000', cityName: '扬州市', hasData: true },
      { cityCode: '321200', cityName: '泰州市', hasData: true },
      { cityCode: '321100', cityName: '镇江市', hasData: true },
      { cityCode: '320800', cityName: '淮安市', hasData: true },
      { cityCode: '320700', cityName: '连云港市', hasData: true },
      { cityCode: '321300', cityName: '宿迁市', hasData: true }
    ];
  }
  if (provinceCode === '420000') {
    return [
      { cityCode: '420100', cityName: '武汉市', hasData: true },
      { cityCode: '420200', cityName: '黄石市', hasData: true },
      { cityCode: '420300', cityName: '十堰市', hasData: true },
      { cityCode: '420500', cityName: '宜昌市', hasData: true },
      { cityCode: '420600', cityName: '襄阳市', hasData: true },
      { cityCode: '420700', cityName: '鄂州市', hasData: true },
      { cityCode: '420800', cityName: '荆门市', hasData: true },
      { cityCode: '420900', cityName: '孝感市', hasData: true },
      { cityCode: '421000', cityName: '荆州市', hasData: true },
      { cityCode: '421100', cityName: '黄冈市', hasData: true },
      { cityCode: '421200', cityName: '咸宁市', hasData: true },
      { cityCode: '421300', cityName: '随州市', hasData: true },
      { cityCode: '422800', cityName: '恩施土家族苗族自治州', hasData: true },
      { cityCode: '429004', cityName: '仙桃市', hasData: true },
      { cityCode: '429005', cityName: '潜江市', hasData: true },
      { cityCode: '429006', cityName: '天门市', hasData: true },
      { cityCode: '429021', cityName: '神农架林区', hasData: true }
    ];
  }
  if (provinceCode === '410000') {
    return [
      { cityCode: '410100', cityName: '郑州市', hasData: true },
      { cityCode: '410200', cityName: '开封市', hasData: true },
      { cityCode: '410300', cityName: '洛阳市', hasData: true },
      { cityCode: '410400', cityName: '平顶山市', hasData: true },
      { cityCode: '410500', cityName: '安阳市', hasData: true },
      { cityCode: '410600', cityName: '鹤壁市', hasData: true },
      { cityCode: '410700', cityName: '新乡市', hasData: true },
      { cityCode: '410800', cityName: '焦作市', hasData: true },
      { cityCode: '410900', cityName: '濮阳市', hasData: true },
      { cityCode: '411000', cityName: '许昌市', hasData: true },
      { cityCode: '411100', cityName: '漯河市', hasData: true },
      { cityCode: '411200', cityName: '三门峡市', hasData: true },
      { cityCode: '411300', cityName: '南阳市', hasData: true },
      { cityCode: '411400', cityName: '商丘市', hasData: true },
      { cityCode: '411500', cityName: '信阳市', hasData: true },
      { cityCode: '411600', cityName: '周口市', hasData: true },
      { cityCode: '411700', cityName: '驻马店市', hasData: true },
      { cityCode: '419001', cityName: '济源示范区', hasData: true }
    ];
  }
  if (provinceCode === '370000') {
    return [
      { cityCode: '370100', cityName: '济南市', hasData: true },
      { cityCode: '370200', cityName: '青岛市', hasData: true },
      { cityCode: '370300', cityName: '淄博市', hasData: true },
      { cityCode: '370400', cityName: '枣庄市', hasData: true },
      { cityCode: '370500', cityName: '东营市', hasData: true },
      { cityCode: '370600', cityName: '烟台市', hasData: true },
      { cityCode: '370700', cityName: '潍坊市', hasData: true },
      { cityCode: '370800', cityName: '济宁市', hasData: true },
      { cityCode: '370900', cityName: '泰安市', hasData: true },
      { cityCode: '371000', cityName: '威海市', hasData: true },
      { cityCode: '371100', cityName: '日照市', hasData: true },
      { cityCode: '371300', cityName: '临沂市', hasData: true },
      { cityCode: '371400', cityName: '德州市', hasData: true },
      { cityCode: '371500', cityName: '聊城市', hasData: true },
      { cityCode: '371600', cityName: '滨州市', hasData: true },
      { cityCode: '371700', cityName: '菏泽市', hasData: true }
    ];
  }
  if (provinceCode === '510000') {
    return [
      { cityCode: '510100', cityName: '成都市', hasData: true },
      { cityCode: '510300', cityName: '自贡市', hasData: true },
      { cityCode: '510400', cityName: '攀枝花市', hasData: true },
      { cityCode: '510500', cityName: '泸州市', hasData: true },
      { cityCode: '510600', cityName: '德阳市', hasData: true },
      { cityCode: '510700', cityName: '绵阳市', hasData: true },
      { cityCode: '510800', cityName: '广元市', hasData: true },
      { cityCode: '510900', cityName: '遂宁市', hasData: true },
      { cityCode: '511000', cityName: '内江市', hasData: true },
      { cityCode: '511100', cityName: '乐山市', hasData: true },
      { cityCode: '511300', cityName: '南充市', hasData: true },
      { cityCode: '511400', cityName: '眉山市', hasData: true },
      { cityCode: '511500', cityName: '宜宾市', hasData: true },
      { cityCode: '511600', cityName: '广安市', hasData: true },
      { cityCode: '511700', cityName: '达州市', hasData: true },
      { cityCode: '511800', cityName: '雅安市', hasData: true },
      { cityCode: '511900', cityName: '巴中市', hasData: true },
      { cityCode: '512000', cityName: '资阳市', hasData: true },
      { cityCode: '513200', cityName: '阿坝藏族羌族自治州', hasData: true },
      { cityCode: '513300', cityName: '甘孜藏族自治州', hasData: true },
      { cityCode: '513400', cityName: '凉山彝族自治州', hasData: true }
    ];
  }
  if (provinceCode === '620000') {
    return [
      { cityCode: '620100', cityName: '兰州市', hasData: true },
      { cityCode: '620200', cityName: '嘉峪关市', hasData: true },
      { cityCode: '620300', cityName: '金昌市', hasData: true },
      { cityCode: '620400', cityName: '白银市', hasData: true },
      { cityCode: '620500', cityName: '天水市', hasData: true },
      { cityCode: '620600', cityName: '武威市', hasData: true },
      { cityCode: '620700', cityName: '张掖市', hasData: true },
      { cityCode: '620800', cityName: '平凉市', hasData: true },
      { cityCode: '620900', cityName: '酒泉市', hasData: true },
      { cityCode: '621000', cityName: '庆阳市', hasData: true },
      { cityCode: '621100', cityName: '定西市', hasData: true },
      { cityCode: '621200', cityName: '陇南市', hasData: true },
      { cityCode: '622900', cityName: '临夏回族自治州', hasData: true },
      { cityCode: '623000', cityName: '甘南藏族自治州', hasData: true },
      { cityCode: '620108', cityName: '兰州新区', hasData: true }
    ];
  }
  if (provinceCode === '130000') {
    return [
      { cityCode: '130100', cityName: '石家庄市', hasData: true },
      { cityCode: '130200', cityName: '唐山市', hasData: true },
      { cityCode: '130300', cityName: '秦皇岛市', hasData: true },
      { cityCode: '130400', cityName: '邯郸市', hasData: true },
      { cityCode: '130500', cityName: '邢台市', hasData: true },
      { cityCode: '130600', cityName: '保定市', hasData: true },
      { cityCode: '130700', cityName: '张家口市', hasData: true },
      { cityCode: '130800', cityName: '承德市', hasData: true },
      { cityCode: '130900', cityName: '沧州市', hasData: true },
      { cityCode: '131000', cityName: '廊坊市', hasData: true },
      { cityCode: '131100', cityName: '衡水市', hasData: true },
      { cityCode: '133100', cityName: '雄安新区', hasData: true },
      { cityCode: '130682', cityName: '定州市', hasData: true },
      { cityCode: '130181', cityName: '辛集市', hasData: true }
    ];
  }
  if (provinceCode === '430000') {
    return [
      { cityCode: '430100', cityName: '长沙市', hasData: true },
      { cityCode: '430200', cityName: '株洲市', hasData: true },
      { cityCode: '430300', cityName: '湘潭市', hasData: true },
      { cityCode: '430400', cityName: '衡阳市', hasData: true },
      { cityCode: '430500', cityName: '邵阳市', hasData: true },
      { cityCode: '430600', cityName: '岳阳市', hasData: true },
      { cityCode: '430700', cityName: '常德市', hasData: true },
      { cityCode: '430800', cityName: '张家界市', hasData: true },
      { cityCode: '430900', cityName: '益阳市', hasData: true },
      { cityCode: '431000', cityName: '郴州市', hasData: true },
      { cityCode: '431100', cityName: '永州市', hasData: true },
      { cityCode: '431200', cityName: '怀化市', hasData: true },
      { cityCode: '431300', cityName: '娄底市', hasData: true },
      { cityCode: '433100', cityName: '湘西土家族苗族自治州', hasData: true }
    ];
  }
  if (provinceCode === '340000') {
    return [
      { cityCode: '340100', cityName: '合肥市', hasData: true },
      { cityCode: '340200', cityName: '芜湖市', hasData: true },
      { cityCode: '340300', cityName: '蚌埠市', hasData: true },
      { cityCode: '340400', cityName: '淮南市', hasData: true },
      { cityCode: '340500', cityName: '马鞍山市', hasData: true },
      { cityCode: '340600', cityName: '淮北市', hasData: true },
      { cityCode: '340700', cityName: '铜陵市', hasData: true },
      { cityCode: '340800', cityName: '安庆市', hasData: true },
      { cityCode: '341000', cityName: '黄山市', hasData: true },
      { cityCode: '341100', cityName: '滁州市', hasData: true },
      { cityCode: '341200', cityName: '阜阳市', hasData: true },
      { cityCode: '341300', cityName: '宿州市', hasData: true },
      { cityCode: '341500', cityName: '六安市', hasData: true },
      { cityCode: '341600', cityName: '亳州市', hasData: true },
      { cityCode: '341700', cityName: '池州市', hasData: true },
      { cityCode: '341800', cityName: '宣城市', hasData: true }
    ];
  }
  if (provinceCode === '350000') {
    return [
      { cityCode: '350100', cityName: '福州市', hasData: true },
      { cityCode: '350200', cityName: '厦门市', hasData: true },
      { cityCode: '350300', cityName: '莆田市', hasData: true },
      { cityCode: '350400', cityName: '三明市', hasData: true },
      { cityCode: '350500', cityName: '泉州市', hasData: true },
      { cityCode: '350600', cityName: '漳州市', hasData: true },
      { cityCode: '350700', cityName: '南平市', hasData: true },
      { cityCode: '350800', cityName: '龙岩市', hasData: true },
      { cityCode: '350900', cityName: '宁德市', hasData: true }
    ];
  }
  if (provinceCode === '210000') {
    return [
      { cityCode: '210100', cityName: '沈阳市', hasData: true },
      { cityCode: '210200', cityName: '大连市', hasData: true },
      { cityCode: '210300', cityName: '鞍山市', hasData: true },
      { cityCode: '210400', cityName: '抚顺市', hasData: true },
      { cityCode: '210500', cityName: '本溪市', hasData: true },
      { cityCode: '210600', cityName: '丹东市', hasData: true },
      { cityCode: '210700', cityName: '锦州市', hasData: true },
      { cityCode: '210800', cityName: '营口市', hasData: true },
      { cityCode: '210900', cityName: '阜新市', hasData: true },
      { cityCode: '211000', cityName: '辽阳市', hasData: true },
      { cityCode: '211100', cityName: '盘锦市', hasData: true },
      { cityCode: '211200', cityName: '铁岭市', hasData: true },
      { cityCode: '211300', cityName: '朝阳市', hasData: true },
      { cityCode: '211400', cityName: '葫芦岛市', hasData: true }
    ];
  }
  if (provinceCode === '360000') {
    return [
      { cityCode: '360100', cityName: '南昌市', hasData: true },
      { cityCode: '360200', cityName: '景德镇市', hasData: true },
      { cityCode: '360300', cityName: '萍乡市', hasData: true },
      { cityCode: '360400', cityName: '九江市', hasData: true },
      { cityCode: '360500', cityName: '新余市', hasData: true },
      { cityCode: '360600', cityName: '鹰潭市', hasData: true },
      { cityCode: '360700', cityName: '赣州市', hasData: true },
      { cityCode: '360800', cityName: '吉安市', hasData: true },
      { cityCode: '360900', cityName: '宜春市', hasData: true },
      { cityCode: '361000', cityName: '抚州市', hasData: true },
      { cityCode: '361100', cityName: '上饶市', hasData: true }
    ];
  }
  if (provinceCode === '230000') {
    return [
      { cityCode: '230100', cityName: '哈尔滨市', hasData: true },
      { cityCode: '230200', cityName: '齐齐哈尔市', hasData: true },
      { cityCode: '230300', cityName: '鸡西市', hasData: true },
      { cityCode: '230400', cityName: '鹤岗市', hasData: true },
      { cityCode: '230500', cityName: '双鸭山市', hasData: true },
      { cityCode: '230600', cityName: '大庆市', hasData: true },
      { cityCode: '230700', cityName: '伊春市', hasData: true },
      { cityCode: '230800', cityName: '佳木斯市', hasData: true },
      { cityCode: '230900', cityName: '七台河市', hasData: true },
      { cityCode: '231000', cityName: '牡丹江市', hasData: true },
      { cityCode: '231100', cityName: '黑河市', hasData: true },
      { cityCode: '231200', cityName: '绥化市', hasData: true },
      { cityCode: '232700', cityName: '大兴安岭地区', hasData: true }
    ];
  }
  if (provinceCode === '220000') {
    return [
      { cityCode: '220100', cityName: '长春市', hasData: true },
      { cityCode: '220200', cityName: '吉林市', hasData: true },
      { cityCode: '220300', cityName: '四平市', hasData: true },
      { cityCode: '220400', cityName: '辽源市', hasData: true },
      { cityCode: '220500', cityName: '通化市', hasData: true },
      { cityCode: '220600', cityName: '白山市', hasData: true },
      { cityCode: '220700', cityName: '松原市', hasData: true },
      { cityCode: '220800', cityName: '白城市', hasData: true },
      { cityCode: '222400', cityName: '延边朝鲜族自治州', hasData: true }
    ];
  }
  if (provinceCode === '140000') {
    return [
      { cityCode: '140100', cityName: '太原市', hasData: true },
      { cityCode: '140200', cityName: '大同市', hasData: true },
      { cityCode: '140300', cityName: '阳泉市', hasData: true },
      { cityCode: '140400', cityName: '长治市', hasData: true },
      { cityCode: '140500', cityName: '晋城市', hasData: true },
      { cityCode: '140600', cityName: '朔州市', hasData: true },
      { cityCode: '140700', cityName: '晋中市', hasData: true },
      { cityCode: '140800', cityName: '运城市', hasData: true },
      { cityCode: '140900', cityName: '忻州市', hasData: true },
      { cityCode: '141000', cityName: '临汾市', hasData: true },
      { cityCode: '141100', cityName: '吕梁市', hasData: true }
    ];
  }
  if (provinceCode === '530000') {
    return [
      { cityCode: '530100', cityName: '昆明市', hasData: true },
      { cityCode: '530300', cityName: '曲靖市', hasData: true },
      { cityCode: '530400', cityName: '玉溪市', hasData: true },
      { cityCode: '530500', cityName: '保山市', hasData: true },
      { cityCode: '530600', cityName: '昭通市', hasData: true },
      { cityCode: '530700', cityName: '丽江市', hasData: true },
      { cityCode: '530800', cityName: '普洱市', hasData: true },
      { cityCode: '530900', cityName: '临沧市', hasData: true },
      { cityCode: '532300', cityName: '楚雄彝族自治州', hasData: true },
      { cityCode: '532500', cityName: '红河哈尼族彝族自治州', hasData: true },
      { cityCode: '532600', cityName: '文山壮族苗族自治州', hasData: true },
      { cityCode: '532800', cityName: '西双版纳傣族自治州', hasData: true },
      { cityCode: '532900', cityName: '大理白族自治州', hasData: true },
      { cityCode: '533100', cityName: '德宏傣族景颇族自治州', hasData: true },
      { cityCode: '533300', cityName: '怒江傈僳族自治州', hasData: true },
      { cityCode: '533400', cityName: '迪庆藏族自治州', hasData: true }
    ];
  }
  if (provinceCode === '520000') {
    return [
      { cityCode: '520100', cityName: '贵阳市', hasData: true },
      { cityCode: '520200', cityName: '六盘水市', hasData: true },
      { cityCode: '520300', cityName: '遵义市', hasData: true },
      { cityCode: '520400', cityName: '安顺市', hasData: true },
      { cityCode: '520500', cityName: '毕节市', hasData: true },
      { cityCode: '520600', cityName: '铜仁市', hasData: true },
      { cityCode: '522300', cityName: '黔西南布依族苗族自治州', hasData: true },
      { cityCode: '522600', cityName: '黔东南苗族侗族自治州', hasData: true },
      { cityCode: '522700', cityName: '黔南布依族苗族自治州', hasData: true }
    ];
  }
  if (provinceCode === '450000') {
    return [
      { cityCode: '450100', cityName: '南宁市', hasData: true },
      { cityCode: '450200', cityName: '柳州市', hasData: true },
      { cityCode: '450300', cityName: '桂林市', hasData: true },
      { cityCode: '450400', cityName: '梧州市', hasData: true },
      { cityCode: '450500', cityName: '北海市', hasData: true },
      { cityCode: '450600', cityName: '防城港市', hasData: true },
      { cityCode: '450700', cityName: '钦州市', hasData: true },
      { cityCode: '450800', cityName: '贵港市', hasData: true },
      { cityCode: '450900', cityName: '玉林市', hasData: true },
      { cityCode: '451000', cityName: '百色市', hasData: true },
      { cityCode: '451100', cityName: '贺州市', hasData: true },
      { cityCode: '451200', cityName: '河池市', hasData: true },
      { cityCode: '451300', cityName: '来宾市', hasData: true },
      { cityCode: '451400', cityName: '崇左市', hasData: true }
    ];
  }
  if (provinceCode === '460000') {
    return [
      { cityCode: '460100', cityName: '海口市', hasData: true }
    ];
  }
  if (provinceCode === '150000') {
    return [
      { cityCode: '150100', cityName: '呼和浩特市', hasData: true },
      { cityCode: '150200', cityName: '包头市', hasData: true },
      { cityCode: '150300', cityName: '乌海市', hasData: true },
      { cityCode: '150400', cityName: '赤峰市', hasData: true },
      { cityCode: '150500', cityName: '通辽市', hasData: true },
      { cityCode: '150600', cityName: '鄂尔多斯市', hasData: true },
      { cityCode: '150700', cityName: '呼伦贝尔市', hasData: true },
      { cityCode: '150800', cityName: '巴彦淖尔市', hasData: true },
      { cityCode: '150900', cityName: '乌兰察布市', hasData: true },
      { cityCode: '152200', cityName: '兴安盟', hasData: true },
      { cityCode: '152500', cityName: '锡林郭勒盟', hasData: true },
      { cityCode: '152900', cityName: '阿拉善盟', hasData: true }
    ];
  }
  if (provinceCode === '640000') {
    return [
      { cityCode: '640100', cityName: '银川市', hasData: true },
      { cityCode: '640200', cityName: '石嘴山市', hasData: true },
      { cityCode: '640300', cityName: '吴忠市', hasData: true },
      { cityCode: '640400', cityName: '固原市', hasData: true },
      { cityCode: '640500', cityName: '中卫市', hasData: true }
    ];
  }
  if (provinceCode === '650000') {
    return [
      { cityCode: '650100', cityName: '乌鲁木齐市', hasData: true },
      { cityCode: '650200', cityName: '克拉玛依市', hasData: true },
      { cityCode: '650400', cityName: '吐鲁番市', hasData: true },
      { cityCode: '650500', cityName: '哈密市', hasData: true },
      { cityCode: '652300', cityName: '昌吉回族自治州', hasData: true },
      { cityCode: '652700', cityName: '博尔塔拉蒙古自治州', hasData: true },
      { cityCode: '652800', cityName: '巴音郭楞蒙古自治州', hasData: true },
      { cityCode: '652900', cityName: '阿克苏地区', hasData: true },
      { cityCode: '653000', cityName: '克孜勒苏柯尔克孜自治州', hasData: true },
      { cityCode: '653100', cityName: '喀什地区', hasData: true },
      { cityCode: '653200', cityName: '和田地区', hasData: true },
      { cityCode: '654000', cityName: '伊犁哈萨克自治州', hasData: true },
      { cityCode: '654200', cityName: '塔城地区', hasData: true },
      { cityCode: '654300', cityName: '阿勒泰地区', hasData: true }
    ];
  }
  if (provinceCode === '630000') {
    return [
      { cityCode: '630100', cityName: '西宁市', hasData: true },
      { cityCode: '630200', cityName: '海东市', hasData: true },
      { cityCode: '632200', cityName: '海北藏族自治州', hasData: true },
      { cityCode: '632300', cityName: '黄南藏族自治州', hasData: true },
      { cityCode: '632500', cityName: '海南藏族自治州', hasData: true },
      { cityCode: '632600', cityName: '果洛藏族自治州', hasData: true },
      { cityCode: '632700', cityName: '玉树藏族自治州', hasData: true },
      { cityCode: '632800', cityName: '海西蒙古族藏族自治州', hasData: true }
    ];
  }
  if (provinceCode === '540000') {
    return [
      { cityCode: '540100', cityName: '拉萨市', hasData: true },
      { cityCode: '540200', cityName: '日喀则市', hasData: true },
      { cityCode: '540300', cityName: '昌都市', hasData: true },
      { cityCode: '540400', cityName: '林芝市', hasData: true },
      { cityCode: '540500', cityName: '山南市', hasData: true },
      { cityCode: '540600', cityName: '那曲市', hasData: true },
      { cityCode: '542500', cityName: '阿里地区', hasData: true }
    ];
  }
  return [
    { cityCode: 'pending', cityName: '该省数据收录中', hasData: false }
  ];




}

// 获取具体城市的政策数据实体
export function getCityData(cityCode: string): CityInsuranceData | undefined {
  return getCityDataByCode(cityCode) || allCities[0];
}
