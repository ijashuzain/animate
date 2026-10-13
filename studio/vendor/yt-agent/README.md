# yt-agent (vendored)

From [Jakeschincariol/youtube-agent-skill](https://github.com/Jakeschincariol/youtube-agent-skill) at commit a2feb21 (MIT, see LICENSE).
Copied unchanged: `../yt-edit/deadair.py` (transcript loader retention.py imports from there), `hookscore.py` + `hooks.json` (yt-script), `title.py` (yt-package), `retention.py` (yt-retention).
Used by studio/tools/package.mjs (hooks, title + thumbnail, search queries) and studio/tools/retention.mjs.
Their rules we adopted are in CLAUDE.md (step 6 "Package") and studio/voice.md.
