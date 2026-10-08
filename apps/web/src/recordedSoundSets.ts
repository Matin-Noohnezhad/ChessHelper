// Original assets and provenance: public/sounds/*-manifest.json and public/sounds/README.md.
const chessbaseMoves = Array.from({ length: 11 }, (_, i) => `chessbase/board/move${i + 1}.mp3`);
const chessbaseCaptures = Array.from({ length: 15 }, (_, i) => `chessbase/board/capture${i + 1}.mp3`);
const chessbaseDesktopMoves = ['move', 'move2', 'move3', 'move4', 'move5', 'move6']
  .map((name) => `chessbase/desktop/${name}.mp3`);
const chessbaseDesktopCaptures = ['capture', 'capture2', 'capture3', 'capture4', 'capture5']
  .map((name) => `chessbase/desktop/${name}.mp3`);

export const RECORDED_SOUND_SETS = [
  {
    key: 'chessbase-desktop',
    label: 'ChessBase — Desktop (classic)',
    description: 'Classic move, capture, and castling recordings from ChessBase Reader 2017, also included in desktop Playchess.',
    source: 'ChessBase',
    sounds: {
      move: 'chessbase/desktop/move.mp3',
      capture: 'chessbase/desktop/capture.mp3',
      castle: 'chessbase/desktop/castle.mp3',
      promotion: 'chessbase/desktop/move.mp3',
      check: 'chessbase/desktop/move.mp3',
      mate: 'chessbase/desktop/move.mp3',
    },
  },
  {
    key: 'chessbase-desktop-varied',
    label: 'ChessBase — Desktop (varied)',
    description: 'Randomly alternates the six move and five capture recordings bundled with ChessBase Reader 2017.',
    source: 'ChessBase',
    sounds: {
      move: chessbaseDesktopMoves,
      capture: chessbaseDesktopCaptures,
      castle: 'chessbase/desktop/castle.mp3',
      promotion: chessbaseDesktopMoves,
      check: chessbaseDesktopMoves,
      mate: chessbaseDesktopMoves,
    },
  },
  {
    key: 'chessbase-recorded',
    label: 'ChessBase — Web board',
    description: 'Original ChessBase web board recordings, with varied moves and captures. Check and promotion use the underlying move sound.',
    source: 'ChessBase',
    sounds: {
      move: chessbaseMoves,
      capture: chessbaseCaptures,
      castle: 'chessbase/board/castle.mp3',
      promotion: chessbaseMoves,
      check: chessbaseMoves,
      mate: chessbaseMoves,
    },
  },
  {
    "key": "chesscom",
    "label": "Chess.com \u2014 Default",
    "description": "Original Chess.com Default recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/01b8fcee7f0d-capture.mp3",
      "castle": "chesscom/files/fcf598533266-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-stone-capture",
    "label": "Chess.com \u2014 Stone Capture",
    "description": "Original Chess.com Stone Capture recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/5d7caf5e00c6-capture.mp3",
      "castle": "chesscom/files/cf9503e3046a-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-nature",
    "label": "Chess.com \u2014 Nature",
    "description": "Original Chess.com Nature recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/6c34baa5e999-move-self.mp3",
      "capture": "chesscom/files/25786624e6ef-capture.mp3",
      "castle": "chesscom/files/23f5b0233e4a-castle.mp3",
      "promotion": "chesscom/files/68066dbce5d4-promote.mp3",
      "check": "chesscom/files/c4cd3c5ac522-move-check.mp3",
      "mate": "chesscom/files/df73c6f463e4-game-end.mp3"
    }
  },
  {
    "key": "chesscom-metal",
    "label": "Chess.com \u2014 Metal",
    "description": "Original Chess.com Metal recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/d2c2164d90c2-move-self.mp3",
      "capture": "chesscom/files/dbb750c6fd26-capture.mp3",
      "castle": "chesscom/files/eaa6649db6f5-castle.mp3",
      "promotion": "chesscom/files/dee7012f76c5-promote.mp3",
      "check": "chesscom/files/6cafefb92a11-move-check.mp3",
      "mate": "chesscom/files/04f058d28af6-game-end.mp3"
    }
  },
  {
    "key": "chesscom-marble",
    "label": "Chess.com \u2014 Marble",
    "description": "Original Chess.com Marble recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/38491442b524-move-self.mp3",
      "capture": "chesscom/files/175bf4e085b0-capture.mp3",
      "castle": "chesscom/files/f0388406a7c8-castle.mp3",
      "promotion": "chesscom/files/25bd06dee452-promote.mp3",
      "check": "chesscom/files/12a3b557d470-move-check.mp3",
      "mate": "chesscom/files/31c637924224-game-end.mp3"
    }
  },
  {
    "key": "chesscom-space",
    "label": "Chess.com \u2014 Space",
    "description": "Original Chess.com Space recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/554ab2cd1292-move-self.mp3",
      "capture": "chesscom/files/76b4bdb7fdbf-capture.mp3",
      "castle": "chesscom/files/180c8d8287ea-castle.mp3",
      "promotion": "chesscom/files/216b3ead2c59-promote.mp3",
      "check": "chesscom/files/395e14f1eb69-move-check.mp3",
      "mate": "chesscom/files/462544b8e3b7-game-end.mp3"
    }
  },
  {
    "key": "chesscom-beat",
    "label": "Chess.com \u2014 Beat",
    "description": "Original Chess.com Beat recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/eebcf6383156-move-self.mp3",
      "capture": "chesscom/files/e18100dd9e32-capture.mp3",
      "castle": "chesscom/files/ceb05d6d3c95-castle.mp3",
      "promotion": "chesscom/files/c55999953582-promote.mp3",
      "check": "chesscom/files/4fa71fbce385-move-check.mp3",
      "mate": "chesscom/files/a12eeb5a1c1b-game-end.mp3"
    }
  },
  {
    "key": "chesscom-silly",
    "label": "Chess.com \u2014 Silly",
    "description": "Original Chess.com Silly recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/a6452dcd3a94-move-self.mp3",
      "capture": "chesscom/files/9b26bebb12bb-capture.mp3",
      "castle": "chesscom/files/6d1293353d41-castle.mp3",
      "promotion": "chesscom/files/afa1e1a47871-promote.mp3",
      "check": "chesscom/files/44d394230b5a-move-check.mp3",
      "mate": "chesscom/files/8b16aa61133e-game-end.mp3"
    }
  },
  {
    "key": "chesscom-lolz",
    "label": "Chess.com \u2014 Lolz",
    "description": "Original Chess.com Lolz recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/7d0f79cf487a-move-self.mp3",
      "capture": "chesscom/files/dc9b707afa2f-capture.mp3",
      "castle": "chesscom/files/a0b5074e68c7-castle.mp3",
      "promotion": "chesscom/files/da3fcff2c3e2-promote.mp3",
      "check": "chesscom/files/95468011d432-move-check.mp3",
      "mate": "chesscom/files/fada9bd30a9b-game-end.mp3"
    }
  },
  {
    "key": "chesscom-newspaper",
    "label": "Chess.com \u2014 Newspaper",
    "description": "Original Chess.com Newspaper recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/db66543dd61b-move-self.mp3",
      "capture": "chesscom/files/000168c6aa44-capture.mp3",
      "castle": "chesscom/files/3aafe2376909-castle.mp3",
      "promotion": "chesscom/files/c067f286b43a-promote.mp3",
      "check": "chesscom/files/63b913d8d022-move-check.mp3",
      "mate": "chesscom/files/1f07bf956263-game-end.mp3"
    }
  },
  {
    "key": "chesscom-pebbles",
    "label": "Chess.com \u2014 Pebbles",
    "description": "Original Chess.com Pebbles recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/3360063949f4-move-self.mp3",
      "capture": "chesscom/files/a7a9ddb2e531-capture.mp3",
      "castle": "chesscom/files/187119ccb5b1-castle.mp3",
      "promotion": "chesscom/files/96dddccb6298-promote.mp3",
      "check": "chesscom/files/bc8fc3f39911-move-check.mp3",
      "mate": "chesscom/files/9e7cd8994515-game-end.mp3"
    }
  },
  {
    "key": "chesscom-runescape-bob-the-cat",
    "label": "Chess.com \u2014 RuneScape - Bob the Cat",
    "description": "Original Chess.com RuneScape - Bob the Cat recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/3c8191f1d1df-capture.mp3",
      "castle": "chesscom/files/68b586db2ecd-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/1d6ba3a68e92-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-runescape-vannaka-wise-old-man",
    "label": "Chess.com \u2014 RuneScape - Vannaka & Wise Old Man",
    "description": "Original Chess.com RuneScape - Vannaka & Wise Old Man recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/9ebea9266850-capture.mp3",
      "castle": "chesscom/files/adfd3a31b2f6-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-runescape-bentnoze-and-wartface",
    "label": "Chess.com \u2014 RuneScape - Bentnoze and Wartface",
    "description": "Original Chess.com RuneScape - Bentnoze and Wartface recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/6210e7b4324a-capture.mp3",
      "castle": "chesscom/files/f5da13fa4a57-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-chess-the-musical",
    "label": "Chess.com \u2014 Chess The Musical",
    "description": "Original Chess.com Chess The Musical recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/c52e76a15feb-move-self.mp3",
      "capture": "chesscom/files/b46ba73842ae-capture.mp3",
      "castle": "chesscom/files/605404f6bc51-castle.mp3",
      "promotion": "chesscom/files/6b5cebbeee35-promote.mp3",
      "check": "chesscom/files/7e80e3fe2480-move-check.mp3",
      "mate": "chesscom/files/3f4d0ff6a04b-game-end.mp3"
    }
  },
  {
    "key": "chesscom-runescape-sliske",
    "label": "Chess.com \u2014 RuneScape - Sliske",
    "description": "Original Chess.com RuneScape - Sliske recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/732ecfa46804-capture.mp3",
      "castle": "chesscom/files/a32ac3c4f329-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/62b7ac2e92a6-game-end.mp3"
    }
  },
  {
    "key": "chesscom-events-esports-world-cup",
    "label": "Chess.com \u2014 Events - Esports World Cup",
    "description": "Original Chess.com Events - Esports World Cup recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/f8cad7ef5b85-move-self.mp3",
      "capture": "chesscom/files/1f7e0cb7260d-capture.mp3",
      "castle": "chesscom/files/a3c2bc99cfe0-castle.mp3",
      "promotion": "chesscom/files/983529b508f5-promote.mp3",
      "check": "chesscom/files/80488af42fff-move-check.mp3",
      "mate": "chesscom/files/eaef83aa5a3b-game-end.mp3"
    }
  },
  {
    "key": "chesscom-bots-earth-day",
    "label": "Chess.com \u2014 Bots - Earth Day",
    "description": "Original Chess.com Bots - Earth Day recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/01b8fcee7f0d-capture.mp3",
      "castle": "chesscom/files/7b541bc73c5d-castle.mp3",
      "promotion": "chesscom/files/e2876341ed1a-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/7cd7cfe203e0-game-end.mp3"
    }
  },
  {
    "key": "chesscom-bots-martin-s-family",
    "label": "Chess.com \u2014 Bots - Martin's Family",
    "description": "Original Chess.com Bots - Martin's Family recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/70a16aa15f51-move-self.mp3",
      "capture": "chesscom/files/1ecb7640587c-capture.mp3",
      "castle": "chesscom/files/e494038eafa5-castle.mp3",
      "promotion": "chesscom/files/95cfd450ee4b-promote.mp3",
      "check": "chesscom/files/5d20248b69bf-move-check.mp3",
      "mate": "chesscom/files/706b9709398b-game-end.mp3"
    }
  },
  {
    "key": "chesscom-basketball",
    "label": "Chess.com \u2014 Basketball",
    "description": "Original Chess.com Basketball recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/629f5390248a-capture.mp3",
      "castle": "chesscom/files/c1dda9283e8d-castle.mp3",
      "promotion": "chesscom/files/42d1c6d117cd-promote.mp3",
      "check": "chesscom/files/090bf831cd17-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-baseball",
    "label": "Chess.com \u2014 Baseball",
    "description": "Original Chess.com Baseball recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/96b0a3d0e864-move-self.mp3",
      "capture": "chesscom/files/c4c8035f322c-capture.mp3",
      "castle": "chesscom/files/773744b6f6ab-castle.mp3",
      "promotion": "chesscom/files/3a78b9c87aa8-promote.mp3",
      "check": "chesscom/files/36fcf9f478e4-move-check.mp3",
      "mate": "chesscom/files/5e4c20c95c24-game-end.mp3"
    }
  },
  {
    "key": "chesscom-bots-pygmy",
    "label": "Chess.com \u2014 Bots - Pygmy",
    "description": "Original Chess.com Bots - Pygmy recordings.",
    "source": "Chess.com",
    "sounds": {
      "move": "chesscom/files/fddd8d2cffbe-move-self.mp3",
      "capture": "chesscom/files/62adf604ccbb-capture.mp3",
      "castle": "chesscom/files/ab91f782e41d-castle.mp3",
      "promotion": "chesscom/files/e36280e727c6-promote.mp3",
      "check": "chesscom/files/b7d1854c67b6-move-check.mp3",
      "mate": "chesscom/files/ac82e27174a9-game-end.mp3"
    }
  },
  {
    "key": "lichess",
    "label": "Lichess \u2014 Standard",
    "description": "Original Lichess standard recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/standard/Move.mp3",
      "capture": "lichess/standard/Capture.mp3",
      "castle": "lichess/standard/Move.mp3",
      "promotion": "lichess/standard/Move.mp3",
      "check": "lichess/standard/Check.mp3",
      "mate": "lichess/standard/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-piano",
    "label": "Lichess \u2014 Piano",
    "description": "Original Lichess piano recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/piano/Move.mp3",
      "capture": "lichess/piano/Capture.mp3",
      "castle": "lichess/piano/Move.mp3",
      "promotion": "lichess/piano/Move.mp3",
      "check": "lichess/piano/Check.mp3",
      "mate": "lichess/piano/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-nes",
    "label": "Lichess \u2014 NES",
    "description": "Original Lichess nes recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/nes/Move.mp3",
      "capture": "lichess/nes/Capture.mp3",
      "castle": "lichess/nes/Move.mp3",
      "promotion": "lichess/nes/Move.mp3",
      "check": "lichess/nes/Check.mp3",
      "mate": "lichess/nes/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-sfx",
    "label": "Lichess \u2014 SFX",
    "description": "Original Lichess sfx recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/sfx/Move.mp3",
      "capture": "lichess/sfx/Capture.mp3",
      "castle": "lichess/sfx/Move.mp3",
      "promotion": "lichess/sfx/Move.mp3",
      "check": "lichess/sfx/Check.mp3",
      "mate": "lichess/sfx/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-futuristic",
    "label": "Lichess \u2014 Futuristic",
    "description": "Original Lichess futuristic recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/futuristic/Move.mp3",
      "capture": "lichess/futuristic/Capture.mp3",
      "castle": "lichess/futuristic/Move.mp3",
      "promotion": "lichess/futuristic/Move.mp3",
      "check": "lichess/futuristic/Check.mp3",
      "mate": "lichess/futuristic/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-robot",
    "label": "Lichess \u2014 Robot",
    "description": "Original Lichess robot recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/robot/Move.mp3",
      "capture": "lichess/robot/Capture.mp3",
      "castle": "lichess/robot/Move.mp3",
      "promotion": "lichess/robot/Move.mp3",
      "check": "lichess/robot/Check.mp3",
      "mate": "lichess/robot/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-woodland",
    "label": "Lichess \u2014 Woodland",
    "description": "Original Lichess woodland recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/woodland/Move.mp3",
      "capture": "lichess/woodland/Capture.mp3",
      "castle": "lichess/woodland/Move.mp3",
      "promotion": "lichess/woodland/Move.mp3",
      "check": "lichess/woodland/Check.mp3",
      "mate": "lichess/woodland/Checkmate.mp3"
    }
  },
  {
    "key": "lichess-lisp",
    "label": "Lichess \u2014 Lisp",
    "description": "Original Lichess lisp recordings. Castling and promotion use the move sound.",
    "source": "Lichess",
    "sounds": {
      "move": "lichess/lisp/Move.mp3",
      "capture": "lichess/lisp/Capture.mp3",
      "castle": "lichess/lisp/Move.mp3",
      "promotion": "lichess/lisp/Move.mp3",
      "check": "lichess/lisp/Check.mp3",
      "mate": "lichess/lisp/Checkmate.mp3"
    }
  }
] as const;
