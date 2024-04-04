import re
import numpy as np


def penumbra_coords(pct, lat, lon, azm, path_width):
    offset_dist = pct * (path_width // 2)
    offset_lat_dist = offset_dist * np.cos(azm)
    offset_lon_dist = offset_dist * np.sin(azm)
    offset_lat_coord = offset_lat_dist / 111.32
    offset_lon_coord = offset_lon_dist / (111.32 * np.cos(lat))
    return [lat + offset_lat_coord, lon + offset_lon_coord]


def minutes_and_direction(degree_str):
    match = re.match(r"(\d+(\.\d+)?)([A-Za-z])", degree_str)
    if match:
        return float(match.group(1)), match.group(3)
    else:
        return None


def ddm_to_dd(degrees, minutes):
    degrees = float(degrees)
    minutes, direction = minutes_and_direction(minutes)
    dd = degrees + minutes / 60
    if direction in ["S", "W"]:
        dd = -dd
    return dd


def convert_coords(coords_string):
    coords_elems = coords_string.strip().split()
    lat = ddm_to_dd(coords_elems[0], coords_elems[1])
    lon = ddm_to_dd(coords_elems[2], coords_elems[3])
    return [lat, lon]


if __name__ == "__main__":
    table = open("eclipse_coords.txt").readlines()
    table = [row.strip().split("  ") for row in table]
    table = [row for row in table if len(row) > 1]
    coords = [
        [convert_coords(row[1]), convert_coords(row[2]), convert_coords(row[3])]
        for row in table
    ]
    coords_array = np.array(coords)
    northern_limit_path = coords_array[:, 0, :]
    azm = [float(row[-3].split()[-1]) for row in table]
    path_widths = [float(row[-2]) for row in table]
