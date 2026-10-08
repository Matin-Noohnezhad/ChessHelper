"""Extract repeated opening prefixes, not whole games, from public master PGNs.

Usage: python3 packages/opening-book/scripts/extract-master-theory.py /path/to/pgns
The input directory contains *.pgn and sources.json (URLs + SHA-256 digests).
The resulting TSV is replayed/validated by ingest-theory.ts before shipping.
"""
from collections import Counter
from pathlib import Path
import hashlib
import json
import re
import sys

MAX_PLIES = 50  # Book-building horizon, not a runtime recognition limit.
MIN_GAMES = 8
MIN_PLAYERS = 4
MIN_ELO = 2400
source = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / 'data'
sources = json.loads((source / 'sources.json').read_text())
for item in sources:
    path = source / item['url'].split('/')[-1]
    assert hashlib.sha256(path.read_bytes()).hexdigest() == item['sha256'], path

games = []
seen = set()
for path in sorted(source.glob('*.pgn')):
    for raw in re.split(r'(?=\[Event\s+")', path.read_text(encoding='utf-8-sig', errors='replace')):
        headers = dict(re.findall(r'^\[(\w+)\s+"([^"\n]*)"\]', raw, re.M))
        if not all(headers.get(key, '').isdigit() and int(headers[key]) >= MIN_ELO for key in ['WhiteElo', 'BlackElo']):
            continue
        if 'FEN' in headers or headers.get('Variant', 'Standard') != 'Standard':
            continue
        moves = re.sub(r'^\[.*\]\s*$', '', raw, flags=re.M)
        moves = re.sub(r'\{[^}]*\}|;[^\n]*', ' ', moves)
        while re.search(r'\([^()]*\)', moves):
            moves = re.sub(r'\([^()]*\)', ' ', moves)
        moves = re.sub(r'\$\d+|\d+\.(?:\.\.)?|[!?]', '', moves)
        tokens = [s.replace('0-0', 'O-O') for s in moves.split() if s not in ['1-0', '0-1', '1/2-1/2', '*', '...']]
        identity = (headers.get('White'), headers.get('Black'), headers.get('Date'), headers.get('Round'), ' '.join(tokens))
        if identity in seen:
            continue
        seen.add(identity)
        games.append((tokens[:MAX_PLIES], (headers.get('White', ''), headers.get('Black', ''))))
    print(path.name, len(games), 'unique qualifying games', flush=True)

counts = Counter()
for tokens, _ in games:
    for end in range(1, len(tokens) + 1):
        counts[' '.join(tokens[:end])] += 1
retained = {line: count for line, count in counts.items() if count >= MIN_GAMES}
del counts
players = {line: set() for line in retained}
for tokens, pair in games:
    for end in range(1, len(tokens) + 1):
        line = ' '.join(tokens[:end])
        if line in players and len(players[line]) < MIN_PLAYERS:
            players[line].update(pair)
retained = {line: count for line, count in retained.items() if len(players[line]) >= MIN_PLAYERS}
# Each retained terminal line implies all its prefixes; store each only once.
parents = {line.rsplit(' ', 1)[0] for line in retained if ' ' in line}
leaves = sorted(line for line in retained if line not in parents)
(out / 'masters.tsv').write_text('games\tpgn\n' + ''.join(f'{retained[line]}\t{line}\n' for line in leaves))
manifest = {
    'sources': sources,
    'minimumEloBothPlayers': MIN_ELO,
    'minimumDistinctGames': MIN_GAMES,
    'minimumDistinctPlayers': MIN_PLAYERS,
    'maxPlies': MAX_PLIES,
    'qualifyingGames': len(games),
    'lines': len(leaves),
    'linesAtLeast21FullMoves': sum(len(line.split()) >= 42 for line in leaves),
}
(out / 'masters-sources.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({k: v for k, v in manifest.items() if k != 'sources'}, indent=2))
