"""
天地图官方矢量数据（审图号：GS（2026）4921号）全域一体化配准与轻量化 SVG 生成脚本
- 取消独立附图线框，全国版图（含三沙市与南海诸岛十段线）一体化真实投影无缝融合
- 精确剔除多余重叠层与杂乱省界虚线，仅保留 348 个医保统筹区与法定南海十段线
- 统一中国 Albers 等面积投影 (viewBox: 0 0 920 940)
"""

import json
import math
import os
import sys

# 1. 中国标准 Albers 等面积投影
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
    y = rho0 - rho * math.cos(theta) # 北向为正
    return x, y

# 画布坐标：viewBox 0 0 920 940
scale = 1005.83
offset_x = 493.04
offset_y = 375.40

def to_svg(lon, lat):
    px, py = albers(lon, lat)
    sx = round(offset_x + px * scale, 1)
    sy = round(offset_y - py * scale, 1) # SVG y轴向下
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

def coords_to_path(coords, is_island_boost=False):
    if not coords: return ''
    if isinstance(coords[0][0], (int, float)):
        # 环 (Ring)
        raw_pts = [to_svg(pt[0], pt[1]) for pt in coords]
        simp_pts = simplify_points(raw_pts, tol=0.35)
        if len(simp_pts) < 3:
            simp_pts = raw_pts
        if len(simp_pts) < 3 and len(raw_pts) > 0:
            # 单点或两点岛礁：生成微型可见多边形
            p0 = raw_pts[0]
            r = 1.4 if is_island_boost else 1.0
            simp_pts = [
                (p0[0] - r, p0[1] - r),
                (p0[0] + r, p0[1] - r),
                (p0[0] + r, p0[1] + r),
                (p0[0] - r, p0[1] + r)
            ]
        pts_str = [f"{round(p[0], 1)},{round(p[1], 1)}" for p in simp_pts]
        return "M" + "L".join(pts_str) + "Z"
    else:
        return "".join(coords_to_path(ring, is_island_boost) for ring in coords)

def geom_to_path(geom, is_island_boost=False):
    gtype = geom.get('type')
    coords = geom.get('coordinates', [])
    if gtype == 'Polygon':
        return coords_to_path(coords, is_island_boost)
    elif gtype == 'MultiPolygon':
        return "".join(coords_to_path(poly, is_island_boost) for poly in coords)
    elif gtype == 'LineString':
        raw_pts = [to_svg(pt[0], pt[1]) for pt in coords]
        simp_pts = simplify_points(raw_pts, tol=0.35)
        pts_str = [f"{round(p[0], 1)},{round(p[1], 1)}" for p in simp_pts]
        return "M" + "L".join(pts_str)
    elif gtype == 'MultiLineString':
        parts = []
        for line in coords:
            raw_pts = [to_svg(pt[0], pt[1]) for pt in line]
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
        return [460, 470]
    avg_lon = sum(pt[0] for pt in coords) / len(coords)
    avg_lat = sum(pt[1] for pt in coords) / len(coords)
    sx, sy = to_svg(avg_lon, avg_lat)
    return [sx, sy]

# 2. 读取当前已有的 348 统筹区元数据
existing_cities_file = os.path.join("src", "data", "map", "china_cities_map.json")
with open(existing_cities_file, 'r', encoding='utf-8') as f:
    existing_cities = json.load(f)

print(f"Loaded {len(existing_cities)} healthcare cities metadata")

# 3. 读取天地图官方矢量数据
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

# 4. 重新投影生成 348 个医保统筹区
output_cities = []
for c_item in existing_cities:
    code = c_item['cityCode']
    name = c_item['cityName']
    
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
    is_sansha = ('三沙' in name or code == '460300')
    
    # 统筹区几何转换：全部统一在主画布中
    path_str = geom_to_path(geom, is_island_boost=is_sansha)
    if is_sansha:
        # 三沙市定焦锚点设为永兴岛中心 (112.34°E, 16.84°N)
        centroid = list(to_svg(112.34, 16.84))
    else:
        centroid = get_centroid(geom)
    
    new_item = dict(c_item)
    new_item['centroid'] = centroid
    new_item['path'] = path_str
    if 'isInset' in new_item:
        del new_item['isInset'] # 不再区分附图，全域一体化
    output_cities.append(new_item)

print(f"Successfully reprojected {len(output_cities)} cities")

# 5. 提取法定南海十段线（Line 35）
# 官方自然资源部数据第 35 项为南海十段线与海上界线
line35_feat = prov_data['features'][35]
ten_dash_path = geom_to_path(line35_feat['geometry'])

boundaries_meta = {
    'mapAuditNumber': "GS（2026）4921号",
    'source': "自然资源部天地图官方矢量数据",
    'viewBox': "0 0 920 940",
    'tenDashLinePath': ten_dash_path
}

# 6. 保存新数据
target_dir = os.path.join("src", "data", "map")
cities_file = os.path.join(target_dir, "china_cities_map.json")
with open(cities_file, 'w', encoding='utf-8') as f:
    json.dump(output_cities, f, ensure_ascii=False)

boundaries_file = os.path.join(target_dir, "china_boundaries.json")
with open(boundaries_file, 'w', encoding='utf-8') as f:
    json.dump(boundaries_meta, f, ensure_ascii=False)

print(f"Saved {cities_file} ({os.path.getsize(cities_file) / 1024:.1f} KB)")
print(f"Saved {boundaries_file} ({os.path.getsize(boundaries_file) / 1024:.1f} KB)")
print("REPROJECT SUCCESSFUL!")
