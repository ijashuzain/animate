#!/usr/bin/env python3
"""Validate research JSON/JSONL. Run: python scripts/validate_records.py [paths...]

Only verifies structural/referential consistency for records supplied; NOT the
truth of research observations or media permissions. Requires jsonschema.
"""
import json
import sys
from pathlib import Path
from collections import Counter
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / "schemas"
TYPES = {p.stem.replace(".schema", ""): p for p in SCHEMA_DIR.glob("*.schema.json")}


def iter_records(path):
    path = Path(path)
    if path.is_dir():
        for p in sorted(path.rglob("*.json")):
            if p.name.endswith('.schema.json') or p.name == 'project.json':
                continue
            yield from iter_records(p)
        for p in sorted(path.rglob('*.jsonl')):
            yield from iter_records(p)
    elif path.suffix == '.jsonl':
        for lineno, line in enumerate(path.read_text().splitlines(), 1):
            if line.strip():
                yield path, lineno, json.loads(line)
    elif path.suffix == '.json':
        obj = json.loads(path.read_text())
        if isinstance(obj, list):
            for i, rec in enumerate(obj, 1): yield path, i, rec
        else: yield path, 1, obj


def main(paths):
    if not paths:
        paths = [ROOT / 'data' / 'examples']
    validators = {}
    for typ, schema_path in TYPES.items():
        schema = json.loads(schema_path.read_text())
        Draft202012Validator.check_schema(schema)
        validators[typ] = Draft202012Validator(schema, format_checker=FormatChecker())
    records = []
    errors = []
    for src in paths:
        for path, line, rec in iter_records(src):
            label = f'{path.relative_to(ROOT) if path.is_relative_to(ROOT) else path}:{line}'
            if not isinstance(rec, dict):
                errors.append(f'{label}: expected JSON object')
                continue
            typ = rec.get('record_type')
            if typ not in validators:
                errors.append(f'{label}: unknown record_type: {typ!r}')
                continue
            for err in validators[typ].iter_errors(rec):
                errors.append(f'{label}: {".".join(map(str,err.path))}: {err.message}')
            records.append((label, rec))
    ids = [rec['record_id'] for _, rec in records if 'record_id' in rec]
    for record_id, count in Counter(ids).items():
        if count > 1: errors.append(f'duplicate record_id: {record_id} ({count} copies)')
    known = {r.get('record_id'): r for _, r in records}
    evidence = {r.get('evidence_id') for _, r in records if r.get('record_type') == 'observation'}
    for label, rec in records:
        typ = rec.get('record_type')
        if typ == 'pattern':
            for ref in rec['evidence_observation_ids']:
                if ref not in known: errors.append(f'{label}: missing observation {ref}')
                elif known[ref].get('record_type') != 'observation':
                    errors.append(f'{label}: {ref} is not an observation')
            if rec['status'] == 'validated':
                if not rec['experiment_ids']:
                    errors.append(f'{label}: validated pattern must cite experiment')
                if rec['independent_source_count'] < 2:
                    errors.append(f'{label}: validated pattern must report >=2 independent sources')
        if typ == 'asset':
            for ref in rec['pattern_ids']:
                if ref not in known:
                    errors.append(f'{label}: missing pattern {ref}')
        if typ == 'edge':
            for ref in [rec['subject_id'], rec['object_id']]:
                if ref not in known and ref not in evidence:
                    errors.append(f'{label}: dangling graph reference {ref}')
        if typ == 'observation':
            if rec['start_ms'] is not None and rec['end_ms'] is not None and rec['end_ms'] < rec['start_ms']:
                errors.append(f'{label}: end_ms before start_ms')
            if rec['access_method'] in {'licensed_still', 'licensed_video'} and rec['rights_state'] not in {'licensed_local_analysis','licensed_redistribution'}:
                errors.append(f'{label}: automated media analysis without declared license')
            if rec['rights_state'] == 'blocked':
                errors.append(f'{label}: observation with blocked rights')
    if errors:
        print('\n'.join('ERROR: '+s for s in errors), file=sys.stderr)
        print(f'FAILED: {len(errors)} error(s) in {len(records)} record(s)', file=sys.stderr)
        return 1
    print(f'PASS: {len(records)} validated record(s); {len(validators)} schemas available')
    print('NOTE: Structural validation does not establish factual correctness or rights to media.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main([Path(p) for p in sys.argv[1:]]))
