#!/usr/bin/env python3
"""Sample frames from a local rights-cleared file, never from online URLs.

Example:
python scripts/sample_authorized_media.py \
  --local-video /path/to/your-own-animation.mp4 \
  --rights-manifest /path/to/real-rights-record.json \
  --source-id MY_OWN_VIDEO \
  --start 0 --duration 8 --fps 3 --max-frames 24 \
  --acknowledge-media-rights

Requirements: ffmpeg and ffprobe installed. Output folder is gitignored.
Does not grant rights; operators must supply true documentary permission.
"""
import argparse
from datetime import datetime,timezone
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--local-video', required=True)
    p.add_argument('--rights-manifest', required=True)
    p.add_argument('--source-id', required=True)
    p.add_argument('--start', type=float, default=0)
    p.add_argument('--duration', type=float, required=True)
    p.add_argument('--fps', type=float, default=2)
    p.add_argument('--max-frames', type=int, default=80)
    p.add_argument('--acknowledge-media-rights', action='store_true')
    args=p.parse_args()
    if not args.acknowledge_media_rights: p.error('Must explicitly acknowledge lawful local media analysis.')
    path=Path(args.local_video).expanduser().resolve()
    rights_path=Path(args.rights_manifest).expanduser().resolve()
    if not path.is_file(): p.error('Media must be a readable LOCAL file, not URL.')
    if not rights_path.is_file(): p.error('Rights manifest must exist locally.')
    if args.start<0 or args.duration<=0 or args.fps<=0 or args.max_frames<1:
        p.error('Invalid nonpositive duration/fps/max-frames or negative start.')
    if args.fps*args.duration > args.max_frames+0.001:
        p.error('Sampling exceeds max-frames: reduce duration/fps or explicitly increase cap.')
    record=json.loads(rights_path.read_text())
    if record.get('synthetic_example') is not False:
        p.error('Real, non-synthetic source rights required.')
    if record.get('source_id') != args.source_id:
        p.error('Rights record source_id must match --source-id.')
    if record.get('rights_state') not in {'licensed_local_analysis','licensed_redistribution'}:
        p.error('Rights state does not authorize local AV processing.')
    if 'frame_extraction' not in record.get('permitted_operations',[]):
        p.error('Rights record must explicitly list frame_extraction.')
    if not record.get('storage_allowed') or not record.get('grant_reference'):
        p.error('Rights record requires actual grant reference and permission for local temporary frame storage.')
    if not shutil.which('ffmpeg') or not shutil.which('ffprobe'):
        p.error('Install ffmpeg and ffprobe to perform local sample extraction.')
    # Restrict output to a private/ignored folder; no path influenced by unknown ID.
    safe_id=''.join(c for c in args.source_id if c.isalnum() or c in '_-')[:50]
    if safe_id != args.source_id or not safe_id:
        p.error('source-id may only contain letters, numbers, underscores and hyphens.')
    out_dir=ROOT/'source_frames'/safe_id
    if out_dir.exists() and any(out_dir.iterdir()):
        p.error('Output already exists. Clear it after checking rights; refusing to overwrite.')
    out_dir.mkdir(parents=True,exist_ok=True)
    probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=width,height,r_frame_rate,codec_type','-of','json',str(path)],text=True,capture_output=True,check=True)
    details=json.loads(probe.stdout)
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-ss',str(args.start),'-i',str(path),'-t',str(args.duration),'-vf',f'fps={args.fps}','-frames:v',str(args.max_frames),str(out_dir/'frame_%05d.png')]
    subprocess.run(cmd,check=True)
    names=sorted(out_dir.glob('frame_*.png'))
    report={'source_id':args.source_id,'local_file':str(path),'extracted_at':datetime.now(timezone.utc).isoformat(),
            'rights_record':str(rights_path),'operation':'licensed_local_frame_extraction',
            'source_probe':details,'start_seconds':args.start,'duration_seconds':args.duration,
            'sample_fps':args.fps,'sample_count':len(names),'frames':[p.name for p in names],
            'time_note':'Sampling intervals are approximate; extract original PTS for precision motion metrics.',
            'retention_until':record.get('retention_until'),
            'publication_warning':'Source frames are private, not licensed for redistribution unless manifest permits.'}
    (out_dir/'sampling_report.json').write_text(json.dumps(report,indent=2)+'\n')
    print('Private frame samples:',len(names),'at',out_dir)
    print('Not for Git. Check rights retention and delete when required.')

if __name__=='__main__': main()
