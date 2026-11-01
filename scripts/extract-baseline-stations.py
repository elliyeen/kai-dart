#!/usr/bin/env python3
"""Snapshot the ORIGINAL station records from the pre-redesign DashboardDemo.tsx
(git ref given as argv[1], default HEAD) into docs/baseline/stations-baseline.json.
Records are per line-membership (one record per original station id)."""
import json, re, subprocess, sys
ref = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
src = subprocess.run(["git","show",f"{ref}:src/components/DashboardDemo.tsx"],capture_output=True,text=True,check=True).stdout
coords = {}
cs = src[src.index("const COORDS"):src.index("const mk =")]
for m in re.finditer(r'"([^"]+)":\s*\[(-?\d+\.\d+),\s*(-?\d+\.\d+)\]', cs):
    coords[m.group(1)] = [float(m.group(2)), float(m.group(3))]  # [lng, lat]
out = []
for m in re.finditer(r'^\s*mk\("([^"]+)",\s*"([^"]+)",\s*(\d+),"(\w+)",.*?,\s*"(red|green|blue|orange|silver)","(#[0-9A-Fa-f]{6})","([^"]+)","([^"]*)"(?:,"([^"]*)")?\)', src, flags=re.M):
    sid,name,_score,_status,line,color,lname,city,closure = m.groups()
    out.append({"id":sid,"name":name,"lineId":line,"city":city,"closure":closure,
                "lng":coords.get(sid,[None,None])[0],"lat":coords.get(sid,[None,None])[1]})
json.dump({"source":f"git:{ref}:src/components/DashboardDemo.tsx","records":out}, open("docs/baseline/stations-baseline.json","w"), indent=1)
from collections import Counter
print(len(out),"records;",len({r['id'] for r in out}),"unique ids;",dict(Counter(r['lineId'] for r in out)),"; missing coords:",[r['id'] for r in out if r['lat'] is None])
