"""
天地图官方矢量数据（审图号：GS（2026）4921号）配准与轻量化 SVG 路径生成脚本
覆盖全国 348 个医保统筹区，支持高精度 Albers 投影、边界线与南海诸岛附图
"""

import json
import math
import os
import sys

# 1. 中国标准 Albers 等面积投影参数
phi1 = math.radians(25.0)
phi2 = math.radians(47.0)
lam0 = math.radians(105.0)
phi0 = math.radians(35.0)

n = 0.5 * (math.sin(phi1) + math.sin(phi2))
C = math.cos(phi1)**2 + 2 * n * math.sin(phi1)
rho0 = math.sqrt(C - 2 * n * math.sin(phi0)) / n

def albers(lon, lat):
    lam = math.radians(lon)
    phi = math.radians(lat)
    theta = n * (lam - lam0)
    val = C - 2 * n * math.sin(phi)
    rho = math.sqrt(max(0.0, val)) / n
    x = rho * math.sin(theta)
    y = -(rho0 - rho * math.cos(theta)) # SVG y轴向下
    return x, y

# 画布坐标尺寸：viewBox 0 0 1000 760
scale = 1170.0
offset_x = 515.0
offset_y = 435.0

def to_svg(lon, lat):
    px, py = albers(lon, lat)
    sx = round(offset_x + px * scale, 1)
    sy = round(offset_y + py * scale, 1)
    return sx, sy

# 南海诸岛标准附图（右下角）
# 视窗：x=815, y=515, w=170, h=230
inset_scale = 360.0
inset_cx = 900.0
inset_cy = 635.0

def to_inset_svg(lon, lat):
    px, py = albers(lon, lat)
    cx_ref, cy_ref = albers(114.0, 13.0)
    sx = round(inset_cx + (px - cx_ref) * inset_scale, 1)
    sy = round(inset_cy + (py - cy_ref) * inset_scale, 1)
    return sx, sy

def simplify_points(pts, tol=0.35):
    if len(pts) <= 2:
        return pts
    x1, y1 = pts[0]
    x2, y2 = pts[-1]
    dx = x2 - x1
    dy = y2 - y1
    denom = math.sqrt(dx*dx + dy*dy)
    max_d = 0
    max_idx = 0
    for i in range(1, len(pts) - 1):
        x0, y0 = pts[i]
        if denom == 0:
            d = math.sqrt((x0 - x1)**2 + (y0 - y1)**2)
        else:
            d = abs(dy*x0 - dx*y0 + x2*y1 - y2*x1) / denom
        if d > max_d:
            max_d = d
            max_idx = i
    if max_d > tol:
        res1 = simplify_points(pts[:max_idx+1], tol)
        res2 = simplify_points(pts[max_idx:], tol)
        return res1[:-1] + res2
    else:
        return [pts[0], pts[-1]]

def coords_to_path(coords, is_inset=False):
    trans = to_inset_svg if is_inset else to_svg
    if not coords: return ''
    if isinstance(coords[0][0], (int, float)):
        # 环 (Ring)
        raw_pts = [trans(pt[0], pt[1]) for pt in coords]
        simp_pts = simplify_points(raw_pts, tol=0.35)
        if len(simp_pts) < 3:
            simp_pts = raw_pts
        pts_str = [f"{round(p[0], 1)},{round(p[1], 1)}" for p in simp_pts]
        return "M" + "L".join(pts_str) + "Z"
    else:
        return "".join(coords_to_path(ring, is_inset) for ring in coords)

def geom_to_path(geom, is_inset=False):
    gtype = geom.get('type')
    coords = geom.get('coordinates', [])
    if gtype == 'Polygon':
        return coords_to_path(coords, is_inset)
    elif gtype == 'MultiPolygon':
        return "".join(coords_to_path(poly, is_inset) for poly in coords)
    elif gtype == 'LineString':
        trans = to_inset_svg if is_inset else to_svg
        raw_pts = [trans(pt[0], pt[1]) for pt in coords]
        simp_pts = simplify_points(raw_pts, tol=0.35)
        pts_str = [f"{round(p[0], 1)},{round(p[1], 1)}" for p in simp_pts]
        return "M" + "L".join(pts_str)
    elif gtype == 'MultiLineString':
        trans = to_inset_svg if is_inset else to_svg
        parts = []
        for line in coords:
            raw_pts = [trans(pt[0], pt[1]) for pt in line]
            simp_pts = simplify_points(raw_pts, tol=0.35)
            pts_str = [f"{round(p[0], 1)},{round(p[1], 1)}" for p in simp_pts]
            parts.append("M" + "L".join(pts_str))
        return "".join(parts)
    return ""

def get_centroid(geom):
    coords = []
    def extract_pts(c):
        if isinstance(c[0], (int, float)):
            coords.append(c)
        else:
            for sub in c: extract_pts(sub)
    extract_pts(geom.get('coordinates', []))
    if not coords:
        return [500, 380]
    # 取经纬度平均中心并投影
    avg_lon = sum(pt[0] for pt in coords) / len(coords)
    avg_lat = sum(pt[1] for pt in coords) / len(coords)
    sx, sy = to_svg(avg_lon, avg_lat)
    return [sx, sy]

# 2. 加载源数据
benchmarks_path = 'scratch_benchmarks.json'
with open(benchmarks_path, 'r', encoding='utf-8') as f:
    benchmarks = json.load(f)

print(f"Loaded {len(benchmarks)} healthcare benchmarks")

desktop_dir = r"C:\Users\19901\OneDrive\Desktop"
city_path = os.path.join(desktop_dir, "审图号：GS（2026）4921号中国_市.geojson")
prov_path = os.path.join(desktop_dir, "审图号：GS（2026）4921号中国_省.geojson")
county_path = os.path.join(desktop_dir, "审图号：GS（2026）4921号中国_县.geojson")

