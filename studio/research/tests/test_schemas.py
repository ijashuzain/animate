"""Small repository consistency smoke test, no copyrighted media needed."""
import subprocess
from pathlib import Path
import sys


def test_example_schemas_validate():
    root=Path(__file__).resolve().parents[1]
    result=subprocess.run([sys.executable,str(root/'scripts/validate_records.py')],capture_output=True,text=True,cwd=root)
    assert result.returncode == 0, result.stderr
