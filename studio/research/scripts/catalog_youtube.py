#!/usr/bin/env python3
"""Authorized YouTube Data API uploads inventory, NO audiovisual downloads.

Use only after reading docs/01_RIGHTS_AND_PROVENANCE.md and obtaining an API key.
Example:
  YOUTUBE_API_KEY=... python scripts/catalog_youtube.py --acknowledge-youtube-policy
The output contains only IDs and URLs plus derived planning statuses; refresh
or remove data as required by API retention policies.
"""
import argparse
from datetime import datetime, timezone, timedelta
import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://www.googleapis.com/youtube/v3/'


def api(endpoint, key, **params):
    url = BASE + endpoint + '?' + urlencode({**params, 'key': key})
    with urlopen(url, timeout=20) as res:
        return json.load(res)


def catalog(key, handle, max_pages):
    ch = api('channels', key, part='id,contentDetails', forHandle=handle)
    items = ch.get('items', [])
    if len(items) != 1: raise RuntimeError('Expected exactly one channel; check handle.')
    channel_id = items[0]['id']
    uploads = items[0]['contentDetails']['relatedPlaylists']['uploads']
    page_token = None
    seen = set()
    out = []
    pages = 0
    while True:
        if pages >= max_pages: raise RuntimeError('Pagination cap reached: incomplete inventory, no output written.')
        params = dict(part='contentDetails', playlistId=uploads, maxResults=50)
        if page_token: params['pageToken'] = page_token
        data = api('playlistItems', key, **params)
        pages += 1
        for item in data.get('items', []):
            video_id = (item.get('contentDetails') or {}).get('videoId')
            if not video_id or video_id in seen: continue
            seen.add(video_id)
            out.append(video_id)
        page_token = data.get('nextPageToken')
        if not page_token: break
    return channel_id, uploads, out, pages


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--handle', default='@kurzgesagt')
    p.add_argument('--max-pages', type=int, default=100)
    p.add_argument('--acknowledge-youtube-policy', action='store_true')
    p.add_argument('--output-dir', default=str(ROOT/'sources'))
    args = p.parse_args()
    if not args.acknowledge_youtube_policy:
        p.error('Read docs/01 and pass --acknowledge-youtube-policy; no scraping/downloading supported.')
    key = os.environ.get('YOUTUBE_API_KEY')
    if not key: p.error('YOUTUBE_API_KEY not set; do not commit API credentials.')
    now = datetime.now(timezone.utc)
    snapshot = f'kurzgesagt-{now:%Y-%m-%dT%H%M%SZ}'
    channel_id, uploads, video_ids, pages = catalog(key, args.handle, args.max_pages)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    records = []
    for v in video_ids:
        records.append({
            'record_type':'video','record_id':'video:'+v,'snapshot_id':snapshot,
            'video_id':v,'source_url':'https://www.youtube.com/watch?v='+v,
            'title':None,'published_at':None,'discovered_at':now.isoformat(),
            'availability':'unknown','format':'unknown','coverage_level':'cataloged',
            'topic_tags':[],'rights_state':'url_only',
            'notes':'API-derived identifier only; video content not viewed. Refresh/erase per applicable API policy.',
            'synthetic_example':False
        })
    out = output_dir/(snapshot+'.jsonl')
    out.write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in records))
    report = {
        'snapshot_id':snapshot,'channel_id':channel_id,'uploads_playlist_id':uploads,
        'retrieved_at':now.isoformat(),'refresh_or_delete_review_by':(now+timedelta(days=30)).isoformat(),
        'pages':pages,'count_cataloged':len(records),'count_visually_analyzed':0,
        'status':'metadata_ids_only','source_media_downloaded':False,
        'note':'Review actual API caching rules; this is an inventory, not an analysis of visual content.'
    }
    (output_dir/(snapshot+'_report.json')).write_text(json.dumps(report,indent=2)+'\n')
    print('Cataloged:',len(records),'Pages:',pages,'Snapshot:',snapshot,'File:',out)
    print('0 videos visually analyzed. Refresh/review retention by',report['refresh_or_delete_review_by'])


if __name__ == '__main__':
    main()