with open(city_path, 'r', encoding='utf-8') as f:
    city_data = json.load(f)

with open(prov_path, 'r', encoding='utf-8') as f:
    prov_data = json.load(f)

with open(county_path, 'r', encoding='utf-8') as f:
    county_data = json.load(f)

# 建立拓扑几何索引
geom_by_code = {}
for feat in city_data['features']:
    gb = feat['properties'].get('gb', '')
    code = gb[3:] if gb.startswith('156') else gb
    geom_by_code[code] = feat

for feat in prov_data['features']:
    gb = feat['properties'].get('gb', '')
    code = gb[3:] if gb.startswith('156') else gb
    if code:
        geom_by_code['P_' + code] = feat

for feat in county_data['features']:
    gb = feat['properties'].get('gb', '')
    code = gb[3:] if gb.startswith('156') else gb
    if code:
        geom_by_code['C_' + code] = feat

special_mapping = {
    '110100': 'P_110000', # 北京市
    '120100': 'P_120000', # 天津市
    '310100': 'P_310000', # 上海市
    '500100': 'P_500000', # 重庆市
    '610403': 'C_610403', # 杨凌示范区
    '130682': 'C_130682', # 定州市
    '130181': 'C_130181', # 辛集市
    '620108': 'C_620102', # 兰州新区
    '133100': 'C_130629', # 雄安新区
    '660000': 'P_650000'  # 兵团
}

# 3. 为 348 个统筹区构建配准数据集
output_cities = []
for b in benchmarks:
    code = b['cityCode']
    name = b['cityName']
    pname = b['provinceName']
    
    # 获取几何
    geom_feat = None
    if code in special_mapping:
        mapped_key = special_mapping[code]
        geom_feat = geom_by_code.get(mapped_key)
    elif code in geom_by_code:
        geom_feat = geom_by_code[code]
    elif 'C_' + code in geom_by_code:
        geom_feat = geom_by_code['C_' + code]
    
    if not geom_feat:
        raise ValueError(f"Missing geometry for {code} {name}")
    
    geom = geom_feat['geometry']
    
    # 针对三沙市特殊处理：南海主图中不展示，直接呈现在右下角附图中
    is_sansha = ('三沙' in name or code == '460300')
    if is_sansha:
        path_str = geom_to_path(geom, is_inset=True)
        centroid = [inset_cx, inset_cy]
    else:
        path_str = geom_to_path(geom, is_inset=False)
        centroid = get_centroid(geom)
    
    city_item = {
        'cityCode': code,
        'cityName': name,
        'provinceName': pname,
        'overallScore': b.get('overallScore', 75),
        'employeeScore': b.get('employeeScore', 75),
        'residentScore': b.get('residentScore', 75),
        'empInpatientRatio': b.get('empInpatientRatio', 0.85),
        'empInpatientDed': b.get('empInpatientDed', 800),
        'empOutpatientCap': b.get('empOutpatientCap', 3000),
        'resInpatientRatio': b.get('resInpatientRatio', 0.65),
        'resOutpatientCap': b.get('resOutpatientCap', 1000),
        'catastrophicMaxRatio': b.get('catastrophicMaxRatio', 0.70),
        'retireeBonusRatio': b.get('retireeBonusRatio', 0.05),
        'docNumber': b.get('latestPolicyDocNumber', '现行有效规章'),
        'centroid': centroid,
        'path': path_str,
        'isInset': is_sansha
    }
    output_cities.append(city_item)

print(f"Successfully processed {len(output_cities)} cities")

# 4. 提取国界线、省界骨架线与十段线
boundary_items = []
ten_dash_lines = []
province_border_paths = []

for feat in prov_data['features']:
    props = feat.get('properties', {})
    p_name = props.get('name', '')
    geom = feat.get('geometry', {})
    
    if '境界线' in p_name:
        # 国界与十段线
        p_main = geom_to_path(geom, is_inset=False)
        p_inset = geom_to_path(geom, is_inset=True)
        ten_dash_lines.append({
            'mainPath': p_main,
            'insetPath': p_inset
        })
    else:
        # 省界
        p_main = geom_to_path(geom, is_inset=False)
        p_inset = geom_to_path(geom, is_inset=True)
        province_border_paths.append({
            'name': p_name,
            'mainPath': p_main,
            'insetPath': p_inset
        })

boundaries_meta = {
    'mapAuditNumber': "GS（2026）4921号",
    'source': "自然资源部天地图官方矢量数据",
    'viewBox': "0 0 1000 760",
    'insetBox': {
        'x': 815,
        'y': 515,
        'width': 170,
        'height': 230
    },
    'tenDashLines': ten_dash_lines,
    'provinceBorders': province_border_paths
}

# 5. 写入目标目录
target_dir = os.path.join("src", "data", "map")
os.makedirs(target_dir, exist_ok=True)

cities_file = os.path.join(target_dir, "china_cities_map.json")
with open(cities_file, 'w', encoding='utf-8') as f:
    json.dump(output_cities, f, ensure_ascii=False)

boundaries_file = os.path.join(target_dir, "china_boundaries.json")
with open(boundaries_file, 'w', encoding='utf-8') as f:
    json.dump(boundaries_meta, f, ensure_ascii=False)

print(f"Saved {cities_file} ({os.path.getsize(cities_file) / 1024:.1f} KB)")
print(f"Saved {boundaries_file} ({os.path.getsize(boundaries_file) / 1024:.1f} KB)")
print("ALL DONE SUCCESS!")
