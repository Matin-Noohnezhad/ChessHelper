/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Regenerate with:
 *   npx vite-node packages/opening-book/scripts/ingest-eco.ts
 *
 * Source: lichess-org/chess-openings (CC0-1.0, public domain), replayed and
 * re-emitted in this project's SAN. 3810 lines.
 *
 * Held as one tab-separated string rather than 3810 array literals.
 * It is a third smaller on the wire and far cheaper for the engine to parse —
 * a big literal costs real milliseconds at startup, a string costs one split.
 * book.ts expands it once at load.
 */

/** Rows of `eco \t name \t space-separated SAN moves`. */
export const ECO_TSV = `A00	Amar Opening	Nh3
A00	Anderssen’s Opening	a3
A00	Barnes Opening	f3
A00	Clemenz Opening	h3
A00	Grob Opening	g4
A00	Hungarian Opening	g3
A00	Kádas Opening	h4
A00	Mieses Opening	d3
A00	Polish Opening	b4
A00	Saragossa Opening	c3
A00	Sodium Attack	Na3
A00	Van Geet Opening	Nc3
A00	Van’t Kruijs Opening	e3
A00	Ware Opening	a4
A00	Grob Opening: Alessi Gambit	g4 f5
A00	Grob Opening: Double Grob	g4 g5
A00	Hungarian Opening: Dutch Defence	g3 f5
A00	Hungarian Opening: Indian Defence	g3 Nf6
A00	Hungarian Opening: Myers Defence	g3 g5
A00	Hungarian Opening: Sicilian Invitation	g3 c5
A00	Hungarian Opening: Symmetrical Variation	g3 g6
A00	Kádas Opening: Koola-Koola Variation	h4 a5
A00	Kádas Opening: Schneider Gambit	h4 g5
A00	Lasker Simul Special	g3 h5
A00	Mieses Opening: Reversed Rat	d3 e5
A00	Polish Opening, with d5	b4 d5
A00	Polish Opening: Birmingham Gambit	b4 c5
A00	Polish Opening: Dutch Defence	b4 f5
A00	Polish Opening: Grigorian Variation	b4 Nc6
A00	Polish Opening: Karniewski Variation	b4 Nh6
A00	Polish Opening: Outflank Variation	b4 c6
A00	Polish Opening: Symmetrical Variation	b4 b5
A00	Van Geet Opening: Laroche Gambit	Nc3 b5
A00	Van Geet Opening: Reversed Nimzowitsch	Nc3 e5
A00	Ware Opening: Symmetric Variation	a4 a5
A00	Anderssen’s Opening: Polish Gambit	a3 a5 b4
A00	Barnes Opening: Hammerschlag	f3 e5 Kf2
A00	Clemenz Opening: Spike Lee Gambit	h3 h5 g4
A00	Global Opening	h3 e5 a3
A00	Grob Opening: Double Grob, Coca-Cola Gambit	g4 g5 f4
A00	Grob Opening: Grob Gambit	g4 d5 Bg2
A00	Hungarian Opening: Reversed Alekhine	g3 e5 Nf3
A00	Kádas Opening: Beginner’s Trap	h4 d5 Rh3
A00	Kádas Opening: Kádas Gambit	h4 c5 b4
A00	Mieses Opening: Myers Spike Attack	d3 g6 g4
A00	Polish Opening: Bugayev Attack	b4 e5 a3
A00	Sodium Attack: Chenoboskion Variation	Na3 g6 g4
A00	Valencia Opening	d3 e5 Nd2
A00	Van Geet Opening: Battambang Variation	a3 e5 Nc3
A00	Van Geet Opening: Düsseldorf Gambit	Nc3 c5 b4
A00	Van Geet Opening: Myers Attack	Nc3 g6 h4
A00	Van Geet Opening: Tübingen Gambit	Nc3 Nf6 g4
A00	Van Geet Opening: Twyble Attack	Nc3 c5 Rb1
A00	Ware Opening: Crab Variation	a4 e5 h4
A00	Ware Opening: Meadow Hay Trap	a4 e5 Ra3
A00	Barnes Opening: Fool’s Mate	f3 e5 g4 Qh4#
A00	Creepy Crawly Formation: Classical Defence	h3 d5 a3 e5
A00	Grob Opening: Grob Gambit Declined	g4 d5 Bg2 c6
A00	Grob Opening: London Defence	g4 e5 h3 Nc6
A00	Hungarian Opening: Catalan Formation	g3 d5 Bg2 e6
A00	Hungarian Opening: Reversed Modern Defence	g3 d5 Bg2 c5
A00	Hungarian Opening: Slav Formation	g3 d5 Bg2 c6
A00	Hungarian Opening: Van Kuijk Gambit	g3 h5 Nf3 h4
A00	Polish Opening: Baltic Defence	b4 d5 Bb2 Bf5
A00	Polish Opening: Czech Defence	b4 e5 Bb2 d6
A00	Polish Opening: German Defence	b4 d5 Bb2 Qd6
A00	Polish Opening: King’s Indian Variation	b4 Nf6 Bb2 g6
A00	Polish Opening: Wolferts Gambit	b4 e5 Bb2 c5
A00	Van Geet Opening: Billockus-Johansen Gambit	Nc3 e5 Nf3 Bc5
A00	Van Geet Opening: Damhaug Gambit	Nc3 d5 f4 e5
A00	Van Geet Opening: Warsteiner Gambit	Nc3 d5 f4 g5
A00	Ware Opening: Wing Gambit	a4 b5 axb5 Bb7
A00	Amar Opening: Paris Gambit	Nh3 d5 g3 e5 f4
A00	Barnes Opening: Gedult Gambit	f3 f5 e4 fxe4 Nc3
A00	Grob Opening: Grob Gambit, Basman Gambit	g4 d5 Bg2 h5 gxh5
A00	Grob Opening: Grob Gambit, Fritz Gambit	g4 d5 Bg2 Bxg4 c4
A00	Grob Opening: Spike Attack	g4 d5 Bg2 c6 g5
A00	Grob Opening: Spike, Hurst Attack	g4 e5 Bg2 d5 c4
A00	Grob Opening: Zilbermints Gambit	g4 d5 e4 dxe4 Nc3
A00	Hungarian Opening: Bücker Gambit	g3 d5 Bg2 e5 b4
A00	Hungarian Opening: Reversed Norwegian Defence	g3 e5 Nf3 e4 Nh4
A00	Kádas Opening: Kádas Gambit	h4 e5 d4 exd4 c3
A00	Kádas Opening: Myers Variation	h4 d5 d4 c5 e4
A00	Kádas Opening: Steinbok Gambit	h4 f5 e4 fxe4 d3
A00	Mieses Opening: Venezolana Variation	d3 c5 Nc3 Nc6 g3
A00	Polish Opening, with d5	b4 d5 Bb2 Nf6 Nf3
A00	Polish Opening: Bugayev Advance Variation	b4 e5 Bb2 f6 b5
A00	Polish Opening: King’s Indian Variation, Schiffler Attack	b4 Nf6 Bb2 g6 e4
A00	Polish Opening: Myers Variation	b4 d5 Bb2 c6 a4
A00	Polish Opening: Outflank Variation, Schuehler Gambit	b4 c6 Bb2 a5 b5
A00	Polish Opening: Tartakower Gambit	b4 e5 Bb2 f6 e4
A00	Van Geet Opening: Dougherty Gambit	Nc3 d5 e4 dxe4 f3
A00	Van Geet Opening: Dunst-Perrenet Gambit	Nc3 d5 e4 dxe4 d3
A00	Van Geet Opening: Hector Gambit	Nc3 d5 e4 dxe4 Bc4
A00	Van Geet Opening: Kluever Gambit	Nc3 f5 e4 fxe4 d3
A00	Van Geet Opening: Napoleon Attack	Nc3 e5 Nf3 Nc6 d4
A00	Van Geet Opening: Nowokunski Gambit	Nc3 e5 f4 exf4 e4
A00	Van Geet Opening: Venezolana Variation	Nc3 d5 d3 Nf6 g3
A00	Van’t Kruijs Opening: Bouncing Bishop Variation	e3 e5 Bc4 b5 Bb3
A00	Grob Opening: Keene Defence	g4 d5 h3 e5 Bg2 c6
A00	Grob Opening: Romford Countergambit	g4 d5 Bg2 Bxg4 c4 d4
A00	Grob Opening: Zilbermints Gambit, Schiller Defence	g4 d5 e4 dxe4 Nc3 h5
A00	Hungarian Opening: Pachman Gambit	g3 f5 e4 fxe4 Qh5+ g6
A00	Polish Opening: Queen’s Indian Variation	b4 e6 Bb2 Nf6 b5 b6
A00	Polish Opening: Queenside Defence	b4 e6 Bb2 Nf6 b5 a6
A00	Sodium Attack: Durkin Gambit	Na3 e5 Nc4 Nc6 e4 f5
A00	Van Geet Opening: Hergert Gambit	Nc3 d6 f4 e5 fxe5 Nc6
A00	Van Geet Opening: Hulsemann Gambit	Nc3 e5 e3 d5 Qh5 Be6
A00	Van Geet Opening: Liebig Gambit	Nc3 e5 e3 d5 Qh5 Nf6
A00	Van Geet Opening: Melleby Gambit	Nc3 d5 f4 d4 Ne4 c5
A00	Van Geet Opening: Pfeiffer Gambit	Nc3 d5 f4 d4 Ne4 e5
A00	Van Geet Opening: Sleipnir Gambit	Nc3 d5 e3 e5 d4 Bb4
A00	Ware Opening: Cologne Gambit	a4 b6 d4 d5 Nc3 Nd7
A00	Barnes Opening: Gedult Gambit	f3 d5 e4 g6 d4 dxe4 c3
A00	Grob Opening: Grob Gambit, Keres Gambit	g4 d5 Bg2 e5 d4 exd4 c3
A00	Grob Opening: Grob Gambit, Richter-Grob Gambit	g4 d5 Bg2 c6 c4 dxc4 b3
A00	Grob Opening: Zilbermints Gambit, Zilbermints-Hartlaub Gambit	g4 d5 e4 dxe4 Nc3 e5 d3
A00	Hungarian Opening: Reversed Brooklyn Defence, Brooklyn Benko Gambit	g3 e5 Nf3 e4 Ng1 Nf6 b4
A00	Hungarian Opening: Winterberg Gambit	g3 d5 Bg2 e5 c4 dxc4 b3
A00	Kádas Opening: Kádas Gambit	h4 d5 d4 c5 Nf3 cxd4 c3
A00	Polish Opening: Schiffler-Sokolsky Variation	b4 e6 Bb2 Nf6 b5 d5 e3
A00	Polish Opening: Schuehler Gambit	b4 c6 Bb2 a5 b5 cxb5 e4
A00	Van Geet Opening: Gladbacher Gambit	Nc3 e5 b3 d5 e4 dxe4 d3
A00	Van Geet Opening: Novosibirsk Variation	Nc3 c5 d4 cxd4 Qxd4 Nc6 Qh4
A00	Van Geet Opening: Pfeiffer Gambit, Sleipnir Countergambit	Nc3 d5 f4 d4 Ne4 e5 Nf3
A00	Van Geet Opening: Reversed Scandinavian	Nc3 e5 d4 exd4 Qxd4 Nc6 Qa4
A00	Van Geet Opening: Sicilian Two Knights	Nc3 c5 Nf3 Nc6 d4 cxd4 Nxd4
A00	Van’t Kruijs Opening: Keoni-Hiva Gambit, Akahi Variation	e3 e5 Nc3 Nf6 f4 exf4 Nf3
A00	Van’t Kruijs Opening: Keoni-Hiva Gambit, Alua Variation	e3 e5 Nc3 Nc6 f4 exf4 Nf3
A00	Van’t Kruijs Opening: Keoni-Hiva Gambit, Ekolu Variation	e3 e5 Nc3 d5 f4 exf4 Nf3
A00	Ware Opening: Ware Gambit	a4 e5 a5 d5 e3 f5 a6
A00	Amsterdam Attack	e3 e5 c4 d6 Nc3 Nc6 b3 Nf6
A00	Hungarian Opening: Burk Gambit	g3 e5 a3 d5 Nf3 e4 Nh4 Be7 d3
A00	Hungarian Opening: Paris Gambit	g3 e5 Nh3 d5 f4 Bxh3 Bxh3 exf4 O-O
A00	Sodium Attack: Celadon Variation	Na3 e5 d3 Bxa3 bxa3 d5 e3 c5 Rb1
A00	Grob Opening: Grob Gambit, Fritz Gambit, Romford Countergambit	g4 d5 Bg2 Bxg4 c4 d4 Bxb7 Nd7 Bxa8 Qxa8
A00	Hungarian Opening: Asten Gambit	g3 Nc6 Nc3 d5 d4 e5 dxe5 d4 Ne4 f5
A00	Amar Opening: Paris Gambit, Gent Gambit	Nh3 d5 g3 e5 f4 Bxh3 Bxh3 exf4 O-O fxg3 hxg3
A00	Polish Opening: King’s Indian Variation, Sokolsky Attack	b4 Nf6 Bb2 g6 c4 Bg7 e3 d6 Nf3 O-O d4
A00	Polish Opening: Rooks Swap Line	b4 e6 Bb2 Nf6 b5 a6 a4 axb5 axb5 Rxa1 Bxa1
A00	Van Geet Opening: Jendrossek Gambit	Nc3 d5 f4 d4 Ne4 f5 Nf2 Nf6 Nf3 c5 b4
A00	Grob Opening: Keene Defence, Main Line	g4 d5 h3 e5 Bg2 c6 d4 e4 c4 Bd6 Nc3 Ne7
A00	Formation: Hippopotamus Attack	a3 e5 b3 d5 c3 Nf6 d3 Nc6 e3 Bd6 f3 O-O g3
A00	Formation: Shy Attack	a3 e5 g3 d5 Bg2 Nf6 d3 Nc6 Nd2 Bd6 e3 O-O h3
A01	Nimzo-Larsen Attack	b3
A01	Nimzo-Larsen Attack: Classical Variation	b3 d5
A01	Nimzo-Larsen Attack: Dutch Variation	b3 f5
A01	Nimzo-Larsen Attack: English Variation	b3 c5
A01	Nimzo-Larsen Attack: Indian Variation	b3 Nf6
A01	Nimzo-Larsen Attack: Modern Variation	b3 e5
A01	Nimzo-Larsen Attack: Polish Variation	b3 b5
A01	Nimzo-Larsen Attack: Symmetrical Variation	b3 b6
A01	Nimzo-Larsen Attack: Graz Attack	b3 d5 Ba3
A01	Nimzo-Larsen Attack: Modern Variation	b3 e5 Bb2 Nc6
A01	Nimzo-Larsen Attack: Modern Variation	b3 e5 Bb2 Nc6 e3
A01	Nimzo-Larsen Attack: Pachman Gambit	b3 e5 Bb2 Nc6 f4
A01	Nimzo-Larsen Attack: Ringelbach Gambit	b3 f5 Bb2 e6 e4
A01	Nimzo-Larsen Attack: Spike Variation	b3 Nf6 Bb2 g6 g4
A01	Nimzo-Larsen Attack: Modern Variation	b3 e5 Bb2 Nc6 c4 Nf6
A02	Bird Opening	f4
A02	Bird Opening: From’s Gambit	f4 e5
A02	Bird Opening: Hobbs Gambit	f4 g5
A02	Bird Opening: Horsefly Defence	f4 Nh6
A02	Bird Opening: Myers Defence	f4 b5
A02	Bird Opening: From’s Gambit, Bahr Gambit	f4 e5 Nc3
A02	Bird Opening: Mujannah	f4 Nf6 c4
A02	Bird Opening: Wagner-Zwitersch Gambit	f4 f5 e4
A02	Bird Opening: Double Duck Formation	f4 f5 d4 d5
A02	Bird Opening: Hobbs-Zilbermints Gambit	f4 h6 Nf3 g5
A02	Bird Opening: Lasker Gambit	f4 e5 fxe5 f6
A02	Bird Opening: Platz Gambit	f4 e5 fxe5 Ne7
A02	Bird Opening: Schlechter Gambit	f4 e5 fxe5 Nc6
A02	Bird Opening: Batavo-Polish Attack	f4 Nf6 Nf3 g6 b4
A02	Bird Opening: From’s Gambit, Langheld Gambit	f4 e5 fxe5 d6 exd6 Nf6
A02	Bird Opening: Siegener Gambit	f4 e5 d4 exd4 Nf3 c5 c3
A02	Bird Opening: Swiss Gambit	f4 f5 e4 fxe4 Nc3 Nf6 g4
A02	Bird Opening: From’s Gambit, Lasker Variation	f4 e5 fxe5 d6 exd6 Bxd6 Nf3 g5
A02	Bird Opening: From’s Gambit, Lipke Variation	f4 e5 fxe5 d6 exd6 Bxd6 Nf3 Nh6 d4
A03	Bird Opening: Dutch Variation	f4 d5
A03	Bird Opening: Dutch Variation, Dudweiler Gambit	f4 d5 g4
A03	Bird Opening: Sturm Gambit	f4 d5 c4
A03	Bird Opening: Williams Gambit	f4 d5 e4
A03	Bird Opening: Lasker Variation	f4 d5 Nf3 Nf6 e3 c5
A03	Bird Opening: Williams Gambit	f4 d5 e4 dxe4 Nc3 Nf6 Qe2
A03	Bird Opening: Williams-Zilbermints Gambit	f4 d5 e4 dxe4 Nc3 Nf6 Nge2
A03	Bird Opening: Thomas Gambit	f4 d5 b3 Nf6 Bb2 d4 Nf3 c5 e3
A04	Zukertort Opening	Nf3
A04	Zukertort Opening: Arctic Defence	Nf3 f6
A04	Zukertort Opening: Basman Defence	Nf3 h6
A04	Zukertort Opening: Black Mustang Defence	Nf3 Nc6
A04	Zukertort Opening: Dutch Variation	Nf3 f5
A04	Zukertort Opening: Herrstrom Gambit	Nf3 g5
A04	Zukertort Opening: Kingside Fianchetto	Nf3 g6
A04	Zukertort Opening: Pirc Invitation	Nf3 d6
A04	Zukertort Opening: Polish Defence	Nf3 b5
A04	Zukertort Opening: Queen’s Gambit Invitation	Nf3 e6
A04	Zukertort Opening: Queenside Fianchetto Variation	Nf3 b6
A04	Zukertort Opening: Ross Gambit	Nf3 e5
A04	Zukertort Opening: Sicilian Invitation	Nf3 c5
A04	Zukertort Opening: Slav Invitation	Nf3 c6
A04	Zukertort Opening: St. George Defence	Nf3 a6
A04	Zukertort Opening: Ware Defence	Nf3 a5
A04	Zukertort Opening: Lisitsyn Gambit	Nf3 f5 e4
A04	Zukertort Defence: Kingside Variation	Nf3 Nh6 d4 g6
A04	Zukertort Defence: Sicilian Knight Variation	Nf3 Na6 e4 c5
A04	Zukertort Opening: Drunken Cavalry Variation	Nf3 Na6 e4 Nh6
A04	Zukertort Opening: Vos Gambit	Nf3 d6 d4 e5
A04	Zukertort Opening: Wade Defence	Nf3 d6 e4 Bg4
A04	Zukertort Opening: Lisitsyn Gambit Deferred	Nf3 f5 d3 Nf6 e4
A04	Zukertort Opening: Speelsmet Gambit	Nf3 c5 d4 cxd4 e3
A04	Zukertort Opening: Arctic Defence, Drunken Knight Variation	Nf3 f6 e4 Nh6 d4 Nf7
A04	Zukertort Opening: The Walrus	Nf3 e5 Nxe5 Nc6 Nxc6 dxc6
A04	Colle System: Rhamphorhynchus Variation	Nf3 c5 e3 g6 d4 Bg7 dxc5 Qa5+
A04	Modern Defence: Semi-Averbakh Variation, Polish Variation	Nf3 c5 c4 g6 d4 Bg7 e4 Qb6
A04	Modern Defence: Semi-Averbakh Variation, Pterodactyl Variation	Nf3 c5 c4 g6 d4 Bg7 e4 Qa5+
A04	Zukertort Opening: Shabalov Gambit	Nf3 e6 c4 a6 Nc3 c5 g3 b5
A04	Modern Defence: Semi-Averbakh Variation, Pterodactyl Variation Accepted	Nf3 g6 d4 Bg7 e4 d6 c4 c5 dxc5 Qa5+
A05	Zukertort Opening	Nf3 Nf6
A05	Zukertort Opening: Lemberger Gambit	Nf3 Nf6 e4
A05	Zukertort Opening: Nimzo-Larsen Variation	Nf3 Nf6 b3
A05	Zukertort Opening: Quiet System	Nf3 Nf6 e3
A05	King’s Indian Attack	Nf3 Nf6 g3 d5
A05	King’s Indian Attack: Spassky Variation	Nf3 Nf6 g3 b5
A05	King’s Indian Attack: Symmetrical Defence	Nf3 Nf6 g3 g6
A05	Zukertort Opening	Nf3 Nf6 Nc3 Nc6
A05	King’s Indian Attack: Smyslov Variation	Nf3 Nf6 g3 g6 b4
A05	Polish Opening: Zukertort System	Nf3 Nf6 b4 g6 Bb2
A05	Zukertort Opening: Myers Polish Attack	Nf3 Nf6 a4 g6 b4
A05	King’s Indian Attack: Wahls Defence	Nf3 Nf6 g3 g6 Bg2 Bg7 O-O O-O d3 d5
A05	Zukertort Opening: Double Fianchetto Attack	Nf3 Nf6 g3 g6 b3 Bg7 Bb2 O-O Bg2 d6 O-O
A06	Zukertort Opening	Nf3 d5
A06	Nimzo-Larsen Attack: Classical Variation	Nf3 d5 b3
A06	Zukertort Opening: Ampel Variation	Nf3 d5 Rg1
A06	Zukertort Opening: Old Indian Attack	Nf3 d5 d3
A06	Zukertort Opening: Reversed Mexican Defence	Nf3 d5 Nc3
A06	Zukertort Opening: Santasiere’s Folly	b4 d5 Nf3
A06	Zukertort Opening: Tennison Gambit	e4 d5 Nf3
A06	Zukertort Opening: The Potato	Nf3 d5 a4
A06	Nimzo-Larsen Attack: Norfolk Gambit	Nf3 d5 b3 c5 e4
A06	Nimzo-Larsen Attack: Norfolk Gambit	Nf3 d5 b3 Nf6 Bb2 c5 e4
A06	Zukertort Opening: Pachman Gambit	Nf3 d5 e3 c5 c4 dxc4 b3
A06	Zukertort Opening: Regina-Nu Gambit	Nf3 d5 b3 c5 c4 dxc4 Nc3
A06	Zukertort Opening: Tennison Gambit, Brigg’s Trap	e4 d5 Nf3 dxe4 Ng5 Nf6 Nc3 Bf5 Qe2 Qd4
A07	King’s Indian Attack	Nf3 d5 g3
A07	Hungarian Opening: Wiedenhagen-Beta Gambit	g3 d5 Nf3 g5
A07	King’s Indian Attack: Double Fianchetto	Nf3 d5 g3 g6
A07	King’s Indian Attack: Keres Variation	Nf3 d5 g3 Bg4
A07	King’s Indian Attack: Omega-Delta Gambit	Nf3 d5 g3 e5
A07	King’s Indian Attack: Sicilian Variation	Nf3 d5 g3 c5
A07	King’s Indian Attack, with e6	Nf3 Nf6 g3 d5 Bg2 e6
A07	King’s Indian Attack: Keres Variation	Nf3 d5 g3 Bg4 Bg2 Nd7
A07	King’s Indian Attack, with Bf5	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5
A07	King’s Indian Attack, with e6	Nf3 Nf6 g3 d5 Bg2 e6 O-O Be7
A07	King’s Indian Attack: Keres Variation	Nf3 d5 g3 c6 Bg2 Bg4 O-O Nd7
A07	King’s Indian Attack: Yugoslav Variation	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bg4
A07	King’s Indian Attack: Yugoslav Variation	c4 e6 Nf3 d5 g3 Nf6 Bg2 b6 O-O
A07	King’s Indian Attack, with Bf5	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5 d3 h6
A07	King’s Indian Attack: Pachman System	Nf3 d5 g3 g6 Bg2 Bg7 O-O e5 d3 Ne7
A07	King’s Indian Attack, with Bf5	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5 d3 e6 Nbd2
A07	King’s Indian Attack, with Bf5	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5 d3 e6 Nh4
A07	King’s Indian Attack, with Bf5	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5 d3 h6 c4 dxc4
A07	King’s Indian Attack: Keres Variation	Nf3 d5 g3 c6 Bg2 Bg4 O-O Nd7 d4 Ngf6 c4 e6 cxd5 exd5 Nc3 Bd6
A08	King’s Indian Attack: Sicilian Variation	Nf3 d5 g3 c5 Bg2
A08	King’s Indian Attack: French Variation	Nf3 d5 g3 c5 Bg2 Nc6
A08	Zukertort Opening: Reversed Grünfeld	Nf3 d5 g3 c5 Bg2 Nc6 d4
A08	Zukertort Opening: Reversed Grünfeld	Nf3 d5 g3 c5 Bg2 Nc6 d4 Nf6
A08	King’s Indian Attack: Sicilian Variation	Nf3 d5 g3 c5 Bg2 Nf6 O-O e6 d3
A08	Zukertort Opening: Reversed Grünfeld	Nf3 d5 g3 c5 Bg2 Nc6 d4 Nf6 O-O
A08	Zukertort Opening: Reversed Grünfeld	Nf3 d5 g3 c5 Bg2 Nc6 d4 e6 O-O
A08	King’s Indian Attack: Sicilian Variation	e4 e6 d3 d5 Nd2 Nf6 Ngf3 c5 g3 Nc6 Bg2 Be7 O-O O-O Re1
A09	Réti Opening	Nf3 d5 c4
A09	Réti Opening: Advance Variation	Nf3 d5 c4 d4
A09	Réti Opening: Réti Accepted	Nf3 d5 c4 dxc4
A09	Réti Opening: Zilbermints Gambit	Nf3 d5 c4 b5
A09	Réti Opening: Penguin Variation	Nf3 d5 c4 d4 Rg1
A09	Réti Opening: Advance Variation, Michel Gambit	Nf3 d5 c4 d4 b4 c5
A09	Réti Opening: Advance Variation, Navara Gambit	Nf3 d5 c4 d4 b4 g5
A09	Réti Opening: Réti Gambit, Keres Variation	Nf3 d5 c4 dxc4 e3 Be6
A09	Réti Opening: Reversed Blumenfeld Gambit	Nf3 d5 c4 d4 e3 c5 b4
A10	English Opening	c4
A10	English Opening: Anglo-Dutch Defence	c4 f5
A10	English Opening: Anglo-Lithuanian Variation	c4 Nc6
A10	English Opening: Anglo-Scandinavian Defence	c4 d5
A10	English Opening: Great Snake Variation	c4 g6
A10	English Opening: Jaenisch Gambit	c4 b5
A10	English Opening: Myers Defence	c4 g5
A10	English Opening: Achilles-Omega Gambit	c4 Nf6 e4
A10	English Opening: Anglo-Dutch Defence, Hickmann Gambit	c4 f5 e4
A10	English Opening: Wade Gambit	c4 f5 g4
A10	English Opening: Adorjan Defence	c4 g6 e4 e5
A10	English Opening: Anglo-Scandinavian Defence, Löhn Gambit	c4 d5 cxd5 e6
A10	English Opening: Anglo-Scandinavian Defence, Schulz Gambit	c4 d5 cxd5 Nf6
A10	English Opening: Myers Gambit	c4 g5 d4 Bg7
A10	English Opening: Zilbermints Gambit	c4 g5 d4 e5
A10	English Opening: Anglo-Dutch Variation, Chabanon Gambit	c4 f5 Nf3 d6 e4
A10	English Opening: Anglo-Dutch Variation, Ferenc Gambit	c4 f5 Nc3 Nf6 e4
A10	English Opening: Anglo-Scandinavian Defence, Malvinas Variation	c4 d5 cxd5 Qxd5 Nc3 Qa5
A10	English Opening: Porcupine Variation	c4 f5 Nc3 Nf6 e4 fxe4 g4
A10	English Opening: King’s English Variation, Botvinnik System, Prickly Pawn Pass System	c4 g6 Nc3 Bg7 g3 Nf6 Bg2 O-O e4 d6 Nge2 e5 O-O c6 d3 a6
A11	English Opening: Caro-Kann Defensive System	c4 c6
A11	Réti Opening: Anglo-Slav Variation, Gurevich System	c4 c6 Nf3 d5 e3
A11	Réti Opening: Anglo-Slav Variation, Gurevich System	c4 c6 Nf3 d5 e3 Nf6 Qc2
A11	Réti Opening: Anglo-Slav Variation, with g3	c4 c6 Nf3 d5 g3 Nf6 Bg2
A11	Réti Opening: Anglo-Slav Variation, with g3	c4 c6 Nf3 d5 g3 Nf6 b3 g6
A11	Réti Opening: Anglo-Slav Variation, with g3	c4 c6 Nf3 d5 g3 Nf6 Bg2 dxc4
A11	Réti Opening: Anglo-Slav Variation, with g3	c4 c6 Nf3 d5 g3 Nf6 Bg2 Bf5
A11	Réti Opening: Anglo-Slav Variation, Gurevich System	c4 c6 Nf3 d5 e3 Nf6 Nc3 Nbd7 Qc2
A11	Réti Opening: Anglo-Slav Variation, Gurevich System	c4 c6 Nf3 d5 e3 Nf6 Nc3 Nbd7 b3 e5
A11	Réti Opening: Anglo-Slav Variation, Gurevich System	c4 c6 Nf3 d5 e3 Nf6 Nc3 e6 b3 Bd6
A11	Réti Opening: Anglo-Slav Variation, with g3	c4 c6 Nf3 d5 g3 Nf6 Bg2 Bf5 O-O e6 d3
A11	Réti Opening: Anglo-Slav Variation, with g3	Nf3 Nf6 g3 d5 Bg2 c6 O-O Bf5 d3 h6 c4 e6
A12	Réti Opening: Anglo-Slav Variation, Bogoljubow Variation	Nf3 d5 c4 c6 b3
A12	Réti Opening: Anglo-Slav Variation, Bogoljubow Variation	Nf3 d5 c4 c6 b3 Bg4
A12	Réti Opening: Anglo-Slav Variation, Bogoljubow Variation	Nf3 d5 c4 c6 b3 Bf5
A12	Réti Opening: Anglo-Slav Variation	c4 Nf6 g3 c6 Nf3 d5 b3
A12	Réti Opening: Anglo-Slav Variation, Bogoljubow Variation	Nf3 d5 c4 c6 b3 Bf5 Bb2
A12	Réti Opening: Anglo-Slav Variation, Bled Variation	Nf3 d5 b3 Nf6 Bb2 g6 c4 c6
A12	Réti Opening: Anglo-Slav Variation, Capablanca Variation	c4 Nf6 Nf3 c6 b3 d5 Bb2 Bg4
A12	Réti Opening: Anglo-Slav Variation, London Defensive System	c4 Nf6 g3 c6 Nf3 d5 b3 Bf5
A12	Réti Opening: Anglo-Slav Variation, New York System	Nf3 Nf6 c4 c6 b3 d5 Bb2 Bf5
A12	Réti Opening: Anglo-Slav Variation, Torre System	c4 Nf6 g3 c6 Nf3 d5 b3 Bg4
A12	Réti Opening: Anglo-Slav Variation, with dxc4	c4 Nf6 g3 c6 Nf3 d5 b3 dxc4
A12	Réti Opening: Anglo-Slav Variation, Capablanca Variation	c4 Nf6 Nf3 c6 b3 d5 Bb2 Bg4 e3
A12	Réti Opening: Anglo-Slav Variation, Capablanca Variation	c4 Nf6 Nf3 c6 b3 d5 Bb2 Bg4 d3
A12	Réti Opening: Anglo-Slav Variation, London Defensive System	c4 Nf6 g3 c6 Nf3 d5 b3 Bf5 Bg2
A12	Réti Opening: Anglo-Slav Variation, London Defensive System	c4 Nf6 g3 c6 Nf3 d5 b3 Bf5 Bb2
A12	Réti Opening: Anglo-Slav Variation, New York System	Nf3 Nf6 c4 c6 b3 d5 Bb2 Bf5 e3
A12	Réti Opening: Anglo-Slav Variation, New York System	Nf3 Nf6 c4 c6 b3 d5 Bb2 Bf5 d3
A12	Réti Opening: Anglo-Slav Variation, Torre System	c4 Nf6 g3 c6 Nf3 d5 b3 Bg4 Bg2
A12	Réti Opening: Anglo-Slav Variation, Torre System	c4 Nf6 g3 c6 Nf3 d5 b3 Bg4 Bb2
A12	Réti Opening: Anglo-Slav Variation, London Defensive System	c4 Nf6 g3 c6 Nf3 d5 b3 Bf5 Bg2 e6 Bb2
A12	Réti Opening: Anglo-Slav Variation, Torre System	c4 Nf6 g3 c6 Nf3 d5 b3 Bg4 Bg2 e6 Bb2
A13	English Opening: Agincourt Defence	c4 e6
A13	English Opening: Agincourt Defence	c4 e6 Nf3
A13	English Opening: Agincourt Defence	c4 e6 Nf3 d5
A13	English Opening: Agincourt Defence, Catalan Defence	c4 e6 Nf3 d5 g3 c5
A13	English Opening: Agincourt Defence, Kurajica Defence	c4 e6 Nf3 d5 g3 c6
A13	English Opening: Neo-Catalan	c4 e6 Nf3 d5 g3 Nf6
A13	English Opening: Agincourt Defence, Bogoljubow Defence	c4 e6 Nf3 d5 g3 Nf6 Bg2 Bd6
A13	English Opening: Agincourt Defence, Catalan Defence Accepted	c4 e6 Nf3 Nf6 g3 d5 Bg2 dxc4
A13	English Opening: Agincourt Defence, Catalan Defence, Semi-Slav Defence	c4 e6 Nf3 Nf6 g3 d5 Bg2 c6
A13	English Opening: Neo-Catalan Declined	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7
A13	English Opening: Romanishin Gambit	c4 Nf6 Nf3 e6 g3 a6 Bg2 b5
A13	English Opening: Agincourt Defence, Catalan Defence	c4 e6 Nf3 d5 g3 b6 Bg2 Bb7 O-O
A13	English Opening: Agincourt Defence, Wimpy System	c4 e6 Nf3 Nf6 b3 d5 Bb2 c5 e3
A13	English Opening: Agincourt Defence	c4 e6 Nf3 d5 b3 Nf6 Bb2 Be7 e3 O-O
A13	English Opening: Agincourt Defence	c4 e6 Nf3 d5 b3 Nf6 Bb2 Be7 e3 O-O d4
A13	English Opening: Agincourt Defence, Tarrasch Defence	c4 e6 Nf3 d5 g3 Nf6 Bg2 c5 b3 Nc6 O-O Be7
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 O-O
A14	English Opening: Agincourt Defence, Neo-Catalan Declined, Early b3	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 b3
A14	English Opening: Agincourt Defence, Neo-Catalan Declined, Early b3	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 b3 b6
A14	English Opening: Agincourt Defence, Neo-Catalan Declined, Early b3	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 b3 c5
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 O-O O-O b3
A14	Réti Opening: Anglo-Slav Variation	Nf3 d5 c4 c6 g3 Nf6 Bg2 e6 b3 Be7 Bb2
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 c4 O-O b3 c5
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 c4 O-O b3 c5 e3
A14	Réti Opening: Anglo-Slav Variation, Bogoljubow Variation, Stonewall Line	Nf3 d5 c4 e6 g3 Nf6 Bg2 Be7 O-O O-O b3 c6 Bb2
A14	English Opening: Agincourt Defence, Keres Defence	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 O-O c5 cxd5 Nxd5 Nc3 Nc6
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 c4 O-O b3 c5 e3 d4
A14	English Opening: Agincourt Defence, Neo-Catalan Declined	Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 c4 O-O b3 c5 e3 Nc6
A15	English Opening: Anglo-Indian Defence	c4 Nf6
A15	English Opening: Anglo-Indian Defence, King’s Knight Variation	c4 Nf6 Nf3
A15	English Orangutan	c4 Nf6 b4
A15	English Opening: Anglo-Indian Defence, King’s Indian Formation	c4 Nf6 Nf3 g6
A15	English Opening: Anglo-Indian Defence, Old Indian Formation	c4 Nf6 Nf3 d6
A15	English Opening: Anglo-Indian Defence, Queen’s Indian Formation	c4 Nf6 Nf3 b6
A15	English Opening: Anglo-Indian Defence, Scandinavian Defence	c4 Nf6 Nf3 d5
A15	English Orangutan	c4 Nf6 Nf3 g6 b4
A15	English Opening: Anglo-Indian Defence, Grünfeld Formation	c4 Nf6 Nf3 g6 g3 d5
A15	English Opening: Anglo-Indian Defence, Romanishin Variation	c4 e6 Nf3 Nf6 g3 a6
A15	English Opening: Anglo-Indian Defence, Scandinavian Defence, Exchange Variation	c4 Nf6 Nf3 d5 cxd5 Nxd5
A15	English Opening: Anglo-Indian Defence, Slav Formation	c4 Nf6 Nf3 g6 g3 c6
A15	English Opening: Anglo-Indian Defence, Anti-Anti-Grünfeld	c4 Nf6 Nc3 g6 Nf3 Bg7 e4
A15	English Opening: Anglo-Indian Defence, King’s Indian Formation, Double Fianchetto	c4 Nf6 Nf3 g6 g3 b6 Bg2 Bb7
A15	English Opening: Anglo-Indian Defence, Queen’s Indian Formation	c4 e6 Nf3 Nf6 g3 b6 Bg2 Bb7
A16	English Opening: Anglo-Indian Defence, Queen’s Knight Variation	c4 Nf6 Nc3
A16	English Opening: Anglo-Grünfeld Defence	c4 Nf6 Nc3 d5
A16	English Opening: Anglo-Indian Defence, Anglo-Grünfeld Variation	c4 Nf6 Nc3 d5 cxd5 Nxd5 Nf3
A16	English Opening: Anglo-Indian Defence, Anglo-Grünfeld Variation	c4 Nf6 Nc3 d5 cxd5 Nxd5 Nf3 g6
A16	English Opening: Anglo-Indian Defence, Anglo-Grünfeld Variation	c4 Nf6 Nc3 d5 cxd5 Nxd5 g3 g6 Bg2 Nb6
A16	English Opening: Anglo-Indian Defence, Anglo-Grünfeld Variation	c4 Nf6 Nc3 d5 cxd5 Nxd5 g3 g6 Bg2 Nxc3
A16	English Opening: Anglo-Grünfeld Defence, Korchnoi Variation	c4 Nf6 Nc3 d5 cxd5 Nxd5 Nf3 g6 g3 Bg7 Bg2 e5
A17	English Opening: Anglo-Indian Defence, Hedgehog System	c4 Nf6 Nc3 e6
A17	English Opening: Anglo-Indian Defence, Nimzo-English	c4 Nf6 Nc3 e6 Nf3 Bb4
A17	English Opening: Anglo-Indian Defence, Queen’s Indian Formation	c4 e6 Nc3 Nf6 Nf3 b6
A17	English Opening: Anglo-Indian Defence, Zvjaginsev-Krasenkow Attack	c4 e6 Nc3 Nf6 Nf3 Bb4 g4
A17	English Opening: Anglo-Indian Defence, Queen’s Indian Variation	c4 e6 Nc3 Nf6 Nf3 b6 e4 Bb7 Bd3
A17	English Opening: Anglo-Indian Defence	c4 Nf6 Nc3 d5 cxd5 Nxd5 Nf3 c5 e3 e6
A18	English Opening: Mikenas-Carls Variation	c4 e6 Nc3 Nf6 e4
A18	English Opening: Mikenas-Carls Variation	c4 e6 Nc3 Nf6 e4 Nc6
A18	English Opening: Mikenas-Carls Variation	c4 e6 Nc3 Nf6 e4 d5 e5
A19	English Opening: Mikenas-Carls, Sicilian	c4 e6 Nc3 Nf6 e4 c5
A19	English Opening: Anglo-Indian Defence, Flohr-Mikenas-Carls Variation, Nei Gambit	c4 e6 Nc3 Nf6 e4 c5 e5 Ng8
A20	English Opening: King’s English Variation	c4 e5
A20	English Opening: King’s English Variation, Nimzowitsch Variation	c4 e5 Nf3
A20	English Opening: Drill Variation	c4 e5 g3 h5
A20	English Opening: King’s English Variation, Nimzowitsch-Flohr Variation	c4 e5 Nf3 e4
A20	English Opening: King’s English Variation, Kahiko-Hula Gambit	c4 e5 e3 Nf6 f4 exf4 Nf3
A21	English Opening: King’s English Variation, Reversed Sicilian	c4 e5 Nc3
A21	English Opening: King’s English Variation, Kramnik-Shirov Counterattack	c4 e5 Nc3 Bb4
A21	English Opening: King’s English Variation	c4 e5 Nc3 d6 Nf3
A21	English Opening: King’s English Variation, Keres Defence	c4 e5 Nc3 d6 g3 c6
A21	English Opening: King’s English Variation, Smyslov Defence	c4 e5 Nc3 d6 Nf3 Bg4
A21	English Opening: King’s English Variation, Troger Defence	c4 e5 Nc3 Nc6 g3 d6 Bg2 Be6
A22	English Opening: King’s English Variation, Two Knights Variation	c4 e5 Nc3 Nf6
A22	English Opening: Carls-Bremen System	c4 e5 Nc3 Nf6 g3
A22	English Opening: King’s English, Mazedonisch	c4 e5 Nc3 Nf6 f4
A22	English Opening: King’s English Variation, Two Knights Variation, Reversed Dragon	c4 e5 Nc3 Nf6 g3 d5
A22	English Opening: King’s English Variation, Two Knights Variation, Smyslov System	c4 e5 Nc3 Nf6 g3 Bb4
A22	English Opening: King’s English Variation, Adhiban Gambit	c4 e5 Nc3 Nf6 Nf3 e4 Ng5 c6
A22	English Opening: King’s English Variation, Bellon Gambit	c4 e5 Nc3 Nf6 Nf3 e4 Ng5 b5
A22	English Opening: King’s English, Erbenheimer Gambit	c4 e5 Nc3 Nf6 Nf3 e4 Ng5 Ng4
A23	English Opening: King’s English Variation, Two Knights Variation, Keres Variation	c4 e5 Nc3 Nf6 g3 c6
A23	English Opening: King’s English Variation, Two Knights Variation, Keres Variation	c4 e5 Nc3 Nf6 g3 Bc5 Bg2 c6
A24	English Opening: King’s English Variation, Two Knights Variation, Fianchetto Line	c4 e5 Nc3 Nf6 g3 g6
A25	English Opening: King’s English Variation, Reversed Closed Sicilian	c4 e5 Nc3 Nc6
A25	English Opening: King’s English Variation, Taimanov Variation	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7
A25	English Opening: King’s English Variation, Closed System	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3
A25	English Opening: King’s English Variation, Hungarian Attack	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 Rb1
A25	English Opening: King’s English Variation, Reversed Closed Sicilian	c4 e5 g3 Nf6 Bg2 Nc6 Nc3 Bb4 Nd5
A25	English Opening: Closed, Taimanov Variation	c4 e5 Nc3 Nc6 g3 g6 Rb1 Nh6 Bg2 Bg7
A25	English Opening: King’s English Variation, Reversed Closed Sicilian	c4 e5 g3 Nf6 Bg2 Nc6 Nc3 Bb4 e4 d6 Nge2
A25	English Opening: King’s English Variation, Reversed Closed Sicilian	c4 e5 Nc3 Nf6 g3 Bb4 e4 O-O Nge2 Nc6 Bg2
A25	English Opening: Closed, Taimanov Variation	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 e3 d6 Nge2 Nh6
A25	English Opening: King’s English Variation, Bremen-Hort Variation	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 e3 d6 Nge2 Be6
A25	English Opening: King’s English Variation, Reversed Closed Sicilian	c4 e5 g3 Nf6 Bg2 Nc6 Nc3 Bb4 e4 d6 Nge2 Bg4
A26	English Opening: King’s English Variation, Closed System, Full Symmetry	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6
A26	English Opening: King’s English Variation, Botvinnik System	c4 e5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 e4
A27	English Opening: King’s English Variation, Three Knights System	c4 e5 Nc3 Nc6 Nf3
A28	English Opening: King’s English Variation, Four Knights Variation	c4 e5 Nc3 Nf6 Nf3 Nc6
A28	English Opening: Four Knights System, Nimzowitsch Variation	c4 e5 Nc3 Nf6 Nf3 Nc6 e4
A28	English Opening: King’s English Variation, Four Knights Variation, Flexible Line	c4 e5 Nc3 Nf6 Nf3 Nc6 d3
A28	English Opening: King’s English Variation, Four Knights Variation, Korchnoi Line	c4 e5 Nc3 Nf6 Nf3 Nc6 a3
A28	English Opening: King’s English Variation, Four Knights Variation, Quiet Line	c4 e5 Nc3 Nf6 Nf3 Nc6 e3
A28	English Opening: King’s English Variation, Four Knights Variation, Bradley Beach Variation	c4 e5 Nc3 Nf6 Nf3 Nc6 d4 e4
A28	English Opening: King’s English Variation, Four Knights Variation, Quiet Line	c4 e5 Nc3 Nf6 Nf3 Nc6 e3 Bb4 Qc2 Bxc3
A28	English Opening: King’s English Variation, Four Knights Variation, Quiet Line	c4 e5 Nc3 Nf6 Nf3 Nc6 e3 Bb4 Qc2 O-O Nd5 Re8 Qf5
A28	English Opening: King’s English Variation, Four Knights Variation	c4 e5 Nc3 Nf6 Nf3 Nc6 d4 exd4 Nxd4 Bb4 Bg5 h6 Bh4 Bxc3+ bxc3 Ne5
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 Nc3 Nf6 Nf3 Nc6 g3
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bb4
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 g3 Nf6 Bg2 d5 cxd5 Nxd5 Nf3 Nc6
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 g3 Nf6 Bg2 d5 cxd5 Nxd5 Nf3 Nc6 d3
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with .. d6	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bc5 d3 d6 Bg2
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with .. d6, a6	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bc5 d3 d6 Bg2 a6
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with .. d6, Be7	c4 e5 Nc3 Nf6 g3 Nc6 Bg2 d6 d3 Be7 Nf3 O-O
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with .. d6, h6	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bc5 d3 d6 Bg2 h6
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with Bc5	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 d5 cxd5 Nxd5 Bg2 Bc5
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with Nb6	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 d5 cxd5 Nxd5 Bg2 Nb6
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, with .. d6	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bc5 d3 d6 Bg2 O-O O-O
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 Nc3 Nf6 Nf3 Nc6 g3 Bb4 Bg2 Bxc3 dxc3 d6 O-O O-O
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line	c4 e5 g3 Nf6 Bg2 d5 cxd5 Nxd5 Nf3 Nc6 d3 Be7 O-O O-O
A29	English Opening: King’s English Variation, Four Knights Variation, Fianchetto Line, Delayed .. Nc6	c4 e5 Nc3 Nf6 g3 Bb4 Bg2 O-O Nf3 Re8 O-O e4 Nd4 Nc6
A30	English Opening: Symmetrical Variation	c4 c5
A30	English Opening: Symmetrical Variation	c4 c5 Nf3
A30	English Opening: Wing Gambit	c4 c5 b4
A30	English Opening: Symmetrical Variation, Napolitano Gambit	c4 c5 Nf3 Nf6 b4
A30	English Opening: Symmetrical Variation, Hedgehog Defence	c4 e6 Nf3 Nf6 Nc3 c5 g3 b6 Bg2 Bb7 O-O Be7
A30	English Opening: Symmetrical, Hedgehog, Flexible Formation	c4 e6 Nf3 c5 Nc3 Nf6 g3 b6 Bg2 Bb7 O-O Be7 d4 cxd4 Qxd4 d6 Rd1 a6 b3 Nbd7
A31	English Opening: Symmetrical Variation, Anti-Benoni Variation	c4 Nf6 d4 c5 Nf3
A32	English Opening: Symmetrical Variation, Anti-Benoni Variation, Spielmann Defence	c4 e6 d4 c5 Nf3 cxd4 Nxd4 Nf6
A33	English Opening: Symmetrical Variation, Anti-Benoni Variation, Spielmann Defence	c4 e6 Nf3 Nf6 Nc3 c5 d4 cxd4 Nxd4 Nc6
A33	English Opening: Symmetrical Variation, Anti-Benoni Variation, Geller Variation	c4 e6 Nf3 Nf6 Nc3 c5 d4 Nc6 g3 cxd4 Nxd4 Qb6
A34	English Opening: Symmetrical Variation, Normal Variation	c4 c5 Nc3
A34	English Opening: Symmetrical Variation, Fianchetto Variation	c4 Nf6 Nc3 c5 g3
A34	English Opening: Symmetrical Variation, Three Knights Variation	c4 c5 Nc3 Nf6 Nf3
A34	English Opening: Symmetrical Variation	c4 c5 Nf3 Nf6 Nc3 Nc6 g3 d5 d4 cxd4
A34	English Opening: Symmetrical Variation, Rubinstein Variation	c4 Nf6 Nc3 c5 g3 d5 cxd5 Nxd5 Bg2 Nc7
A34	English Opening: Symmetrical Variation, Rubinstein Variation	c4 c5 Nf3 Nf6 Nc3 d5 cxd5 Nxd5 g3 Nc6 Bg2 Nc7
A35	English Opening: Symmetrical Variation, Two Knights Variation	c4 c5 Nc3 Nc6
A35	English Opening: Symmetrical Variation	c4 c5 Nc3 Nf6 Nf3 e5
A35	English Opening: Symmetrical Variation, Four Knights Variation	c4 c5 Nf3 Nf6 Nc3 Nc6
A35	English Opening: Symmetrical Variation, Four Knights Variation, Keres-Parma System	c4 c5 Nf3 Nf6 Nc3 Nc6 g3 e6
A36	English Opening: Symmetrical Variation, Two Knights, Fianchetto Variation	c4 c5 Nc3 Nc6 g3
A36	English Opening: Symmetrical Variation, Ultra-Symmetrical Variation	c4 c5 g3 g6 Bg2 Bg7 Nc3 Nc6
A36	English Opening: Symmetrical Variation, Botvinnik System	c4 c5 e4 Nc6 Nc3 g6 g3 Bg7 Bg2
A36	English Opening: Symmetrical Variation, Botvinnik System Reversed, with e3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 e3 e5
A37	English Opening: Symmetrical Variation, Three Knights, Fianchetto Variation	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5
A37	English Opening: Symmetrical Variation, Three Knights, Fianchetto Variation	c4 c5 Nf3 Nc6 g3 g6 Bg2 Bg7 O-O d6 Nc3
A37	English Opening: Symmetrical Variation, Three Knights, Fianchetto Variation	c4 c5 Nf3 Nc6 g3 g6 Bg2 Bg7 O-O e6 Nc3
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5 O-O d6
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5 O-O Nge7
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5 O-O Nge7 a3
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5 O-O Nge7 d3
A37	English Opening: Symmetrical Variation, Botvinnik System Reversed, with Nf3	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 e5 O-O Nge7 d3 d6
A38	English Opening: Symmetrical Variation, Full Symmetry Line	c4 Nf6 Nf3 c5 Nc3 Nc6 g3 g6 Bg2 Bg7
A38	English Opening: Symmetrical Variation, Double Fianchetto	c4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 Nf3 Nf6 O-O O-O b3
A38	English Opening: Symmetrical Variation, Duchamp Variation	c4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O c5 Nc3 Nc6 d3
A39	English Opening: Symmetrical Variation, Mecking Variation	c4 Nf6 Nf3 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 O-O O-O d4
A40	Queen’s Pawn Game	d4
A40	Australian Defence	d4 Na6
A40	Borg Defence: Borg Gambit	d4 g5
A40	English Defence	d4 b6
A40	Englund Gambit	d4 e5
A40	Horwitz Defence	d4 e6
A40	Mikenas Defence	d4 Nc6
A40	Polish Defence	d4 b5
A40	Queen’s Pawn Game: Modern Defence	d4 g6
A40	Englund Gambit Declined	d4 e5 d5
A40	Englund Gambit Declined: Reversed Alekhine	d4 e5 Nf3
A40	Englund Gambit Declined: Reversed French	d4 e5 e3
A40	English Defence	d4 e6 c4 b6
A40	Englund Gambit Declined: Reversed Krebs	d4 e5 Nf3 e4
A40	Englund Gambit: Hartlaub-Charlick Gambit	d4 e5 dxe5 d6
A40	Englund Gambit: Mosquito Gambit	d4 e5 dxe5 Qh4
A40	Englund Gambit: Soller Gambit	d4 e5 dxe5 f6
A40	Horwitz Defence: Zilbermints Gambit	d4 e6 c4 e5
A40	Kangaroo Defence	d4 e6 c4 Bb4+
A40	Montevideo Defence	d4 Nc6 d5 Nb8
A40	Queen’s Pawn Game: Anglo-Slav Opening	d4 c6 c4 d6
A40	Englund Gambit Declined: Reversed Brooklyn	d4 e5 Nf3 e4 Ng1
A40	Englund Gambit Declined: Reversed Mokele Mbembe	d4 e5 Nf3 e4 Ne5
A40	Kangaroo Defence: Keres Defence, Transpositional Variation	d4 e6 c4 Bb4+ Nc3
A40	Modern Defence: Lizard Defence, Pirc-Diemer Gambit	d4 g6 h4 Nf6 h5
A40	Polish Defence: Spassky Gambit Accepted	d4 b5 e4 Bb7 Bxb5
A40	English Defence: Eastbourne Gambit	d4 b6 c4 Bb7 Nc3 e5
A40	Englund Gambit Declined: Diemer Counterattack	d4 e5 d5 Bc5 e4 Qh4
A40	Englund Gambit: Felbecker Gambit	d4 e5 dxe5 Nc6 Nf3 Bc5
A40	Englund Gambit: Main Line	d4 e5 dxe5 Nc6 Nf3 Qe7
A40	Englund Gambit: Soller Gambit Deferred	d4 e5 dxe5 Nc6 Nf3 f6
A40	Englund Gambit: Zilbermints Gambit	d4 e5 dxe5 Nc6 Nf3 Nge7
A40	Mikenas Defence: Cannstatter Variation	d4 Nc6 c4 e5 d5 Nd4
A40	Mikenas Defence: Lithuanian Variation	d4 Nc6 c4 e5 d5 Nce7
A40	Slav Indian: Kudischewitsch Gambit	d4 c6 Nf3 Nf6 c4 b5
A40	Englund Gambit: Stockholm Variation	d4 e5 dxe5 Nc6 Nf3 Qe7 Qd5
A40	Pterodactyl Defence: Queen Pterodactyl, Quiet Line	d4 g6 c4 Bg7 Nc3 c5 e3
A40	Colle System: Pterodactyl Variation	d4 g6 Nf3 Bg7 e3 c5 Bd3 Qa5+
A40	English Defence: Perrin Variation	d4 e6 c4 b6 e4 Bb7 Bd3 Nc6
A40	Mikenas Defence: Pozarek Gambit	d4 Nc6 c4 e5 dxe5 Nxe5 Nc3 Nxc4
A40	Pterodactyl Defence: Central, Benoni Pterodactyl	d4 g6 c4 Bg7 e4 c5 d5 Qa5+
A40	Pterodactyl Defence: Fianchetto, Queen Benoni Pterodactyl	d4 g6 c4 Bg7 Nc3 c5 d5 Qa5
A40	Pterodactyl Defence: Fianchetto, Queen Pterodactyl	d4 g6 Nf3 Bg7 g3 c5 Bg2 Qa5+
A40	Zaire Defence	d4 Nc6 d5 Nb8 e4 Nf6 e5 Ng8
A40	English Defence: Hartlaub Gambit Declined	c4 e6 d4 b6 Nc3 Bb7 e4 f5 d5
A40	Colle System: Siroccopteryx Variation	d4 g6 Nf3 Bg7 e3 c5 Bd3 cxd4 Nxd4 Qa5+
A40	English Defence: Hartlaub Gambit Accepted	c4 e6 d4 b6 Nc3 Bb7 e4 f5 exf5 Nf6
A40	English Defence: Poli Gambit	d4 e6 c4 b6 e4 Bb7 f3 f5 exf5 Nh6
A40	Modern Defence: Beefeater Variation	d4 g6 c4 Bg7 Nc3 c5 d5 Bxc3+ bxc3 f5
A40	Pterodactyl Defence: Fianchetto, Queen Pteranodon	d4 g6 c4 Bg7 Nc3 c5 d5 Bxc3+ bxc3 Qa5
A40	Pterodactyl Defence: Central, Benoni Beefeater Pterodactyl	d4 g6 c4 Bg7 Nc3 c5 d5 d6 e4 Bxc3+ bxc3 Qa5
A40	Benoni Defence: Franco-Sicilian Hybrid	d4 e6 c4 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 Nf3 Ne7
A41	Queen’s Pawn Game	d4 d6
A41	Old Indian Defence	d4 d6 c4
A41	Queen’s Pawn Game: Rossolimo Variation	d4 d6 Nf3 g6
A41	Rat Defence: English Rat	d4 d6 c4 e5
A41	Wade Defence	d4 d6 Nf3 Bg4
A41	Modern Defence	d4 g6 c4 Bg7 Nc3 d6
A41	Modern Defence: Neo-Modern Defence	d4 g6 c4 Bg7 e4 e5
A41	Rat Defence: English Rat, Lisbon Gambit	d4 d6 c4 e5 dxe5 Nc6
A41	Rat Defence: English Rat, Pounds Gambit	d4 d6 c4 e5 dxe5 Be6
A41	Robatsch Defence: Rossolimo Variation	d4 d6 Nf3 g6 c4 Bg7 e4 Bg4
A41	Zukertort Opening: Wade Defence, Chigorin Plan	d4 d6 Nf3 Bg4 c4 Nd7 Qb3 Rb8
A42	Modern Defence: Averbakh System	d4 g6 c4 Bg7 Nc3 d6 e4
A42	Modern Defence: Kotov Variation	d4 g6 c4 Bg7 Nc3 d6 e4 Nc6
A42	Modern Defence: Randspringer Variation	d4 g6 c4 Bg7 Nc3 d6 e4 f5
A42	Modern Defence: Averbakh Variation, Pseudo-Sämisch	d4 g6 c4 Bg7 e4 d6 Be3 Nf6 f3
A42	Pterodactyl Defence	Nf3 c5 c4 g6 d4 Bg7 e4 Qa5+ Nc3 d6
A42	Pterodactyl Defence: Central, Bogolubovia	d4 g6 c4 Bg7 e4 d6 Nc3 c5 Nge2 Qa5
A43	Benoni Defence: Old Benoni	d4 c5
A43	Benoni Defence: Benoni Gambit Accepted	d4 c5 dxc5
A43	Benoni Defence: Old Benoni	d4 c5 d5
A43	Benoni Defence: Zilbermints-Benoni Gambit	d4 c5 b4
A43	Benoni Defence: Benoni Gambit, Schlenker Defence	d4 c5 dxc5 Na6
A43	Benoni Defence: Benoni-Indian Defence	d4 c5 d5 Nf6
A43	Benoni Defence: Cormorant Gambit	d4 c5 dxc5 b6
A43	Benoni Defence: Old Benoni	d4 c5 d5 d6
A43	Benoni Defence: Old Benoni, Mujannah Formation	d4 c5 d5 f5
A43	Benoni Defence: Snail Variation	d4 c5 d5 Na6
A43	Benoni Defence: Benoni-Indian Defence, Kingside Move Order	d4 c5 d5 Nf6 Nf3
A43	Benoni Defence: Benoni-Staunton Gambit	d4 c5 d5 f5 e4
A43	Benoni Defence: French Benoni	e4 e6 d4 c5 d5
A43	Benoni Defence: Zilbermints-Benoni Gambit	d4 c5 Nf3 cxd4 b4
A43	Queen’s Pawn Game: Liedmann Gambit	d4 c5 c4 cxd4 e3
A43	Benoni Defence: Hawk Variation	d4 Nf6 Nf3 c5 d5 c4
A43	Benoni Defence: Old Benoni, Schmid Variation	d4 c5 d5 d6 Nc3 g6
A43	Benoni Defence: Woozle	d4 c5 d5 Nf6 Nc3 Qa5
A43	Benoni Defence: Zilbermints-Benoni Gambit, Tamarkin Countergambit	d4 c5 Nf3 cxd4 b4 e5
A43	Indian Defence: Pseudo-Benko	d4 Nf6 Nf3 c5 d5 b5
A44	Benoni Defence: Old Benoni	d4 c5 d5 e5
A44	Benoni Defence: Semi-Benoni	d4 c5 d5 e5 e4 d6
A45	Indian Defence	d4 Nf6
A45	Basque Opening	d4 Nf6 b3
A45	Canard Opening	d4 Nf6 f4
A45	Indian Defence: Accelerated London System	d4 Nf6 Bf4
A45	Indian Defence: Gibbins-Weidenhagen Gambit	d4 Nf6 g4
A45	Indian Defence: Omega Gambit	d4 Nf6 e4
A45	Indian Defence: Pawn Push Variation	d4 Nf6 d5
A45	Indian Defence: Tartakower Attack	d4 Nf6 g3
A45	Paleface Attack	d4 Nf6 f3
A45	Trompowsky Attack	d4 Nf6 Bg5
A45	Indian Defence: Gibbins-Weidenhagen Gambit Accepted	d4 Nf6 g4 Nxg4
A45	Indian Defence: Gibbins-Weidenhagen Gambit, Oshima Defence	d4 Nf6 g4 e5
A45	Indian Defence: Lazard Gambit	d4 Nf6 Nd2 e5
A45	Indian Defence: Maddigan Gambit	d4 Nf6 Nc3 e5
A45	Indian Defence: Reversed Chigorin Defence	d4 Nf6 Nc3 c5
A45	Queen’s Pawn Game: Chigorin Variation	d4 Nf6 Nc3 d5
A45	Trompowsky Attack: Classical Defence	d4 Nf6 Bg5 e6
A45	Amazon Attack: Siberian Attack	d4 Nf6 Nc3 d5 Qd3
A45	Indian Defence: Gedult Attack	d4 Nf6 f3 d5 g4
A45	Indian Defence: Paleface Attack, Blackmar-Diemer Gambit Deferred	d4 Nf6 f3 d5 e4
A45	Queen’s Pawn Game: Veresov, Richter Attack	d4 Nf6 f3 d5 Nc3
A45	Trompowsky Attack: Classical Defence, Big Center Variation	d4 Nf6 Bg5 e6 e4
A45	Trompowsky Attack: Edge Variation	d4 Nf6 Bg5 Ne4 Bh4
A45	Trompowsky Attack: Raptor Variation	d4 Nf6 Bg5 Ne4 h4
A45	Trompowsky Attack: Borg Variation	d4 Nf6 Bg5 Ne4 Bf4 g5
A45	Indian Defence: Gibbins-Weidenhagen Gambit, Maltese Falcon	d4 Nf6 g4 Nxg4 f3 Nf6 e4
A45	Indian Defence: Omega Gambit, Arafat Gambit	d4 Nf6 e4 Nxe4 Bd3 Nf6 Bg5
A45	Trompowsky Attack: Poisoned Pawn Variation	d4 Nf6 Bg5 c5 d5 Qb6 Nc3
A45	Trompowsky Attack: Raptor Variation, Hergert Gambit	d4 Nf6 Bg5 Ne4 h4 Nxg5 hxg5 e5
A45	Indian Defence: Gibbins-Weidenhagen Gambit, Stummer Gambit	d4 Nf6 g4 Nxg4 e4 d6 Be2 Nf6 Nc3
A45	Trompowsky Attack: Edge Variation, Hergert Gambit	d4 Nf6 Bg5 Ne4 Bh4 d5 f3 Nf6 Nc3 Bf5 e4
A45	Trompowsky Attack: Edge Variation, Hergert Gambit	d4 Nf6 Bg5 Ne4 Bh4 c6 Nd2 Qa5 c3 Nxd2 Qxd2 d5 e4
A46	Indian Defence: Knights Variation	d4 Nf6 Nf3
A46	Döry Defence	d4 Nf6 Nf3 Ne4
A46	Indian Defence: Czech-Indian	d4 Nf6 Nf3 c6
A46	Indian Defence: Knights Variation, Alburt-Miles Variation	d4 Nf6 Nf3 a6
A46	Indian Defence: Polish Variation	d4 Nf6 Nf3 b5
A46	Indian Defence: Spielmann-Indian	d4 Nf6 Nf3 c5
A46	Indian Defence: Wade-Tartakower Defence	d4 Nf6 Nf3 d6
A46	Indian Defence: London System	d4 Nf6 Nf3 e6 Bf4
A46	Torre Attack: Classical Defence	d4 Nf6 Nf3 e6 Bg5
A46	Yusupov-Rubinstein System	d4 Nf6 Nf3 e6 e3
A46	Torre Attack: Classical Defence, Nimzowitsch Variation	d4 Nf6 Nf3 e6 Bg5 h6
A46	Queen’s Pawn Game: Veresov Attack, Classical Defence	d4 Nf6 Nf3 e6 Nc3 d5 Bg5
A46	Torre Attack: Wagner Gambit	d4 Nf6 Nf3 e6 Bg5 c5 e4
A46	Torre Attack: Classical Defence, Petrosian Gambit	d4 Nf6 Nf3 e6 Bg5 c5 e3 b6 d5
A46	Queen’s Pawn Game: Torre Attack, Breyer Variation	d4 Nf6 Nf3 e6 Bg5 d5 e3 c5 c3 Qb6
A47	Pseudo Queen’s Indian Defence	d4 Nf6 Nf3 b6
A47	Indian Defence: Schnepper Gambit	d4 Nf6 Nf3 b6 c3 e5
A47	Marienbad System	d4 Nf6 Nf3 b6 g3 Bb7 Bg2 c5
A47	Marienbad System: Berg Variation	d4 Nf6 Nf3 b6 g3 Bb7 Bg2 c5 c4 cxd4 Qxd4
A47	Pseudo Queen’s Indian Defence	d4 Nf6 Nf3 b6 e3 Bb7 Bd3 e6 Nbd2 c5 b3 Be7
A48	East Indian Defence	d4 Nf6 Nf3 g6
A48	London System	d4 Nf6 Nf3 g6 Bf4
A48	Torre Attack: Fianchetto Defence	d4 Nf6 Nf3 g6 Bg5
A48	London System	d4 Nf6 Nf3 g6 Bf4 Bg7 e3
A48	Queen’s Pawn Game: Barry Attack	d4 Nf6 Nf3 g6 Nc3 d5 Bf4
A48	Indian Defence: Colle System, King’s Indian Variation	d4 Nf6 Nf3 g6 e3 Bg7 Bd3 d6
A48	London System	d4 Nf6 Nf3 g6 Bf4 Bg7 e3 d6
A48	Queen’s Pawn Game: Barry Attack	d4 Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7
A48	Torre Attack: Fianchetto Defence, Euwe Variation	d4 Nf6 Nf3 g6 Bg5 Bg7 Nbd2 c5
A48	London System, with Bd3	d4 Nf6 Nf3 g6 Bf4 Bg7 e3 d6 Bd3
A48	London System, with Be2	d4 Nf6 Nf3 g6 Bf4 Bg7 e3 d6 Be2
A48	Queen’s Pawn Game: Barry Attack, Tarzan Attack	d4 Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7 Qd2
A48	London System, with Be2	d4 Nf6 Nf3 g6 Bf4 Bg7 e3 d6 Be2 O-O
A48	Queen’s Pawn Game: Torre Attack, Grünfeld Variation, Main Line	d4 Nf6 Nf3 g6 Bg5 Bg7 Nbd2 d5 e3 O-O
A48	London System, with Be2	d4 Nf6 Nf3 g6 Bf4 Bg7 e3 d6 h3 c5 Be2
A48	Queen’s Pawn Game: Barry Attack, Grünfeld Variation	d4 Nf6 Nf3 g6 Nc3 d5 Bf4 Bg7 e3 O-O Be2
A49	Indian Defence: Przepiorka Variation	d4 Nf6 Nf3 g6 g3
A50	Indian Defence: Normal Variation	d4 Nf6 c4
A50	Indian Defence: Medusa Gambit	d4 Nf6 c4 g5
A50	Indian Defence: Pyrenees Gambit	d4 Nf6 c4 b5
A50	Mexican Defence	d4 Nf6 c4 Nc6
A50	Queen’s Indian Accelerated	d4 Nf6 c4 b6
A50	Slav Indian	d4 Nf6 c4 c6
A50	Mexican Defence: Horsefly Gambit	d4 Nf6 c4 Nc6 d5 Ne5 f4
A51	Indian Defence: Budapest Gambit	d4 Nf6 c4 e5
A51	Indian Defence: Budapest Gambit Accepted	d4 Nf6 c4 e5 dxe5
A51	Indian Defence: Budapest Gambit Accepted, Fajarowicz Defence	d4 Nf6 c4 e5 dxe5 Ne4
A51	Indian Defence: Budapest Gambit Accepted, Fajarowicz Defence, Bonsdorf Variation	d4 Nf6 c4 e5 dxe5 Ne4 a3
A51	Indian Defence: Budapest Gambit Accepted, Fajarowicz Defence, Steiner Variation	d4 Nf6 c4 e5 dxe5 Ne4 Qc2
A52	Indian Defence: Budapest Gambit Accepted, Main Line	d4 Nf6 c4 e5 dxe5 Ng4
A52	Indian Defence: Budapest Gambit Accepted, Main Line, Adler Variation	d4 Nf6 c4 e5 dxe5 Ng4 Nf3
A52	Indian Defence: Budapest Gambit Accepted, Main Line, Alekhine Variation	d4 Nf6 c4 e5 dxe5 Ng4 e4
A52	Indian Defence: Budapest Gambit Accepted, Main Line, Rubinstein Variation	d4 Nf6 c4 e5 dxe5 Ng4 Bf4
A52	Indian Defence: Budapest Gambit Accepted, Main Line, Alekhine Variation, Abonyi Variation	d4 Nf6 c4 e5 dxe5 Ng4 e4 Nxe5
A52	Indian Defence: Budapest Gambit Accepted, Main Line, Alekhine Variation, Tartakower Defence	d4 Nf6 c4 e5 dxe5 Ng4 e4 d6
A53	Old Indian Defence	d4 Nf6 c4 d6
A53	Old Indian Defence: Aged Gibbon Gambit	d4 Nf6 c4 d6 g4
A53	Old Indian Defence: Czech Variation, with Nc3	d4 Nf6 c4 d6 Nc3 c6
A53	Old Indian Defence: Czech Variation, with Nf3	d4 Nf6 c4 d6 Nf3 c6
A53	Old Indian Defence: Janowski Variation	d4 Nf6 c4 d6 Nc3 Bf5
A53	Old Indian Defence: Janowski Variation, Fianchetto Variation	d4 Nf6 c4 d6 Nc3 Bf5 g3
A53	Old Indian Defence: Janowski Variation, Grinberg Gambit	d4 Nf6 c4 d6 Nc3 Bf5 e4
A53	Old Indian Defence: Janowski Variation, Main Line	d4 Nf6 c4 d6 Nc3 Bf5 f3
A54	Old Indian Defence: Tartakower-Indian	d4 Nf6 c4 d6 Nf3 Bg4
A54	Old Indian Defence: Ukrainian Variation	d4 Nf6 c4 d6 Nc3 e5
A54	Old Indian Defence: Two Knights Variation	d4 Nf6 c4 d6 Nc3 e5 Nf3
A54	Old Indian Defence: Duz-Khotimirsky Variation	d4 Nf6 c4 d6 Nc3 e5 e3 Nbd7 Bd3
A55	Old Indian Defence: Normal Variation	d4 Nf6 c4 d6 Nc3 Nbd7 e4 e5 Nf3
A56	Benoni Defence	d4 Nf6 c4 c5
A56	Benoni Defence: Czech Benoni Defence	d4 Nf6 c4 c5 d5 e5
A56	Benoni Defence: Hromádka System	d4 Nf6 c4 c5 d5 d6
A56	Benoni Defence: Weenink Variation	d4 Nf6 c4 c5 dxc5 e6
A56	Vulture Defence	d4 Nf6 c4 c5 d5 Ne4
A56	Benoni Defence: King’s Indian System	d4 Nf6 c4 c5 d5 e5 Nc3 d6 e4 g6
A56	Grünfeld Defence: Three Knights Variation, Burille Variation, Reversed Tarrasch	d4 Nf6 c4 c5 e3 g6 Nc3 Bg7 Nf3 O-O Be2 cxd4 exd4 d5 O-O Nc6
A57	Benko Gambit	d4 Nf6 c4 c5 d5 b5
A57	Benko Gambit Declined: Bishop Attack	d4 Nf6 c4 c5 d5 b5 Bg5
A57	Benko Gambit Declined: Hjørring Countergambit	d4 Nf6 c4 c5 d5 b5 e4
A57	Benko Gambit Declined: Main Line	d4 Nf6 c4 c5 d5 b5 Nf3
A57	Benko Gambit Declined: Pseudo-Sämisch	d4 Nf6 c4 c5 d5 b5 f3
A57	Benko Gambit Declined: Quiet Line	d4 Nf6 c4 c5 d5 b5 Nd2
A57	Benko Gambit Declined: Sosonko Variation	d4 Nf6 c4 c5 d5 b5 a4
A57	Benko Gambit: Mutkin Countergambit	d4 Nf6 c4 c5 d5 b5 g4
A57	Benko Gambit Accepted	d4 Nf6 c4 c5 d5 b5 cxb5 a6
A57	Benko Gambit Accepted: Dlugy Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 f3
A57	Benko Gambit Accepted: Modern Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 e3
A57	Benko Gambit Accepted: Pawn Return Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 b6
A57	Benko Gambit: Zaitsev System	d4 Nf6 c4 c5 d5 b5 cxb5 a6 Nc3
A57	Benko Gambit: Zaitsev Variation, Nescafe Frappe Attack	d4 Nf6 c4 c5 d5 b5 cxb5 a6 Nc3 axb5 e4 b4 Nb5
A57	Benko Gambit: Nescafe Frappe Attack	d4 Nf6 c4 c5 d5 b5 cxb5 a6 Nc3 axb5 e4 b4 Nb5 d6 Bc4
A58	Benko Gambit Accepted: Fully Accepted Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6
A58	Benko Gambit Accepted: Central Storming Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 f4
A58	Benko Gambit: Fianchetto Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 Bxa6 Nc3 d6 Nf3 g6 g3
A58	Benko Gambit: Nd2 Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 Bxa6 Nc3 d6 Nf3 g6 Nd2
A58	Benko Gambit Accepted: Fianchetto Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 g3 d6 Bg2 Bg7 Nf3
A59	Benko Gambit Accepted: Yugoslav	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 Bxa6 Nc3 d6 e4
A59	Benko Gambit	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 e4 Bxf1 Kxf1 d6 g3
A59	Benko Gambit Accepted: Yugoslav	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 e4 Bxf1 Kxf1 d6 Nge2
A59	Benko Gambit Accepted: King Walk Variation	d4 Nf6 c4 c5 d5 b5 cxb5 a6 bxa6 g6 Nc3 Bxa6 Nf3 d6 e4 Bxf1 Kxf1 Bg7 g3 O-O Kg2
A60	Benoni Defence: Modern Variation	d4 Nf6 c4 c5 d5 e6
A60	Benoni Defence: Modern Variation, Snake Variation	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 Bd6
A61	Benoni Defence	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6
A61	Benoni Defence: Fianchetto Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 g3
A61	Benoni Defence: Knight’s Tour Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 Nd2
A61	Benoni Defence: Uhlmann Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg5
A62	Benoni Defence: Fianchetto Variation	d4 Nf6 c4 e6 g3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O
A63	Benoni Defence: Fianchetto Variation, Hastings Defence	d4 Nf6 c4 e6 g3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O O-O Nbd7
A64	Benoni Defence: Fianchetto Variation, Hastings Defence, Main Line	d4 Nf6 c4 e6 g3 c5 d5 exd5 cxd5 d6 Nc3 g6 Bg2 Bg7 Nf3 O-O O-O a6 a4 Nbd7 Nd2 Re8
A65	Benoni Defence: King’s Pawn Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4
A65	Benoni Defence: King’s Pawn Line, with Bg5	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5 c5 d5
A65	Benoni Defence: King’s Pawn Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7
A65	Benoni Defence: King’s Pawn Line, with Be3	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7 Be3
A65	Benoni Defence: King’s Pawn Line, with Bg5	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7 Bg5
A65	Benoni Defence: King’s Pawn Line, with Nge2	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f3 Bg7 Nge2
A65	Benoni Defence: King’s Pawn Line	d4 Nf6 c4 g6 f3 c5 d5 d6 e4 Bg7 Nc3 e6 Be3 O-O Qd2 exd5 cxd5
A65	Benoni Defence: King’s Pawn Line, with Bg5	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5 c5 d5 e6 Qd2 exd5 exd5
A65	Benoni Defence: King’s Pawn Line, with Nge2	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Nge2 c5 d5 e6 Ng3 exd5 cxd5
A66	Benoni Defence: Pawn Storm Variation	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4
A66	Benoni Defence: Mikenas Variation	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 e5
A67	Benoni Defence: Taimanov Variation	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 Bb5+
A68	Benoni Defence: Four Pawns Attack	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 Nf3 O-O
A69	Benoni Defence: Four Pawns Attack, Main Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 f4 Bg7 Nf3 O-O Be2 Re8
A70	Benoni Defence: Classical Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4
A70	Benoni Defence: Classical Variation, New York Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 h3
A70	Benoni Defence: Classical Variation, Traditional Variation	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 Be2
A71	Benoni Defence: Classical Variation, Averbakh-Grivas Attack	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 Bg5
A72	Benoni Defence: Classical Variation	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O
A73	Benoni Defence: Classical Variation, Main Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O
A74	Benoni Defence: Classical Variation, Full Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O a6 a4
A75	Benoni Defence: Classical Variation, Argentine Counterattack	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 Be2 O-O O-O a6 a4 Bg4
A76	Benoni Defence: Classical Variation, Czerniak Defence	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O Re8
A77	Benoni Defence: Classical Variation, Czerniak Defence, Tal Line	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O Re8 Nd2
A78	Benoni Defence: Classical Variation, Czerniak Defence	d4 Nf6 c4 e6 Nf3 c5 d5 exd5 cxd5 d6 Nc3 g6 e4 Bg7 Be2 O-O O-O Re8 Nd2 Na6
A79	Benoni Defence: Classical Variation, Czerniak Defence	d4 Nf6 c4 c5 d5 e6 Nc3 exd5 cxd5 d6 e4 g6 Nf3 Bg7 Be2 O-O O-O Re8 Nd2 Na6 f3
A80	Dutch Defence	d4 f5
A80	Dutch Defence: Alapin Variation	d4 f5 Qd3
A80	Dutch Defence: Hopton Attack	d4 f5 Bg5
A80	Dutch Defence: Korchnoi Attack	d4 f5 h3
A80	Dutch Defence: Krejcik Gambit	d4 f5 g4
A80	Dutch Defence: Raphael Variation	d4 f5 Nc3
A80	Dutch Defence: Hevendehl Gambit	d4 f5 g4 e5
A80	Dutch Defence: Omega-Isis Gambit	d4 f5 Nf3 e5
A80	Queen’s Pawn Game: Veresov Attack, Dutch System	d4 f5 Nc3 d5
A80	Dutch Defence: Barcza Variation	d4 f5 Nf3 Nf6 c3
A80	Dutch Defence: Janzen-Korchnoi Gambit	d4 f5 h3 Nf6 g4
A80	Dutch Defence: Kingfisher Gambit	d4 f5 Nc3 d5 e4
A80	Dutch Defence: Manhattan Gambit, Anti-Classical Line	d4 f5 Qd3 e6 g4
A80	Dutch Defence: Manhattan Gambit, Anti-Leningrad	d4 f5 Qd3 g6 g4
A80	Dutch Defence: Manhattan Gambit, Anti-Modern	d4 f5 Qd3 d6 g4
A80	Dutch Defence: Manhattan Gambit, Anti-Stonewall	d4 f5 Qd3 d5 g4
A80	Dutch Defence: Senechaud Gambit	d4 f5 Bf4 e6 g4
A80	Dutch Defence: Spielmann Gambit	d4 f5 Nc3 Nf6 g4
A80	Dutch Defence: Krejcik Gambit, Tate Gambit	d4 f5 g4 fxg4 e4 d5 Nc3
A81	Dutch Defence: Fianchetto Attack	d4 f5 g3
A81	Dutch Defence: Semi-Leningrad Variation	d4 f5 g3 Nf6 Bg2 g6
A81	Dutch Defence: Blackburne Variation	d4 f5 g3 Nf6 Bg2 e6 Nh3
A81	Dutch Defence: Leningrad Variation, Carlsbad Variation	d4 f5 g3 g6 Bg2 Bg7 Nh3
A81	Dutch Defence: Leningrad, Basman System	d4 f5 g3 c6 Bg2 g6 Nf3 Bg7 O-O Nh6
A82	Dutch Defence: Staunton Gambit	d4 f5 e4
A82	Dutch Defence: Staunton Gambit Accepted	d4 f5 e4 fxe4
A82	Rat Defence: Balogh Defence	e4 d6 d4 f5
A82	Dutch Defence: Staunton Gambit, American Attack	d4 f5 e4 fxe4 Nd2
A82	Dutch Defence: Blackmar’s Second Gambit	d4 f5 e4 fxe4 Nc3 Nf6 f3
A82	Dutch Defence: Staunton Gambit, Tartakower Variation	d4 f5 e4 fxe4 Nc3 Nf6 g4
A83	Dutch Defence: Staunton Gambit	d4 f5 e4 fxe4 Nc3 Nf6 Bg5
A83	Dutch Defence: Staunton Gambit, Chigorin Variation	d4 f5 e4 fxe4 Nc3 Nf6 Bg5 c6
A83	Dutch Defence: Staunton Gambit, Nimzowitsch Variation	d4 f5 e4 fxe4 Nc3 Nf6 Bg5 b6
A83	Dutch Defence: Staunton Gambit, Alekhine Variation	d4 f5 e4 fxe4 Nc3 Nf6 Bg5 g6 h4
A83	Dutch Defence: Staunton Gambit, Lasker Variation	d4 f5 e4 fxe4 Nc3 Nf6 Bg5 g6 f3
A84	Dutch Defence	d4 f5 c4
A84	Dutch Defence: Classical Variation	d4 f5 c4 e6
A84	Dutch Defence: Normal Variation	d4 f5 c4 Nf6
A84	Dutch Defence: Bellon Gambit	d4 f5 c4 e6 e4
A84	Dutch Defence: Rubinstein Variation	d4 f5 c4 e6 Nc3
A84	Dutch Defence: Bladel Variation	d4 f5 c4 g6 Nc3 Nh6
A84	Dutch Defence: Krause Variation	d4 f5 c4 Nf6 Nc3 d6 Nf3 Nc6
A85	Dutch Defence: Queen’s Knight Variation	d4 f5 c4 Nf6 Nc3
A86	Dutch Defence: Fianchetto Variation	d4 f5 c4 Nf6 g3
A86	Dutch Defence: Leningrad Variation	d4 f5 c4 Nf6 g3 g6
A86	Dutch Defence: Hort-Antoshin System	d4 f5 c4 Nf6 g3 d6 Bg2 c6 Nc3 Qc7
A87	Dutch Defence: Leningrad Variation	d4 f5 c4 Nf6 g3 g6 Bg2 Bg7 Nf3
A88	Dutch Defence: Leningrad Variation, Warsaw Variation	d4 f5 g3 Nf6 Bg2 g6 Nf3 Bg7 O-O O-O c4 d6 Nc3 c6
A89	Dutch Defence: Leningrad Variation, Matulovic Variation	d4 f5 g3 Nf6 Bg2 g6 Nf3 Bg7 O-O O-O c4 d6 Nc3 Nc6
A90	Dutch Defence: Classical Variation	d4 f5 c4 Nf6 g3 e6 Bg2
A90	Dutch Defence: Nimzo-Dutch Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Bb4+
A90	Dutch Defence: Classical Variation	d4 f5 c4 Nf6 g3 e6 Bg2 d5 Nf3
A90	Dutch Defence: Nimzo-Dutch Variation, Alekhine Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Bb4+ Bd2 Be7
A90	Dutch Defence: Stonewall Variation, Modern Variation	d4 f5 c4 e6 Nf3 Nf6 g3 c6 Bg2 d5 O-O Bd6
A91	Dutch Defence: Classical Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7
A91	Dutch Defence: Classical Variation, Blackburne Attack	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nh3
A92	Dutch Defence: Classical Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O
A92	Dutch Defence: Alekhine Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O Ne4
A92	Dutch Defence: Stonewall Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5
A92	Dutch Defence: Stonewall Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 Nc3
A93	Dutch Defence: Stonewall Variation, Botvinnik Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 b3
A94	Dutch Defence: Stonewall Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 b3 c6 Ba3
A95	Dutch Defence: Stonewall Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 Nc3 c6
A95	Dutch Defence: Stonewall Variation, Chekhover Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d5 Nc3 c6 Qc2 Qe8 Bg5
A96	Dutch Defence: Classical Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6
A96	Dutch Defence: Classical Variation, Buenos Aires Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 a5
A96	Dutch Defence: Classical Variation, Huisl Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Ne4
A97	Dutch Defence: Classical Variation, Ilyin-Zhenevsky Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Qe8
A97	Dutch Defence: Classical Variation, Ilyin-Zhenevsky Variation, Winter Variation	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Qe8 Re1
A98	Dutch Defence: Classical Variation, Ilyin-Zhenevsky Variation, Alatortsev-Lisitsyn Line	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Qe8 Qc2
A99	Dutch Defence: Classical Variation, Ilyin-Zhenevsky Variation, Modern Main Line	d4 f5 c4 Nf6 g3 e6 Bg2 Be7 Nf3 O-O O-O d6 Nc3 Qe8 b3
B00	King’s Pawn Game	e4
B00	Barnes Defence	e4 f6
B00	Borg Defence	e4 g5
B00	Carr Defence	e4 h6
B00	Duras Gambit	e4 f5
B00	Goldsmith Defence	e4 h5
B00	Hippopotamus Defence	e4 Nh6
B00	Lemming Defence	e4 Na6
B00	Nimzowitsch Defence	e4 Nc6
B00	Owen Defence	e4 b6
B00	Pirc Defence	e4 d6
B00	St. George Defence	e4 a6
B00	Ware Defence	e4 a5
B00	Nimzowitsch Defence	e4 Nc6 d4
B00	Nimzowitsch Defence: Declined Variation	e4 Nc6 Nf3
B00	Nimzowitsch Defence: Pseudo-Spanish Variation	e4 Nc6 Bb5
B00	Nimzowitsch Defence: Wheeler Gambit	e4 Nc6 b4
B00	Pirc Defence	e4 d6 d4
B00	Rat Defence: Harmonist	e4 d6 f4
B00	Rat Defence: Petruccioli Attack	e4 d6 h4
B00	Rat Defence: Spike Attack	e4 d6 g4
B00	Borg Defence: Borg Gambit	e4 g5 d4 Bg7
B00	Borg Defence: Zilbermints Gambit	e4 g5 d4 e5
B00	Carr Defence: Zilbermints Gambit	e4 h6 d4 e5
B00	Fried Fox Defence	e4 f6 d4 Kf7
B00	Goldsmith Defence: Picklepuss Defence	e4 h5 d4 Nf6
B00	Nimzowitsch Defence: Colorado Countergambit	e4 Nc6 Nf3 f5
B00	Nimzowitsch Defence: Franco-Nimzowitsch Variation	e4 Nc6 Nf3 e6
B00	Nimzowitsch Defence: French Connection	e4 Nc6 Nc3 e6
B00	Nimzowitsch Defence: Kennedy Variation	e4 Nc6 d4 e5
B00	Nimzowitsch Defence: Mikenas Variation	e4 Nc6 d4 d6
B00	Nimzowitsch Defence: Neo-Mongoloid Defence	e4 Nc6 d4 f6
B00	Nimzowitsch Defence: Pirc Connection	e4 Nc6 Nc3 g6
B00	Nimzowitsch Defence: Scandinavian Variation	e4 Nc6 d4 d5
B00	Nimzowitsch Defence: Williams Variation	e4 Nc6 Nf3 d6
B00	Nimzowitsch Defence: Woodchuck Variation	e4 Nc6 d4 a6
B00	Owen Defence: Guatemala Defence	e4 b6 d4 Ba6
B00	Pirc Defence	e4 d6 d4 Nf6
B00	Rat Defence: Antal Defence	e4 d6 d4 Nd7
B00	St. George Defence: Zilbermints Gambit	e4 a6 d4 e5
B00	Ware Defence: Snagglepuss Defence	e4 a5 d4 Nc6
B00	Lion Defence: Lion’s Jaw	e4 d6 d4 Nf6 f3
B00	Nimzowitsch Defence: Colorado Countergambit Accepted	e4 Nc6 Nf3 f5 exf5
B00	Nimzowitsch Defence: Hornung Gambit	e4 Nc6 d4 d5 Be3
B00	Nimzowitsch Defence: Kennedy Variation, Linksspringer Variation	e4 Nc6 d4 e5 d5
B00	Nimzowitsch Defence: Scandinavian Variation, Advance Variation	e4 Nc6 d4 d5 e5
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation	e4 Nc6 d4 d5 Nc3
B00	Owen Defence: Naselwaus Gambit	e4 b6 d4 Bb7 Bg5
B00	Owen Defence: Smith Gambit	e4 b6 d4 Bb7 Nf3
B00	Pirc Defence: Roscher Gambit	e4 d6 d4 Nf6 Nf3
B00	Borg Defence: Troon Gambit	e4 g5 d4 h6 h4 g4
B00	Hippopotamus Defence	e4 Nh6 d4 g6 c4 f6
B00	Nimzowitsch Defence: Breyer Variation	e4 Nc6 Nc3 Nf6 d4 e5
B00	Nimzowitsch Defence: El Columpio Defence	e4 Nc6 Nf3 Nf6 e5 Ng4
B00	Nimzowitsch Defence: Kennedy Variation, Bielefelder Gambit	e4 Nc6 d4 e5 dxe5 Bc5
B00	Nimzowitsch Defence: Kennedy Variation, de Smet Gambit	e4 Nc6 d4 e5 dxe5 d6
B00	Nimzowitsch Defence: Kennedy Variation, Hammer Gambit	e4 Nc6 d4 e5 dxe5 f6
B00	Nimzowitsch Defence: Kennedy Variation, Herford Gambit	e4 Nc6 d4 e5 dxe5 Qh4
B00	Nimzowitsch Defence: Scandinavian Variation, Aachen Gambit	e4 Nc6 d4 d5 exd5 Nb4
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation	e4 Nc6 d4 d5 Nc3 dxe4
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Brandics Gambit	e4 Nc6 d4 d5 Nc3 a6
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Erben Gambit	e4 Nc6 d4 d5 Nc3 g6
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Heinola-Deppe Gambit	e4 Nc6 d4 d5 Nc3 e5
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Vehre Variation	e4 Nc6 d4 d5 Nc3 Nf6
B00	Nimzowitsch Defence: Scandinavian Variation, Exchange Variation	e4 Nc6 d4 d5 exd5 Qxd5
B00	Owen Defence: Hekili-Loa Gambit	e4 b6 d4 c5 dxc5 Nc6
B00	Owen Defence: Unicorn Variation	e4 f6 d4 b6 c4 Bb7
B00	Owen Defence: Wind Gambit	e4 b6 d4 Bb7 f3 e5
B00	Rat Defence: Fuller Gambit	e4 d6 f4 d5 exd5 Nf6
B00	Nimzowitsch Defence: Kennedy Variation, Keres Attack	e4 Nc6 d4 e5 dxe5 Nxe5 Nc3
B00	Nimzowitsch Defence: Kennedy Variation, Paulsen Attack	e4 Nc6 d4 e5 dxe5 Nxe5 Nf3
B00	Nimzowitsch Defence: Scandinavian Variation, Exchange Variation, Marshall Gambit	e4 Nc6 d4 d5 exd5 Qxd5 Nc3
B00	Van Geet Opening: Berlin Gambit	e4 Nc6 d4 d5 Nc3 dxe4 d5
B00	Nimzowitsch Defence: Kennedy Variation, Main Line	e4 Nc6 d4 e5 dxe5 Nxe5 f4 Ng6
B00	Nimzowitsch Defence: Kennedy Variation, Riemann Defence	e4 Nc6 d4 e5 dxe5 Nxe5 f4 Nc6
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Nimzowitsch Gambit	e4 Nc6 d4 d5 Nc3 dxe4 d5 Ne5
B00	St. George Defence: Polish Variation	e4 a6 d4 b5 Nf3 Bb7 Bd3 e6
B00	Nimzowitsch Defence: Scandinavian Variation, Bogoljubow Variation, Richter Gambit	e4 Nc6 d4 d5 Nc3 dxe4 d5 Nb8 f3
B00	Owen Defence: Matovinsky Gambit	e4 b6 d4 Bb7 Bd3 f5 exf5 Bxg2 Qh5+ g6
B00	Nimzowitsch Defence: El Columpio Defence, El Columpio Gambit	e4 Nc6 Nf3 Nf6 e5 Ng4 d4 d6 h3 Nh6 e6
B00	Nimzowitsch Defence: El Columpio Defence, Exchange Variation	e4 Nc6 Nf3 Nf6 e5 Ng4 d4 d6 h3 Nh6 exd6
B00	Nimzowitsch Defence: El Columpio Defence, Pin Variation	e4 Nc6 Nf3 Nf6 e5 Ng4 d4 d6 h3 Nh6 Bb5
B00	St. George Defence: San Jorge Variation	e4 a6 d4 b5 Nf3 Bb7 Bd3 d6 O-O g6 c3 Bg7
B01	Scandinavian Defence	e4 d5
B01	Scandinavian Defence	e4 d5 b3
B01	Scandinavian Defence: Zilbermints Gambit	e4 d5 b4
B01	Scandinavian Defence: Blackburne-Kloosterboer Gambit	e4 d5 exd5 c6
B01	Scandinavian Defence: Mieses-Kotroc Variation	e4 d5 exd5 Qxd5
B01	Scandinavian Defence: Modern Variation	e4 d5 exd5 Nf6
B01	Scandinavian Defence: Modern Variation	e4 d5 exd5 Nf6 d4
B01	Scandinavian Defence: Blackburne Gambit	e4 d5 exd5 c6 dxc6 Nxc6
B01	Scandinavian Defence: Boehnke Gambit	e4 d5 exd5 e5 dxe6 Bxe6
B01	Scandinavian Defence: Gubinsky-Melts Defence	e4 d5 exd5 Qxd5 Nc3 Qd6
B01	Scandinavian Defence: Icelandic-Palme Gambit	e4 d5 exd5 Nf6 c4 e6
B01	Scandinavian Defence: Kloosterboer Gambit	e4 d5 exd5 c6 dxc6 e5
B01	Scandinavian Defence: Main Line	e4 d5 exd5 Qxd5 Nc3 Qa5
B01	Scandinavian Defence: Marshall Variation	e4 d5 exd5 Nf6 d4 Nxd5
B01	Scandinavian Defence: Panov Transfer	e4 d5 exd5 Nf6 c4 c6
B01	Scandinavian Defence: Portuguese Gambit	e4 d5 exd5 Nf6 d4 Bg4
B01	Scandinavian Defence: Richter Variation	e4 d5 exd5 Nf6 d4 g6
B01	Scandinavian Defence: Valencian Variation	e4 d5 exd5 Qxd5 Nc3 Qd8
B01	Van Geet Opening: Grünfeld Defence	e4 d5 Nc3 dxe4 Nxe4 e5
B01	Scandinavian Defence: Main Line, Leonhardt Gambit	e4 d5 exd5 Qxd5 Nc3 Qa5 b4
B01	Scandinavian Defence: Portuguese Gambit, Classical Variation	e4 d5 exd5 Nf6 d4 Bg4 Nf3
B01	Scandinavian Defence: Portuguese Gambit, Wuss Variation	e4 d5 exd5 Nf6 d4 Bg4 Be2
B01	Scandinavian Defence: Anderssen Counterattack	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5
B01	Scandinavian Defence: Kádas Gambit	e4 d5 exd5 Nf6 d4 c6 dxc6 e5
B01	Scandinavian Defence: Kiel Variation	e4 d5 exd5 Nf6 d4 Nxd5 c4 Nb4
B01	Scandinavian Defence: Main Line, Mieses Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6
B01	Scandinavian Defence: Modern Variation, Gipslis Variation	e4 d5 exd5 Nf6 d4 Nxd5 Nf3 Bg4
B01	Scandinavian Defence: Modern Variation, Wing Gambit	e4 d5 exd5 Nf6 d4 g6 c4 b5
B01	Scandinavian Defence: Portuguese Gambit, Elbow Variation	e4 d5 exd5 Nf6 d4 Bg4 Bb5+ c6
B01	Scandinavian Defence: Richter Variation	e4 d5 exd5 Nf6 d4 Nxd5 Nf3 g6
B01	Scandinavian Defence: Schiller-Pytel Variation	e4 d5 exd5 Qxd5 Nc3 Qd6 d4 c6
B01	Scandinavian Defence: Anderssen Counterattack, Goteborg System	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5 Nf3
B01	Scandinavian Defence: Portuguese Gambit, Banker Variation	e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 c4
B01	Scandinavian Defence: Portuguese Gambit, Correspondence Refutation	e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 g4
B01	Scandinavian Defence: Portuguese Gambit, Lusophobe Variation	e4 d5 exd5 Nf6 d4 Bg4 Bb5+ Nbd7 Be2
B01	Scandinavian Defence: Anderssen Counterattack, Collijn Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5 Nf3 Bg4
B01	Scandinavian Defence: Bronstein Variation	e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Nf3 a6
B01	Scandinavian Defence: Classical Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bf5
B01	Scandinavian Defence: Valencian Variation, Ilundain Variation	e4 d5 exd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 c6
B01	Scandinavian Defence: Valencian Variation, Main Line	e4 d5 exd5 Qxd5 Nc3 Qd8 d4 Nf6 Nf3 Bg4
B01	Scandinavian Defence: Lasker Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bg4 h3
B01	Scandinavian Defence: Portuguese Gambit, Jadoul Variation	e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 Bb5+ Nbd7 c4
B01	Scandinavian Defence: Portuguese Gambit, Melbourne Shuffle Variation	e4 d5 exd5 Nf6 d4 Bg4 f3 Bf5 Bb5+ Nbd7 Nc3
B01	Scandinavian Defence: Anderssen Counterattack, Orthodox Attack	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 e5 dxe5 Nc6 Nf3 Bb4 Bd2
B01	Scandinavian Defence: Grünfeld Variation	e4 d5 exd5 Qxd5 Nc3 Qa5 d4 Nf6 Nf3 Bf5 Ne5 c6 g4
B01	Scandinavian Defence: Schiller-Pytel Variation, Modern Variation	e4 d5 exd5 Qxd5 Nc3 Qd6 d4 Nf6 Bc4 c6 Nge2 Bf5 Bf4 Qb4
B02	Alekhine Defence	e4 Nf6
B02	Alekhine Defence: Krejcik Variation	e4 Nf6 Bc4
B02	Alekhine Defence: Maróczy Variation	e4 Nf6 d3
B02	Alekhine Defence: Brooklyn Variation	e4 Nf6 e5 Ng8
B02	Alekhine Defence: Mokele Mbembe	e4 Nf6 e5 Ne4
B02	Alekhine Defence: Normal Variation	e4 Nf6 e5 Nd5
B02	Alekhine Defence: Scandinavian Variation	e4 Nf6 Nc3 d5
B02	Alekhine Defence: Buckley Attack	e4 Nf6 e5 Nd5 Na3
B02	Alekhine Defence: Krejcik Variation, Krejcik Gambit	e4 Nf6 Bc4 Nxe4 Bxf7+
B02	Alekhine Defence: Sämisch Attack	e4 Nf6 e5 Nd5 Nc3
B02	Alekhine Defence: Two Pawns Attack	e4 Nf6 e5 Nd5 c4
B02	Alekhine Defence: Welling Variation	e4 Nf6 e5 Nd5 b3
B02	Alekhine Defence: Brooklyn Variation, Everglades Variation	e4 Nf6 e5 Ng8 d4 f5
B02	Alekhine Defence: Mokele Mbembe, Modern Line	e4 Nf6 e5 Ne4 d4 f6
B02	Alekhine Defence: Mokele Mbembe, Vavra Defence	e4 Nf6 e5 Ne4 d4 e6
B02	Alekhine Defence: Scandinavian Variation, Geschev Gambit	e4 Nf6 Nc3 d5 exd5 c6
B02	Alekhine Defence: The Squirrel	e4 Nf6 e5 Nd5 c4 Nf4
B02	Alekhine Defence: Scandinavian Variation, Myers Gambit	e4 Nf6 Nc3 d5 d3 dxe4 Bg5
B02	Alekhine Defence: Spielmann Gambit	e4 Nf6 Nc3 d5 e5 Nfd7 e6
B02	Alekhine Defence: Steiner Variation	e4 Nf6 e5 Nd5 c4 Nb6 b3
B02	Alekhine Defence: Two Pawns Attack, Lasker Variation	e4 Nf6 e5 Nd5 c4 Nb6 c5
B02	Alekhine Defence: Two Pawns Attack, Tate Variation	e4 Nf6 e5 Nd5 c4 Nb6 a4
B02	Alekhine Defence: Kmoch Variation	e4 Nf6 e5 Nd5 Bc4 Nb6 Bb3 c5 d3
B02	Alekhine Defence: Hunt Variation, Lasker Simul Gambit	e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Bc4 e6 Nc3
B02	Alekhine Defence: Two Pawns Attack, Mikenas Variation	e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Bc4 e6 Nc3 d6
B02	Alekhine Defence: Hunt Variation, Matsukevich Gambit	e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Nc3 Nxc3 dxc3 d6 Bg5
B02	Alekhine Defence: Hunt Variation, Mikenas Gambit	e4 Nf6 e5 Nd5 c4 Nb6 c5 Nd5 Bc4 e6 Nc3 d6 Nxd5 exd5 Bxd5
B03	Alekhine Defence	e4 Nf6 e5 Nd5 d4
B03	Alekhine Defence	e4 Nf6 e5 Nd5 d4 d6
B03	Alekhine Defence: O’Sullivan Gambit	e4 Nf6 e5 Nd5 d4 b5
B03	Alekhine Defence	e4 Nf6 e5 Nd5 d4 d6 c4
B03	Alekhine Defence: Balogh Variation	e4 Nf6 e5 Nd5 d4 d6 Bc4
B03	Alekhine Defence: Exchange Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6
B03	Alekhine Defence: Four Pawns Attack	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4
B03	Alekhine Defence: Hunt Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 c5
B03	Alekhine Defence: Four Pawns Attack, Cambridge Gambit	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 g5
B03	Alekhine Defence: Four Pawns Attack, Fianchetto Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 g6
B03	Alekhine Defence: Four Pawns Attack, Trifunovic Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 Bf5
B03	Alekhine Defence: Modern Variation, Alekhine Gambit	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 Nf3 Bg4 Be2
B03	Alekhine Defence: Four Pawns Attack, Main Line	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3
B03	Alekhine Defence: Exchange Variation, Voronezh Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 Be3 Bg7 Rc1 O-O b3
B03	Alekhine Defence: Four Pawns Attack, Ilyin-Zhenevsky Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Nf3 Bg4 e6 fxe6 c5
B03	Alekhine Defence: Four Pawns Attack, Korchnoi Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Bf5 Nc3 e6 Nf3 Be7 Be2 O-O O-O f6
B03	Alekhine Defence: Exchange Variation, Karpov Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 exd6 cxd6 Nc3 g6 h3 Bg7 Nf3 O-O Be2 Nc6 O-O Bf5 Bf4
B03	Alekhine Defence: Four Pawns Attack, Tartakower Variation	e4 Nf6 e5 Nd5 d4 d6 c4 Nb6 f4 dxe5 fxe5 Nc6 Be3 Bf5 Nc3 e6 Nf3 Qd7 Be2 O-O-O O-O Be7
B04	Alekhine Defence: Modern Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3
B04	Alekhine Defence: Modern Variation, Alburt Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 g6
B04	Alekhine Defence: Modern Variation, Larsen Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 dxe5
B04	Alekhine Defence: Modern Variation, Larsen-Haakert Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 Nc6
B04	Alekhine Defence: Modern Variation, Schmid Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 Nb6
B04	Alekhine Defence: Modern Variation, Keres Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 g6 Bc4 Nb6 Bb3 Bg7 a4
B05	Alekhine Defence: Modern Variation, Main Line	e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4
B05	Alekhine Defence: Modern Variation, Alekhine Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 c4
B05	Alekhine Defence: Modern Variation, Panov Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 h3
B05	Alekhine Defence: Modern Variation, Flohr Variation	e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 Be2 c6
B05	Alekhine Defence: Modern Variation, Vitolins Attack	e4 Nf6 e5 Nd5 d4 d6 Nf3 Bg4 c4 Nb6 d5
B06	Modern Defence	e4 g6
B06	Modern Defence	e4 g6 d4 Bg7
B06	Modern Defence: Fianchetto Gambit	e4 g6 d4 f5
B06	Modern Defence: Norwegian Defence	e4 g6 d4 Nf6
B06	Modern Defence: Bishop Attack	e4 g6 d4 Bg7 Bc4
B06	Modern Defence: Standard Line	e4 g6 d4 Bg7 Nc3
B06	Modern Defence: Three Pawns Attack	e4 g6 d4 Bg7 f4
B06	Modern Defence: Westermann Gambit	e4 g6 d4 Bg7 Bd2
B06	Modern Defence: Wind Gambit	e4 g6 d4 Bg7 Bd3
B06	Modern Defence: Bishop Attack, Bücker Gambit	e4 g6 d4 Bg7 Bc4 b5
B06	Modern Defence: Lizard Defence, Mittenberger Gambit	e4 g6 d4 Bg7 Nc3 d5
B06	Modern Defence: Modern Pterodactyl	e4 g6 d4 Bg7 Nc3 c5
B06	Modern Defence: Mongredien Defence, with Nc3	e4 g6 d4 Bg7 Nc3 b6
B06	Modern Defence: Mongredien Defence, with Nf3	e4 g6 d4 Bg7 Nf3 b6
B06	Modern Defence: Standard Defence	e4 g6 d4 Bg7 Nc3 d6
B06	Rat Defence: Accelerated Gurgenidze	e4 g6 d4 d6 Nc3 c6
B06	Modern Defence: Pseudo-Austrian Attack	e4 g6 d4 Bg7 Nc3 d6 f4
B06	Modern Defence: Two Knights Variation	e4 g6 d4 Bg7 Nc3 d6 Nf3
B06	Pterodactyl Defence: Eastern, Anhanguera	e4 g6 d4 Bg7 Nc3 c5 Be3
B06	Pterodactyl Defence: Eastern, Benoni	d4 g6 e4 Bg7 Nc3 c5 d5
B06	Modern Defence: Bishop Attack, Monkey’s Bum	e4 g6 Bc4 Bg7 Qf3 e6 d4 Bxd4
B06	Modern Defence: Norwegian Defence, Norwegian Gambit	e4 g6 d4 Nf6 e5 Nh5 Be2 d6
B06	Modern Defence: Two Knights Variation, Suttles Variation	e4 g6 d4 Bg7 Nc3 c6 Nf3 d6
B06	Pterodactyl Defence: Austrian, Austriadactylus Western	e4 g6 d4 Bg7 f4 c5 Nf3 Qa5+
B06	Pterodactyl Defence: Austrian, Grand Prix Pterodactyl	e4 g6 Nc3 Bg7 f4 c5 Nf3 Qa5
B06	Pterodactyl Defence: Austrian, Pteranodon	e4 g6 d4 Bg7 f4 c5 c3 Qa5
B06	Pterodactyl Defence: Eastern, Benoni Pterodactyl	d4 g6 Nc3 Bg7 e4 c5 d5 Qa5
B06	Pterodactyl Defence: Eastern, Rhamphorhynchus	e4 g6 d4 Bg7 Nc3 c5 dxc5 Qa5
B06	Pterodactyl Defence: Fianchetto, King Pterodactyl	e4 g6 d4 Bg7 g3 c5 Nf3 Qa5+
B06	Pterodactyl Defence: Fianchetto, Rhamphorhynchus	e4 g6 d4 Bg7 g3 c5 dxc5 Qa5+
B06	Pterodactyl Defence: Western, Anhanguera	e4 g6 d4 Bg7 Nf3 c5 Be3 Qa5+
B06	Modern Defence: Anti-Modern	e4 g6 d4 Bg7 Nc3 c6 Bc4 d6 Qe2
B06	Pterodactyl Defence: Sicilian, Siroccopteryx	e4 g6 d4 Bg7 Nc3 c5 Nf3 Qa5 Bc4
B06	Modern Defence: Dunworthy Variation	e4 g6 d4 Bg7 c4 d5 exd5 c6 dxc6 Bxd4
B06	Modern Defence: Gurgenidze Defence	e4 g6 d4 Bg7 Nc3 c6 f4 d5 e5 h5
B06	Modern Defence: Masur Gambit	e4 g6 d4 Nh6 Nc3 f5 Bxh6 Bxh6 exf5 O-O
B06	Modern Defence: Semi-Averbakh Variation, Pterodactyl Variation Declined	e4 g6 d4 Bg7 c4 c5 Nf3 d6 Be2 Qa5+
B06	Pterodactyl Defence: Central, Anhanguera	e4 g6 d4 Bg7 c4 c5 Nc3 d6 Be3 Qa5
B06	Pterodactyl Defence: Central, Benoni Quetzalcoatlus	e4 g6 d4 Bg7 c4 c5 d5 d6 Nc3 Qa5
B06	Pterodactyl Defence: Central, Quetzalcoatlus Gambit	e4 g6 d4 Bg7 c4 c5 Nc3 d6 dxc5 Qa5
B06	Pterodactyl Defence: Eastern, Benoni Pteranodon	e4 g6 d4 Bg7 Nc3 c5 d5 Bxc3+ bxc3 Qa5
B06	Pterodactyl Defence: Eastern, Pteranodon	e4 g6 d4 Bg7 Nc3 c5 dxc5 Bxc3+ bxc3 Qa5
B06	Pterodactyl Defence: Sicilian, Quetzalcoatlus	e4 g6 d4 Bg7 Nc3 c5 Nf3 Qa5 Be2 d6
B06	Pterodactyl Defence: Western, Siroccopteryx	e4 g6 Nf3 Bg7 d4 c5 Bc4 cxd4 Nxd4 Qa5+
B06	Modern Defence: Two Knights Variation, Suttles Variation, Tal Gambit	e4 g6 d4 Bg7 Nc3 d6 Nf3 c6 Bg5 Qb6 Qd2 Qxb2
B07	King’s Pawn Game: Maróczy Defence	e4 d6 d4 e5
B07	Czech Defence	e4 d6 d4 Nf6 Nc3 c6
B07	Lion Defence	e4 d6 d4 Nf6 Nc3 Nbd7
B07	Pirc Defence	e4 d6 d4 Nf6 Nc3 g6
B07	Lion Defence: Anti-Philidor	e4 d6 d4 Nf6 Nc3 Nbd7 f4
B07	Lion Defence: Bayonet Attack	e4 d6 d4 Nf6 Nc3 Nbd7 g4
B07	Modern Defence: Geller’s System	e4 g6 d4 Bg7 Nf3 d6 c3
B07	Pirc Defence: Byrne Variation	e4 d6 d4 Nf6 Nc3 g6 Bg5
B07	Pirc Defence: Kholmov System	e4 d6 d4 Nf6 Nc3 g6 Bc4
B07	Pirc Defence: Sveshnikov System	e4 d6 d4 Nf6 Nc3 g6 g3
B07	Lion Defence: Anti-Philidor, Lion’s Cave	e4 d6 d4 Nf6 Nc3 Nbd7 f4 e5
B07	Pirc Defence: 150 Attack	e4 d6 d4 Nf6 Nc3 g6 Be3 c6 Qd2
B07	Pirc Defence: 150 Attack, Sveshnikov-Jansa Attack	e4 d6 d4 Nf6 Nc3 g6 Be3 c6 h3
B07	Pirc Defence: Bayonet Attack	e4 d6 d4 Nf6 Nc3 g6 Be2 Bg7 h4
B07	Pirc Defence: Chinese Variation	e4 d6 d4 Nf6 Nc3 g6 Be2 Bg7 g4
B07	Pirc Defence: 150 Attack, Inner Doll Defence	e4 d6 d4 Nf6 Nc3 g6 Be3 c6 Qd2 Bg4
B07	Lion Defence: Anti-Philidor, Lion’s Cave, Lion Claw Gambit	e4 d6 d4 Nf6 Nc3 Nbd7 f4 e5 Nf3 exd4 Qxd4 c6 Bc4 d5
B08	Pirc Defence: Classical Variation	e4 d6 d4 Nf6 Nc3 g6 Nf3
B08	Pirc Defence: Classical Variation	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7
B08	Pirc Defence: Classical Variation, Quiet System	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2
B08	Pirc Defence: Classical Variation, Schlechter Variation	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 h3
B08	Pirc Defence: Classical Variation, Quiet System, Chigorin Line	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O Nc6
B08	Pirc Defence: Classical Variation, Quiet System, Czech Defence	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O c6
B08	Pirc Defence: Classical Variation, Quiet System, Parma Defence	e4 d6 d4 Nf6 Nc3 g6 Nf3 Bg7 Be2 O-O O-O Bg4
B09	Pirc Defence: Austrian Attack	e4 d6 d4 Nf6 Nc3 g6 f4
B09	Pirc Defence: Austrian Attack, Ljubojevic Variation	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Bc4
B09	Pirc Defence: Austrian Attack	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O
B09	Pirc Defence: Austrian Attack, Dragon Formation	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 c5
B09	Pirc Defence: Austrian Attack, Kurajica Variation	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O Be3
B09	Pirc Defence: Austrian Attack, Unzicker Attack	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O e5
B09	Pirc Defence: Austrian Attack, Weiss Variation	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O Bd3
B09	Pirc Defence: Austrian Attack, Unzicker Attack, Bronstein Variation	e4 d6 d4 Nf6 Nc3 g6 f4 Bg7 Nf3 O-O e5 Nfd7 h4
B10	Caro-Kann Defence	e4 c6
B10	Caro-Kann Defence	e4 c6 Nc3
B10	Caro-Kann Defence: Accelerated Panov Attack	e4 c6 c4
B10	Caro-Kann Defence: Breyer Variation	e4 c6 d3
B10	Caro-Kann Defence: Euwe Attack	e4 c6 b3
B10	Caro-Kann Defence: Hillbilly Attack	e4 c6 Bc4
B10	Caro-Kann Defence: Labahn Attack	e4 c6 b4
B10	Caro-Kann Defence: Spike Variation	e4 c6 g4
B10	Caro-Kann Defence	e4 c6 Nc3 d5
B10	Caro-Kann Defence: Accelerated Panov Attack	e4 c6 c4 d5
B10	Caro-Kann Defence: Accelerated Panov Attack, Open Variation	e4 c6 c4 e5
B10	Caro-Kann Defence: Endgame Offer	e4 c6 Nf3 d5 d3
B10	Caro-Kann Defence: Goldman Variation	e4 c6 Nc3 d5 Qf3
B10	Caro-Kann Defence: Labahn Attack, Double Gambit	e4 c6 b4 d5 b5
B10	Caro-Kann Defence: Labahn Attack, Polish Variation	e4 c6 b4 e5 Bb2
B10	Caro-Kann Defence: St. Patrick’s Attack	e4 c6 Nc3 d5 h3
B10	Caro-Kann Defence: Toikkanen Gambit	e4 c6 c4 d5 e5
B10	Caro-Kann Defence: Two Knights Attack	e4 c6 Nc3 d5 Nf3
B10	Caro-Kann Defence: Accelerated Panov Attack, Pseudo-Scandinavian	e4 c6 c4 d5 exd5 Qxd5
B10	Caro-Kann Defence: Accelerated Panov Attack, Van Weersel Attack	e4 c6 c4 d5 cxd5 cxd5 Qb3
B10	Caro-Kann Defence: Apocalypse Attack	e4 c6 Nf3 d5 exd5 cxd5 Ne5
B10	Caro-Kann Defence: Dinic Gambit	e4 c6 Nf3 d5 d3 dxe4 Ng5
B10	Caro-Kann Defence: Hector Gambit	e4 c6 Nc3 d5 Nf3 dxe4 Ng5
B10	Caro-Kann Defence: Hillbilly Attack, Schaeffer Gambit	e4 c6 Bc4 d5 Bb3 dxe4 Qh5
B10	Caro-Kann Defence: Scorpion-Horus Gambit	e4 c6 Nc3 d5 d3 dxe4 Bg5
B10	Caro-Kann Defence: Spike Variation, Scorpion-Grob Gambit	e4 c6 g4 d5 Nc3 dxe4 d3
B10	Caro-Kann Defence: Accelerated Panov Attack, Modern Variation	e4 c6 c4 d5 exd5 cxd5 cxd5 Nf6
B10	Caro-Kann Defence: Endgame Variation	e4 c6 Nf3 d5 d3 dxe4 dxe4 Qxd1+ Kxd1
B10	Caro-Kann Defence: Breyer Variation, Stein Attack	e4 c6 d3 d5 Nd2 g6 Ngf3 Bg7 g3 e5 Bg2 Ne7 O-O O-O b4
B11	Caro-Kann Defence: Two Knights Attack, Mindeno Variation	e4 c6 Nc3 d5 Nf3 Bg4
B11	Caro-Kann Defence: Two Knights Attack, Mindeno Variation, Exchange Line	e4 c6 Nc3 d5 Nf3 Bg4 h3 Bxf3
B11	Caro-Kann Defence: Two Knights Attack, Mindeno Variation, Retreat Line	e4 c6 Nc3 d5 Nf3 Bg4 h3 Bh5
B12	Caro-Kann Defence	e4 c6 d4
B12	Caro-Kann Defence	e4 c6 d4 d5
B12	Caro-Kann Defence: De Bruycker Defence	e4 c6 d4 Na6
B12	Caro-Kann Defence: Masi Variation	e4 c6 d4 Nf6
B12	Caro-Kann Defence: Massachusetts Defence	e4 c6 d4 f5
B12	Caro-Kann Defence: Advance Variation	e4 c6 d4 d5 e5
B12	Caro-Kann Defence: Maróczy Variation	e4 c6 d4 d5 f3
B12	Caro-Kann Defence: Mieses Gambit	e4 c6 d4 d5 Be3
B12	Caro-Kann Defence: Modern Variation	e4 c6 d4 d5 Nd2
B12	Caro-Kann Defence: Advance Variation, Botvinnik-Carls Defence	e4 c6 d4 d5 e5 c5
B12	Caro-Kann Defence: De Bruycker Defence	e4 c6 d4 Na6 Nc3 Nc7
B12	Caro-Kann Defence: Edinburgh Variation	e4 c6 d4 d5 Nd2 Qb6
B12	Caro-Kann Defence: Advance Variation, Bayonet Attack	e4 c6 d4 d5 e5 Bf5 g4
B12	Caro-Kann Defence: Advance Variation, Bronstein Variation	e4 c6 d4 d5 e5 Bf5 Ne2
B12	Caro-Kann Defence: Advance Variation, Prins Attack	e4 c6 d4 d5 e5 Bf5 b4
B12	Caro-Kann Defence: Advance Variation, Short Variation	e4 c6 d4 d5 e5 Bf5 Nf3
B12	Caro-Kann Defence: Advance Variation, Tal Variation	e4 c6 d4 d5 e5 Bf5 h4
B12	Caro-Kann Defence: Advance Variation, Van der Wiel Attack	e4 c6 d4 d5 e5 Bf5 Nc3
B12	Caro-Kann Defence: Ulysses Gambit	e4 c6 d4 d5 Nf3 dxe4 Ng5
B12	Caro-Kann Defence: Advance Variation, Van der Wiel Attack, Dreyev Defence	e4 c6 d4 d5 e5 Bf5 Nc3 Qb6
B12	Caro-Kann Defence: Advance, Short Variation	e4 c6 d4 d5 e5 Bf5 c3 e6 Be2
B12	Caro-Kann Defence: Mieses Attack, Landau Gambit	e4 c6 d4 d5 Bd3 Nf6 e5 Nfd7 e6
B12	Caro-Kann Defence: Maróczy Variation, Maróczy Gambit	e4 c6 d4 d5 f3 dxe4 fxe4 e5 Nf3 exd4 Bc4
B12	Caro-Kann Defence: Advance Variation, Van der Wiel Attack	e4 c6 d4 d5 e5 Bf5 Nc3 e6 g4 Bg6 Nge2 c5 h4
B13	Caro-Kann Defence: Exchange Variation	e4 c6 d4 d5 exd5
B13	Caro-Kann Defence: Exchange Variation	e4 c6 d4 d5 exd5 cxd5
B13	Caro-Kann Defence: Exchange Variation	e4 c6 d4 d5 exd5 cxd5 Bf4
B13	Caro-Kann Defence: Exchange Variation, Bulla Attack	e4 c6 d4 d5 exd5 cxd5 g4
B13	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4
B13	Caro-Kann Defence: Exchange Variation	e4 c6 d4 d5 exd5 cxd5 Nf3 Nc6
B13	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3
B13	Caro-Kann Defence: Panov Attack, Gunderam Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 c5
B13	Caro-Kann Defence: Panov Attack, Modern Defence	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6
B13	Caro-Kann Defence: Exchange Variation, Rubinstein Variation	e4 c6 d4 d5 exd5 cxd5 Bd3 Nc6 c3 Nf6 Bf4
B13	Caro-Kann Defence: Panov Attack, Modern Defence, Carlsbad Line	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 e6
B13	Caro-Kann Defence: Panov Attack, Modern Defence, Czerniak Line	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 Qa5
B13	Caro-Kann Defence: Panov Attack, Modern Defence, Mieses Line	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Nf3 Bg4
B13	Caro-Kann Defence: Panov Attack, Modern Defence, Reifir-Spielmann Line	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 Qb6
B13	Caro-Kann Defence: Panov-Botvinnik, Herzog Defence	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Bg5 dxc4 d5 Na5
B14	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6
B14	Caro-Kann Defence: Panov Attack, Fianchetto Defence	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 g6
B14	Caro-Kann Defence: Panov Attack, Fianchetto Defence, Fianchetto Gambit	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 g6 cxd5 Bg7
B14	Caro-Kann Defence: Panov Attack, Main Line	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 e6 Nf3 Bb4
B14	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nf6 Nc3 Nc6 Nf3 e6 c5
B14	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nc6 Nc3 Nf6 Nf3 e6 cxd5 exd5 Bb5 Bg4
B14	Caro-Kann Defence: Panov Attack	e4 c6 d4 d5 exd5 cxd5 c4 Nc6 Nc3 Nf6 Nf3 e6 cxd5 exd5 Bb5 Bd6 Bg5 O-O O-O
B15	Caro-Kann Defence	e4 c6 d4 d5 Nc3
B15	Caro-Kann Defence	e4 c6 d4 d5 Nc3 dxe4
B15	Caro-Kann Defence: Campomanes Attack	e4 c6 d4 d5 Nc3 Nf6
B15	Caro-Kann Defence: Gurgenidze Counterattack	e4 c6 d4 d5 Nc3 b5
B15	Caro-Kann Defence: Gurgenidze System	e4 c6 d4 d5 Nc3 g6
B15	Caro-Kann Defence: Main Line	e4 c6 d4 d5 Nd2 dxe4 Nxe4
B15	Caro-Kann Defence: Rasa-Studier Gambit	e4 c6 d4 d5 Nc3 dxe4 f3
B15	Caro-Kann Defence: von Hennig Gambit	e4 c6 d4 d5 Nc3 dxe4 Bc4
B15	Caro-Kann Defence: Alekhine Gambit	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Bd3
B15	Caro-Kann Defence: Tartakower Variation	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6
B15	Caro-Kann Defence: Alien Gambit	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Ng5 h6 Nxf7
B15	Caro-Kann Defence: Forgacs Variation	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6 Bc4
B15	Caro-Kann Defence: Tartakower Variation, Perlis Line	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ exf6 c3 Bd6 Bd3 O-O Qc2 h6
B16	Caro-Kann Defence: Finnish Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 h6
B16	Caro-Kann Defence: Bronstein-Larsen Variation	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Nxf6+ gxf6
B17	Caro-Kann Defence: Karpov Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7
B17	Caro-Kann Defence: Karpov Variation, Modern Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Ng5
B17	Caro-Kann Defence: Karpov Variation, Modern Variation, Ivanchuk Defence	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Ng5 Ndf6
B17	Caro-Kann Defence: Karpov Variation, Modern Variation, Kasparov Attack	e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Ng3
B17	Caro-Kann Defence: Karpov Variation, Tiviakov-Fischer Attack	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Bc4 Ngf6 Nxf6+ Nxf6
B17	Caro-Kann Defence: Karpov Variation, Smyslov Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Bc4 Ngf6 Ng5 e6 Qe2 Nb6
B17	Caro-Kann Defence: Karpov Variation, Smyslov Variation, Main Line	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Bc4 Ngf6 Ng5 e6 Qe2 Nb6 Bb3
B17	Caro-Kann Defence: Karpov Variation, Modern Main Line	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Ng5 Ngf6 Bd3 e6 N1f3 Bd6 Qe2 h6 Ne4 Nxe4 Qxe4
B18	Caro-Kann Defence: Classical Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5
B18	Caro-Kann Defence: Classical Variation, Flohr Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 Nh3
B18	Caro-Kann Defence: Classical Variation, Main Line	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4
B18	Caro-Kann Defence: Classical Variation, Maróczy Attack	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 f4
B18	Caro-Kann Defence: Martian Gambit	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng5 Bg6 N1f3 h6 Ne6
B19	Caro-Kann Defence: Classical Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7
B19	Caro-Kann Defence: Classical Variation, Spassky Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5
B19	Caro-Kann Defence: Classical Variation, Lobron System	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 e6 Bd2 Ngf6 O-O-O Be7
B19	Caro-Kann Defence: Classical Variation, Seirawan Variation	e4 c6 d4 d5 Nd2 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7 Bd3 Bxd3 Qxd3 Ngf6 Bd2 e6 O-O-O Bd6
B20	Sicilian Defence	e4 c5
B20	Sicilian Defence: Amazon Attack	e4 c5 Qg4
B20	Sicilian Defence: Bowdler Attack	e4 c5 Bc4
B20	Sicilian Defence: Brick Variation	e4 c5 Nh3
B20	Sicilian Defence: Czerniak Attack	e4 c5 b3
B20	Sicilian Defence: Grob Variation	e4 c5 g4
B20	Sicilian Defence: Keres Variation	e4 c5 Ne2
B20	Sicilian Defence: King David’s Opening	e4 c5 Ke2
B20	Sicilian Defence: Kronberger Variation	e4 c5 Na3
B20	Sicilian Defence: Lasker-Dunne Attack	e4 c5 g3
B20	Sicilian Defence: Mengarini Variation	e4 c5 a3
B20	Sicilian Defence: Myers Attack, with a4	e4 c5 a4
B20	Sicilian Defence: Myers Attack, with h4	e4 c5 h4
B20	Sicilian Defence: Staunton-Cochrane Variation	e4 c5 c4
B20	Sicilian Defence: Wing Gambit	e4 c5 b4
B20	Sicilian Defence: Czerniak Attack, Queen Fianchetto Variation	e4 c5 b3 b6
B20	Sicilian Defence: Euwe Attack, Prins Gambit	e4 c5 b3 d5 Bb2
B20	Sicilian Defence: Wing Gambit, Abrahams Variation	e4 c5 b4 cxb4 Bb2
B20	Sicilian Defence: Wing Gambit, Marshall Variation	e4 c5 b4 cxb4 a3
B20	Sicilian Defence: Wing Gambit, Santasiere Variation	e4 c5 b4 cxb4 c4
B20	Sicilian Defence: Wing Gambit, Carlsbad Variation	e4 c5 b4 cxb4 a3 bxa3
B20	Sicilian Defence: Big Clamp Formation	e4 c5 d3 Nc6 c3 d6 f4
B20	Sicilian Defence: Kronberger Variation, Nemeth Gambit	e4 c5 Na3 Nc6 d4 cxd4 Bc4
B20	Sicilian Defence: Gloria Variation	e4 c5 c4 d6 Nc3 Nc6 g3 h5
B20	Sicilian Defence: Wing Gambit, Marienbad Variation	e4 c5 b4 cxb4 a3 d5 exd5 Qxd5 Bb2
B20	Sicilian Defence: Wing Gambit, Nanu Gambit	e4 c5 b4 cxb4 a3 d5 exd5 Qxd5 Nf3 e5 c4 Qe6 Bd3
B20	Sicilian Defence: Wing Gambit, Romanian Defence	e4 c5 b4 cxb4 a3 d5 exd5 Qxd5 Nf3 e5 Bb2 Nc6 c4 Qe6
B21	Sicilian Defence: McDonnell Attack	e4 c5 f4
B21	Sicilian Defence: Smith-Morra Gambit	e4 c5 d4
B21	Sicilian Defence: Halasz Gambit	e4 c5 d4 cxd4 f4
B21	Sicilian Defence: McDonnell Attack, Toilet Variation	e4 c5 f4 d5 Nc3
B21	Sicilian Defence: Morphy Gambit	e4 c5 d4 cxd4 Nf3
B21	Sicilian Defence: Smith-Morra Gambit	e4 c5 d4 cxd4 c3
B21	Bird Opening: Dutch Variation, Batavo Gambit	e4 c5 f4 d5 Nf3 dxe4
B21	Sicilian Defence: McDonnell Attack, Tal Gambit	e4 c5 f4 d5 exd5 Nf6
B21	Sicilian Defence: Smith-Morra Gambit Accepted	e4 c5 d4 cxd4 c3 dxc3
B21	Sicilian Defence: Smith-Morra Gambit Declined, Alapin Formation	e4 c5 d4 cxd4 c3 Nf6
B21	Sicilian Defence: Smith-Morra Gambit Declined, Center Formation	e4 c5 d4 cxd4 c3 e5
B21	Sicilian Defence: Smith-Morra Gambit Declined, Push Variation	e4 c5 d4 cxd4 c3 d3
B21	Sicilian Defence: Smith-Morra Gambit Declined, Scandinavian Formation	e4 c5 d4 cxd4 c3 d5
B21	Sicilian Defence: Smith-Morra Gambit Declined, Wing Formation	e4 c5 d4 cxd4 c3 Qa5
B21	Sicilian Defence: Morphy Gambit, Andreaschek Gambit	e4 c5 d4 cxd4 Nf3 e5 c3
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Danish Variation	e4 c5 d4 cxd4 c3 dxc3 Nf3
B21	Sicilian Defence: Smith-Morra Gambit Declined, Dubois Variation	e4 c5 d4 cxd4 c3 d3 c4
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Fianchetto Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 g6
B21	Sicilian Defence: Coles Sicilian Gambit	e4 c5 d4 cxd4 Qxd4 Nc6 Qd1 Nf6 Bc4
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Fianchetto Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 g6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Fianchetto Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 d6 Nf3 g6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Kan Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 e6 Nf3 a6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Fianchetto Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 g6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Morphy Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Bc5
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Paulsen Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 a6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Pin Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Bb4
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Scheveningen Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 e6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Siberian Variation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Taimanov Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 e6 Bc4 a6 Nf3 Ne7
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Chicago Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 d6 Nf3 e6 Bc4 Nf6 O-O a6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Classical Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 d6 Bc4 a6 O-O Nf6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Finegold Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 e6 Nf3 d6 Bc4 a6 O-O Be7 Qe2 Nf6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Larsen Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 Qe2 a6 O-O Bd6
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Morphy Defence Deferred	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 a6 O-O b5 Bb3 Bc5
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Siberian Variation, Siberian Trap	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 Qe2 Nf6 O-O Ng4
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Sozin Formation	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Bc4 e6 Nf3 d6 O-O a6 Qe2 b5
B21	Sicilian Defence: Smith-Morra Gambit Accepted, Chicago Defence	e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Bc4 e6 Nf3 d6 O-O a6 Qe2 b5 Bb3 Ra7
B22	Sicilian Defence: Alapin Variation	e4 c5 c3
B22	Sicilian Defence: Alapin Variation, Anti-Alapin Gambit	e4 c5 c3 d5 exd5 Nf6
B22	Sicilian Defence: Alapin Variation, Barmen Defence	e4 c5 c3 d5 exd5 Qxd5
B22	Sicilian Defence: Alapin Variation, Smith-Morra Declined	e4 c5 c3 Nf6 e5 Nd5 d4 cxd4
B22	Sicilian Defence: Alapin Variation, Barmen Defence	e4 c5 c3 d5 exd5 Qxd5 d4 g6 Nf3
B22	Sicilian Defence: Alapin Variation, Barmen Defence	e4 c5 c3 d5 exd5 Qxd5 d4 Nc6 Nf3
B22	Sicilian Defence: Heidenfeld Variation	e4 c5 c3 Nf6 e5 Nd5 Nf3 Nc6 Na3
B22	Sicilian Defence: Alapin Variation, Barmen Defence, Modern Line	e4 c5 c3 d5 exd5 Qxd5 d4 Nf6 Nf3 Bg4
B22	Sicilian Defence: Delayed Alapin Variation	e4 c5 Nf3 e6 c3 d5 exd5 Qxd5 d4 Nf6
B22	Sicilian Defence: Alapin Variation, Stoltz Attack	e4 c5 c3 Nf6 e5 Nd5 Nf3 Nc6 Bc4 Nb6 Bb3
B22	Sicilian Defence: Alapin Variation, Barmen Defence, Central Exchange	e4 c5 c3 d5 exd5 Qxd5 d4 cxd4 cxd4 Nc6 Nf3 Bg4
B22	Sicilian Defence: Delayed Alapin Variation	e4 c5 Nf3 e6 c3 d5 exd5 exd5 Bb5+ Nc6 O-O Bd6 d4
B22	Sicilian Defence: Alapin Variation, Barmen Defence, Milner-Barry Attack	e4 c5 c3 d5 exd5 Qxd5 d4 Nc6 Nf3 cxd4 cxd4 e5 Nc3 Bb4 Be2
B22	Sicilian Defence: Alapin Variation, Stoltz Attack, Ivanchuk Line	e4 c5 c3 Nf6 e5 Nd5 Nf3 Nc6 Bc4 Nb6 Bb3 c4 Bc2 Qc7 Qe2 g5
B22	Sicilian Defence: Alapin Variation, Barmen Defence, Endgame Variation	e4 c5 c3 d5 exd5 Qxd5 d4 cxd4 cxd4 Nc6 Nf3 Bg4 Nc3 Bxf3 gxf3 Qxd4 Qxd4 Nxd4
B23	Sicilian Defence: Closed	e4 c5 Nc3
B23	Sicilian Defence: Closed	e4 c5 Nc3 e6
B23	Sicilian Defence: Closed, Traditional	e4 c5 Nc3 Nc6
B23	Sicilian Defence: Closed	e4 c5 Nc3 e6 g3
B23	Sicilian Defence: Closed, Chameleon Variation	e4 c5 Nc3 Nc6 Nge2
B23	Sicilian Defence: Closed, Grob Attack	e4 c5 Nc3 Nc6 g4
B23	Sicilian Defence: Grand Prix Attack	e4 c5 Nc3 Nc6 f4
B23	Sicilian Defence: Closed, Korchnoi Defence	e4 c5 Nc3 e6 g3 d5
B23	Sicilian Defence: Closed, Portland Attack	e4 c5 Nc3 Nc6 d3 g6 g4
B23	Sicilian Defence: Closed, Carlsen Variation	e4 c5 Nc3 d6 d4 cxd4 Qxd4 Nc6 Qd2
B23	Sicilian Defence: Grand Prix Attack, Schofman Variation	e4 c5 Nc3 Nc6 f4 g6 Nf3 Bg7 Bc4 e6 f5
B24	Sicilian Defence: Closed, Fianchetto Variation	e4 c5 Nc3 Nc6 g3
B24	Sicilian Defence: Closed	e4 c5 Nc3 Nc6 g3 g6
B24	Sicilian Defence: Closed	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7
B24	Sicilian Defence: Closed, Smyslov Variation	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 e6 Be3 Nd4 Nce2
B25	Sicilian Defence: Closed	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6
B25	Sicilian Defence: Closed	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 f4
B25	Sicilian Defence: Closed, Botvinnik Defence, with f4	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 f4 e5
B25	Sicilian Defence: Closed, Botvinnik Defence, with Nge2	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 Nge2 e5
B25	Sicilian Defence: Closed, Botvinnik Defence, Edge Variation	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 f4 e5 Nh3 Nge7
B26	Sicilian Defence: Closed	e4 c5 Nc3 Nc6 g3 g6 Bg2 Bg7 d3 d6 Be3
B27	Sicilian Defence	e4 c5 Nf3
B27	Sicilian Defence: Brussels Gambit	e4 c5 Nf3 f5
B27	Sicilian Defence: Bücker Variation	e4 c5 Nf3 h6
B27	Sicilian Defence: Hyperaccelerated Dragon	e4 c5 Nf3 g6
B27	Sicilian Defence: Jalalabad Variation	e4 c5 Nf3 e5
B27	Sicilian Defence: Katalimov Variation	e4 c5 Nf3 b6
B27	Sicilian Defence: Mongoose Variation	e4 c5 Nf3 Qa5
B27	Sicilian Defence: Polish Gambit	e4 c5 Nf3 b5
B27	Sicilian Defence: Quinteros Variation	e4 c5 Nf3 Qc7
B27	Sicilian Defence: Hyperaccelerated Dragon	e4 c5 Nf3 g6 d4
B27	Sicilian Defence: Acton Extension	e4 c5 Nf3 g6 c4 Bh6
B27	Sicilian Defence: Double-Dutch Gambit	e4 c5 Nf3 f5 exf5 Nh6
B27	Sicilian Defence: Frederico Variation	e4 c5 Nf3 g6 d4 f5
B27	Sicilian Defence: Hyperaccelerated Pterodactyl	e4 c5 Nf3 g6 d4 Bg7
B27	Modern Defence: Pterodactyl Variation	e4 c5 Nf3 g6 d4 Bg7 Nc3 Qa5
B27	Pterodactyl Defence: Western, Pterodactyl	e4 c5 Nf3 g6 c3 Bg7 d4 Qa5
B27	Pterodactyl Defence: Western, Rhamphorhynchus	e4 c5 Nf3 g6 d4 Bg7 dxc5 Qa5+
B27	Pterodactyl Defence: Sicilian, Anhanguera	e4 c5 Nf3 g6 d4 Bg7 Nc3 Qa5 Be3
B27	Pterodactyl Defence: Sicilian, Benoni Gambit	e4 c5 Nf3 g6 d4 Bg7 Nc3 Qa5 d5
B27	Pterodactyl Defence: Sicilian, Rhamphorhynchus	e4 c5 Nf3 g6 d4 Bg7 dxc5 Qa5+ Nc3
B27	Pterodactyl Defence: Sicilian, Unpin	e4 c5 Nf3 g6 d4 Bg7 Nc3 Qa5 Bd2
B27	Pterodactyl Defence: Sicilian, Pteranodon	e4 c5 Nf3 g6 d4 Bg7 dxc5 Qa5+ Nc3 Bxc3+ bxc3
B27	Sicilian Defence: Hyperaccelerated Pterodactyl, Exchange Variation	e4 c5 Nf3 g6 d4 Bg7 dxc5 Qa5+ Nc3 Bxc3+ bxc3 Qxc3+
B28	Sicilian Defence: O’Kelly Variation	e4 c5 Nf3 a6
B28	Sicilian Defence: O’Kelly Variation, Aronin System	e4 c5 Nf3 a6 Be2
B28	Sicilian Defence: O’Kelly Variation, Kieseritzky System	e4 c5 Nf3 a6 b3
B28	Sicilian Defence: O’Kelly Variation, Maróczy Bind	e4 c5 Nf3 a6 c4
B28	Sicilian Defence: O’Kelly Variation, Normal System	e4 c5 Nf3 a6 d4
B28	Sicilian Defence: O’Kelly Variation, Quiet System	e4 c5 Nf3 a6 d3
B28	Sicilian Defence: O’Kelly Variation, Réti System	e4 c5 Nf3 a6 g3
B28	Sicilian Defence: O’Kelly Variation, Venice System	e4 c5 Nf3 a6 c3
B28	Sicilian Defence: O’Kelly Variation, Wing Gambit	e4 c5 Nf3 a6 b4
B28	Sicilian Defence: O’Kelly Variation, Yerevan System	e4 c5 Nf3 a6 Nc3
B28	Sicilian Defence: O’Kelly Variation, Maróczy Bind, Paulsen Line	e4 c5 Nf3 a6 c4 e6
B28	Sicilian Defence: O’Kelly Variation, Maróczy Bind, Robatsch Line	e4 c5 Nf3 a6 c4 d6
B28	Sicilian Defence: O’Kelly Variation, Venice System, Barcza Line	e4 c5 Nf3 a6 c3 Nf6
B28	Sicilian Defence: O’Kelly Variation, Venice System, Ljubojevic Line	e4 c5 Nf3 a6 c3 b5
B28	Sicilian Defence: O’Kelly Variation, Venice System, Steiner Line	e4 c5 Nf3 a6 c3 d6
B28	Sicilian Defence: O’Kelly Variation, Normal System, Cortlever Gambit	e4 c5 Nf3 a6 d4 cxd4 Bc4
B28	Sicilian Defence: O’Kelly Variation, Normal System, Smith-Morra Line	e4 c5 Nf3 a6 d4 cxd4 c3
B28	Sicilian Defence: O’Kelly Variation, Normal System, Zagorovsky Line	e4 c5 Nf3 a6 d4 cxd4 Qxd4
B28	Sicilian Defence: O’Kelly Variation, Normal System, Taimanov Line	e4 c5 Nf3 a6 d4 cxd4 Nxd4 e5
B28	Sicilian Defence: O’Kelly Variation, Venice System, Gambit Line	e4 c5 Nf3 a6 c3 d5 exd5 Nf6
B29	Sicilian Defence: Nimzowitsch Variation	e4 c5 Nf3 Nf6
B29	Sicilian Defence: Nimzowitsch Variation, Advance Variation	e4 c5 Nf3 Nf6 e5
B29	Sicilian Defence: Nimzowitsch Variation, Closed Variation	e4 c5 Nf3 Nf6 Nc3
B29	Sicilian Defence: Nimzowitsch Variation, Exchange Variation	e4 c5 Nf3 Nf6 e5 Nd5 Nc3 Nxc3
B29	Sicilian Defence: Nimzowitsch Variation, Main Line	e4 c5 Nf3 Nf6 e5 Nd5 Nc3 e6 Nxd5 exd5 d4 Nc6
B30	Sicilian Defence: Old Sicilian	e4 c5 Nf3 Nc6
B30	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack	e4 c5 Nf3 Nc6 Bb5
B30	Sicilian Defence: Portsmouth Gambit	e4 c5 Nf3 Nc6 b4
B30	Sicilian Defence: Closed, Anti-Sveshnikov Variation	e4 c5 Nf3 Nc6 Nc3 e5
B30	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Brooklyn Retreat Defence	e4 c5 Nf3 Nc6 Bb5 Nb8
B30	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, San Francisco Gambit	e4 c5 Nf3 Nc6 Bb5 Na5 b4
B30	Sicilian Defence: Closed, Anti-Sveshnikov Variation, with d6	e4 c5 Nf3 Nc6 Nc3 e5 Bc4 Be7 d3 d6
B30	Sicilian Defence: Closed, Anti-Sveshnikov Variation, with Nf6	e4 c5 Nf3 Nc6 Nc3 e5 Bc4 Be7 d3 Nf6
B30	Sicilian Defence: Closed, Anti-Sveshnikov Variation, Kharlov-Kramnik Line	e4 c5 Nf3 Nc6 Nc3 e5 Bc4 Be7 d3 d6 Nd2 Bg5
B31	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation	e4 c5 Nf3 Nc6 Bb5 g6
B31	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Gufeld Gambit	e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 c3 e5 d4
B31	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Lutikov Gambit	e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 c3 Nf6 d4
B31	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Fianchetto Variation, Totsky Attack	e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 c3 Nf6 Qa4
B31	Sicilian Defence: Nyezhmetdinov-Rossolimo Attack, Gurgenidze Variation	e4 c5 Nf3 Nc6 Bb5 g6 O-O Bg7 Re1 e5 b4
B32	Sicilian Defence: Open	e4 c5 Nf3 Nc6 d4
B32	Sicilian Defence: Franco-Sicilian Variation	e4 c5 Nf3 Nc6 d4 e6
B32	Sicilian Defence: Open	e4 c5 Nf3 Nc6 d4 cxd4
B32	Sicilian Defence: Open	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4
B32	Sicilian Defence: Accelerated Dragon	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6
B32	Sicilian Defence: Flohr Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Qc7
B32	Sicilian Defence: Godiva Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Qb6
B32	Sicilian Defence: Löwenthal Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5
B32	Sicilian Defence: Nimzo-American Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 d5
B32	Sicilian Defence: Kalashnikov Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5 Nb5 d6
B32	Sicilian Defence: O’Kelly Variation, Maróczy Bind, Geller Line	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 a6 c4 e5
B33	Sicilian Defence: Open	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6
B33	Sicilian Defence: Lasker-Pelikan Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5
B33	Sicilian Defence: Lasker-Pelikan Variation, Exchange Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Nxc6
B33	Sicilian Defence: Lasker-Pelikan Variation, Retreat Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Nf3
B33	Sicilian Defence: Lasker-Pelikan Variation, Schlechter Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Nb3
B33	Sicilian Defence: Lasker-Pelikan Variation, Bird Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 Be6
B33	Sicilian Defence: Lasker-Pelikan Variation, Sveshnikov Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5
B33	Sicilian Defence: Lasker-Pelikan Variation, Sveshnikov Variation, Chelyabinsk Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Nd5
B33	Sicilian Defence: Lasker-Pelikan Variation, Sveshnikov Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5
B33	Sicilian Defence: Lasker-Pelikan Variation, Sveshnikov Variation, Novosibirsk Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 Bg7
B33	Sicilian Defence: Lasker-Pelikan Variation, Sveshnikov Variation, Peresypkin’s Sacrifice	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Ndb5 d6 Bg5 a6 Na3 b5 Bxf6 gxf6 Nd5 f5 Bxb5
B34	Sicilian Defence: Accelerated Dragon, Exchange Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nxc6
B34	Sicilian Defence: Accelerated Dragon, Modern Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3
B35	Sicilian Defence: Accelerated Dragon, Modern Bc4 Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Bc4
B35	Sicilian Defence: Dragon Variation, Modern Bc4 Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Bc4 d6
B36	Sicilian Defence: Accelerated Dragon, Maróczy Bind	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4
B36	Sicilian Defence: Accelerated Dragon, Maróczy Bind, Gurgenidze Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Nf6 Nc3 Nxd4 Qxd4 d6
B37	Sicilian Defence: Accelerated Dragon, Maróczy Bind	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7
B37	Sicilian Defence: Accelerated Dragon, Simagin Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Nc2 d6 Be2 Nh6
B38	Sicilian Defence: Accelerated Dragon, Maróczy Bind	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3
B39	Sicilian Defence: Accelerated Dragon, Maróczy Bind, Breyer Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 c4 Bg7 Be3 Nf6 Nc3 Ng4
B40	Sicilian Defence: French Variation	e4 c5 Nf3 e6
B40	Sicilian Defence: Delayed Alapin Variation, with e6	e4 c5 Nf3 e6 c3
B40	Sicilian Defence: French Variation, Westerinen Attack	e4 c5 Nf3 e6 b3
B40	Sicilian Defence: Kramnik Variation	e4 c5 Nf3 e6 c4
B40	Sicilian Defence: Wing Gambit Deferred	e4 c5 Nf3 e6 b4
B40	Sicilian Defence: Drazic Variation	e4 c5 Nf3 e6 d4 a6
B40	Sicilian Defence: French Variation, Open	e4 c5 Nf3 e6 d4 cxd4
B40	Sicilian Defence: Marshall Counterattack	e4 c5 Nf3 e6 d4 d5
B40	Sicilian Defence: Smith-Morra Gambit Deferred	e4 c5 Nf3 e6 d4 cxd4 c3
B40	Sicilian Defence: French Variation, Normal	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6
B40	Sicilian Defence: Kveinis Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Qb6
B40	Sicilian Defence: Paulsen-Basman Defence	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Bc5
B40	Sicilian Defence: Alapin Variation, Sherzer Variation	e4 c5 Nf3 e6 c3 Nf6 e5 Nd5 d4 Nc6
B40	Sicilian Defence: Gaw-Paw Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 Qb6
B40	Sicilian Defence: Pin Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 Bb4
B40	Sicilian Defence: Kan Variation, Wing Attack, Fianchetto Variation	e4 c5 Nf3 e6 Nc3 a6 g3 b5 d4 cxd4 Nxd4
B40	Sicilian Defence: Pin Variation, Koch Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 Bb4 e5
B40	Sicilian Defence: Pin Variation, Jaffe Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 Bb4 Bd3 e5
B41	Sicilian Defence: Kan Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6
B41	Sicilian Defence: Kan Variation, Maróczy Bind, Réti Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 c4
B41	Sicilian Defence: Kan Variation, Maróczy Bind, Hedgehog Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 c4 g6
B41	Sicilian Defence: Kan Variation, Maróczy Bind, Bronstein Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 c4 Nf6 Nc3 Bb4 Bd3 Nc6
B41	Sicilian Defence: Kan Variation, Maróczy Bind, Bronstein Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 c4 Nf6 Nc3 Bb4 Bd3 Nc6 Bc2
B42	Sicilian Defence: Kan Variation, Modern Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3
B42	Sicilian Defence: Kan Variation, Polugaevsky Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 Bc5
B42	Sicilian Defence: Kan Variation, Swiss Cheese Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 g6
B42	Sicilian Defence: Kan Variation, Gipslis Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Bd3 Nf6 O-O d6 c4 g6
B43	Sicilian Defence: Kan Variation, Knight Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3
B43	Sicilian Defence: Kan Variation, Wing Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 b5
B43	Sicilian Defence: Kan Variation, Wing Attack, Spraggett Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 b5 Bd3 Qb6 Nf3
B43	Sicilian Defence: Kan Variation, Wing Attack, Christiansen’s Dream	e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6 Nc3 b5 Bd3 Qb6 Be3 Bc5 Qg4
B44	Sicilian Defence: Taimanov Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6
B44	Sicilian Defence: Taimanov Variation, Szén Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nb5
B44	Sicilian Defence: Taimanov Variation, Gary Gambit	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nb5 d6 c4 Nf6 N1c3 a6 Na3 d5
B44	Sicilian Defence: Taimanov Variation, Modern Line	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nb5 d6 c4 Nf6 N1c3 a6 Na3 Be7 Be2 O-O O-O b6
B45	Sicilian Defence: Taimanov Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3
B45	Sicilian Defence: Four Knights Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Nf6
B45	Sicilian Defence: Four Knights Variation, Exchange Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Nf6 Nxc6
B45	Sicilian Defence: Four Knights Variation, Cobra Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Nf6 Ndb5 Bc5
B45	Sicilian Defence: Four Knights Variation, Sveshnikov Transfer	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Nf6 Ndb5 d6
B45	Sicilian Defence: Four Knights Variation, American Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Nf6 Ndb5 Bb4 Nd6+
B46	Sicilian Defence: Taimanov Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 a6
B47	Sicilian Defence: Taimanov Variation, Bastrikov Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7
B47	Sicilian Defence: Taimanov Variation, Bastrikov Variation, Ponomariov Gambit	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Ndb5 Qb8 Be3 a6 Bb6
B48	Sicilian Defence: Taimanov Variation, Bastrikov Variation, English Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3
B49	Sicilian Defence: Taimanov Variation, Bastrikov Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be3 a6 Be2
B50	Sicilian Defence: Modern Variations	e4 c5 Nf3 d6
B50	Sicilian Defence	e4 c5 Nf3 d6 d4
B50	Sicilian Defence: Delayed Alapin Variation, with d6	e4 c5 Nf3 d6 c3
B50	Sicilian Defence: Kopec System	e4 c5 Nf3 d6 Bd3
B50	Sicilian Defence: Wing Gambit, Deferred Variation	e4 c5 Nf3 d6 b4
B50	Sicilian Defence	e4 c5 Nf3 d6 d4 cxd4
B50	Sicilian Defence: Kotov Gambit	e4 c5 Nf3 d6 g3 b5
B50	Sicilian Defence: Modern Variations, Anti-Qxd4 Move Order	e4 c5 Nf3 d6 d4 Nf6
B50	Sicilian Defence: Modern Variations, Tartakower	e4 c5 Nf3 d6 d4 cxd4 c3
B50	Sicilian Defence: Modern Variations, Anti-Qxd4 Move Order Accepted	e4 c5 Nf3 d6 d4 Nf6 dxc5 Nxe4
B50	Sicilian Defence: Delayed Alapin Variation, Basman-Palatnik Gambit	e4 c5 Nf3 d6 c3 Nf6 Be2 Nc6 d4 cxd4 cxd4 Nxe4
B50	Sicilian Defence: Delayed Alapin Variation, Basman-Palatnik Double Gambit	e4 c5 Nf3 d6 c3 Nf6 Be2 Nc6 d4 cxd4 cxd4 Nxe4 d5 Qa5+ Nc3 Nxc3 bxc3
B51	Sicilian Defence: Moscow Variation	e4 c5 Nf3 d6 Bb5+
B51	Sicilian Defence: Moscow Variation, Dorfman Gambit	e4 c5 Nf3 d6 Bb5+ Nc6 O-O Bd7 Qe2 g6 e5
B51	Sicilian Defence: Moscow Variation, Moscow Gambit	e4 c5 Nf3 d6 Bb5+ Nc6 O-O Bd7 c3 Nf6 Re1 a6 Bxc6 Bxc6 d4 Bxe4 Bg5
B52	Sicilian Defence: Moscow Variation, Main Line	e4 c5 Nf3 d6 Bb5+ Bd7
B52	Sicilian Defence: Moscow Variation, Sokolsky Variation	e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7 c4
B52	Sicilian Defence: Moscow Variation, Haag Gambit	e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7 O-O Nc6 c3 Nf6 d4
B53	Sicilian Defence: Chekhover Variation	e4 c5 Nf3 d6 d4 cxd4 Qxd4
B53	Sicilian Defence: Chekhover Variation, Zaitsev Defence	e4 c5 Nf3 d6 d4 cxd4 Qxd4 Nc6 Bb5 Qd7
B54	Sicilian Defence: Dragon Variation, Accelerated Dragon	e4 c5 Nf3 d6 d4 cxd4 Nxd4 g6
B54	Sicilian Defence: Modern Variations, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6
B54	Sicilian Defence: Modern Variations, Ginsberg Gambit	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Bc4
B54	Sicilian Defence: Prins Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 f3
B55	Sicilian Defence: Prins Variation, Venice Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 f3 e5 Bb5+
B56	Sicilian Defence: Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6
B56	Sicilian Defence: Kupreichik Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Bd7
B56	Sicilian Defence: Classical Variation, Fianchetto Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 g3
B56	Sicilian Defence: Spielmann Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Nde2
B56	Sicilian Defence: Venice Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e5 Bb5+
B57	Sicilian Defence: Classical Variation, Sozin Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bc4
B57	Sicilian Defence: Classical Variation, Anti-Sozin Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 Qb6
B57	Sicilian Defence: Magnus Smith Trap	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 g6 Nxc6 bxc6 e5
B58	Sicilian Defence: Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Be2
B58	Sicilian Defence: Boleslavsky Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Be2 e5
B58	Sicilian Defence: Boleslavsky Variation, Louma Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 e5 Nxc6
B58	Sicilian Defence: Classical Variation, Dragon Transfer	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Be2 Nxd4 Qxd4 g6
B59	Sicilian Defence: Boleslavsky Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 e5 Nb3
B60	Sicilian Defence: Richter-Rauzer Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5
B60	Sicilian Defence: Richter-Rauzer Variation, Dragon Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 g6
B60	Sicilian Defence: Richter-Rauzer Variation, Modern Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 Bd7
B61	Sicilian Defence: Richter-Rauzer Variation, Modern Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 Bd7 Qd2
B62	Sicilian Defence: Richter-Rauzer Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6
B62	Sicilian Defence: Richter-Rauzer Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd3
B62	Sicilian Defence: Richter-Rauzer Variation, Exchange Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Nxc6
B62	Sicilian Defence: Richter-Rauzer Variation, Podebrady Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 e6 Nb3
B62	Sicilian Defence: Richter-Rauzer Variation, Vitolins Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Bb5
B63	Sicilian Defence: Richter-Rauzer Variation, Traditional Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2
B63	Sicilian Defence: Richter-Rauzer Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7
B63	Sicilian Defence: Richter-Rauzer Variation, Ivanov Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Qb6
B63	Sicilian Defence: Richter-Rauzer Variation, Classical Variation, Kantscher Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7 O-O-O Nxd4 Qxd4 a6 f4 b5
B64	Sicilian Defence: Richter-Rauzer Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7 O-O-O O-O f4
B64	Sicilian Defence: Richter-Rauzer Variation, Classical Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 e6 Qd2 Be7 O-O-O O-O f4 e5
B65	Sicilian Defence: Richter-Rauzer Variation, Rauzer Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7 O-O-O O-O f4 Nxd4
B65	Sicilian Defence: Richter-Rauzer Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 Be7 O-O-O O-O f4 Nxd4 Qxd4
B66	Sicilian Defence: Richter-Rauzer Variation, Neo-Modern Variation, Early Deviations	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5 e6 Qd2 a6
B67	Sicilian Defence: Richter-Rauzer Variation, Neo-Modern Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 e6 Qd2 a6 O-O-O Bd7
B68	Sicilian Defence: Richter-Rauzer Variation, Neo-Modern Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 e6 Qd2 a6 O-O-O Bd7 f4 Be7
B69	Sicilian Defence: Richter-Rauzer Variation, Neo-Modern Variation, Nyezhmetdinov Attack	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bg5 e6 Qd2 a6 O-O-O Bd7 f4 Be7 Nf3 b5 Bxf6
B70	Sicilian Defence: Dragon Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6
B70	Sicilian Defence: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2
B70	Sicilian Defence: Dragon Variation, Fianchetto Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 g3
B71	Sicilian Defence: Dragon Variation, Levenfish Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 f4
B71	Sicilian Defence: Dragon Variation, Levenfish Variation, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 f4 Nbd7
B72	Sicilian Defence: Dragon Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3
B72	Sicilian Defence: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 Be2
B72	Sicilian Defence: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 Be2 Nc6
B72	Sicilian Defence: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 Be2 Nc6 Nb3
B72	Sicilian Defence: Dragon Variation, Classical Variation, Amsterdam Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 g6 Be3 Bg7 Qd2
B72	Sicilian Defence: Dragon Variation, Classical Variation, Grigoriev Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 g6 Be3 Bg7 Qd2 O-O O-O-O
B73	Sicilian Defence: Dragon Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O Nc6 Be3
B73	Sicilian Defence: Dragon Variation, Classical Variation, Battery Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Qd2
B73	Sicilian Defence: Dragon Variation, Classical Variation, Zollner Gambit	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Be3 Bg7 Be2 Nf6 Nc3 O-O O-O d6 f4 Qb6 e5
B74	Sicilian Defence: Dragon Variation, Classical Variation, Normal Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3
B74	Sicilian Defence: Dragon Variation, Classical Variation, Alekhine Line	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Be2 O-O O-O d6 Nb3 a5
B74	Sicilian Defence: Dragon Variation, Classical Variation, Maróczy Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3 Be6 f4 Na5
B74	Sicilian Defence: Dragon Variation, Classical Variation, Tartakower Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3 Be6 f4 Qc8
B74	Sicilian Defence: Dragon Variation, Classical Variation, Spielmann Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6 Nc3 Bg7 Be3 Nf6 Be2 O-O Nb3 d6 O-O Be6 f4 Na5 f5 Bc4 Bd3
B74	Sicilian Defence: Dragon Variation, Classical Variation, Bernard Defence	e4 c5 Nf3 g6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 Bg7 O-O O-O Be3 Nc6 Nb3 Be6 f4 Na5 f5 Bc4 Bd3 Bxd3 cxd3 d5
B74	Sicilian Defence: Dragon Variation, Classical Variation, Stockholm Attack	e4 c5 Nc3 d6 f4 Nc6 Nf3 g6 d4 cxd4 Nxd4 Bg7 Be3 Nf6 Be2 O-O Nb3 Be6 O-O Na5 f5 Bc4 Nxa5 Bxe2 Qxe2 Qxa5 g4
B75	Sicilian Defence: Dragon Variation, Yugoslav Attack, Early Deviations	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3
B75	Sicilian Defence: Dragon Variation, Yugoslav Attack, Belezky Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 Nc6
B75	Sicilian Defence: Dragon Variation, Yugoslav Attack, Hungarian Dragon	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Nc6 f3 h5
B76	Sicilian Defence: Dragon Variation, Yugoslav Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O
B76	Sicilian Defence: Dragon Variation, Yugoslav Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6
B76	Sicilian Defence: Dragon Variation, Yugoslav Attack, Modern Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 Nc6 Qd2 O-O O-O-O
B76	Sicilian Defence: Dragon Variation, Yugoslav Attack, Panov Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 g4
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Byrne Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 a5
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Sosonko Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 Nc6 Qd2 O-O Bc4 Nd7
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 Bb3
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Czerniak Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 Nc6 Qd2 O-O Bc4 Nxd4 Bxd4 Be6
B77	Sicilian Defence: Dragon Variation, Yugoslav Attack, Czerniak Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 Nc6 Qd2 O-O Bc4 Nxd4 Bxd4 Be6 Bb3 Qa5
B78	Sicilian Defence: Dragon Variation, Yugoslav Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O
B78	Sicilian Defence: Dragon Variation, Yugoslav Attack, Chinese Dragon	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rb8
B78	Sicilian Defence: Dragon Variation, Yugoslav Attack, Old Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8
B78	Sicilian Defence: Dragon Variation, Yugoslav Attack, Topalov Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Rc8 Bb3 Nxd4 Bxd4
B79	Sicilian Defence: Dragon Variation, Yugoslav Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 h4 Qa5 O-O-O Rfc8 Bb3
B79	Sicilian Defence: Dragon Variation, Yugoslav Attack, Soltis Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be3 Bg7 f3 O-O Qd2 Nc6 Bc4 Bd7 O-O-O Qa5 h4 Rfc8 Bb3 h5
B80	Sicilian Defence: Scheveningen Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6
B80	Sicilian Defence: Scheveningen Variation, Fianchetto Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 g3
B80	Sicilian Defence: Scheveningen Variation, Vitolins Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bb5+
B80	Sicilian Defence: Scheveningen Variation, English Attack, with Qd2	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e6 Qd2
B81	Sicilian Defence: Scheveningen Variation, Keres Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 g4
B82	Sicilian Defence: Scheveningen Variation, Matanovic Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 f4
B82	Sicilian Defence: Scheveningen Variation, Tal Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 f4 Nc6 Be3 Be7 Qf3
B83	Sicilian Defence: Scheveningen Variation, Classical Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2
B83	Sicilian Defence: Scheveningen Variation, Modern Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 d6 Be2 Nf6
B83	Sicilian Defence: Scheveningen Variation, Modern Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 Be7 O-O O-O f4 Nc6 Be3
B83	Sicilian Defence: Scheveningen Variation, Modern Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Be2 Be7 O-O O-O f4 Nc6 Be3 Bd7 Nb3
B84	Sicilian Defence: Scheveningen Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e6
B84	Sicilian Defence: Najdorf Variation, Scheveningen Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e6 O-O Nbd7
B84	Sicilian Defence: Scheveningen Variation, Classical Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e6 O-O Qc7
B85	Sicilian Defence: Scheveningen Variation, Classical Variation, Paulsen Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4 e6 Be2 Qc7 O-O Nc6
B85	Sicilian Defence: Scheveningen Variation, Classical Variation, Paulsen Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be2 a6 O-O Nf6 Be3 d6 f4
B85	Sicilian Defence: Scheveningen Variation, Classical Variation, Paulsen Variation	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be2 a6 O-O Nf6 Kh1 Be7 f4 d6 a4
B85	Sicilian Defence: Scheveningen Variation, Classical Main Line	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6 Nc3 Qc7 Be2 a6 O-O Nf6 Be3 Be7 f4 d6 Qe1 O-O
B86	Sicilian Defence: Sozin Attack	e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4
B87	Sicilian Defence: Sozin Attack, Flank Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bc4 e6 Bb3 b5
B88	Sicilian Defence: Sozin Attack, Leonhardt Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 e6
B88	Sicilian Defence: Sozin Attack, Fischer Variation	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 e6 Bb3 Be7 Be3 O-O f4
B89	Sicilian Defence: Sozin Attack, Main Line	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 e6 Be3
B89	Sicilian Defence: Velimirovic Attack	e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 Nf6 Nc3 d6 Bc4 e6 Be3 Be7 Qe2
B89	Sicilian Defence: Sozin Attack, Main Line, Sherbakov Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bc4 e6 Be3 Be7 Bb3 O-O O-O Na5 f4 b6
B90	Sicilian Defence: Najdorf Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6
B90	Sicilian Defence: Najdorf Variation, Adams Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 h3
B90	Sicilian Defence: Najdorf Variation, Dekker Gambit	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 g4
B90	Sicilian Defence: Najdorf Variation, English Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3
B90	Sicilian Defence: Najdorf Variation, Lipnitsky Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bc4
B90	Sicilian Defence: Najdorf Variation, Petronić Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Rg1
B90	Sicilian Defence: Najdorf Variation, Yates Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bd3
B90	Sicilian Defence: Najdorf Variation, English Attack, Anti-English	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 Ng4
B90	Sicilian Defence: Scheveningen Variation, Delayed Keres Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e6 g4
B90	Sicilian Defence: Scheveningen Variation, English Attack, with f3	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e6 f3
B90	Sicilian Defence: Najdorf Variation, English Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3
B90	Sicilian Defence: Najdorf Variation, English Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be7 f3
B90	Sicilian Defence: Najdorf Variation, English Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 h3
B90	Sicilian Defence: Najdorf Variation, English Attack	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be7 h3
B90	Sicilian Defence: Scheveningen Variation, Delayed Keres Attack, Perenyi Gambit	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e6 g4 e5 Nf5 g6 g5
B91	Sicilian Defence: Najdorf Variation, Zagreb Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 g3
B92	Sicilian Defence: Najdorf Variation, Opocensky Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2
B92	Sicilian Defence: Najdorf Variation, Opocensky Variation	e4 c5 Nf3 Nf6 Nc3 d6 d4 cxd4 Nxd4 a6 Be2 e5 Nb3 Be6 Be3
B92	Sicilian Defence: Najdorf Variation, Opocensky Variation, Modern Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O Be6
B92	Sicilian Defence: Najdorf Variation, Opocensky Variation, Traditional Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be2 e5 Nb3 Be7 O-O O-O
B93	Sicilian Defence: Najdorf Variation, Amsterdam Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 f4
B94	Sicilian Defence: Najdorf Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5
B94	Sicilian Defence: Najdorf Variation, Ivkov Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 Nbd7 Bc4 Qa5 Qd2 e6 O-O-O b5 Bb3 Bb7 Rhe1 Nc5 e5
B95	Sicilian Defence: Najdorf Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6
B96	Sicilian Defence: Najdorf Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4
B96	Sicilian Defence: Najdorf Variation, Neo-Classical Defence	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Nc6
B96	Sicilian Defence: Najdorf Variation, Polugaevsky Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 b5
B96	Sicilian Defence: Najdorf Variation, Polugaevsky Variation, Simagin Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 b5 e5 dxe5 fxe5 Qc7 Qe2
B97	Sicilian Defence: Najdorf Variation, Poisoned Pawn Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Qb6
B97	Sicilian Defence: Najdorf Variation, Poisoned Pawn Accepted	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Qb6 Qd2 Qxb2 Rb1 Qa3
B98	Sicilian Defence: Najdorf Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7
B98	Sicilian Defence: Najdorf Variation, Traditional Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 Qc7
B98	Sicilian Defence: Najdorf Variation, Browne Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 h6 Bh4 Qc7
B98	Sicilian Defence: Najdorf Variation, Goteborg Variation	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 h6 Bh4 g5
B99	Sicilian Defence: Najdorf Variation, Main Line	e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 Qc7 O-O-O Nbd7
C00	French Defence	e4 e6
C00	French Defence: Banzai-Leong Gambit	e4 e6 b4
C00	French Defence: Bird Invitation	e4 e6 Bb5
C00	French Defence: Chigorin Variation	e4 e6 Qe2
C00	French Defence: Horwitz Attack	e4 e6 b3
C00	French Defence: King’s Indian Attack	e4 e6 d3
C00	French Defence: Knight Variation	e4 e6 Nf3
C00	French Defence: La Bourdonnais Variation	e4 e6 f4
C00	French Defence: Normal Variation	e4 e6 d4
C00	French Defence: Queen’s Knight	e4 e6 Nc3
C00	French Defence: Réti-Spielmann Attack	e4 e6 g3
C00	French Defence: Steiner Variation	e4 e6 c4
C00	French Defence: Steinitz Attack	e4 e6 e5
C00	French Defence	e4 e6 d4 d5
C00	French Defence: Baeuerle Gambit	e4 e6 d4 b5
C00	French Defence: Franco-Hiva Gambit	e4 e6 d4 f5
C00	French Defence: Franco-Sicilian Defence	e4 e6 d4 c5
C00	French Defence: King’s Indian Attack, Franco-Hiva Gambit	e4 e6 d3 f5
C00	French Defence: Knight Variation, Franco-Hiva Gambit	e4 e6 Nf3 f5
C00	French Defence: Mediterranean Defence	e4 e6 d4 Nf6
C00	French Defence: St. George Defence	e4 e6 d4 a6
C00	Rat Defence: Small Center Defence	d4 e6 e4 d6
C00	French Defence: Alapin Gambit	e4 e6 d4 d5 Be3
C00	French Defence: Banzai-Leong Gambit, Pinova Gambit	e4 e6 b4 Bxb4 e5
C00	French Defence: Diemer-Duhm Gambit	e4 e6 d4 d5 c4
C00	French Defence: Franco-Hiva Gambit Accepted	e4 e6 d4 f5 exf5
C00	French Defence: Horwitz Attack, Papa-Ticulat Gambit	e4 e6 b3 d5 Bb2
C00	French Defence: Morphy Gambit	e4 e6 d4 d5 Nh3
C00	French Defence: Pelikan Variation	e4 e6 Nc3 d5 f4
C00	French Defence: Perseus Gambit	e4 e6 d4 d5 Nf3
C00	French Defence: Schlechter Variation	e4 e6 d4 d5 Bd3
C00	French Defence: St. George Defence, Three Pawn Attack	e4 e6 d4 a6 c4
C00	French Defence: Two Knights Variation	e4 e6 Nf3 d5 Nc3
C00	French Defence: Diemer-Duhm Gambit Accepted	e4 e6 d4 d5 c4 dxe4
C00	French Defence: La Bourdonnais Variation, Reuter Gambit	e4 e6 f4 d5 Nf3 dxe4
C00	French Defence: St. George Defence, Sanky-George Gambit	e4 e6 d4 a6 c4 b5
C00	French Defence: Carlson Gambit	e4 e6 d4 d5 Nf3 dxe4 Ne5
C00	French Defence: Orthoschnapp Gambit	e4 e6 c4 d5 cxd5 exd5 Qb3
C00	French Defence: Wing Gambit	e4 e6 Nf3 d5 e5 c5 b4
C00	French Defence: Hoffmann Gambit	e4 e6 d4 d5 Qe2 e5 f4 exf4
C00	French Defence: St. George Defence, St. George Gambit	e4 e6 d4 a6 c4 b5 cxb5 axb5
C00	French Defence: Reversed Philidor Formation	e4 e6 d3 d5 Nd2 Nf6 Ngf3 Nc6 Be2
C00	French Defence: St. George Defence, Traditional Line	e4 e6 d4 a6 Nf3 b5 Bd3 c5 c3 Bb7 O-O Nf6
C01	French Defence: Exchange Variation	e4 e6 d4 d5 exd5
C01	French Defence: Exchange Variation	e4 e6 d4 d5 exd5 exd5 Nf3
C01	French Defence: Exchange Variation	e4 e6 d4 d5 exd5 exd5 Nc3
C01	French Defence: Exchange Variation, Monte Carlo Variation	e4 e6 d4 d5 exd5 exd5 c4
C01	French Defence: Exchange Variation, Svenonius Variation	e4 e6 d4 d5 Nc3 Nf6 exd5 exd5 Bg5
C01	French Defence: Exchange Variation, Bogoljubow Variation	e4 e6 d4 d5 exd5 exd5 Nc3 Nf6 Bg5 Nc6
C02	French Defence: Advance Variation	e4 e6 d4 d5 e5
C02	French Defence: Advance Variation	e4 e6 d4 d5 e5 c5
C02	French Defence: Advance Variation, Extended Bishop Swap	e4 e6 d4 d5 e5 Bd7
C02	French Defence: Advance Variation	e4 e6 d4 d5 e5 c5 c3
C02	French Defence: Advance Variation, Frenkel Gambit	e4 e6 d4 d5 e5 c5 b4
C02	French Defence: Advance Variation, Nimzowitsch Attack	e4 e6 d4 d5 e5 c5 Qg4
C02	French Defence: Advance Variation, Nimzowitsch System	e4 e6 d4 d5 e5 c5 Nf3
C02	French Defence: Advance Variation, Steinitz Variation	e4 e6 d4 d5 e5 c5 dxc5
C02	French Defence: Advance Variation	e4 e6 d4 d5 e5 c5 c3 Nc6
C02	French Defence: Advance Variation, Kupreichik Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Be3
C02	French Defence: Advance Variation, Nimzowitsch Gambit	e4 e6 d4 d5 e5 c5 Qg4 cxd4 Nf3
C02	French Defence: Advance Variation, Paulsen Attack	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3
C02	French Defence: Advance Variation, Ruisdonk Gambit	e4 e6 d4 d5 e5 c5 Nf3 cxd4 Bd3
C02	French Defence: Advance Variation, Euwe Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Bd7
C02	French Defence: Advance Variation, Wade Variation	e4 e6 d4 d5 e5 c5 c3 Qb6 Nf3 Bd7
C02	French Defence: Advance Variation, Main Line	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3
C02	French Defence: Advance Variation, Milner-Barry Gambit	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3
C02	French Defence: Advance Variation, Lputian Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 a3 Nh6
C02	French Defence: Advance Variation, Milner-Barry Gambit, Hector Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 O-O
C02	French Defence: Advance Variation, Milner-Barry Gambit, Hector Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 O-O Bd7 Re1
C02	French Defence: Advance Variation, Milner-Barry Gambit, Main Line	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 cxd4 Bd7 O-O
C02	French Defence: Advance Variation, Milner-Barry Gambit, Sørensen Variation	e4 e6 d4 d5 e5 c5 c3 Nc6 Nf3 Qb6 Bd3 cxd4 cxd4 Bd7 O-O Nxd4 Ng5
C03	French Defence: Tarrasch Variation	e4 e6 d4 d5 Nd2
C03	French Defence: Tarrasch Variation, Guimard Defence	e4 e6 d4 d5 Nd2 Nc6
C03	French Defence: Tarrasch Variation, Haberditz Variation	e4 e6 d4 d5 Nd2 f5
C03	French Defence: Tarrasch Variation, Modern System	e4 e6 d4 d5 Nd2 a6
C03	French Defence: Tarrasch Variation, Morozevich Variation	e4 e6 d4 d5 Nd2 Be7
C03	French Defence: Tarrasch Variation, Guimard Defence, Thunderbunny Variation	e4 e6 d4 d5 Nd2 Nc6 c3 dxe4 Nxe4 e5
C04	French Defence: Tarrasch Variation, Guimard Defence, Main Line	e4 e6 d4 d5 Nd2 Nc6 Ngf3 Nf6
C05	French Defence: Tarrasch Variation, Closed Variation	e4 e6 d4 d5 Nd2 Nf6
C05	French Defence: Tarrasch Variation, Pawn Center Variation	e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 f4
C05	French Defence: Tarrasch Variation, Botvinnik Variation	e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 b6
C05	French Defence: Tarrasch Variation, Closed Variation	e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6
C06	French Defence: Tarrasch Variation, Closed Variation, Main Line	e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4
C06	French Defence: Tarrasch Variation, Leningrad Variation	e4 e6 d4 d5 Nd2 Nf6 e5 Nfd7 Bd3 c5 c3 Nc6 Ne2 cxd4 cxd4 Nb6
C07	French Defence: Tarrasch Variation, Open System	e4 e6 d4 d5 Nd2 c5
C07	French Defence: Tarrasch Variation, Open System, Euwe-Keres Line	e4 e6 d4 d5 Nd2 c5 Ngf3
C07	French Defence: Tarrasch Variation, Open System, Süchting Line	e4 e6 d4 d5 Nd2 c5 c3
C07	French Defence: Tarrasch Variation, Chistyakov Defence	e4 e6 d4 d5 Nd2 c5 exd5 Qxd5
C07	French Defence: Tarrasch Variation, Open System, Shaposhnikov Gambit	e4 e6 d4 d5 Nd2 c5 exd5 Nf6
C07	French Defence: Tarrasch Variation, Eliskases Variation	e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd8
C07	French Defence: Tarrasch Variation, Chistyakov Defence, Modern Line	e4 e6 d4 d5 Nd2 c5 exd5 Qxd5 Ngf3 cxd4 Bc4 Qd6 O-O Nf6 Nb3 Nc6 Nbxd4 Nxd4 Nxd4 a6
C08	French Defence: Tarrasch Variation, Open System	e4 e6 d4 d5 Nd2 c5 exd5 exd5
C08	French Defence: Tarrasch Variation, Open System, Advance Line	e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 c4
C09	French Defence: Tarrasch Variation, Open System, Main Line	e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nc6
C09	French Defence: Tarrasch Variation, Open System, Main Line	e4 e6 d4 d5 Nd2 c5 exd5 exd5 Ngf3 Nc6 Bb5 Bd6 dxc5 Bxc5 O-O Ne7 c3
C10	French Defence: Paulsen Variation	e4 e6 d4 d5 Nc3
C10	French Defence: Hecht-Reefschläger Variation	e4 e6 d4 d5 Nc3 Nc6
C10	French Defence: Marshall Gambit	e4 e6 d4 d5 Nc3 c5
C10	French Defence: Rubinstein Variation	e4 e6 d4 d5 Nc3 dxe4
C10	French Defence: Rubinstein Variation, Blackburne Defence	e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7
C10	French Defence: Rubinstein Variation, Ellis Gambit	e4 e6 d4 d5 Nc3 dxe4 Nxe4 e5
C10	French Defence: Rubinstein Variation, Maric Variation	e4 e6 d4 d5 Nc3 dxe4 Nxe4 Qd5
C10	French Defence: Rubinstein Variation, Fort Knox Variation	e4 e6 d4 d5 Nc3 dxe4 Nxe4 Bd7 Nf3 Bc6
C10	French Defence: Rubinstein Variation, Capablanca Line	e4 e6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 Ne5
C10	French Defence: Rubinstein Variation, Kasparov Attack	e4 e6 d4 d5 Nd2 dxe4 Nxe4 Nd7 Nf3 Ngf6 Nxf6+ Nxf6 c3
C11	French Defence: Classical Variation	e4 e6 d4 d5 Nc3 Nf6
C11	French Defence: Classical Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5
C11	French Defence: Classical Variation, Delayed Exchange Variation	e4 e6 d4 d5 Nc3 Nf6 exd5
C11	French Defence: Classical Variation, Steinitz Variation	e4 e6 d4 d5 Nc3 Nf6 e5
C11	French Defence: Classical Variation, Swiss Variation	e4 e6 d4 d5 Nc3 Nf6 Bd3
C11	French Defence: Henneberger Variation	e4 e6 d4 d5 Nc3 Nf6 Be3
C11	French Defence: Classical Variation, Burn Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4
C11	French Defence: Classical Variation, Shirov-Anand Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 Nce2
C11	French Defence: Steinitz Variation, Gledhill Attack	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 Qg4
C11	French Defence: Steinitz Variation	e4 e6 d4 d5 Nc3 a6 Nf3 Nf6 e5 Nfd7
C11	French Defence: Steinitz Variation	e4 e6 d4 d5 Nc3 a6 Nf3 Nf6 e5 Nfd7 a3
C11	French Defence: Steinitz Variation	e4 e6 d4 d5 Nc3 a6 Nf3 Nf6 e5 Nfd7 Ne2
C11	French Defence: Steinitz Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3
C11	French Defence: Classical Variation, Burn Variation, Morozevich Line	e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4 Be7 Bxf6 gxf6
C11	French Defence: Steinitz Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 dxc5 Nc6
C11	French Defence: Steinitz Variation, Boleslavsky Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 Nf3 Nc6 Be3
C11	French Defence: Steinitz Variation, Bradford Attack Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 dxc5 Bxc5 Qg4
C11	French Defence: Classical Variation, Burn Variation, Main Line	e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4 Be7 Bxf6 Bxf6 Nf3 O-O
C11	French Defence: Steinitz Variation, Brodsky-Jones Variation	e4 e6 d4 d5 Nc3 Nf6 e5 Nfd7 f4 c5 dxc5 Nc6 a3 Bxc5 Qg4 O-O Nf3 f6
C12	French Defence: McCutcheon Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4
C12	French Defence: McCutcheon Variation, Advance Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5
C12	French Defence: McCutcheon Variation, Exchange Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 exd5
C12	French Defence: McCutcheon Variation, Bernstein Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bh4
C12	French Defence: McCutcheon Variation, Chigorin Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 exf6
C12	French Defence: McCutcheon Variation, Dr. Olland Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bc1
C12	French Defence: McCutcheon Variation, Janowski Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Be3
C12	French Defence: McCutcheon Variation, Lasker Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Bxc3
C12	French Defence: McCutcheon Variation, Tartakower Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Nfd7
C12	French Defence: McCutcheon Variation, Bogoljubow Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 exd5 Qxd5 Bxf6 gxf6 Qd2 Qa5
C12	French Defence: McCutcheon Variation, Lasker Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 Bd2 Bxc3 bxc3 Ne4 Qg4 g6
C12	French Defence: McCutcheon Variation, Duras Variation	e4 e6 Nc3 d5 d4 Nf6 Bg5 Bb4 e5 h6 Bd2 Bxc3 bxc3 Ne4 Qg4 Kf8 Bc1
C12	French Defence: McCutcheon Variation, Grigoriev Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Bb4 e5 h6 exf6 hxg5 fxg7 Rg8 h4 gxh4 Qg4
C13	French Defence: Classical Variation, Normal Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7
C13	French Defence: Classical Variation, Richter Attack	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 Bxf6
C13	French Defence: Classical Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 dxe4 Nxe4 Be7
C13	French Defence: Classical Variation, Tartakower Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Ne4
C13	French Defence: Classical Variation, Vistaneckis Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Ng8
C13	French Defence: Alekhine-Chatard Attack	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4
C13	French Defence: Alekhine-Chatard Attack, Breyer Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 c5
C13	French Defence: Alekhine-Chatard Attack, Maróczy Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 a6
C13	French Defence: Alekhine-Chatard Attack, Spielmann Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 O-O
C13	French Defence: Alekhine-Chatard Attack, Teichmann Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 f6
C13	French Defence: Classical Variation, Frankfurt Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Ng8 Be3 b6
C13	French Defence: Classical Variation, Richter Attack	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 Bxf6 Bxf6 e5 Be7 Qg4
C13	French Defence: Alekhine-Chatard Attack, Albin-Chatard Gambit	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 h4 Bxg5 hxg5 Qxg5
C14	French Defence: Classical Variation	e4 e6 d4 d5 Nc3 a6 Nf3 Nf6 e5 Nfd7 Bg5
C14	French Defence: Classical Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7
C14	French Defence: Classical Variation, Alapin Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Nb5
C14	French Defence: Classical Variation, Pollock Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Qg4
C14	French Defence: Classical Variation, Rubinstein Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Qd2
C14	French Defence: Classical Variation, Steinitz Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4
C14	French Defence: Classical Variation, Tarrasch Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 Bd3
C14	French Defence: Classical Variation, Stahlberg Variation	e4 e6 d4 d5 Nc3 Nf6 Bg5 Be7 e5 Nfd7 Bxe7 Qxe7 f4 O-O Nf3 c5 Qd2 Nc6 O-O-O c4
C15	French Defence: Winawer Variation	e4 e6 d4 d5 Nc3 Bb4
C15	French Defence: Winawer Variation, Alekhine-Maróczy Gambit	e4 e6 d4 d5 Nc3 Bb4 Ne2
C15	French Defence: Winawer Variation, Delayed Exchange Variation	e4 e6 d4 d5 Nc3 Bb4 exd5
C15	French Defence: Winawer Variation, Fingerslip Variation	e4 e6 d4 d5 Nc3 Bb4 Bd2
C15	French Defence: McCutcheon Variation, Wolf Gambit	e4 e6 d4 d5 Nc3 Bb4 Ne2 Nf6 Bg5
C15	French Defence: Winawer Variation, Fingerslip Variation, Schwarz’s Line	e4 e6 d4 d5 Nc3 Bb4 Bd2 Ne7 Nb1
C15	French Defence: Winawer Variation, Alekhine Gambit Accepted	e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4 a3 Bxc3+
C15	French Defence: Winawer Variation, Fingerslip Variation, Kunin Double Gambit	e4 e6 d4 d5 Nc3 Bb4 Bd2 dxe4 Qg4 Qxd4
C15	French Defence: Winawer Variation, Exchange Variation, Canal Attack	e4 e6 d4 d5 Nc3 Bb4 exd5 exd5 Bd3 Ne7 Qh5
C15	French Defence: Winawer Variation, Kondratiyev Variation	e4 e6 d4 d5 Nc3 Bb4 Bd3 c5 exd5 Qxd5 Bd2
C15	French Defence: Winawer Variation, Winckelmann-Reimer Gambit	e4 e6 d4 d5 Nc3 Bb4 a3 Bxc3+ bxc3 dxe4 f3
C15	French Defence: Winawer Variation, Alekhine Gambit, Kan Variation	e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4 a3 Bxc3+ Nxc3 Nc6
C15	French Defence: Winawer Variation, Fingerslip Variation, Main Line	e4 e6 d4 d5 Nc3 Bb4 Bd2 dxe4 Qg4 Nf6 Qxg7 Rg8 Qh6
C15	French Defence: Winawer Variation, Alekhine Gambit, Alatortsev Variation	e4 e6 d4 d5 Nc3 Bb4 Ne2 dxe4 a3 Be7 Nxe4 Nf6 N2g3 O-O Be2 Nc6
C16	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5
C16	French Defence: Winawer Variation, Petrosian Variation	e4 e6 d4 d5 Nc3 Bb4 e5 Qd7
C17	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5
C17	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3
C17	French Defence: Winawer Variation, Advance Variation, Moscow Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 Qg4
C17	French Defence: Winawer Variation, Bogoljubow Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 Bd2
C17	French Defence: Winawer Variation, Retreat Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Ba5
C17	French Defence: Winawer Variation, Bogoljubow Variation, Icelandic Defence	e4 e6 d4 d5 Nc3 Bb4 e5 c5 Bd2 Ne7 f4
C17	French Defence: Winawer Variation, Maróczy-Wallis Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 cxd4 axb4 dxc3
C17	French Defence: Winawer Variation, Retreat Variation, Armenian Line	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Ba5 b4 cxd4
C17	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 cxd4 axb4 dxc3 Nf3
C18	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3
C18	French Defence: Winawer Variation, Advance Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7
C18	French Defence: Winawer Variation, Classical Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Qc7
C18	French Defence: Winawer Variation, Portisch-Hook Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Qa5
C18	French Defence: Winawer Variation, Advance Variation, with Bd3	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Bd3
C18	French Defence: Winawer Variation, Advance Variation, with h4	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 h4
C18	French Defence: Winawer Variation, Advance Variation, with Bd3	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Bd3 Qc7
C18	French Defence: Winawer Variation, Advance Variation, with h4	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 h4 Qc7
C18	French Defence: Winawer Variation, Eingorn Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Kf8
C18	French Defence: Winawer Variation, Poisoned Pawn Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7
C18	French Defence: Winawer Variation, Warsaw Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 O-O
C18	French Defence: Winawer Variation, Poisoned Pawn Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 cxd4 Qxg7
C18	French Defence: Winawer Variation, Poisoned Pawn Variation Declined	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Bd3
C18	French Defence: Winawer Variation, Poisoned Pawn Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 cxd4 Qxg7 Rg8 Qxh7 Nbc6
C18	French Defence: Winawer Variation, Poisoned Pawn Variation, Main Line	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Ne2
C18	French Defence: Winawer Variation, Poisoned Pawn Variation, Paoli Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Qg4 Qc7 Qxg7 Rg8 Qxh7 cxd4 Kd1
C19	French Defence: Winawer Variation, Advance Variation, Smyslov Variation	e4 e6 d4 d5 Nc3 Bb4 e5 Ne7 a3 Bxc3+ bxc3 c5 a4
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Nf3
C19	French Defence: Winawer Variation, Advance Variation, Smyslov Variation	e4 e6 d4 d5 Nc3 Bb4 e5 Ne7 a3 Bxc3+ bxc3 c5 a4 Qc7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Nc6 Nf3 Nge7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Nf3 Qc7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Nf3 Qc7 h4
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 Bd3 Nbc6 Nf3
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Nc6 Nf3 Qa5 Bd2 Nge7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3 Qa5 Qd2
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3 Qa5 Bd2
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3 Qa5 Qd2 Bd7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3 Qa5 Bd2 Bd7
C19	French Defence: Winawer Variation, Positional Variation	e4 e6 d4 d5 Nc3 Bb4 e5 c5 a3 Bxc3+ bxc3 Ne7 a4 Nbc6 Nf3 Qa5 Bd2 c4
C20	King’s Pawn Game	e4 e5
C20	Bongcloud Attack	e4 e5 Ke2
C20	Center Game	e4 e5 d4
C20	English Opening: The Whale	e4 e5 c4
C20	King’s Pawn Game: Alapin Opening	e4 e5 Ne2
C20	King’s Pawn Game: King’s Head Opening	e4 e5 f3
C20	King’s Pawn Game: Leonardis Variation	e4 e5 d3
C20	King’s Pawn Game: MacLeod Attack	e4 e5 c3
C20	King’s Pawn Game: Mengarini’s Opening	e4 e5 a3
C20	King’s Pawn Game: Napoleon Attack	e4 e5 Qf3
C20	King’s Pawn Game: Tortoise Opening	e4 e5 Bd3
C20	King’s Pawn Game: Wayward Queen Attack	e4 e5 Qh5
C20	King’s Pawn Opening	e4 e5 b3
C20	Portuguese Opening	e4 e5 Bb5
C20	King’s Pawn Game: Bavarian Gambit	e4 e5 c4 d5
C20	King’s Pawn Game: Beyer Gambit	e4 e5 d4 d5
C20	King’s Pawn Game: Clam Variation, King’s Gambit Reversed	e4 e5 d3 f5
C20	King’s Pawn Game: MacLeod Attack, Lasa Gambit	e4 e5 c3 f5
C20	King’s Pawn Game: Wayward Queen Attack, Kiddie Countergambit	e4 e5 Qh5 Nf6
C20	Barnes Opening: Walkerling	f3 e5 e4 Nf6 Bc4
C20	King’s Pawn Game: King’s Head Opening	e4 e5 f3 Nf6 Nc3
C20	King’s Pawn Opening: Speers	e4 e5 Qg4 Nf6 Qf5
C20	Portuguese Opening: Miguel Gambit	e4 e5 Bb5 Bc5 b4
C20	Portuguese Opening: Portuguese Gambit	e4 e5 Bb5 Nf6 d4
C20	King’s Pawn Game: Clam Variation, Radisch Gambit	e4 e5 d3 Nf6 f4 Bc5
C20	King’s Pawn Game: MacLeod Attack, Norwalde Gambit	e4 e5 c3 d5 Qh5 Bd6
C20	King’s Pawn Game: Philidor Gambit	e4 e5 d4 d6 dxe5 Bd7
C20	King’s Pawn Game: Weber Gambit	e4 e5 d3 d5 exd5 c6 dxc6 Nxc6
C20	King’s Pawn Game: Wayward Queen Attack, Mellon Gambit	e4 e5 Qh5 Nc6 Bc4 Nh6 d3 g6 Qf3 f6 Ne2 d5
C20	King’s Pawn Opening: Van Hooydoon Gambit	e4 e5 Qe2 Nc6 c3 Nf6 Nf3 Bc5 d4 exd4 cxd4 Nxd4
C21	Center Game Accepted	e4 e5 d4 exd4
C21	Center Game	e4 e5 d4 exd4 Qxd4
C21	Center Game: Halasz-McDonnell Gambit	e4 e5 d4 exd4 f4
C21	Center Game: Kieseritzky Variation	e4 e5 d4 exd4 Nf3
C21	Center Game: Ross Gambit	e4 e5 d4 exd4 Bd3
C21	Center Game: von der Lasa Gambit	e4 e5 d4 exd4 Bc4
C21	Danish Gambit	e4 e5 d4 exd4 c3
C21	Center Game: Kieseritzky Variation	e4 e5 d4 exd4 Nf3 c5
C21	Danish Gambit Accepted	e4 e5 d4 exd4 c3 dxc3
C21	Danish Gambit Accepted: Svenonius Defence	e4 e5 d4 exd4 c3 Ne7
C21	Danish Gambit Declined: Sörensen Defence	e4 e5 d4 exd4 c3 d5
C21	Center Game: Kieseritzky Variation	e4 e5 d4 exd4 Nf3 c5 Bc4
C21	Center Game: Lanc-Arnold Gambit	e4 e5 d4 exd4 Nf3 Bc5 c3
C21	Center Game: Halasz-McDonnell Gambit, Crocodile Variation	e4 e5 d4 exd4 f4 Bc5 Nf3 Nc6 c3
C21	Center Game: Lanc-Arnold Gambit, Schippler Gambit	e4 e5 d4 exd4 Nf3 Bc5 c3 dxc3 Bc4
C21	Danish Gambit Accepted: Chigorin Defence	e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 Qe7
C21	Danish Gambit Accepted: Classical Defence	e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 Nf6
C21	Danish Gambit Accepted: Copenhagen Defence	e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 Bb4+
C21	Danish Gambit Accepted: Schlechter Defence	e4 e5 d4 exd4 c3 dxc3 Bc4 cxb2 Bxb2 d5
C22	Center Game: Normal Variation	e4 e5 d4 exd4 Qxd4 Nc6
C22	Center Game: Hall Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qc4
C22	Center Game: Paulsen Attack Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qe3
C22	Center Game: Berger Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qe3 Nf6
C22	Center Game: l’Hermet Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qe3 f5
C22	Center Game: Charousek Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qe3 Bb4+ c3 Be7
C22	Center Game: Kupreichik Variation	e4 e5 d4 exd4 Qxd4 Nc6 Qe3 Nf6 Nc3 Bb4 Bd2 O-O O-O-O Re8 Bc4 d6 Nh3
C23	Bishop’s Opening	e4 e5 Bc4
C23	Bishop’s Opening: Boi Variation	e4 e5 Bc4 Bc5
C23	Bishop’s Opening: Calabrese Countergambit	e4 e5 Bc4 f5
C23	Bishop’s Opening: Khan Gambit	e4 e5 Bc4 d5
C23	Bishop’s Opening: Philidor Counterattack	e4 e5 Bc4 c6
C23	Bishop’s Opening: Calabrese Countergambit, Jaenisch Variation	e4 e5 Bc4 f5 d3
C23	Bishop’s Opening: Lewis Gambit	e4 e5 Bc4 Bc5 d4
C23	Bishop’s Opening: Lopez Variation	e4 e5 Bc4 Bc5 Qe2
C23	Bishop’s Opening: McDonnell Gambit	e4 e5 Bc4 Bc5 b4
C23	Bishop’s Opening: Philidor Variation	e4 e5 Bc4 Bc5 c3
C23	Bishop’s Opening: Stein Gambit	e4 e5 Bc4 Bc5 f4
C23	Bishop’s Opening: Anderssen Gambit	e4 e5 Bc4 b5 Bxb5 c6
C23	Bishop’s Opening: del Rio Variation	e4 e5 Bc4 Bc5 c3 Qg5
C23	Bishop’s Opening: Lewis Countergambit	e4 e5 Bc4 Bc5 c3 d5
C23	Bishop’s Opening: Thorold Gambit	e4 e5 Bc4 b5 Bxb5 f5
C23	Bishop’s Opening: Lopez Variation, Lopez Gambit	e4 e5 Bc4 Bc5 Qe2 Nf6 f4
C23	Bishop’s Opening: McDonnell Gambit, La Bourdonnais-Denker Gambit	e4 e5 Bc4 Bc5 b4 Bxb4 c3
C23	Bishop’s Opening: McDonnell Gambit, McDonnell Double Gambit	e4 e5 Bc4 Bc5 b4 Bxb4 f4
C23	Bishop’s Opening: Lewis Countergambit	e4 e5 Bc4 Bc5 c3 d5 Bxd5 Nf6
C23	Bishop’s Opening: Lewis Countergambit, Walker Variation	e4 e5 Bc4 Bc5 c3 d5 Bxd5 Nf6 d4
C23	Bishop’s Opening: Lopez Gambit	e4 e5 Bc4 Bc5 Qe2 Nc6 c3 Nf6 f4
C23	Bishop’s Opening: Pratt Variation	e4 e5 Bc4 Bc5 c3 Nf6 d4 exd4 e5 d5 exf6 dxc4 Qh5 O-O
C23	Bishop’s Opening: Lisitsyn Variation	e4 e5 Bc4 c6 d4 d5 exd5 cxd5 Bb5+ Bd7 Bxd7+ Nxd7 dxe5 Nxe5 Ne2
C23	Bishop’s Opening: Four Pawns Gambit	e4 e5 Bc4 Bc5 b4 Bxb4 f4 exf4 Nf3 Be7 d4 Bh4+ g3 fxg3 O-O gxh2+ Kh1
C24	Bishop’s Opening: Berlin Defence	e4 e5 Bc4 Nf6
C24	Bishop’s Opening: Berlin Defence, Greco Gambit	e4 e5 Bc4 Nf6 f4
C24	Bishop’s Opening: Ponziani Gambit	e4 e5 Bc4 Nf6 d4
C24	Bishop’s Opening: Paulsen Defence	e4 e5 Bc4 Nf6 d3 c6
C24	Bishop’s Opening: Pachman Gambit	e4 e5 Bc4 Nf6 Ne2 Nxe4 Nec3
C24	Bishop’s Opening: Vienna Hybrid	e4 e5 Bc4 Nf6 d3 Nc6 Nc3
C24	Bishop’s Opening: Warsaw Gambit	e4 e5 Bc4 Nf6 d4 exd4 c3
C24	Bishop’s Opening: Kitchener Folly	e4 e5 Bc4 Nf6 d3 Be7 Nf3 O-O
C24	Bishop’s Opening: Krejcik Gambit	e4 e5 Bc4 Nf6 f3 Bc5 Ne2 Nc6 b4
C24	Bishop’s Opening: Urusov Gambit, Panov Variation	e4 e5 Bc4 Nf6 d4 exd4 Nf3 d5 exd5 Bb4+ c3 Qe7+
C25	Vienna Game	e4 e5 Nc3
C25	Vienna Game: Anderssen Defence	e4 e5 Nc3 Bc5
C25	Vienna Game: Max Lange Defence	e4 e5 Nc3 Nc6
C25	Vienna Gambit, with Max Lange Defence	e4 e5 Nc3 Nc6 f4
C25	Vienna Game: Fyfe Gambit	e4 e5 Nc3 Nc6 d4
C25	Vienna Game: Giraffe Attack	e4 e5 Nc3 Bc5 Qg4
C25	Vienna Game: Hamppe-Meitner Variation	e4 e5 Nc3 Bc5 Na4
C25	Vienna Game: Omaha Gambit	e4 e5 Nc3 d6 f4
C25	Vienna Game: Paulsen Variation	e4 e5 Nc3 Nc6 g3
C25	Vienna Game: Philidor Countergambit	e4 e5 Nc3 Nc6 d4 f5
C25	Vienna Game: Zhuravlev Countergambit	e4 e5 Nc3 Bb4 Qg4 Nf6
C25	Vienna Gambit, with Max Lange Defence: Knight Variation	e4 e5 Nc3 Nc6 f4 exf4 Nf3
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit	e4 e5 Nc3 Nc6 f4 exf4 d4
C25	Vienna Gambit, with Max Lange Defence: Cunningham Defence	e4 e5 Nc3 Nc6 f4 exf4 Nf3 Be7
C25	Vienna Gambit, with Max Lange Defence: Quelle Gambit	e4 e5 Nc3 Nc6 f4 Bc5 fxe5 d6
C25	Vienna Gambit, with Max Lange Defence: Pierce Gambit	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 d4
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit, Main Line	e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2
C25	Vienna Game: Stanley Variation, Meitner-Mieses Gambit	e4 e5 Nc3 Nc6 Bc4 Bc5 Qg4 Qf6 Nd5
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit, Fraser-Minckwitz Defence	e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 b6
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit, Paulsen Defence	e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 d6
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit, Sörensen Defence	e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 g5
C25	Vienna Gambit, with Max Lange Defence: Steinitz Gambit, Zukertort Defence	e4 e5 Nc3 Nc6 f4 exf4 d4 Qh4+ Ke2 d5
C25	Vienna Game: Paulsen Variation	e4 e5 Nc3 Nc6 g3 Nf6 Bg2 Bc5 Nge2 d5
C25	Vienna Game: Paulsen Variation, Mariotti Gambit	e4 e5 Nc3 Nc6 g3 Bc5 Bg2 h5 Nf3 h4
C25	Vienna Gambit, with Max Lange Defence: Hamppe-Allgaier Gambit	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 h4 g4 Ng5
C25	Vienna Game: Hamppe-Muzio Gambit	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 Bc4 g4 O-O
C25	Vienna Gambit, with Max Lange Defence: Hamppe-Allgaier Gambit, Alapin Variation	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 h4 g4 Ng5 d6
C25	Vienna Gambit, with Max Lange Defence: Hamppe-Muzio Gambit	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3
C25	Vienna Gambit, with Max Lange Defence: Hamppe-Allgaier Gambit, Thorold Variation	e4 e5 f4 exf4 Nf3 Nc6 Nc3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 d4
C25	Vienna Game: Hamppe-Muzio, Dubois Variation	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Ne5 Qxf4 Qf6
C25	Vienna Game: Pierce Gambit, Rushmere Attack	e4 e5 Nc3 Nc6 f4 exf4 Nf3 g5 d4 g4 Bc4 gxf3 O-O d5 exd5 Bg4 dxc6
C26	Vienna Game: Falkbeer Variation	e4 e5 Nc3 Nf6
C26	Vienna Game: Mengarini Variation	e4 e5 Nc3 Nf6 a3
C26	Vienna Game: Mieses Variation	e4 e5 Nc3 Nf6 g3
C26	Vienna Game: Stanley Variation	e4 e5 Nc3 Nf6 Bc4
C26	Bishop’s Opening: Horwitz Gambit	e4 e5 Bc4 Nf6 Nc3 b5
C26	Vienna Game: Stanley Variation, Reversed Spanish	e4 e5 Nc3 Nf6 Bc4 Bb4
C26	Bishop’s Opening: Vienna Hybrid, Spielmann Attack	e4 e5 Nc3 Nf6 Bc4 Bc5 d3
C26	Vienna Game: Mieses Variation, Erben Gambit	e4 e5 Nc3 Nf6 g3 d5 exd5 c6
C26	Vienna Game: Stanley Variation, Eifel Gambit	e4 e5 Nc3 Nf6 Bc4 Bc5 Nge2 b5
C26	Vienna Game: Paulsen Variation, Pollock Gambit	e4 e5 Nc3 Nf6 g3 Bc5 Bg2 Nc6 Nge2 d5 exd5
C27	Vienna Game: Frankenstein-Dracula Variation	e4 e5 Nc3 Nf6 Bc4 Nxe4
C27	Bishop’s Opening: Boden-Kieseritzky Gambit	e4 e5 Nf3 Nf6 Bc4 Nxe4 Nc3
C27	Bishop’s Opening: Boden-Kieseritzky Gambit, Lichtenhein Defence	e4 e5 Nf3 Nf6 Bc4 Nxe4 Nc3 d5
C27	Vienna Game: Stanley Variation, Monster Declined	e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Be7
C27	Vienna Game: Adams’ Gambit	e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Nc6 d4
C27	Vienna Game: Stanley Variation, Alekhine Variation	e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Be7 Nf3 Nc6 Nxe5
C27	Vienna Game: Stanley Variation, Frankenstein-Dracula Variation	e4 e5 Nc3 Nf6 Bc4 Nxe4 Qh5 Nd6 Bb3 Nc6 Nb5 g6 Qf3 f5 Qd5 Qe7 Nxc7+ Kd8 Nxa8 b6
C28	Vienna Game: Stanley Variation, Three Knights Variation	e4 e5 Nc3 Nc6 Bc4 Nf6
C28	Bishop’s Opening: Vienna Hybrid, Hromádka Variation	e4 e5 Nc3 Nc6 Bc4 Nf6 d3 Bb4 Ne2
C28	Vienna Game: Stanley Variation, Bronstein Gambit	e4 e5 Nc3 Nc6 Bc4 Nf6 f4 Nxe4 Nf3
C29	Vienna Game: Vienna Gambit	e4 e5 Nc3 Nf6 f4
C29	Vienna Game: Vienna Gambit, Main Line	e4 e5 Nc3 Nf6 f4 d5
C29	Vienna Game: Vienna Gambit, Steinitz Variation	e4 e5 Nc3 Nf6 f4 d5 d3
C29	Vienna Game: Vienna Gambit, Modern Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 d3
C29	Vienna Game: Vienna Gambit, Paulsen Attack	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Qf3
C29	Vienna Game: Vienna Gambit, Bardeleben Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Qf3 f5
C29	Vienna Game: Vienna Gambit, Breyer Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7
C29	Vienna Game: Heyde Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Qf3 f5 d4
C29	Vienna Game: Vienna Gambit, Kaufmann Variation	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Bg4 Qe2
C29	Vienna Game: Vienna Gambit, Wurzburger Trap	e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 d3 Qh4+ g3 Nxg3 Nf3 Qh5 Nxd5
C30	King’s Gambit	e4 e5 f4
C30	King’s Gambit Declined: Classical Variation	e4 e5 f4 Bc5
C30	King’s Gambit Declined: Keene’s Defence	e4 e5 f4 Qh4+
C30	King’s Gambit Declined: Mafia Defence	e4 c5 f4 e5
C30	King’s Gambit Declined: Norwalde Variation	e4 e5 f4 Qf6
C30	King’s Gambit Declined: Panteldakis Countergambit	e4 e5 f4 f5
C30	King’s Gambit Declined: Petrov’s Defence	e4 e5 f4 Nf6
C30	King’s Gambit Declined: Queen’s Knight Defence	e4 e5 f4 Nc6
C30	King’s Gambit Declined: Zilbermints Double Countergambit	e4 e5 f4 g5
C30	King’s Gambit Declined: Classical Variation, Walthoffen Attack	e4 e5 f4 Bc5 Qh5
C30	King’s Gambit Declined: Keene’s Defence	e4 e5 f4 Qh4+ g3
C30	King’s Gambit Declined: Keene Defence	e4 e5 f4 Qh4+ g3 Qe7
C30	King’s Gambit Declined: Miles Defence	e4 e5 f4 Nc6 Nf3 f5
C30	King’s Gambit Declined: Panteldakis Countergambit, Greco Variation	e4 e5 f4 f5 exf5 Qh4+
C30	King’s Gambit Declined: Panteldakis Countergambit, Schiller’s Defence	e4 e5 f4 f5 exf5 Bc5
C30	King’s Gambit Declined: Senechaud Countergambit	e4 e5 f4 Bc5 Nf3 g5
C30	King’s Gambit Declined: Soller-Zilbermints Gambit	e4 e5 f4 f6 fxe5 Nc6
C30	King’s Gambit Declined: Zilbermints Double Gambit	e4 e5 f4 Nc6 Nf3 g5
C30	King’s Gambit Declined: Classical Variation	e4 e5 f4 Bc5 Nf3 d6 c3
C30	King’s Gambit Declined: Classical Variation, Rotlewi Countergambit	e4 e5 f4 Bc5 Nf3 d6 b4
C30	King’s Gambit Declined: Classical, Soldatenkov Variation	e4 e5 f4 Bc5 Nf3 d6 fxe5
C30	King’s Gambit Declined: Norwalde Variation, Schubert Variation	e4 e5 f4 Qf6 Nc3 Qxf4 d4
C30	King’s Gambit Declined: Classical Variation, Rubinstein Countergambit	e4 e5 f4 Bc5 Nf3 d6 c3 f5
C30	King’s Gambit Declined: Classical, Hanham Variation	e4 e5 f4 Bc5 Nf3 d6 Nc3 Nd7
C30	King’s Gambit Declined: Hobbs-Zilbermints Gambit	e4 e5 f4 Nc6 Nf3 g5 fxg5 h6
C30	King’s Gambit Declined: Panteldakis Countergambit, Shirazi Line	e4 e5 f4 f5 exf5 exf4 Qh5+ Ke7
C30	King’s Gambit Declined: Norwalde Variation, Bücker Gambit	e4 e5 f4 Qf6 Nc3 Qxf4 Nf3 Bb4 Bc4
C30	King’s Gambit Declined: Classical Variation, Euwe Attack	e4 e5 f4 Bc5 Nf3 d6 c3 Bg4 fxe5 dxe5 Qa4+
C30	King’s Gambit Declined: Panteldakis Countergambit, Pawn Sacrifice Line	e4 e5 f4 f5 exf5 exf4 Qh5+ g6 fxg6 Qe7+ Kd1
C30	King’s Gambit Declined: Panteldakis Countergambit, Symmetrical Variation	e4 e5 f4 f5 exf5 exf4 Nf3 d5 d4 Bd6 Bd3
C30	King’s Gambit Declined: Classical, Réti Variation	e4 e5 f4 Bc5 Nf3 d6 c3 f5 fxe5 dxe5 d4 exd4 Bc4
C30	King’s Gambit Declined: Classical, Svenonius Variation	e4 e5 Bc4 Nc6 Nc3 Nf6 d3 Bc5 f4 d6 Nf3 Bg4 h3 Bxf3 Qxf3 exf4
C31	King’s Gambit Declined: Falkbeer Countergambit	e4 e5 f4 d5
C31	King’s Gambit Declined: Falkbeer Countergambit Accepted	e4 e5 f4 d5 exd5
C31	King’s Gambit Declined: Falkbeer Countergambit, Blackburne Attack	e4 e5 f4 d5 Nf3
C31	King’s Gambit Declined: Falkbeer Countergambit, Hinrichsen Gambit	e4 e5 f4 d5 d4
C31	King’s Gambit Declined: Falkbeer Countergambit, Milner-Barry Variation	e4 e5 f4 d5 Nc3
C31	King’s Gambit Declined: Falkbeer Countergambit, Miles Gambit	e4 e5 f4 d5 exd5 Bc5
C31	King’s Gambit Declined: Falkbeer Countergambit, Modern Transfer	e4 e5 f4 d5 exd5 exf4
C31	King’s Gambit Declined: Falkbeer Countergambit, Nimzowitsch-Marshall Countergambit	e4 e5 f4 d5 exd5 c6
C31	King’s Gambit Declined: Falkbeer Countergambit, Staunton Line	e4 e5 f4 d5 exd5 e4
C31	King’s Gambit Declined: Falkbeer Countergambit, Anderssen Attack	e4 e5 f4 d5 exd5 e4 Bb5+
C31	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit	e4 e5 f4 d5 exd5 e4 d3
C31	Van Geet Opening: Grünfeld Defence, Steiner Gambit	e4 e5 f4 d5 Nc3 dxe4 Nxe4
C31	King’s Gambit Declined: Falkbeer Countergambit, Pickler Gambit	e4 e5 f4 d5 exd5 c6 dxc6 Bc5
C31	King’s Gambit Declined: Falkbeer Countergambit, Rubinstein Variation	e4 e5 f4 d5 exd5 e4 Nc3 Nf6 Qe2
C31	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit, Morphy Defence	e4 e5 Nc3 Nf6 f4 d5 exd5 e4 d3 Bb4 Bd2 e3
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit Accepted	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit, Keres Variation	e4 e5 f4 d5 exd5 e4 d3 Nf6 Nd2
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit, Old Line	e4 e5 f4 d5 exd5 e4 d3 Nf6 Qe2
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4 Nxe4 Qe2
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Gambit, Main Line	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4 Nxe4 Nf3 Bc5 Qe2 Bf5
C32	King’s Gambit Declined: Falkbeer Countergambit, Charousek Variation	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4 Nxe4 Qe2 Qxd5 Nd2 f5 g4
C32	King’s Gambit Declined: Falkbeer Countergambit, Tarrasch Variation	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4 Nxe4 Nf3 Bc5 Qe2 Bf5 g4 O-O
C32	King’s Gambit Declined: Falkbeer Countergambit, Alapin Variation	e4 e5 f4 d5 exd5 e4 d3 Nf6 dxe4 Nxe4 Nf3 Bc5 Qe2 Bf2+ Kd1 Qxd5+ Nfd2
C33	King’s Gambit Accepted	e4 e5 f4 exf4
C33	King’s Gambit Accepted: Basman Gambit	e4 e5 f4 exf4 Qe2
C33	King’s Gambit Accepted: Bishop’s Gambit	e4 e5 f4 exf4 Bc4
C33	King’s Gambit Accepted: Breyer Gambit	e4 e5 f4 exf4 Qf3
C33	King’s Gambit Accepted: Carrera Gambit	e4 e5 f4 exf4 Qh5
C33	King’s Gambit Accepted: Dodo Variation	e4 e5 f4 exf4 Qg4
C33	King’s Gambit Accepted: Eisenberg Variation	e4 e5 f4 exf4 Nh3
C33	King’s Gambit Accepted: Gaga Gambit	e4 e5 f4 exf4 g3
C33	King’s Gambit Accepted: Mason-Keres Gambit	e4 e5 f4 exf4 Nc3
C33	King’s Gambit Accepted: Orsini Gambit	e4 e5 f4 exf4 b3
C33	King’s Gambit Accepted: Paris Gambit	e4 e5 f4 exf4 Ne2
C33	King’s Gambit Accepted: Schurig Gambit, with Bb5	e4 e5 f4 exf4 Bb5
C33	King’s Gambit Accepted: Schurig Gambit, with Bd3	e4 e5 f4 exf4 Bd3
C33	King’s Gambit Accepted: Stamma Gambit	e4 e5 f4 exf4 h4
C33	King’s Gambit Accepted: Tartakower Gambit	e4 e5 f4 exf4 Be2
C33	King’s Gambit Accepted: Tumbleweed	e4 e5 f4 exf4 Kf2
C33	King’s Gambit Accepted: Villemson Gambit	e4 e5 f4 exf4 d4
C33	King’s Gambit Accepted: Bishop’s Gambit, Anderssen Defence	e4 e5 f4 exf4 Bc4 g5
C33	King’s Gambit Accepted: Bishop’s Gambit, Bledow Variation	e4 e5 f4 exf4 Bc4 d5
C33	King’s Gambit Accepted: Bishop’s Gambit, Cozio Defence	e4 e5 f4 exf4 Bc4 Nf6
C33	King’s Gambit Accepted: Bishop’s Gambit, Gianutio Gambit	e4 e5 f4 exf4 Bc4 f5
C33	King’s Gambit Accepted: Bishop’s Gambit, Kieseritzky Gambit	e4 e5 f4 exf4 Bc4 b5
C33	King’s Gambit Accepted: Bishop’s Gambit, Lopez Defence	e4 e5 f4 exf4 Bc4 c6
C33	King’s Gambit Accepted: Bishop’s Gambit, Maurian Defence	e4 e5 f4 exf4 Bc4 Nc6
C33	King’s Gambit Accepted: Bishop’s Gambit, Steinitz Defence	e4 e5 f4 exf4 Bc4 Ne7
C33	King’s Gambit Accepted: Bishop’s Gambit, Bogoljubow Variation	e4 e5 f4 exf4 Bc4 Nf6 Nc3
C33	King’s Gambit Accepted: Bishop’s Gambit, Anderssen Variation	e4 e5 f4 exf4 Bc4 d5 Bxd5 c6
C33	King’s Gambit Accepted: Bishop’s Gambit, Bledow Countergambit	e4 e5 f4 exf4 Bc4 d5 Bxd5 Nf6
C33	King’s Gambit Accepted: Bishop’s Gambit, Boden Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 Nc6
C33	King’s Gambit Accepted: Bishop’s Gambit, Bogoljubow Defence	e4 e5 f4 exf4 Bc4 Nf6 Nc3 c6
C33	King’s Gambit Accepted: Bishop’s Gambit, Bryan Countergambit	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5
C33	King’s Gambit Accepted: Bishop’s Gambit, Cozio Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 d6
C33	King’s Gambit Accepted: Bishop’s Gambit, First Jaenisch Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 Nf6
C33	King’s Gambit Accepted: Bishop’s Gambit, Greco Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 Bc5
C33	King’s Gambit Accepted: Bishop’s Gambit, Lopez Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5
C33	King’s Gambit Accepted: Tartakower Gambit, Weiss Defence	e4 e5 f4 exf4 Be2 f5 exf5 d6
C33	King’s Gambit Accepted: Bishop’s Gambit, Classical Defence, Cozio Attack	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5 Qf3
C33	King’s Gambit Accepted: Bishop’s Gambit, Paulsen Attack	e4 e5 f4 exf4 Bc4 Nf6 Nc3 Bb4 e5
C33	King’s Gambit Accepted: Bishop’s Gambit, Boren-Svenonius Variation	e4 e5 f4 exf4 Bc4 d5 Bxd5 Qh4+ Kf1 Bd6
C33	King’s Gambit Accepted: Bishop’s Gambit, Chigorin’s Attack	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 d5 Bxd5 g5 g3
C33	King’s Gambit Accepted: Bishop’s Gambit, McDonnell Attack	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5 Nc3 Bg7 g3
C33	King’s Gambit Accepted: Bishop’s Gambit, Classical Defence	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 Ne7 Nc3 g5 d4 Bg7
C33	King’s Gambit Accepted: Lopez-Gianutio Countergambit, Hein Variation	e4 e5 f4 exf4 Bc4 f5 Qe2 Qh4+ Kd1 fxe4 Nc3 Kd8
C33	King’s Gambit Accepted: Bishop’s Gambit, Fraser Variation	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5 Nc3 Bg7 g3 fxg3 Qf3
C33	King’s Gambit Accepted: Bishop’s Gambit, Grimm Attack	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5 Nc3 Bg7 d4 d6 e5
C33	King’s Gambit Accepted: Bishop’s Gambit, McDonnell Attack	e4 e5 f4 exf4 Bc4 Qh4+ Kf1 g5 Nc3 Bg7 d4 Ne7 g3
C34	King’s Gambit Accepted: King’s Knight’s Gambit	e4 e5 f4 exf4 Nf3
C34	King’s Gambit Accepted: Becker Defence	e4 e5 f4 exf4 Nf3 h6
C34	King’s Gambit Accepted: Bonsch-Osmolovsky Variation	e4 e5 f4 exf4 Nf3 Ne7
C34	King’s Gambit Accepted: Fischer Defence	e4 e5 f4 exf4 Nf3 d6
C34	King’s Gambit Accepted: Gianutio Countergambit	e4 e5 f4 exf4 Nf3 f5
C34	King’s Gambit Accepted: King’s Knight’s Gambit	e4 e5 f4 exf4 Nf3 g5
C34	King’s Gambit Accepted: MacLeod Defence	e4 e5 f4 exf4 Nf3 Nc6
C34	King’s Gambit Accepted: Schallopp Defence	e4 e5 f4 exf4 Nf3 Nf6
C34	King’s Gambit Accepted: Wagenbach Defence	e4 e5 f4 exf4 Nf3 h5
C34	King’s Gambit Accepted: Fischer Defence, Schulder Gambit	e4 e5 f4 exf4 Nf3 d6 b4
C34	King’s Gambit Accepted: Fischer Defence, Spanish Variation	e4 e5 f4 exf4 Nf3 d6 d4 Nf6 Bd3
C34	King’s Gambit Accepted: Schallopp Defence, Tashkent Attack	e4 e5 f4 exf4 Nf3 Nf6 e5 Nh5 g4
C34	King’s Gambit Accepted: Greco Gambit	e4 e5 f4 exf4 Nf3 d6 Bc4 h6 d4 g5 h4 Bg7
C35	King’s Gambit Accepted: Cunningham Defence	e4 e5 f4 exf4 Nf3 Be7
C35	King’s Gambit Accepted: Cunningham Defence, McCormick Defence	e4 e5 f4 exf4 Nf3 Be7 Bc4 Nf6
C35	King’s Gambit Accepted: Cunningham Defence, Bertin Gambit	e4 e5 f4 exf4 Nf3 Be7 Bc4 Bh4+ g3
C35	King’s Gambit Accepted: Cunningham Defence, Bertin Gambit	e4 e5 f4 exf4 Nf3 Be7 Bc4 Bh4+ g3 fxg3 O-O gxh2+ Kh1
C36	King’s Gambit Accepted: Modern Defence	e4 e5 f4 exf4 Nf3 d5
C36	King’s Gambit Accepted: Modern Defence	e4 e5 f4 exf4 Nf3 d5 exd5
C36	King’s Gambit Accepted: Abbazia Defence	e4 e5 f4 exf4 Nf3 d5 exd5 Nf6
C36	King’s Gambit Accepted: Abbazia Defence, Main Line	e4 e5 f4 exf4 Nf3 d5 exd5 Nf6 Bb5+ c6 dxc6 bxc6 Bc4 Nd5
C37	King’s Gambit Accepted: King’s Knight’s Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4
C37	King’s Gambit Accepted: Quaade Gambit	e4 e5 f4 exf4 Nf3 g5 Nc3
C37	King’s Gambit Accepted: Rosentreter Gambit	e4 e5 f4 exf4 Nf3 g5 d4
C37	King’s Gambit Accepted: Blachly Gambit	e4 e5 f4 exf4 Nf3 Nc6 Bc4 g5
C37	King’s Gambit Accepted: Australian Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 h4
C37	King’s Gambit Accepted: Ghulam-Kassim Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 d4
C37	King’s Gambit Accepted: Lolli Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Bxf7+
C37	King’s Gambit Accepted: McDonnell Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Nc3
C37	King’s Gambit Accepted: Muzio Gambit, Wild Muzio Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O
C37	King’s Gambit Accepted: Rosentreter Gambit, Sörensen Gambit	e4 e5 f4 exf4 Nf3 g5 d4 g4 Nc3
C37	King’s Gambit Accepted: Rosentreter Gambit, Testa Variation	e4 e5 f4 exf4 Nf3 g5 d4 g4 Bxf4
C37	King’s Gambit Accepted: Salvio Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5
C37	King’s Gambit Accepted: Sörensen Gambit	e4 e5 f4 exf4 Nf3 g5 d4 g4 Ne5
C37	King’s Gambit Accepted: Muzio Gambit, Brentano Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O d5
C37	King’s Gambit Accepted: Muzio Gambit, Kling and Horwitz Counterattack	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O Qe7
C37	King’s Gambit Accepted: Ghulam-Kassim Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 d4 gxf3 Qxf3
C37	King’s Gambit Accepted: Kotov Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 d4 gxf3 Bxf4
C37	King’s Gambit Accepted: Rosentreter Gambit, Bird Gambit	e4 e5 f4 exf4 Nf3 g5 d4 g4 Ne5 Qh4+ g3
C37	King’s Gambit Accepted: Muzio Gambit Accepted, From’s Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qe7
C37	King’s Gambit Accepted: Muzio Gambit, Holloway Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Nc6
C37	King’s Gambit Accepted: Muzio Gambit, Sarratt Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6
C37	King’s Gambit Accepted: Salvio Gambit, Cochrane Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 f3
C37	King’s Gambit Accepted: Salvio Gambit, Santa Maria Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 Nf6
C37	King’s Gambit Accepted: Salvio Gambit, Silberschmidt Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 Nh6
C37	King’s Gambit Accepted: Salvio Gambit, Viennese Variation	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 Nc6
C37	King’s Gambit Accepted: Double Muzio Gambit, Bello Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6 Nc3
C37	King’s Gambit Accepted: Middleton Countergambit	e4 e5 f4 exf4 Nf3 g5 Bc4 d6 O-O Bg4 h3 h5 hxg4 hxg4
C37	King’s Gambit Accepted: Salvio Gambit, Anderssen Counterattack	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 Nh6 d4 d6
C37	King’s Gambit Accepted: Silberschmidt Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Ne5 Qh4+ Kf1 Nh6 d4 f3
C37	King’s Gambit Accepted: Double Muzio Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6 e5 Qxe5 Bxf7+
C37	King’s Gambit Accepted: Double Muzio Gambit, Baldwin Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6 Nc3 Qd4+ Kh1 Qxc4 Nd5
C37	King’s Gambit Accepted: Lolli Gambit, Young Variation	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 Bxf7+ Kxf7 O-O gxf3 Qxf3 Qf6 d4 Qxd4+ Be3 Qf6 Nc3
C37	King’s Gambit Accepted: Double Muzio Gambit, Young Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6 Bxf7+ Kxf7 d4 Qxd4+ Be3 Qf6 Nc3 fxe3
C37	King’s Gambit Accepted: Double Muzio Gambit, Paulsen Defence	e4 e5 f4 exf4 Nf3 g5 Bc4 g4 O-O gxf3 Qxf3 Qf6 e5 Qxe5 d3 Bh6 Nc3 Ne7 Bd2 Nbc6 Rae1
C38	King’s Gambit Accepted: Traditional Variation	e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7
C38	King’s Gambit Accepted: Hanstein Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7 O-O
C38	King’s Gambit Accepted: Philidor Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7 h4
C38	King’s Gambit Accepted: Mayet Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7 d4 d6 c3
C38	King’s Gambit Accepted: Philidor Gambit, Schultz Variation	e4 e5 f4 exf4 Nf3 h6 Bc4 d6 d4 g5 h4 Bg7 Qd3
C38	King’s Gambit Accepted: Greco Gambit	e4 e5 f4 exf4 Nf3 g5 Bc4 Bg7 h4 h6 d4 d6 Nc3 c6 hxg5 hxg5 Rxh8 Bxh8 Ne5
C39	King’s Gambit Accepted: King’s Knight’s Gambit	e4 e5 f4 exf4 Nf3 g5 h4
C39	King’s Gambit Accepted: Allgaier Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5
C39	King’s Gambit Accepted: Kieseritzky Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5
C39	King’s Gambit Accepted: Allgaier, Schlechter Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 Nf6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Berlin Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Brentano Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 d5
C39	King’s Gambit Accepted: Kieseritzky Gambit, Kolisch Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 d6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Long Whip	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 h5
C39	King’s Gambit Accepted: Kieseritzky Gambit, Neumann Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nc6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Paulsen Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Bg7
C39	King’s Gambit Accepted: Kieseritzky Gambit, Rosenthal Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Qe7
C39	King’s Gambit Accepted: Kieseritzky, Polerio Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Be7
C39	King’s Gambit Accepted: Kieseritzky Gambit, Berlin Defence, Rubinstein Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 d4
C39	King’s Gambit Accepted: Kieseritzky Gambit, Cotter Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7
C39	King’s Gambit Accepted: Kieseritzky Gambit, Berlin Defence, de Riviere Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Nxg4 d5
C39	King’s Gambit Accepted: Allgaier Gambit, Thorold Attack	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 d4
C39	King’s Gambit Accepted: Allgaier Gambit, Urusov Attack	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 Bc4+
C39	King’s Gambit Accepted: Allgaier, Blackburne Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 Nc3
C39	King’s Gambit Accepted: Kieseritzky Gambit, Brentano Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 d5 d4 Nf6 Bxf4
C39	King’s Gambit Accepted: Kieseritzky, Salvio Defence, Cozio Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Qe7 d4 f5 Bc4
C39	King’s Gambit Accepted: Kieseritzky Gambit, Anderssen Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Paulsen Defence Deferred	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bg7
C39	King’s Gambit Accepted: Kieseritzky Gambit, Brentano Defence, Caro Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 d5 d4 Nf6 Bxf4 Nxe4 Nd2
C39	King’s Gambit Accepted: Kieseritzky, Long Whip Defence, Jaenisch Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 h5 Bc4 Rh7 d4 Bh6 Nc3
C39	King’s Gambit Accepted: Kieseritzky, Rice Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 O-O
C39	King’s Gambit Accepted: Allgaier, Horny Defence	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 Qxg4 Nf6 Qxf4 Bd6
C39	King’s Gambit Accepted: Kieseritzky Gambit, Rice Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 O-O Bxe5
C39	King’s Gambit Accepted: Allgaier, Urusov Attack	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 Bc4+ d5 Bxd5+ Kg7 d4
C39	King’s Gambit Accepted: Kieseritzky Gambit, Anderssen-Cordel Gambit	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ne5 Nf6 Bc4 d5 exd5 Bd6 d4 Nh5 Bxf4 Nxf4
C39	King’s Gambit Accepted: Allgaier, Cook Variation	e4 e5 f4 exf4 Nf3 g5 h4 g4 Ng5 h6 Nxf7 Kxf7 d4 d5 Bxf4 dxe4 Bc4+ Kg7 Be5+
C40	King’s Knight Opening	e4 e5 Nf3
C40	Elephant Gambit	e4 e5 Nf3 d5
C40	Gunderam Defence	e4 e5 Nf3 Qe7
C40	King’s Pawn Game: Busch-Gass Gambit	e4 e5 Nf3 Bc5
C40	King’s Pawn Game: Damiano Defence	e4 e5 Nf3 f6
C40	King’s Pawn Game: Gunderam Gambit	e4 e5 Nf3 c6
C40	King’s Pawn Game: McConnell Defence	e4 e5 Nf3 Qf6
C40	Latvian Gambit	e4 e5 Nf3 f5
C40	Latvian Gambit Accepted	e4 e5 Nf3 f5 exf5
C40	Latvian Gambit: Diepstraten Countergambit	e4 e5 Nf3 f5 c4
C40	Latvian Gambit: Lobster Gambit	e4 e5 Nf3 f5 g4
C40	Latvian Gambit: Mason Countergambit	e4 e5 Nf3 f5 d4
C40	Latvian Gambit: Mayet Attack	e4 e5 Nf3 f5 Bc4
C40	Latvian Gambit: Mlotkowski Variation	e4 e5 Nf3 f5 Nc3
C40	Latvian Gambit: Senechaud Gambit	e4 e5 Nf3 f5 b4
C40	Elephant Gambit: Maróczy Gambit	e4 e5 Nf3 d5 exd5 Bd6
C40	Elephant Gambit: Paulsen Countergambit	e4 e5 Nf3 d5 exd5 e4
C40	King’s Pawn Game: Busch-Gass Gambit, Chiodini Gambit	e4 e5 Nf3 Bc5 Nxe5 Nc6
C40	King’s Pawn Game: Gunderam Defence, Gunderam Gambit	e4 e5 Nf3 Qe7 Bc4 f5
C40	Latvian Gambit: Fraser Defence	e4 e5 Nf3 f5 Nxe5 Nc6
C40	Latvian Gambit: Greco Variation	e4 e5 Nf3 f5 Nxe5 Qe7
C40	Latvian Gambit: Mayet Attack, Morgado Defence	e4 e5 Nf3 f5 Bc4 Nf6
C40	Latvian Gambit: Mayet Attack, Strautins Gambit	e4 e5 Nf3 f5 Bc4 b5
C40	King’s Pawn Game: La Bourdonnais Gambit	e4 e5 Nf3 Qf6 Bc4 Qg6 O-O
C40	Latvian Gambit Accepted: Foltys-Leonhardt Variation	e4 e5 Nf3 f5 Nxe5 Qf6 Nc4
C40	Latvian Gambit Accepted: Main Line	e4 e5 Nf3 f5 Nxe5 Qf6 d4
C40	Elephant Gambit: Wasp Variation	e4 e5 Nf3 d5 Nxe5 dxe4 Bc4 Qg5
C40	King’s Pawn Game: Damiano Defence, Damiano Gambit, Chigorin Gambit	e4 e5 Nf3 f6 Nxe5 Qe7 Nf3 d5
C40	Latvian Gambit: Corkscrew Countergambit	e4 e5 Nf3 f5 Bc4 fxe4 Nxe5 Nf6
C40	Latvian Gambit: Mayet Attack, Polerio-Svedenborg Variation	e4 e5 Nf3 f5 Bc4 fxe4 Nxe5 d5
C40	Latvian Gambit Accepted: Bilguer Variation	e4 e5 Nf3 f5 Nxe5 Qf6 d4 d6 Nc4
C40	Latvian Gambit Accepted: Foltys Variation	e4 e5 Nf3 f5 Nxe5 Qf6 Nc4 fxe4 d3
C40	Latvian Gambit Accepted: Leonhardt Variation	e4 e5 Nf3 f5 Nxe5 Qf6 Nc4 fxe4 Nc3
C40	Latvian Gambit: Mayet Attack, Poisoned Pawn Variation	e4 e5 Nf3 f5 Bc4 fxe4 Nxe5 Qg5 d4 Qxg2
C40	King’s Pawn Game: Damiano Defence, Damiano Gambit	e4 e5 Nf3 f6 Nxe5 fxe5 Qh5+ g6 Qxe5+ Qe7 Qxh8
C40	Latvian Gambit Accepted: Bronstein Attack	e4 e5 Nf3 f5 Nxe5 Qf6 d4 d6 Nc4 fxe4 Be2
C40	Latvian Gambit Accepted: Nimzowitsch Attack	e4 e5 Nf3 f5 Nxe5 Qf6 d4 d6 Nc4 fxe4 Ne3
C40	Latvian Gambit: Corkscrew Gambit	e4 e5 Nf3 f5 Nxe5 Nf6 Bc4 fxe4 Nf7 Qe7 Nxh8 d5
C40	Latvian Gambit Accepted: Bronstein Gambit	e4 e5 Nf3 f5 Nxe5 Qf6 d4 d6 Nc4 fxe4 Qh5+ g6 Qe2
C40	Latvian Gambit: Behting Variation	e4 e5 Nf3 f5 Bc4 fxe4 Nxe5 Qg5 Nf7 Qxg2 Rf1 d5 Nxh8 Nf6
C41	Philidor Defence	e4 e5 Nf3 d6
C41	Philidor Defence	e4 e5 Nf3 d6 d4
C41	Philidor Defence	e4 e5 Nf3 d6 Bc4
C41	Philidor Defence	e4 e5 Nf3 d6 Bc4 Be7
C41	Philidor Defence: Exchange Variation	e4 e5 Nf3 d6 d4 exd4
C41	Philidor Defence: Hanham Variation	e4 e5 Nf3 d6 d4 Nd7
C41	Philidor Defence: Lopez Countergambit	e4 e5 Nf3 d6 Bc4 f5
C41	Philidor Defence: Nimzowitsch Variation	e4 e5 Nf3 d6 d4 Nf6
C41	Philidor Defence: Philidor Countergambit	e4 e5 Nf3 d6 d4 f5
C41	Philidor Defence: Philidor Gambit	e4 e5 Nf3 d6 d4 Bd7
C41	Philidor Defence: Bird Gambit	e4 e5 Nf3 d6 d4 exd4 c3
C41	Philidor Defence: Exchange Variation	e4 e5 Nf3 d6 d4 exd4 Nxd4
C41	Philidor Defence: Morphy Gambit	e4 e5 Nf3 d6 d4 exd4 Bc4
C41	Philidor Defence: Nimzowitsch Variation	e4 e5 Nf3 d6 d4 Nf6 dxe5
C41	Philidor Defence: Nimzowitsch Variation, Klein Variation	e4 e5 Nf3 d6 d4 Nf6 Bc4
C41	Philidor Defence: Nimzowitsch, Locock Variation	e4 e5 Nf3 d6 d4 Nf6 Ng5
C41	Philidor Defence: Philidor Countergambit, Zukertort Variation	e4 e5 Nf3 d6 d4 f5 Nc3
C41	Philidor Defence: Steinitz Variation	e4 e5 Nf3 d6 Bc4 Be7 c3
C41	Philidor Defence: Albin-Blackburne Gambit	e4 e5 Nf3 d6 d4 Bg4 dxe5 Nd7
C41	Philidor Defence: Boden Variation	e4 e5 Nf3 d6 d4 exd4 Qxd4 Bd7
C41	Philidor Defence: Exchange Variation	e4 e5 Nf3 d6 d4 exd4 Nxd4 Nf6
C41	Philidor Defence: Hanham Variation, Sharp Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 Nb6
C41	Philidor Defence: Larsen Variation	e4 e5 Nf3 d6 d4 exd4 Nxd4 g6
C41	Philidor Defence: Lion Variation	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7
C41	Philidor Defence: Hanham Variation, Delmar Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 c6 c3
C41	Philidor Defence: Hanham Variation, Krause Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 c6 O-O
C41	Philidor Defence: Hanham Variation, Schlechter Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 c6 Nc3
C41	Philidor Defence: Hanham, Kmoch Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 c6 Ng5
C41	Philidor Defence: Lion Variation, Shirov Gambit	e4 e5 Nf3 d6 d4 Nd7 Nc3 Ngf6 g4
C41	Philidor Defence: Nimzowitsch Variation, Rellstab Variation	e4 e5 Nf3 d6 d4 Nf6 dxe5 Nxe4 Qd5
C41	Philidor Defence: Nimzowitsch Variation, Sokolsky Variation	e4 e5 Nf3 d6 d4 Nf6 dxe5 Nxe4 Nbd2
C41	Philidor Defence: Paulsen Attack	e4 e5 Nf3 d6 d4 exd4 Nxd4 d5 exd5
C41	Philidor Defence: Hanham Variation, Steiner Variation	e4 e5 Nf3 d6 d4 Nd7 Bc4 c6 O-O Be7 dxe5
C41	Philidor Defence: Lion Variation, Bishop Sacrifice	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 Bxf7+
C41	Philidor Defence: Lopez Countergambit, Jaenisch Variation	e4 e5 Nf3 d6 d4 f5 Bc4 exd4 Ng5 Nh6 Nxh7
C41	Philidor Defence: Philidor Countergambit, del Rio Attack	e4 e5 Nf3 d6 d4 f5 dxe5 fxe4 Ng5 d5 e6
C41	Philidor Defence: Lion Variation, Lion’s Claw, with Bc4 and h6	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 O-O h6
C41	Philidor Defence: Lion Variation, Lion’s Claw, with Be2 and c6	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Be2 Be7 O-O c6
C41	Philidor Defence: Lion Variation, Delayed Bishop Sacrifice	e4 d6 d4 Nf6 Nc3 Nbd7 Nf3 e5 Bc4 Be7 dxe5 dxe5 Bxf7+
C41	Philidor Defence: Nimzowitsch, Larobok Variation	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 Ng5 O-O Bxf7+
C41	Philidor Defence: Philidor Countergambit, Berger Variation	e4 e5 Nf3 d6 d4 f5 dxe5 fxe4 Ng5 d5 e6 Bc5 Nc3
C41	Philidor Defence: Lion Variation, Forcing Line	e4 e5 Nf3 d6 d4 Nf6 Nc3 Nbd7 Bc4 Be7 Ng5 O-O Bxf7+ Rxf7 Ne6
C41	Philidor Defence: Lion Variation, Sozin Variation	e4 d6 d4 Nf6 Nc3 e5 Nf3 Nbd7 Bc4 Be7 O-O O-O Qe2 c6 a4 exd4
C41	Philidor Defence: Berger Variation	e4 e5 Nf3 d6 d4 exd4 Nxd4 Nf6 Nc3 Be7 Be2 O-O O-O c5 Nf3 Nc6 Bg5 Be6 Re1
C42	Petrov’s Defence	e4 e5 Nf3 Nf6
C42	Petrov’s Defence	e4 e5 Nf3 Nf6 Nxe5
C42	Petrov’s Defence: Italian Variation	e4 e5 Nf3 Nf6 Bc4
C42	Petrov’s Defence: Three Knights Game	e4 e5 Nf3 Nf6 Nc3
C42	Petrov’s Defence	e4 e5 Nf3 Nf6 Nxe5 d6
C42	Petrov’s Defence: Damiano Variation	e4 e5 Nf3 Nf6 Nxe5 Nxe4
C42	Petrov’s Defence: Stafford Gambit	e4 e5 Nf3 Nf6 Nxe5 Nc6
C42	Petrov’s Defence	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3
C42	Petrov’s Defence: Cochrane Gambit	e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7
C42	Petrov’s Defence: Karklins-Martinovsky Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nd3
C42	Petrov’s Defence: Moody Gambit	e4 e5 Nf3 Nf6 Qe2 Nc6 d4
C42	Petrov’s Defence: Paulsen Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nc4
C42	Petrov’s Defence	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4
C42	Petrov’s Defence: Damiano Variation, Kholmov Gambit	e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2 Qe7
C42	Petrov’s Defence: Stafford Gambit Accepted	e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6
C42	Petrov’s Defence: Classical Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4
C42	Petrov’s Defence: Cochrane Gambit, Bishop Check Line	e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7 Kxf7 Bc4+
C42	Petrov’s Defence: Cochrane Gambit, Center Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nxf7 Kxf7 d4
C42	Petrov’s Defence: Cozio Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Qe2
C42	Petrov’s Defence: French Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d3
C42	Petrov’s Defence: Kaufmann Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 c4
C42	Petrov’s Defence: Millennium Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Bd3
C42	Petrov’s Defence: Nimzowitsch Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 Nc3
C42	Petrov’s Defence: Classical Attack, Closed Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 Nf6
C42	Petrov’s Defence: Stafford Gambit Accepted	e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 Nc3 Bc5
C42	Petrov’s Defence: Stafford Gambit Accepted	e4 e5 Nf3 Nf6 Nxe5 Nc6 Nxc6 dxc6 d3 Bc5
C42	Petrov’s Defence: Classical Attack, Marshall Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6
C42	Petrov’s Defence: Classical Attack, Mason-Showalter Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6
C42	Petrov’s Defence: Classical Attack, Mason Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O O-O
C42	Petrov’s Defence: Classical Attack, Chigorin Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 Re1
C42	Petrov’s Defence: Classical Attack, Jaenisch Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4
C42	Petrov’s Defence: Classical Attack, Staunton Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 c6
C42	Petrov’s Defence: Classical Attack, Tarrasch Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 Bg4
C42	Petrov’s Defence: Classical Attack, Chigorin Variation, Browne Attack	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4 Nb4 cxd5
C42	Petrov’s Defence: Classical Attack, Chigorin Variation, Main Line	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 c4 Nb4 Be2
C42	Petrov’s Defence: Classical Attack, Marshall Variation, Chinese Gambit	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 c6 Re1 Bg4
C42	Petrov’s Defence: Classical Attack, Berger Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 Re1 Bg4 c3 f5 Nbd2
C42	Petrov’s Defence: Classical Attack, Krause Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Nc6 O-O Be7 Re1 Bg4 c3 f5 c4
C42	Petrov’s Defence: Classical Attack, Maróczy Variation	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Be7 O-O Nc6 Re1 Bg4 c3 f5 c4 Bh4
C42	Petrov’s Defence: Classical Attack, Marshall Trap	e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4 d4 d5 Bd3 Bd6 O-O O-O c4 Bg4 cxd5 f5 Re1 Bxh2+
C43	Petrov’s Defence: Modern Attack	e4 e5 Nf3 Nf6 d4
C43	Petrov’s Defence: Modern Attack	e4 e5 Nf3 Nf6 d4 exd4
C43	Petrov’s Defence: Modern Attack, Symmetrical Variation	e4 e5 Nf3 Nf6 d4 d5
C43	Bishop’s Opening: Urusov Gambit	e4 e5 Bc4 Nf6 d4 exd4 Nf3
C43	Petrov’s Defence: Modern Attack, Center Variation	e4 e5 Nf3 Nf6 d4 Nxe4 Bd3
C43	Petrov’s Defence: Modern Attack, Murrey Variation	e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 Nc6
C43	Bishop’s Opening: Urusov Gambit, Keidansky Gambit	e4 e5 Bc4 Nf6 d4 exd4 Nf3 Nxe4 Qxd4
C43	Petrov’s Defence: Modern Attack, Center Attack	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qxd4
C43	Petrov’s Defence: Modern Attack, Steinitz Variation	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qe2
C43	Petrov’s Defence: Modern Attack, Tal Gambit	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Bb5
C43	Petrov’s Defence: Modern Attack, Bardeleben Variation	e4 e5 Nf3 Nf6 d4 exd4 e5 Ne4 Qe2 Nc5 Nxd4 Nc6
C43	Petrov’s Defence: Modern Attack, Trifunovic Variation	e4 e5 Nf3 Nf6 d4 Nxe4 Bd3 d5 Nxe5 Bd6 O-O O-O c4 Bxe5
C44	King’s Knight Opening: Normal Variation	e4 e5 Nf3 Nc6
C44	Irish Gambit	e4 e5 Nf3 Nc6 Nxe5
C44	King’s Knight Opening: Konstantinopolsky	e4 e5 Nf3 Nc6 g3
C44	King’s Pawn Game: Dresden Opening	e4 e5 Nf3 Nc6 c4
C44	King’s Pawn Game: Pachman Wing Gambit	e4 e5 Nf3 Nc6 b4
C44	King’s Pawn Game: Tayler Opening	e4 e5 Nf3 Nc6 Be2
C44	Ponziani Opening	e4 e5 Nf3 Nc6 c3
C44	Scotch Game	e4 e5 Nf3 Nc6 d4
C44	Ponziani Opening: Jaenisch Counterattack	e4 e5 Nf3 Nc6 c3 Nf6
C44	Ponziani Opening: Ponziani Countergambit	e4 e5 Nf3 Nc6 c3 f5
C44	Ponziani Opening: Réti Variation	e4 e5 Nf3 Nc6 c3 Nge7
C44	Ponziani Opening: Romanishin Variation	e4 e5 Nf3 Nc6 c3 Be7
C44	Scotch Game	e4 e5 Nf3 Nc6 d4 exd4
C44	Scotch Game: Lolli Variation	e4 e5 Nf3 Nc6 d4 Nxd4
C44	Dresden Opening: The Goblin	e4 e5 Nf3 Nc6 c4 Nf6 Nxe5
C44	King’s Pawn Game: Schulze-Müller Gambit	e4 e5 Nf3 Nc6 Nxe5 Nxe5 d4
C44	King’s Pawn Game: Tayler Opening	e4 e5 Nf3 Nc6 Be2 Nf6 d4
C44	Latvian Gambit: Clam Gambit	e4 e5 Nf3 Nc6 d3 f5 exf5
C44	Ponziani Opening: Jaenisch Counterattack	e4 e5 Nf3 Nc6 c3 Nf6 d3
C44	Ponziani Opening: Neumann Gambit	e4 e5 Nf3 Nc6 c3 Nf6 Bc4
C44	Ponziani Opening: Spanish Variation	e4 e5 Nf3 Nc6 c3 d5 Bb5
C44	Scotch Game: Göring Gambit	e4 e5 Nf3 Nc6 d4 exd4 c3
C44	Scotch Game: Relfsson Gambit	e4 e5 Nf3 Nc6 d4 exd4 Bb5
C44	Scotch Game: Scotch Gambit	e4 e5 Nf3 Nc6 d4 exd4 Bc4
C44	Ponziani Opening: Caro Gambit	e4 e5 Nf3 Nc6 c3 d5 Qa4 Bd7
C44	Ponziani Opening: Jaenisch Counterattack	e4 e5 Nf3 Nc6 c3 Nf6 d3 d5
C44	Ponziani Opening: Leonhardt Variation	e4 e5 Nf3 Nc6 c3 d5 Qa4 Nf6
C44	Ponziani Opening: Steinitz Variation	e4 e5 Nf3 Nc6 c3 d5 Qa4 f6
C44	Scotch Game: Benima Defence	e4 e5 Nf3 Nc6 Bc4 Be7 d4 exd4
C44	Scotch Game: Haxo Gambit	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5
C44	Scotch Game: Scotch Gambit, Dubois Réti Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4
C44	Scotch Game: Scotch Gambit, Göring Gambit Declined	e4 e5 Nf3 Nc6 d4 exd4 c3 d5
C44	Scotch Game: Scotch Gambit, London Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bb4+
C44	King’s Pawn Game: Tayler Opening, Basman Gambit	e4 e5 Nf3 Nc6 Be2 Nf6 d4 exd4 e5
C44	King’s Pawn Game: Tayler Opening, Inverted Hanham	e4 e5 Nf3 Nc6 Be2 Nf6 d3 d5 Nbd2
C44	Ponziani Opening: Jaenisch Counterattack	e4 e5 Nf3 Nc6 c3 Nf6 d3 d5 Nbd2
C44	Ponziani Opening: Ponziani Countergambit, Schmidt Attack	e4 e5 Nf3 Nc6 c3 f5 d4 d6 d5
C44	Scotch Game: Göring Gambit, Double Pawn Sacrifice	e4 e5 Nf3 Nc6 d4 exd4 c3 dxc3 Bc4
C44	Scotch Game: Lolli Variation	e4 e5 Nf3 Nc6 d4 Nxd4 Nxd4 exd4 Qxd4
C44	Scotch Game: Napoleon Gambit	e4 e5 Nf3 Nc6 d4 Nxd4 Nxd4 exd4 Bc4
C44	Scotch Game: Scotch Gambit, Advance Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5
C44	Scotch Game: Scotch Gambit, Sarratt Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 Ng5
C44	Ponziani Opening: Vukovic Gambit	e4 e5 Nf3 Nc6 c3 Nf6 d4 Nxe4 d5 Bc5
C44	Scotch Game: Göring Gambit, Main Line	e4 e5 Nf3 Nc6 d4 exd4 c3 dxc3 Nxc3 Bb4
C44	Scotch Game: Scotch Gambit, Kingside Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 e5 Ng4
C44	Ponziani Opening: Spanish Variation, Harrwitz Attack, Nikitin Gambit	e4 e5 Nf3 Nc6 c3 d5 Bb5 dxe4 Nxe5 Qd5 Qa4
C44	Scotch Game: Vitzthum Attack	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 Ng5 Nh6 Qh5
C44	Scotch Game: Göring Gambit, Bardeleben Variation	e4 e5 Nf3 Nc6 d4 exd4 c3 dxc3 Bc4 Nf6 Nxc3 Bb4
C44	Scotch Game: Scotch Gambit, Cochrane-Anderssen Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 O-O d6 c3 Bg4
C44	Scotch Game: Cochrane Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bb4+ c3 dxc3 bxc3 Ba5 e5
C44	Scotch Game: Cochrane-Shumov Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 Ng5 Nh6 Nxf7 Nxf7 Bxf7+ Kxf7 Qh5+ g6 Qxc5 d5
C44	Scotch Game: Hanneken Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bb4+ c3 dxc3 O-O cxb2 Bxb2 Nf6 Ng5 O-O e5 Nxe5
C44	Scotch Game: Sea-Cadet Mate	e4 e5 Nf3 Nc6 d4 exd4 c3 dxc3 Nxc3 d6 Bc4 Bg4 O-O Ne5 Nxe5 Bxd1 Bxf7+ Ke7 Nd5#
C45	Scotch Game	e4 e5 Nf3 Nc6 d4 exd4 Nxd4
C45	Scotch Game: Classical Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5
C45	Scotch Game: Malaniuk Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bb4+
C45	Scotch Game: Schmidt Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6
C45	Scotch Game: Steinitz Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4
C45	Scotch Game: Alekhine Gambit	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 e5
C45	Scotch Game: Braune Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Be3
C45	Scotch Game: Fraser Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nf3
C45	Scotch Game: Horwitz Attack	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5
C45	Scotch Game: Paulsen Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nf5
C45	Scotch Game: Potter Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nb3
C45	Scotch Game: Steinitz Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3
C45	Scotch Game: Classical Variation, Intermezzo Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nxc6 Qf6
C45	Scotch Game: Modern Defence	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nc3 Bb4
C45	Scotch Game: Romanishin Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Nb3 Bb4+
C45	Scotch Game	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2
C45	Scotch Game: Blumenfeld Attack	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 Nb5
C45	Scotch Game: Ghulam-Kassim Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nxd4 Qxd4 d6 Bd3
C45	Scotch Game: Mieses Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5
C45	Scotch Game: Tartakower Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 Nd2
C45	Scotch Game: Classical Variation, Millennium Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Qg6
C45	Scotch Game: Classical Variation, Blackburne Attack	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Qd2
C45	Scotch Game: Meitner Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Nc2
C45	Scotch Game: Paulsen Attack	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bb5
C45	Scotch Game: Paulsen, Gunsberg Defence	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Bb5 Nd8
C45	Scotch Game: Horwitz Attack, Blackburne Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O Bxd2 Qxd2
C45	Scotch Game: Rosenthal Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4 Nb5 Bb4+ Bd2 Qxe4+ Be2 Kd8 O-O Bxd2 Nxd2 Qg6
C45	Scotch Game: Gottschall Variation	e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5 Be3 Qf6 c3 Nge7 Qd2 d5 Nb5 Bxe3 Qxe3 O-O Nxc7 Rb8 Nxd5 Nxd5 exd5 Nb4
C46	Three Knights Opening	e4 e5 Nf3 Nc6 Nc3
C46	Three Knights Opening	e4 e5 Nf3 Nc6 Nc3 Bb4
C46	Three Knights Opening: Steinitz Defence	e4 e5 Nf3 Nc6 Nc3 g6
C46	Three Knights Opening: Winawer Defence	e4 e5 Nf3 Nc6 Nc3 f5
C46	Three Knights Opening: Schlechter Variation	e4 e5 Nf3 Nc6 Nc3 Bb4 Nd5 Nf6
C46	Three Knights Opening: Steinitz-Rosenthal Variation	e4 e5 Nf3 Nc6 Nc3 g6 d4 exd4 Nd5
C47	Four Knights Game	e4 e5 Nf3 Nc6 Nc3 Nf6
C47	Four Knights Game: Glek System	e4 e5 Nf3 Nc6 Nc3 Nf6 g3
C47	Four Knights Game: Gunsberg Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 a3
C47	Four Knights Game: Halloween Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5
C47	Four Knights Game: Italian Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Nc3
C47	Four Knights Game: Naroditsky Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Nd5
C47	Four Knights Game: Scotch Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 d4
C47	Four Knights Game: Scotch Variation Accepted	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4
C47	Four Knights Game: Gunsberg Variation, Provincial Opening	e4 e5 Nf3 Nc6 Nc3 Nf6 a3 d6 h3
C47	Four Knights Game: Italian Variation, Noa Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 Nc3 Nxe4 Bxf7+
C47	Four Knights Game: Scotch Variation, Belgrade Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nd5
C47	Four Knights Game: Scotch Variation, Krause Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 Bb4 Nxe5
C47	Four Knights Game: Scotch Variation, Krause Gambit, Leonhardt Defence	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 Bb4 Nxe5 Qe7
C47	Four Knights Game: Scotch Variation, Oxford Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 Bb4 d5 Nd4
C47	Four Knights Game: Scotch Variation, Schmid Defence	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nxd4 Nxe4
C47	Four Knights Game: Scotch Variation, Belgrade Gambit, Modern Defence	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nd5 Nxe4 Qe2 f5
C47	Four Knights Game: Glek System	e4 e5 Nf3 Nc6 Nc3 Nf6 g3 d5 exd5 Nxd5 Bg2 Nxc3 bxc3
C47	Four Knights Game: Halloween Gambit, Oldtimer Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5 Nxe5 d4 Ng6 e5 Ng8 Bc4 Bb4 Qf3 f5
C47	Four Knights Game: Scotch Variation Accepted, Main Line	e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nxd4 Bb4 Nxc6 bxc6 Bd3 d5 exd5 O-O O-O
C47	Four Knights Game: Halloween Gambit, Plasma Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Nxe5 Nxe5 d4 Nc6 d5 Ne5 f4 Ng6 e5 Ng8 d6 cxd6 exd6 Qf6 Nb5 Rb8
C48	Four Knights Game: Spanish Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5
C48	Four Knights Game: Spanish Variation, Classical Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bc5
C48	Four Knights Game: Spanish Variation, Rubinstein Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4
C48	Four Knights Game: Spanish Variation, Ranken Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 a6 Bxc6
C48	Four Knights Game: Spanish Variation, Rubinstein Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Be2
C48	Four Knights Game: Spanish Variation, Rubinstein Variation Accepted	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Nxd4
C48	Four Knights Game: Spanish Variation, Rubinstein Variation, Henneberger Variation	e4 e5 Nf3 Nf6 Nc3 Nc6 Bb5 Nd4 O-O
C48	Four Knights Game: Spanish Variation, Rubinstein Variation	e4 e5 Nf3 Nf6 Nc3 Nc6 Bb5 Nd4 Nxe5 Qe7 f4
C48	Four Knights Game: Spanish Variation, Rubinstein Variation, Marshall Gambit	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Ba4 Bc5 Nxe5 O-O
C48	Four Knights Game: Spanish Variation, Rubinstein Variation, Marshall Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Nxe5 Bc5 O-O O-O
C48	Four Knights Game: Spanish Variation, Bardeleben Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bc5 O-O O-O Nxe5 Nxe5 d4 Bd6 f4 Nc6 e5 Bb4
C48	Four Knights Game: Spanish Variation, Rubinstein Variation, Maróczy Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Nd4 Be2 Nxf3+ Bxf3 Bc5 O-O O-O d3 d6 Na4 Bb6
C48	Four Knights Game: Spanish Variation, Spielmann Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 a6 Bxc6 dxc6 Nxe5 Nxe4 Nxe4 Qd4 O-O Qxe5 Re1 Be6 d4 Qd5
C49	Four Knights Game: Spanish Variation, Double Spanish	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4
C49	Four Knights Game: Spanish Variation, Double Spanish	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3
C49	Four Knights Game: Spanish Variation, Nimzowitsch Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O Bxc6
C49	Four Knights Game: Spanish Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 Bxc3
C49	Four Knights Game: Spanish Variation, Symmetrical Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6
C49	Four Knights Game: Spanish Variation, Symmetrical Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Ne2
C49	Four Knights Game: Spanish Variation, Alatortsev Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 Qe7 Ne2 d5
C49	Four Knights Game: Spanish Variation, Gunsberg Counterattack	e4 e5 Nf3 Nf6 Nc3 Nc6 Bb5 Bb4 O-O O-O Nd5 Nxd5 exd5 e4
C49	Four Knights Game: Spanish Variation, Svenonius Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 Bxc3 bxc3 d5
C49	Four Knights Game: Spanish Variation, Symmetrical Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Ne7
C49	Four Knights Game: Spanish Variation, Symmetrical Variation, Tarrasch Variation	e4 e5 Nf3 Nf6 Nc3 Nc6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Be6
C49	Four Knights Game: Spanish Variation, Janowski Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 Bxc3 bxc3 d6 Re1
C49	Four Knights Game: Spanish Variation, Symmetrical Variation, Metger Unpin	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Bxc3 bxc3 Qe7
C49	Four Knights Game: Spanish Variation, Symmetrical Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Bxc3 bxc3 Qe7 Re1 Nd8 d4 Bg4
C49	Four Knights Game: Spanish Variation, Symmetrical Variation, Blake Variation	e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6 Bg5 Ne7 Nh4 c6 Bc4 d5 Bb3 Qd6
C50	Italian Game	e4 e5 Nf3 Nc6 Bc4
C50	Italian Game: Anti-Fried Liver Defence	e4 e5 Nf3 Nc6 Bc4 h6
C50	Italian Game: Blackburne-Kostić Gambit	e4 e5 Nf3 Nc6 Bc4 Nd4
C50	Italian Game: Giuoco Piano	e4 e5 Nf3 Nc6 Bc4 Bc5
C50	Italian Game: Hungarian Defence	e4 e5 Nf3 Nc6 Bc4 Be7
C50	Italian Game: Paris Defence	e4 e5 Nf3 Nc6 Bc4 d6
C50	Italian Game: Rousseau Gambit	e4 e5 Nf3 Nc6 Bc4 f5
C50	Italian Game: Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 d3
C50	Italian Game: Jerome Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 Bxf7+
C50	Italian Game: Rosentreter Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 d4
C50	Four Knights Game: Italian Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 Nc3 Nf6
C50	Italian Game: Giuoco Pianissimo, Lucchini Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 d3 f5
C50	Italian Game: Giuoco Pianissimo, Normal	e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5
C50	Italian Game: Classical Variation, Albin Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 c3
C50	Italian Game: Deutz Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d4
C50	Italian Game: Giuoco Pianissimo, Italian Four Knights Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6 Nc3
C50	Italian Game: Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 Nc3 Nf6 O-O O-O
C50	Italian Game: Giuoco Pianissimo, Dubois Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 d3 f5 Ng5 f4
C50	Italian Game: Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Nf6 O-O Bc5 Nc3 d6 d3
C50	Italian Game: Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 Nc3 Nf6 O-O O-O d3
C50	Italian Game: Giuoco Pianissimo, Canal Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6 Nc3 d6 Bg5
C50	Italian Game: Hungarian Defence, Tartakower Variation	e4 e5 Nf3 Nc6 Bc4 Be7 d4 exd4 c3 Nf6 e5 Ne4
C51	Italian Game: Evans Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4
C51	Italian Game: Evans Gambit Accepted	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4
C51	Italian Game: Evans Gambit Declined	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6
C51	Italian Game: Evans Gambit, Fontaine Countergambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 b5
C51	Italian Game: Evans Gambit, Hein Countergambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 d5
C51	Italian Game: Evans Gambit Declined	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 a4
C51	Italian Game: Evans Gambit Declined, Cordel Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 Bb2
C51	Italian Game: Evans Gambit, Anderssen Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Be7
C51	Italian Game: Evans Gambit, Mayet Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bf8
C51	Italian Game: Evans Gambit, McDonnell Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5
C51	Italian Game: Evans Gambit, Stone-Ware Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bd6
C51	Italian Game: Evans Gambit Declined, Showalter Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 a4 a6 Nc3
C51	Italian Game: Evans Gambit Declined, Hirschbach Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 b5 Na5 Nxe5 Qg5
C51	Italian Game: Evans Gambit Declined, Lange Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 b5 Na5 Nxe5 Nh6
C51	Italian Game: Evans Gambit, Anderssen Variation, Cordel Line	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Be7 d4 Na5
C51	Italian Game: Evans Gambit Declined, Vasquez Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 b5 Na5 Nxe5 Qg5 Bxf7+ Ke7 Qh5
C51	Italian Game: Evans Gambit, Harding Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 cxd4 Bb4+ Bd2
C51	Italian Game: Evans Gambit, McDonnell Defence, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6
C51	Italian Game: Evans Gambit Declined, Hicken Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 b5 Na5 Nxe5 Qg5 Qf3 Qxe5 Qxf7+ Kd8 Bb2
C51	Italian Game: Evans Gambit, Morphy Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d6 cxd4 Bb6 Nc3
C51	Italian Game: Evans Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Bg4
C51	Italian Game: Evans Gambit, Fraser Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Bg4 Qa4
C51	Italian Game: Evans Gambit, Göring Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Na5 Bg5
C51	Italian Game: Evans Gambit, Ulvestad Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 d5 Na5 Bb2
C51	Italian Game: Evans Gambit, Paulsen Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 d5 Na5 Bb2 Ne7
C51	Italian Game: Evans Gambit, Steinitz Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Na5 Bg5 f6 Be3
C51	Italian Game: Evans Gambit Declined, Pavlov Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 b5 Na5 Nxe5 Nh6 d4 d6 Bxh6 dxe5 Bxg7 Rg8 Bxf7+ Kxf7 Bxe5 Qg5 Nd2
C51	Italian Game: Evans Gambit, Fraser-Mortimer Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Bg4 Qa4 Bd7 Qb3 Na5 Bxf7+ Kf8 Qc2
C51	Italian Game: Evans Gambit, Mortimer-Evans Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Bc5 d4 exd4 O-O d6 cxd4 Bb6 Nc3 Bg4 Qa4 Bd7 Qb3 Na5 Bxf7+ Kf8 Qc2 Kxf7
C52	Italian Game: Evans Gambit, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5
C52	Italian Game: Evans Gambit, Slow Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O
C52	Italian Game: Evans Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6
C52	Italian Game: Evans Gambit, Bronstein Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6
C52	Italian Game: Evans Gambit, Laroche Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 Nf6
C52	Italian Game: Evans Gambit, Leonhardt Countergambit	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 b5
C52	Italian Game: Evans Gambit, Pierce Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4
C52	Italian Game: Evans Gambit, Sokolsky Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6 Bg5
C52	Italian Game: Evans Gambit, Tartakower Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6 Qb3
C52	Italian Game: Evans Gambit, Alapin-Steinitz Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6 d4 Bg4
C52	Italian Game: Evans Gambit, Anderssen Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O Nf6 d4 exd4
C52	Italian Game: Evans Gambit, Compromised Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O dxc3
C52	Italian Game: Evans Gambit, Dufresne Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d3
C52	Italian Game: Evans Gambit, Johner Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O b5
C52	Italian Game: Evans Gambit, Lasker Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6 d4 Bb6
C52	Italian Game: Evans Gambit, Mieses Defence	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O Nge7
C52	Italian Game: Evans Gambit, Sanders-Alapin Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O d6 d4 Bd7
C52	Italian Game: Evans Gambit, Richardson Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 O-O Nf6 d4 O-O Nxe5
C52	Italian Game: Evans Gambit, Waller Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O d6 Qb3
C52	Italian Game: Evans Gambit, Compromised Defence, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O dxc3 Qb3 Qf6 e5 Qg6 Nxc3 Nge7 Ba3
C52	Italian Game: Evans Gambit, Compromised Defence, Potter Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 exd4 O-O dxc3 Qb3 Qf6 e5 Qg6 Nxc3 Nge7 Rd1
C52	Italian Game: Evans Gambit, Levenfish Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bxb4 c3 Ba5 d4 d6 Qb3 Qd7 dxe5 dxe5 O-O Bb6 Ba3 Na5 Nxe5
C53	Italian Game: Classical Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3
C53	Italian Game: Classical Variation, Closed Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7
C53	Italian Game: Bird’s Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 b4
C53	Italian Game: Classical Variation, Center Holding Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6
C53	Italian Game: Classical Variation, Mestel Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 Bg5
C53	Italian Game: Classical Variation, La Bourdonnais Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 d6 d4 exd4 cxd4 Bb6
C53	Italian Game: Classical Variation, Eisinger Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 d5 Nb8 d6
C53	Italian Game: Classical Variation, Tarrasch Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Qe7 d4 Bb6 O-O d6 a4 a6 h3 Nf6 Re1
C54	Italian Game: Classical Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6
C54	Italian Game: Classical Variation, Center Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6
C54	Italian Game: Classical Variation, Giuoco Pianissimo, with a6	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 a6
C54	Italian Game: Classical Variation, with d5	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d5
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 h6 c3
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3
C54	Italian Game: Classical Variation, Giuoco Pianissimo, Albin Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 b4
C54	Italian Game: Classical Variation, Giuoco Pianissimo, with a5	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 a5 c3
C54	Italian Game: Classical Variation, Greco Gambit, Dubov Italian	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 b4
C54	Italian Game: Classical Variation, Greco Gambit, Modern Line	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5
C54	Italian Game: Classical Variation, Greco Gambit, Traditional Line	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a5
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 Bb6
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 O-O
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 O-O c3 d5
C54	Italian Game: Classical Variation, Giuoco Pianissimo, with a6	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 Nbd2 a6
C54	Italian Game: Classical Variation, Giuoco Pianissimo, with h6	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 h6
C54	Italian Game: Classical Variation, Greco Gambit, Modern Line	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5 d5
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 Nbd2 O-O O-O
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 a4
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 Re1
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 h6 Re1
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 h6 Nbd2
C54	Italian Game: Giuoco Piano, Cracow Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Kf1
C54	Italian Game: Giuoco Piano, Greco’s Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 a4 Ba7
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 a4 O-O
C54	Italian Game: Classical Variation, Giuoco Pianissimo	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 a6 Re1 Ba7
C54	Italian Game: Classical Variation, Giuoco Pianissimo, with a4 a5	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O a4 a5
C54	Italian Game: Classical Variation, Greco Gambit, Anderssen Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5 d5 Bb5 Ne4 cxd4 Bb4+
C54	Italian Game: Classical Variation, Greco Gambit, Greco Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Nxc3
C54	Italian Game: Classical Variation, Greco Gambit, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3
C54	Italian Game: Classical Variation, Ghulam-Kassim Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 e5 Ne4 Bd5 Nxf2 Kxf2 dxc3+ Kg3
C54	Italian Game: Classical Variation, Giuoco Pianissimo, Main Line	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3
C54	Italian Game: Classical Variation, Greco Gambit, Moeller-Therkatz Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 d5
C54	Italian Game: Giuoco Piano, Rosentreter Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 O-O Bc5 d4 Bxd4 Nxd4 Nxd4 Bg5 h6 Bh4 g5 f4
C54	Italian Game: Giuoco Piano, Aitken Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Nxc3 bxc3 Bxc3 Ba3
C54	Italian Game: Giuoco Piano, Holzhausen Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 O-O Bc5 d4 Bxd4 Nxd4 Nxd4 Bg5 d6 f4 Qe7 fxe5 dxe5 Nc3
C54	Italian Game: Giuoco Piano, Steinitz Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 bxc3 d5 Ba3
C54	Italian Game: Giuoco Piano, Bernstein Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Nxc3 bxc3 Bxc3 Qb3 d5
C54	Italian Game: Classical Variation, Greco Gambit, Moeller-Bayonet Attack	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 d5 Bf6 Re1 Ne7 Rxe4 d6 g4
C54	Italian Game: Giuoco Piano, Krause Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Nxe4 Bxb4 Nxb4 Bxf7+ Kxf7 Qb3+ d5 Ne5+ Kf6 f3
C54	Italian Game: Giuoco Piano, Therkatz-Herzog Variation	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Nc3 Nxe4 O-O Bxc3 d5 Bf6 Re1 Ne7 Rxe4 d6 Bg5 Bxg5 Nxg5 O-O Nxh7
C55	Italian Game: Two Knights Defence	e4 e5 Nf3 Nc6 Bc4 Nf6
C55	Italian Game: Two Knights Defence, Modern Bishop’s Opening	e4 e5 Nf3 Nc6 Bc4 Nf6 d3
C55	Italian Game: Two Knights Defence, Modern Bishop’s Opening	e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7
C55	Italian Game: Two Knights Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 Nc3 Nxe4 Nxe4 d5
C55	Italian Game: Two Knights Defence, Modern Bishop’s Opening	e4 e5 Nf3 Nc6 Bc4 Nf6 d3 h6 O-O d6
C55	Italian Game: Two Knights Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 O-O Bc5 d4 Bxd4 Nxd4 Nxd4 Bg5 d6
C56	Italian Game: Two Knights Defence, Open Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4
C56	Italian Game: Scotch Invitation Declined	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 d6
C56	Italian Game: Scotch Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O
C56	Italian Game: Two Knights Defence, Perreux Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 Ng5
C56	Italian Game: Scotch Gambit, de Riviere Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Be7
C56	Italian Game: Scotch Gambit, Double Gambit Accepted	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Nxe4
C56	Italian Game: Scotch Gambit, Janowski Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O d6
C56	Italian Game: Scotch Gambit, Max Lange Attack	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Bc5
C56	Italian Game: Scotch Gambit, Nakhmanson Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Nxe4 Nc3
C56	Italian Game: Scotch Gambit, Walbrodt-Baird Gambit	e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 O-O
C56	Italian Game: Two Knights Defence, Max Lange Attack	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Bc5 e5
C56	Italian Game: Scotch Gambit, Max Lange Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 e5 d5 Bb5 Ne4
C56	Italian Game: Scotch Gambit, Max Lange Attack, Spielmann Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Bc5 e5 Ng4
C56	Italian Game: Scotch Gambit, Canal Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Nxe4 Re1 d5 Nc3
C56	Italian Game: Two Knights Defence, Max Lange Attack, Krause Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Bc5 e5 Ng4 c3
C56	Italian Game: Scotch Gambit, Anderssen Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Nxe4 Re1 d5 Bxd5 Qxd5 Nc3
C56	Italian Game: Scotch Gambit, Max Lange Attack Accepted	e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d4 exd4 e5 d5 exf6 dxc4 Re1+ Be6 fxg7
C56	Italian Game: Two Knights Defence, Keidansky Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 e5 d5 Bb5 Ne4 Nxd4 Bc5 Nxc6 Bxf2+ Kf1 Qh4
C56	Italian Game: Two Knights Defence, Max Lange Attack, Loman Defence	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 O-O Nf6 e5 d5 exf6 dxc4 Re1+ Be6 Ng5 g6
C56	Italian Game: Scotch Gambit, Anderssen Attack, Main Line	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Nxe4 Re1 d5 Bxd5 Qxd5 Nc3 Qa5 Nxe4 Be6 Bd2 Qd5 Bg5
C56	Italian Game: Scotch Gambit, Max Lange Attack, Long Variation	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Bc5 e5 d5 exf6 dxc4 Re1+ Be6 Ng5 Qd5 Nc3 Qf5 Nce4
C56	Italian Game: Two Knights Defence, Max Lange Attack, Rubinstein Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Bc5 e5 d5 exf6 dxc4 Re1+ Be6 Ng5 Qd5 Nc3 Qf5 Nce4 Bf8
C56	Italian Game: Two Knights Defence, Yurdansky Attack	e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 O-O Nxe4 Re1 d5 Bxd5 Qxd5 Nc3 Qa5 Nxe4 Be6 Bg5 h6 Bh4 g5 Nf6+ Ke7 b4
C56	Italian Game: Two Knights Defence, Max Lange Attack, Berger Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 d4 exd4 O-O Bc5 e5 d5 exf6 dxc4 Re1+ Be6 Ng5 Qd5 Nc3 Qf5 g4 Qg6 Nce4 Bb6 f4 O-O-O
C57	Italian Game: Two Knights Defence, Knight Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5
C57	Italian Game: Two Knights Defence, Knight Attack, Normal Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5
C57	Italian Game: Two Knights Defence, Ponziani-Steinitz Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Nxe4
C57	Italian Game: Two Knights Defence, Traxler Counterattack	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5
C57	Italian Game: Two Knights Defence, Traxler Counterattack, Bishop Sacrifice Line	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Bxf7+
C57	Italian Game: Two Knights Defence, Traxler Counterattack, Knight Sacrifice Line	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7
C57	Italian Game: Two Knights Defence, Fritz Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nd4
C57	Italian Game: Two Knights Defence, Kloss Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nb4
C57	Italian Game: Two Knights Defence, Ulvestad Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 b5
C57	Italian Game: Two Knights Defence, Fried Liver Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7
C57	Italian Game: Two Knights Defence, Lolli Attack	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 d4
C57	Italian Game: Two Knights Defence, Traxler Variation, Trencianske-Teplice Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Bxf7+ Ke7 d4
C57	Italian Game: Two Knights Defence, Pincus Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 d4 Bb4+
C57	Italian Game: Two Knights Defence, Traxler Counterattack, King March Line	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 Bc5 Nxf7 Bxf2+ Kxf2 Nxe4+ Ke3
C57	Italian Game: Two Knights Defence, Ulvestad Variation, Kurkin Gambit	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 b5 Bf1 h6 Nxf7
C57	Italian Game: Two Knights Defence, Fritz, Gruber Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nd4 c3 b5 Bf1 Nxd5 Ne4
C57	Italian Game: Two Knights Defence, Fegatello Attack, Leonhardt Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7 Qf3+ Ke6 Nc3 Nb4 Qe4 c6 a3 Na6 d4 Nc7
C58	Italian Game: Two Knights Defence, Polerio Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5
C58	Italian Game: Two Knights Defence, Polerio Defence, Bishop Check Line	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+
C58	Italian Game: Two Knights Defence, Polerio Defence, Kieseritzky Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 d3
C58	Italian Game: Two Knights Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2
C58	Italian Game: Two Knights Defence, Polerio Defence, Bogoljubow Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Qf3
C58	Italian Game: Two Knights Defence, Blackburne Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Qf3 cxb5
C58	Italian Game: Two Knights Defence, Colman Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Qf3 Rb8
C58	Italian Game: Two Knights Defence, Paoli Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Qf3 Qc7 Bd3
C58	Italian Game: Two Knights Defence, Maróczy Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 d3 h6 Nf3 e4 Qe2 Nxc4 dxc4 Be7
C58	Italian Game: Two Knights Defence, Polerio Defence, Yankovich Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 d3 h6 Nf3 e4 Qe2 Nxc4 dxc4 Bc5 Nfd2
C59	Italian Game: Two Knights Defence, Polerio Defence, Suhle Defence	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6
C59	Italian Game: Two Knights Defence, Steinitz Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nh3
C59	Italian Game: Two Knights Defence, Polerio Defence, Göring Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Qc7
C59	Italian Game: Two Knights Defence, Knorre Variation	e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5 Bb5+ c6 dxc6 bxc6 Be2 h6 Nf3 e4 Ne5 Bd6 d4 Qc7 Bd2
C60	Ruy Lopez	e4 e5 Nf3 Nc6 Bb5
C60	Ruy Lopez: Alapin Defence	e4 e5 Nf3 Nc6 Bb5 Bb4
C60	Ruy Lopez: Brentano Gambit	e4 e5 Nf3 Nc6 Bb5 g5
C60	Ruy Lopez: Bulgarian Variation	e4 e5 Nf3 Nc6 Bb5 a5
C60	Ruy Lopez: Cozio Defence	e4 e5 Nf3 Nc6 Bb5 Nge7
C60	Ruy Lopez: Fianchetto Defence	e4 e5 Nf3 Nc6 Bb5 g6
C60	Ruy Lopez: Lucena Variation	e4 e5 Nf3 Nc6 Bb5 Be7
C60	Ruy Lopez: Nürnberg Variation	e4 e5 Nf3 Nc6 Bb5 f6
C60	Ruy Lopez: Pollock Defence	e4 e5 Nf3 Nc6 Bb5 Na5
C60	Ruy Lopez: Retreat Variation	e4 e5 Nf3 Nc6 Bb5 Nb8
C60	Ruy Lopez: Rotary-Albany Gambit	e4 e5 Nf3 Nc6 Bb5 b6
C60	Ruy Lopez: Spanish Countergambit	e4 e5 Nf3 Nc6 Bb5 d5
C60	Ruy Lopez: Vinogradov Variation	e4 e5 Nf3 Nc6 Bb5 Qe7
C60	Ruy Lopez: Cozio Defence, Paulsen Variation	e4 e5 Nf3 Nc6 Bb5 Nge7 Nc3 g6
C60	Ruy Lopez: Fianchetto Defence, Kevitz Gambit	e4 e5 Nf3 Nc6 Bb5 g6 c3 f5
C60	Ruy Lopez: Spanish Countergambit, Harding Countergambit, Fricke Gambit	e4 e5 Nf3 Nc6 Bb5 d5 Nxe5 Qg5 O-O
C60	Ruy Lopez: Spanish Countergambit, Harding Gambit	e4 e5 Nf3 Nc6 Bb5 d5 Nxe5 Qg5 Nxc6
C60	Ruy Lopez: Alapin Defence, Alapin Gambit	e4 e5 Nf3 Nc6 Bb5 Bb4 c3 Ba5 Bxc6 dxc6
C60	Ruy Lopez: Cozio Defence, Tartakower Gambit	e4 e5 Nf3 Nc6 Bb5 g6 d4 exd4 Nxd4 Bg7 Be3 Nge7 Nc3 O-O Qd2 d5
C61	Ruy Lopez: Bird Variation	e4 e5 Nf3 Nc6 Bb5 Nd4
C61	Ruy Lopez: Bird Variation, Paulsen Variation	e4 e5 Nf3 Nc6 Bb5 Nd4 Nxd4 exd4 O-O Ne7
C62	Ruy Lopez: Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 d6
C62	Ruy Lopez: Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 d6 d4
C62	Ruy Lopez: Steinitz Defence, Center Gambit	e4 e5 Nf3 Nc6 Bb5 d6 d4 exd4 O-O
C62	Ruy Lopez: Steinitz Defence, Semi-Duras Variation	e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7 c4
C62	Ruy Lopez: Steinitz Defence, Nimzowitsch Attack	e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7 Nc3 Nf6 Bxc6
C63	Ruy Lopez: Schliemann Defence	e4 e5 Nf3 Nc6 Bb5 f5
C63	Ruy Lopez: Schliemann Defence, Dyckhoff Variation	e4 e5 Nf3 Nc6 Bb5 f5 Nc3
C63	Ruy Lopez: Schliemann Defence, Exchange Variation	e4 e5 Nf3 Nc6 Bb5 f5 Bxc6
C63	Ruy Lopez: Schliemann Defence, Jaenisch Gambit Accepted	e4 e5 Nf3 Nc6 Bb5 f5 exf5
C63	Ruy Lopez: Schliemann Defence, Schönemann Attack	e4 e5 Nf3 Nc6 Bb5 f5 d4
C63	Ruy Lopez: Schliemann Defence, Kostić Defence	e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 Be7
C63	Ruy Lopez: Schliemann Defence, Tartakower Variation	e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 Nf6
C63	Ruy Lopez: Schliemann Defence, Classical Variation	e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 d5 Nxe5 dxe4 Nxc6 Qg5
C63	Ruy Lopez: Schliemann Defence, Möhring Variation	e4 e5 Nf3 Nc6 Bb5 f5 Nc3 fxe4 Nxe4 d5 Nxe5 dxe4 Nxc6 Qd5
C64	Ruy Lopez: Classical Variation	e4 e5 Nf3 Nc6 Bb5 Bc5
C64	Ruy Lopez: Classical Variation, Central Variation	e4 e5 Nf3 Nc6 Bb5 Bc5 c3
C64	Ruy Lopez: Classical Variation, Spanish Wing Gambit	e4 e5 Nf3 Nc6 Bb5 Bc5 b4
C64	Ruy Lopez: Classical Defence, Boden Variation	e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Qe7
C64	Ruy Lopez: Classical Variation, Charousek Variation	e4 e5 Nf3 Nc6 Bb5 Bc5 c3 Bb6
C64	Ruy Lopez: Classical Variation, Cordel Gambit	e4 e5 Nf3 Nc6 Bb5 Bc5 c3 f5
C64	Ruy Lopez: Classical Variation, Konikowski Gambit	e4 e5 Nf3 Nc6 Bb5 Bc5 c3 d5
C64	Ruy Lopez: Classical Defence, Zaitsev Variation	e4 e5 Nf3 Nc6 Bb5 Bc5 O-O Nd4 b4
C64	Ruy Lopez: Classical Defence, Benelux Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 c3 O-O d4 Bb6
C64	Ruy Lopez: Classical Variation, Modern Main Line	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 c3 O-O d4 Bb6 Bg5
C65	Ruy Lopez: Berlin Defence	e4 e5 Nf3 Nc6 Bb5 Nf6
C65	Ruy Lopez: Berlin Defence	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 d3
C65	Ruy Lopez: Halloween Attack	e4 e5 Nf3 Nc6 Bb5 Nf6 Nxe5
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation, Mortimer Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Ne7
C65	Ruy Lopez: Berlin Defence, Beverwijk Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5
C65	Ruy Lopez: Berlin Defence, Fishing Pole Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Ng4
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation, Anderssen Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 Bxc6+
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation, Duras Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 d3 d6 c4
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation, Kaufmann Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Bc5 Be3
C65	Ruy Lopez: Berlin Defence, Nyholm Attack	e4 e5 Nf3 Nc6 Bb5 Nf6 d4 exd4 O-O
C65	Ruy Lopez: Classical Variation, Zukertort Gambit	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Bc5 c3
C65	Ruy Lopez: Berlin Defence, Anti-Berlin Variation, Mortimer Trap	e4 e5 Nf3 Nc6 Bb5 Nf6 d3 Ne7 Nxe5 c6
C66	Ruy Lopez: Berlin Defence, Improved Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6
C66	Ruy Lopez: Closed Berlin Defence, Chigorin Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6 d4 Nd7
C66	Ruy Lopez: Berlin Defence, Closed Wolf Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6 d4 Bd7 Nc3 exd4
C66	Ruy Lopez: Berlin Defence, Hedgehog Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6 d4 Bd7 Nc3 Be7
C66	Ruy Lopez: Berlin Defence, Closed Bernstein Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6 d4 Bd7 Nc3 Be7 Bg5
C66	Ruy Lopez: Berlin Defence, Closed Showalter Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O d6 d4 Bd7 Nc3 Be7 Bxc6
C66	Ruy Lopez: Berlin Defence, Tarrasch Trap	e4 e5 Nf3 Nc6 Bb5 d6 d4 Bd7 Nc3 Nf6 O-O Be7 Re1 O-O
C67	Ruy Lopez: Berlin Defence, Rio Gambit Accepted	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4
C67	Ruy Lopez: Berlin Defence, l’Hermet Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6
C67	Ruy Lopez: Berlin Defence, Rio de Janeiro Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7
C67	Ruy Lopez: Berlin Defence, Rosenthal Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 a6
C67	Ruy Lopez: Berlin Defence, Minckwitz Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 dxe5
C67	Ruy Lopez: Open Berlin Defence, l’Hermet Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 dxe5
C67	Ruy Lopez: Open Berlin Defence, Showalter Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Ba4
C67	Ruy Lopez: Berlin Defence, Trifunovic Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 d5
C67	Ruy Lopez: Berlin Defence, l’Hermet Variation, Westerinen Line	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Ne4
C67	Ruy Lopez: Berlin Defence, Cordel Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 Nd6 Bxc6 bxc6 dxe5 Nf5
C67	Ruy Lopez: Berlin Defence, l’Hermet Variation, Berlin Wall Defence	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8
C67	Ruy Lopez: Berlin Defence, Pillsbury Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 Nd6 Bxc6 bxc6 dxe5 Nb7 b3
C67	Ruy Lopez: Berlin Defence, Winawer Attack	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 Nd6 Bxc6 bxc6 dxe5 Nb7 Nd4
C67	Ruy Lopez: Berlin Defence, Zukertort Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 Nd6 Bxc6 bxc6 dxe5 Nb7 c4
C67	Ruy Lopez: Berlin Defence, Berlin Wall	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8 Nc3 Bd7
C67	Ruy Lopez: Berlin Defence, Rio de Janeiro Variation	e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Be7 Qe2 Nd6 Bxc6 bxc6 dxe5 Nb7 Nc3 O-O Re1 Nc5 Nd4 Ne6 Be3 Nxd4 Bxd4 c5
C68	Ruy Lopez: Exchange Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6
C68	Ruy Lopez: Exchange Variation, Lutikov Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 bxc6
C68	Ruy Lopez: Exchange Variation, Keres Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 Nc3
C68	Ruy Lopez: Exchange Variation, Romanovsky Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 Nc3 f6 d3
C68	Ruy Lopez: Exchange Variation, Alekhine Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 d4 exd4 Qxd4 Qxd4 Nxd4 Bd6
C68	Ruy Lopez: Exchange, Alekhine Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 d4 exd4 Qxd4 Qxd4 Nxd4 Bd7
C69	Ruy Lopez: Exchange Variation, Normal Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O
C69	Ruy Lopez: Exchange Variation, Bronstein Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O Qd6
C69	Ruy Lopez: Exchange Variation, Gligoric Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O f6
C69	Ruy Lopez: Exchange Variation, King’s Bishop Variation	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O Bd6
C69	Ruy Lopez: Exchange Variation, Alapin Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O Bg4 h3 h5
C70	Ruy Lopez: Morphy Defence	e4 e5 Nf3 Nc6 Bb5 a6
C70	Ruy Lopez: Bird’s Defence Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nd4
C70	Ruy Lopez: Morphy Defence, Alapin’s Defence Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bb4
C70	Ruy Lopez: Morphy Defence, Caro Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5
C70	Ruy Lopez: Morphy Defence, Classical Defence Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Bc5
C70	Ruy Lopez: Morphy Defence, Cozio Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nge7
C70	Ruy Lopez: Morphy Defence, Fianchetto Defence Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 g6
C70	Ruy Lopez: Morphy Defence, Schliemann Defence Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 f5
C70	Ruy Lopez: Morphy Defence, Schliemann Defence Deferred, Jaenisch Gambit Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 f5 exf5
C70	Ruy Lopez: Morphy Defence, Graz Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Bc5
C70	Ruy Lopez: Morphy Defence, Norwegian Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Na5
C70	Ruy Lopez: Morphy Defence, Norwegian Variation, Nightingale Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 Na5 Bxf7+
C71	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6
C71	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 Nc3
C71	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c4
C71	Ruy Lopez: Noah’s Ark Trap	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 b5 Bb3 d6 d4 Nxd4 Nxd4 exd4 Qxd4 c5
C72	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 O-O
C72	Ruy Lopez: Closed, Kecskemet Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 O-O Bd7 c3 Nf6 d4 Be7 Nbd2 O-O Re1 Be8
C73	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 Bxc6+ bxc6 d4
C73	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 Bxc6+ bxc6 d4 f6
C74	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3
C74	Ruy Lopez: Morphy Defence, Modern Steinitz Defence, Siesta Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 f5
C74	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 f5 exf5 Bxf5 O-O
C75	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Bd7
C75	Ruy Lopez: Morphy Defence, Modern Steinitz Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 d6 c3 Bd7 d4 Nge7
C76	Ruy Lopez: Morphy Defence, Modern Steinitz Defence, Fianchetto Variation	e4 e5 Nf3 Nc6 Bb5 g6 c3 a6 Ba4 d6 d4 Bd7
C77	Ruy Lopez: Morphy Defence, Anderssen Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 d3
C77	Ruy Lopez: Morphy Defence, Bayreuth Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 Bxc6
C77	Ruy Lopez: Morphy Defence, Jaffe Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 c3
C77	Ruy Lopez: Morphy Defence, Mackenzie Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 d4
C77	Ruy Lopez: Morphy Defence, Tarrasch Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 Nc3
C77	Ruy Lopez: Morphy Defence, Wormald Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 Qe2
C77	Ruy Lopez: Morphy Defence, Duras Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 d3 d6 c4
C77	Ruy Lopez: Wormald Attack, Grünfeld Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 Qe2 b5 Bb3 Be7 d4 d6 c3 Bg4
C78	Ruy Lopez: Morphy Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O
C78	Ruy Lopez: Brix Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O g6
C78	Ruy Lopez: Central Countergambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d5
C78	Ruy Lopez: Morphy Defence, Møller Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Bc5
C78	Ruy Lopez: Morphy Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 d6
C78	Ruy Lopez: Morphy Defence, Arkhangelsk Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bb7
C78	Ruy Lopez: Morphy Defence, Neo-Arkhangelsk Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Bc5
C78	Ruy Lopez: Morphy Defence, Wing Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Be7 a4
C78	Ruy Lopez: Rabinovich Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 d6 Ng5 d5 exd5 Nd4 Re1 Bc5 Rxe5+ Kf8
C79	Ruy Lopez: Morphy Defence, Steinitz Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6
C79	Ruy Lopez: Morphy Defence, Steinitz Deferred	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6 Bxc6+ bxc6 d4 Nxe4
C79	Ruy Lopez: Steinitz Defence Deferred, Lipnitsky Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6 Bxc6+ bxc6 d4 Bg4
C79	Ruy Lopez: Steinitz Defence Deferred, Boleslavsky Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O d6 Bxc6+ bxc6 d4 Nxe4 Re1 f5 dxe5 d5 Nc3
C80	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4
C80	Ruy Lopez: Morphy Defence, Tartakower Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 Qe2
C80	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4
C80	Ruy Lopez: Open, Knorre Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 Nc3
C80	Ruy Lopez: Open, Riga Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 exd4
C80	Ruy Lopez: Open, Skipworth Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 Re1 d5
C80	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3
C80	Ruy Lopez: Open, Friess Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Nxe5
C80	Ruy Lopez: Open, Richter Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 d5
C80	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5
C80	Ruy Lopez: Open, Harksen Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 c4
C80	Ruy Lopez: Open, Main Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6
C80	Ruy Lopez: Open, Schlechter Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 a4 Nxd4
C80	Ruy Lopez: Open, Zukertort Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Ne7
C80	Ruy Lopez: Open, Bernstein Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Nbd2
C80	Ruy Lopez: Open, Berger Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 a4 Nxd4 Nxd4 exd4 Nc3
C80	Ruy Lopez: Open, Bernstein Variation, Luther Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Nbd2 Bc5 Qe1
C80	Ruy Lopez: Open, Karpov Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Nbd2 Nc5 c3 d4 Ng5
C81	Ruy Lopez: Open, Howell Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Qe2
C81	Ruy Lopez: Open, Howell Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Qe2 Be7 c4
C81	Ruy Lopez: Open, Howell Attack, Ekstrom Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Qe2 Be7 Rd1 O-O c4 bxc4 Bxc4 Qd7
C82	Ruy Lopez: Open	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3
C82	Ruy Lopez: Open, Berlin Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Nc5
C82	Ruy Lopez: Open, Italian Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5
C82	Ruy Lopez: Open, Motzko Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Qd3
C82	Ruy Lopez: Open, St. Petersburg Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2
C82	Ruy Lopez: Open, Motzko Attack, Nenarokov Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Qd3 Ne7
C82	Ruy Lopez: Open, Dilworth Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Bc5 Nbd2 O-O Bc2 Nxf2
C83	Ruy Lopez: Open, Classical Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Be7
C83	Ruy Lopez: Open, Classical Defence, Main Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 Be7 Re1 b5 Bb3 d5 dxe5 Be6 c3
C83	Ruy Lopez: Open, Classical Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 Nbd2 Nc5 c3 Be7
C83	Ruy Lopez: Open, Malkin Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Be7 Nbd2 O-O Qe2
C83	Ruy Lopez: Open, Breslau Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Be7 Re1 O-O Nd4 Nxe5
C83	Ruy Lopez: Open, Tarrasch Trap	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6 c3 Be7 Re1 O-O Nd4 Qd7 Nxe6 fxe6 Rxe4
C84	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7
C84	Ruy Lopez: Closed, Center Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 d4
C84	Ruy Lopez: Closed, Martinez Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 d3
C84	Ruy Lopez: Closed, Morphy Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Nc3
C84	Ruy Lopez: Closed, Basque Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 d4 exd4 e5 Ne4 c3
C84	Ruy Lopez: Closed, Center Attack, Basque Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 d4 exd4 e5 Ne4 c3 dxc3
C85	Ruy Lopez: Closed, Delayed Exchange	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Bxc6
C86	Ruy Lopez: Closed, Worrall Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Qe2
C86	Ruy Lopez: Closed, Worrall Attack, Castling Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Qe2 b5 Bb3 O-O
C86	Ruy Lopez: Closed, Worrall Attack, Delayed Castling Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Qe2 b5 Bb3 d6
C86	Ruy Lopez: Closed, Worrall Attack, Castling Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 Qe2 Be7 O-O b5 Bb3 O-O c3 d5 d3
C87	Ruy Lopez: Closed, Averbakh Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 d6
C88	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3
C88	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O
C88	Ruy Lopez: Closed, Trajkovic Counterattack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 Bb7
C88	Ruy Lopez: Closed, Anti-Marshall	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O a4
C88	Ruy Lopez: Closed, Rosen Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 d4
C88	Ruy Lopez: Noah’s Ark Trap	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 d4 Nxd4 Nxd4 exd4 Qxd4 c5
C88	Ruy Lopez: Closed, Balla Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 Na5 Bc2 c5 d4 Qc7 a4
C88	Ruy Lopez: Closed, Leonhardt Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 Na5 Bc2 c5 d4 Qc7 h3 Nc6 d5 Nb8 Nbd2 g5
C88	Ruy Lopez: Closed, Alekhine Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 Na5 Bc2 c5 d4 Qc7 Nbd2 O-O Nf1 Bg4 Ne3 Bxf3 Qxf3
C89	Ruy Lopez: Marshall Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5
C89	Ruy Lopez: Marshall Attack, Steiner Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 e4
C89	Ruy Lopez: Marshall Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 a4 Bb7
C89	Ruy Lopez: Marshall Attack, Modern Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6
C89	Ruy Lopez: Marshall Attack, Original Marshall Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 Nf6
C89	Ruy Lopez: Marshall Attack, Main Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4
C89	Ruy Lopez: Marshall Attack, Re3 Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 Bxd5 cxd5 d4 Bd6 Re3
C89	Ruy Lopez: Marshall Attack, Modern Main Line	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4 Bd6 Re1 Qh4 g3 Qh3
C89	Ruy Lopez: Marshall Attack, Main Line, Spassky Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O c3 d5 exd5 Nxd5 Nxe5 Nxe5 Rxe5 c6 d4 Bd6 Re1 Qh4 g3 Qh3 Be3 Bg4 Qd3 Rae8 Nd2 Re6 a4 Qh5
C90	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O
C90	Ruy Lopez: Closed, Lutikov Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O Bc2
C90	Ruy Lopez: Closed, Pilnik Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O d3 d6 c3
C90	Ruy Lopez: Closed, Suetin Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O a3
C91	Ruy Lopez: Closed, Yates Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O d4
C91	Ruy Lopez: Closed, Bogoljubow Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O d4 Bg4
C91	Ruy Lopez: Closed, Yates Variation, Short Attack	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O d4 Bg4 a4
C92	Ruy Lopez: Closed	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3
C92	Ruy Lopez: Closed, Flohr System	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Bb7
C92	Ruy Lopez: Closed, Karpov Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nd7
C92	Ruy Lopez: Closed, Kholmov Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Be6
C92	Ruy Lopez: Closed, Zaitsev System	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Re8
C92	Ruy Lopez: Closed, Smyslov-Breyer-Zaitsev Hybrid	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Bb7 d4 Re8 Nbd2 Bf8 a3 h6
C93	Ruy Lopez: Closed, Smyslov Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 h6
C94	Ruy Lopez: Closed, Breyer Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8
C94	Ruy Lopez: Closed, Breyer Defence, Quiet Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d3
C95	Ruy Lopez: Closed, Breyer	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4
C95	Ruy Lopez: Closed, Breyer Defence, Zaitsev Hybrid	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7
C95	Ruy Lopez: Closed, Breyer Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nh4
C95	Ruy Lopez: Closed, Breyer Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 c5
C96	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2
C96	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5
C96	Ruy Lopez: Closed, Chigorin Defence, Gajewski Gambit	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 d5
C96	Ruy Lopez: Closed, Borisenko Variation	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Nc6
C96	Ruy Lopez: Closed, Keres Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Nd7
C96	Ruy Lopez: Closed, Rossolimo Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c6 d4 Qc7
C97	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5
C97	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7
C97	Ruy Lopez: Closed, Chigorin, Yugoslav System	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7 Nbd2 Bd7 Nf1 Rfe8 Ne3 g6
C98	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7 Nbd2 Nc6
C98	Ruy Lopez: Closed, Chigorin Defence	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7 Nbd2 Nc6 dxc5
C99	Ruy Lopez: Closed, Chigorin Defence, Panov System	e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Na5 Bc2 c5 d4 Qc7 Nbd2 cxd4 cxd4
D00	Queen’s Pawn Game	d4 d5
D00	Amazon Attack	d4 d5 Qd3
D00	Blackmar-Diemer Gambit	d4 d5 e4
D00	Queen’s Pawn Game	d4 d5 e3
D00	Queen’s Pawn Game: Accelerated London System	d4 d5 Bf4
D00	Queen’s Pawn Game: Chigorin Variation	d4 d5 Nc3
D00	Queen’s Pawn Game: Levitsky Attack	d4 d5 Bg5
D00	Queen’s Pawn Game: Mason Attack	d4 d5 f4
D00	Queen’s Pawn Game: Zurich Gambit	d4 d5 g4
D00	Queen’s Pawn Game	d4 d5 e3 Nf6
D00	Queen’s Pawn Game: Accelerated London System, Steinitz Countergambit	d4 d5 Bf4 c5
D00	Queen’s Pawn Game: Chigorin Variation	d4 d5 Nc3 e6
D00	Queen’s Pawn Game: Chigorin Variation, Alburt Defence	d4 d5 Nc3 Bf5
D00	Queen’s Pawn Game: Chigorin Variation, Anti-Veresov	d4 d5 Nc3 Bg4
D00	Queen’s Pawn Game: Chigorin Variation, Irish Gambit	d4 d5 Nc3 c5
D00	Queen’s Pawn Game: Chigorin Variation, Shaviliuk Gambit	d4 d5 Nc3 e5
D00	Queen’s Pawn Game: Chigorin Variation, Shropshire Defence	d4 d5 Nc3 h5
D00	Queen’s Pawn Game: Levitsky Attack, Welling Variation	d4 d5 Bg5 Bg4
D00	Blackmar-Diemer Gambit: Blackmar Gambit	d4 d5 e4 dxe4 f3
D00	Blackmar-Diemer Gambit: Diemer-Rosenberg Attack	d4 d5 e4 dxe4 Be3
D00	Blackmar-Diemer Gambit: Fritz Attack	d4 d5 e4 dxe4 Bc4
D00	Queen’s Pawn Game: Accelerated London System, Steinitz Countergambit Accepted	d4 d5 Bf4 c5 dxc5
D00	Queen’s Pawn Game: Accelerated London System, Steinitz Countergambit, Morris Countergambit	d4 d5 Bf4 c5 e4
D00	Queen’s Pawn Game: Hübsch Gambit	d4 Nf6 Nc3 d5 e4
D00	Queen’s Pawn Game: Stonewall Attack	d4 d5 e3 Nf6 Bd3
D00	Blackmar-Diemer Gambit	d4 d5 e4 dxe4 Nc3 Nf6
D00	Blackmar-Diemer Gambit: Lemberger Countergambit	d4 d5 e4 dxe4 Nc3 e5
D00	Blackmar-Diemer Gambit: Netherlands Variation	d4 d5 e4 dxe4 Nc3 f5
D00	Blackmar-Diemer Gambit: Reversed Albin Countergambit	d4 d5 e4 dxe4 Nc3 c5
D00	Blackmar-Diemer Gambit: Zeller Defence	d4 d5 e4 dxe4 Nc3 Bf5
D00	Queen’s Pawn Game: Accelerated London System, Steinitz Countergambit, Morris Countergambit Accepted	d4 d5 Bf4 c5 e4 dxe4
D00	Queen’s Pawn Game: Chigorin Variation, Fianchetto Defence	d4 g6 Nf3 Bg7 Nc3 d5
D00	Blackmar-Diemer Gambit: Lemberger Countergambit, Endgame Variation	d4 d5 e4 dxe4 Nc3 e5 dxe5
D00	Blackmar-Diemer Gambit: Lemberger Countergambit, Lange Gambit	d4 d5 e4 dxe4 Nc3 e5 Nxe4
D00	Blackmar-Diemer Gambit: Lemberger Countergambit, Rasmussen Attack	d4 d5 e4 dxe4 Nc3 e5 Nge2
D00	Blackmar-Diemer Gambit: Lemberger Countergambit, Sneiders Attack	d4 d5 e4 dxe4 Nc3 e5 Qh5
D00	Blackmar-Diemer Gambit: Lemberger Countergambit, Soller Attack	d4 d5 e4 dxe4 Nc3 e5 Be3
D00	Blackmar-Diemer Gambit: Rasa-Studier Gambit	d4 d5 e4 dxe4 Nc3 Nf6 Be3
D00	Blackmar-Diemer Gambit: von Popiel Gambit	d4 d5 e4 dxe4 Nc3 Nf6 Bg5
D00	Blackmar-Diemer Gambit Accepted	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3
D00	Blackmar-Diemer Gambit Declined: Brombacher Countergambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 c5
D00	Blackmar-Diemer Gambit Declined: Elbert Countergambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 e5
D00	Blackmar-Diemer Gambit Declined: Gedult Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 a6
D00	Blackmar-Diemer Gambit Declined: Lamb Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 Nc6
D00	Blackmar-Diemer Gambit Declined: Langeheinicke Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 e3
D00	Blackmar-Diemer Gambit Declined: O’Kelly Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 c6
D00	Blackmar-Diemer Gambit Declined: Vienna Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 Bf5
D00	Blackmar-Diemer Gambit Declined: Weinsbach Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 e6
D00	Blackmar-Diemer Gambit Accepted: Ryder Gambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Qxf3
D00	Blackmar-Diemer Gambit Declined: Weinsbach Defence, Pfrang Gambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 e6 fxe4
D00	Blackmar-Diemer Gambit: Zeller Defence, Soller Attack	d4 d5 e4 dxe4 Nc3 Bf5 f3 Nf6 Bc4
D00	Blackmar-Diemer Gambit Accepted: Bogoljubow Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6
D00	Blackmar-Diemer Gambit Accepted: Euwe Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 e6
D00	Blackmar-Diemer Gambit Accepted: Gunderam Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bf5
D00	Blackmar-Diemer Gambit Accepted: Holwell Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Qd6
D00	Blackmar-Diemer Gambit Accepted: Kaulich Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 c5
D00	Blackmar-Diemer Gambit Accepted: Pietrowsky Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Nc6
D00	Blackmar-Diemer Gambit Accepted: Ritter Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 b6
D00	Blackmar-Diemer Gambit Accepted: Schlutter Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Nbd7
D00	Blackmar-Diemer Gambit Accepted: Teichmann Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bg4
D00	Blackmar-Diemer Gambit Accepted: Ziegler Defence	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 c6
D00	Blackmar-Diemer Gambit Accepted: Euwe Defence, Duthilleul Gambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 e6 Bd3
D00	Blackmar-Diemer Gambit Accepted: Bogoljubow Defence, Mad Dog Attack	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6 Bc4 Bg7 h4
D00	Blackmar-Diemer Gambit Accepted: Bogoljubow Defence, Nimzowitsch Attack	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6 Bc4 Bg7 Ne5
D00	Blackmar-Diemer Gambit Accepted: Gunderam Defence, Stader Variation	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bf5 Ne5 e6 g4 Be4
D00	Blackmar-Diemer Gambit Accepted: Bogoljubow Defence, Kloss Attack	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6 Bc4 Bg7 O-O O-O Kh1
D00	Blackmar-Diemer Gambit Accepted: Bogoljubow Defence, Studier Attack	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 g6 Bc4 Bg7 O-O O-O Qe1
D00	Blackmar-Diemer Gambit Accepted: Teichmann Defence, Ciesielski Variation	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bg4 h3 Bxf3 Qxf3 c6 Qf2
D00	Blackmar-Diemer Gambit Accepted: Teichmann Defence, Classical Variation	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bg4 h3 Bxf3 Qxf3 c6 Be3
D00	Blackmar-Diemer Gambit Accepted: Teichmann Defence, Seidel-Hall Attack	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 Bg4 h3 Bxf3 Qxf3 c6 g4
D00	Blackmar-Diemer Gambit: von Popiel Gambit, Zilbermints Variation	d4 d5 e4 dxe4 Nc3 Nf6 Bg5 Bf5 Bxf6 exf6 g4 Bg6 Qe2 Bb4 Qb5+
D00	Blackmar-Diemer Gambit Accepted: Euwe Defence, Zilbermints Gambit	d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 e6 Bg5 Be7 Bd3 Nc6 O-O Nxd4 Kh1
D01	Rapport-Jobava System	d4 d5 Nc3 Nf6 Bf4
D01	Rapport-Jobava System, with e6	d4 d5 Nc3 e6 Bf4
D01	Richter-Veresov Attack	d4 Nf6 Nc3 d5 Bg5
D01	Rapport-Jobava System	d4 d5 Nc3 Nf6 Bf4 e6
D01	Rapport-Jobava System	d4 d5 Nc3 Nf6 Bf4 g6
D01	Richter-Veresov Attack	d4 Nf6 Nc3 d5 Bg5 Bf5
D01	Richter-Veresov Attack: Boyce Defence	d4 Nf6 Nc3 d5 Bg5 Ne4
D01	Richter-Veresov Attack: Richter Variation	d4 Nf6 Nc3 d5 Bg5 Bf5 f3
D01	Richter-Veresov Attack: Two Knights System	d4 Nf6 Nc3 d5 Bg5 Nbd7 Nf3
D01	Richter-Veresov Attack: Veresov Variation	d4 Nf6 Nc3 d5 Bg5 Bf5 Bxf6
D01	Richter-Veresov Attack: Two Knights System, Grünfeld Defence	d4 Nf6 Nc3 d5 Bg5 Nbd7 Nf3 g6
D01	Richter-Veresov Attack: Malich Gambit	d4 Nf6 Nc3 d5 Bg5 c5 Bxf6 gxf6 e4 dxe4 d5
D02	Queen’s Pawn Game: Zukertort Variation	d4 d5 Nf3
D02	Queen’s Pawn Game: Anti-Torre	Nf3 d5 d4 Bg4
D02	Queen’s Pawn Game: Chigorin Variation	d4 d5 Nf3 Nc6
D02	Queen’s Pawn Game: Krause Variation	d4 d5 Nf3 c5
D02	Queen’s Pawn Game: Symmetrical Variation	d4 d5 Nf3 Nf6
D02	Queen’s Pawn Game: London System	d4 d5 Nf3 Nf6 Bf4
D02	Queen’s Pawn Game: London System, with e6	d4 d5 Nf3 e6 Bf4
D02	Queen’s Pawn Game: Symmetrical Variation, Pseudo-Catalan	d4 d5 Nf3 Nf6 g3
D02	Queen’s Pawn Game: London System, with e6	d4 d5 Nf3 e6 Bf4 Nf6
D02	Queen’s Pawn Game: Zilbermints Countergambit	d4 d5 Nf3 Nf6 c4 b5
D02	Queen’s Pawn Game: Chandler Gambit	d4 d5 Nf3 c5 g3 cxd4 Bg2
D02	Queen’s Pawn Game: London System	d4 d5 Nf3 Nf6 Bf4 c5 e3
D02	Queen’s Gambit Declined: Baltic Defence, Pseudo-Slav	d4 d5 Nf3 Bf5 c4 e6 Nc3 c6
D02	Queen’s Pawn Game: Levitsky Attack, Euwe Variation, Modern Line	d4 d5 Nf3 c6 Bg5 h6 Bh4 Qb6
D02	Queen’s Pawn Game: Symmetrical Variation, Pseudo-Catalan	d4 d5 Nf3 Nf6 g3 c6 Bg2 Bg4
D02	London System: Poisoned Pawn Variation	d4 Nf6 Nf3 d5 Bf4 c5 e3 Qb6 Nc3
D02	Queen’s Pawn Game: London System	d4 d5 Nf3 Nf6 Bf4 c5 e3 Nc6 Nbd2
D02	Queen’s Pawn Game: London System, Pterodactyl Variation	d4 g6 Nf3 Bg7 Bf4 c5 c3 cxd4 cxd4 Qa5+
D02	Queen’s Pawn Game: Symmetrical Variation, Pseudo-Catalan	Nf3 d5 g3 c6 Bg2 Nf6 O-O Bg4 d4 e6
D02	Queen’s Pawn Game: London System	d4 d5 Nf3 Nf6 Bf4 c5 e3 Nc6 Nbd2 e6 c3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5
D03	Queen’s Pawn Game: Torre Attack, Gossip Variation	d4 d5 Nf3 Nf6 Bg5 Ne4
D03	Queen’s Pawn Game: Torre Attack, Grünfeld Variation	d4 d5 Nf3 Nf6 Bg5 g6
D03	Queen’s Pawn Game: Torre Attack, Grünfeld Variation	d4 d5 Nf3 Nf6 Bg5 g6 e3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 Nbd2
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 Nbd7 Bd3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nbd7
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nc6
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 Nbd2 Nc6 c3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nbd7 Nbd2
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nc6 Bd3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 Nbd2 Be7 c3 Nbd7 e3
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nbd7 Nbd2 Bd6
D03	Queen’s Pawn Game: Torre Attack	d4 d5 Nf3 Nf6 Bg5 e6 e3 c5 c3 Nbd7 Nbd2 Be7
D04	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3
D04	Queen’s Pawn Game: Colle System, Anti-Colle	d4 d5 Nf3 Nf6 e3 Bf5
D04	Queen’s Pawn Game: Colle System, Grünfeld Formation	d4 d5 Nf3 Nf6 e3 g6 Bd3 Bg7
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6 Bd3
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6 b3
D05	Queen’s Pawn Game: Colle System, Traditional Colle	d4 Nf6 Nf3 e6 e3 c5 Bd3 d5 c3
D05	Queen’s Pawn Game: Zukertort Variation	d4 d5 Nf3 c5 e3 Nf6 Nbd2 e6 b3
D05	Rubinstein Opening	d4 Nf6 Nf3 e6 e3 c5 Bd3 d5 b3
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6 b3 c5 Bb2 Nc6
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6 b3 c5 Bb2 Nc6 Bd3
D05	Queen’s Pawn Game: Colle System	d4 d5 Nf3 Nf6 e3 e6 b3 c5 Bb2 Nc6 Nbd2
D05	Rubinstein Opening: Semi-Slav Defence	d4 d5 Nf3 Nf6 e3 e6 Bd3 Bd6 O-O O-O b3 Nbd7 Bb2
D05	Rubinstein Opening: Bogoljubow Defence	d4 Nf6 Nf3 e6 e3 c5 Bd3 d5 b3 Nc6 O-O Bd6 Bb2 O-O
D05	Rubinstein Opening: Classical Defence	d4 Nf6 Nf3 e6 e3 c5 Bd3 d5 b3 Nc6 O-O Be7 Bb2 O-O
D05	Rubinstein Opening: Semi-Slav Defence	d4 d5 Nf3 Nf6 e3 e6 Bd3 Bd6 O-O O-O b3 Nbd7 Bb2 c6
D05	Rubinstein Opening: Semi-Slav Defence	d4 d5 Nf3 Nf6 e3 e6 Bd3 Bd6 O-O O-O b3 Nbd7 Bb2 c6 Nbd2
D05	Queen’s Pawn Game: Colle System	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O c5 b3 Be7 Bb2 O-O Nbd2 d5
D06	Queen’s Gambit	d4 d5 c4
D06	Queen’s Gambit Declined: Austrian Defence	d4 d5 c4 c5
D06	Queen’s Gambit Declined: Baltic Defence	d4 d5 c4 Bf5
D06	Queen’s Gambit Declined: Marshall Defence	d4 d5 c4 Nf6
D06	Queen’s Gambit Declined: Zilbermints Gambit	d4 d5 c4 b5
D06	Queen’s Gambit Declined: Baltic Defence, Queen Attack	d4 d5 c4 Bf5 Qb3
D06	Queen’s Gambit Declined: Austrian Attack, Salvio Countergambit	d4 d5 c4 c5 dxc5 d4
D06	Queen’s Gambit Declined: Austrian Defence, Gusev Countergambit	d4 d5 c4 c5 cxd5 Nf6
D06	Queen’s Gambit Declined: Marshall Defence, Tan Gambit	d4 d5 c4 Nf6 cxd5 c6
D06	Queen’s Gambit Declined: Baltic Defence, Queen Attack Deferred	d4 d5 c4 Bf5 Nc3 e6 Qb3
D06	Queen’s Gambit Declined: Baltic Defence, Pseudo-Chigorin	d4 d5 c4 Bf5 Nc3 e6 Nf3 Nc6
D06	Queen’s Gambit Declined: Austrian Defence, Haberditz Variation	d4 d5 c4 c5 cxd5 Nf6 e4 Nxe4 dxc5 Qa5+
D06	Queen’s Gambit Declined: Baltic Defence, Argentinian Gambit	d4 d5 c4 Bf5 cxd5 Bxb1 Qa4+ c6 dxc6 Nxc6
D07	Queen’s Gambit Declined: Chigorin Defence	d4 d5 c4 Nc6
D07	Queen’s Gambit Declined: Chigorin Defence	d4 d5 c4 Nc6 Nc3
D07	Queen’s Gambit Declined: Chigorin Defence	d4 d5 c4 Nc6 Nc3 dxc4
D07	Queen’s Gambit Declined: Chigorin Defence, Exchange Variation	d4 d5 c4 Nc6 cxd5 Qxd5
D07	Queen’s Gambit Declined: Chigorin Defence, Lazard Gambit	d4 d5 c4 Nc6 Nf3 e5
D07	Queen’s Gambit Declined: Chigorin Defence, Main Line	d4 d5 c4 Nc6 Nf3 Bg4
D07	Queen’s Gambit Declined: Chigorin Defence, Tartakower Gambit	d4 d5 c4 Nc6 Nc3 e5
D07	Queen’s Gambit Declined: Chigorin Defence, Janowski Variation	d4 d5 c4 Nc6 Nc3 dxc4 Nf3
D07	Queen’s Gambit Declined: Chigorin Defence, Main Line, Alekhine Variation	d4 d5 c4 Nc6 Nf3 Bg4 Qa4
D07	Queen’s Gambit Declined: Chigorin Defence, Modern Gambit	d4 d5 c4 Nc6 Nc3 dxc4 Nf3 Nf6
D07	Queen’s Gambit Declined: Chigorin Defence, Exchange Variation, Costa’s Line	d4 d5 c4 Nc6 cxd5 Qxd5 e3 e5 Nc3 Bb4 Bd2 Bxc3 Bxc3 exd4 Ne2
D08	Queen’s Gambit Declined: Albin Countergambit	d4 d5 c4 e5
D08	Queen’s Gambit Declined: Albin Countergambit, Normal Line	d4 d5 c4 e5 dxe5 d4 Nf3
D08	Queen’s Gambit Declined: Albin Countergambit, Spassky Variation	d4 d5 c4 e5 dxe5 d4 e4
D08	Queen’s Gambit Declined: Albin Countergambit, Tartakower Defence	d4 d5 c4 e5 dxe5 d4 Nf3 c5
D08	Queen’s Gambit Declined: Albin Countergambit, Modern Line	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 Nbd2
D08	Queen’s Gambit Declined: Albin Countergambit, Balogh Variation	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 Nbd2 Qe7
D08	Queen’s Gambit Declined: Albin Countergambit, Janowski Variation	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 Nbd2 f6
D08	Queen’s Gambit Declined: Albin Countergambit, Lasker Trap	d4 d5 c4 e5 dxe5 d4 e3 Bb4+ Bd2 dxe3
D08	Queen’s Gambit Declined: Albin Countergambit, Krenosz Variation	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 Nbd2 Bg4 h3 Bxf3 Nxf3 Bb4+ Bd2 Qe7
D09	Queen’s Gambit Declined: Albin Countergambit, Fianchetto Variation	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3
D09	Queen’s Gambit Declined: Albin Countergambit, Fianchetto Variation, Be6 Line	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3 Be6
D09	Queen’s Gambit Declined: Albin Countergambit, Fianchetto Variation, Bf5 Line	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3 Bf5
D09	Queen’s Gambit Declined: Albin Countergambit, Fianchetto Variation, Bg4 Line	d4 d5 c4 e5 dxe5 d4 Nf3 Nc6 g3 Bg4
D10	Slav Defence	d4 d5 c4 c6
D10	Slav Defence	d4 d5 c4 c6 Nc3
D10	Slav Defence: Diemer Gambit	d4 d5 c4 c6 e4
D10	Slav Defence: Exchange Variation	d4 d5 c4 c6 cxd5
D10	Slav Defence	d4 d5 c4 c6 Nc3 dxc4
D10	Slav Defence: Winawer Countergambit	d4 d5 c4 c6 Nc3 e5
D10	Slav Defence: Slav Gambit, Alekhine Attack	d4 d5 c4 c6 Nc3 dxc4 e4
D10	Slav Defence: Winawer Countergambit, Anti-Winawer Gambit	d4 d5 c4 c6 Nc3 e5 e4
D10	Slav Defence: Exchange Variation, Boor Attack	d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 f3
D11	Slav Defence: Modern Line	d4 d5 c4 c6 Nf3
D11	Slav Defence: Bonet Gambit	d4 d5 c4 c6 Nf3 Nf6 Bg5
D11	Slav Defence: Breyer Variation	d4 d5 c4 c6 Nf3 Nf6 Nbd2
D11	Slav Defence: Quiet Variation	d4 d5 c4 c6 Nf3 Nf6 e3
D11	Slav Defence: Quiet Variation, Pin Defence	d4 d5 c4 c6 Nf3 Nf6 e3 Bg4
D11	Slav Defence: Modern Line	d4 d5 c4 c6 Nf3 Nf6 g3 dxc4 Bg2 g6
D11	Slav Defence: Modern Line	d4 d5 c4 c6 Nf3 Nf6 g3 Bg4 Bg2 e6 O-O
D11	Slav Defence: Modern Line	d4 d5 Nf3 Nf6 g3 c6 Bg2 Bg4 O-O Nbd7 c4
D12	Slav Defence: Quiet Variation, Schallopp Defence	d4 d5 c4 c6 Nf3 Nf6 e3 Bf5
D12	Slav Defence: Quiet Variation, Schallopp Defence	d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 Nc3 e6
D12	Slav Defence: Quiet Variation, Amsterdam Variation	d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 cxd5 cxd5 Nc3 e6 Ne5 Nfd7
D12	Slav Defence: Quiet Variation, Landau Variation	d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 cxd5 cxd5 Qb3 Qc8 Bd2 e6 Na3
D13	Slav Defence: Exchange Variation	d4 d5 c4 c6 Nf3 Nf6 cxd5 cxd5
D13	Slav Defence: Exchange Variation, Schallopp Variation	d4 d5 c4 c6 Nf3 Nf6 e3 Bf5 cxd5 cxd5 Nc3
D14	Slav Defence: Exchange Variation, Symmetrical Line	d4 d5 c4 c6 cxd5 cxd5 Nc3 Nf6 Nf3 Nc6 Bf4 Bf5
D14	Slav Defence: Exchange Variation, Trifunovic Variation	d4 d5 c4 c6 Nf3 Nf6 cxd5 cxd5 Nc3 Nc6 Bf4 Bf5 e3 e6 Qb3 Bb4
D15	Slav Defence: Three Knights Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3
D15	Slav Defence: Chebanenko Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 a6
D15	Slav Defence: Schlechter Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 g6
D15	Slav Defence: Süchting Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 Qb6
D15	Slav Defence: Two Knights Attack	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4
D15	Slav Defence: Alekhine Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 e3
D15	Slav Defence: Chebanenko Variation, Advance System	d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 c5
D15	Slav Defence: Geller Gambit	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 e4
D15	Slav Defence: Chebanenko Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 a6 e3 Bf5
D15	Slav Defence: Geller Gambit	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 e4 b5 e5
D16	Slav Defence: Alapin Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4
D16	Slav Defence: Smyslov Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Na6
D16	Slav Defence: Soultanbeieff Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 e6
D16	Slav Defence: Steiner Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bg4
D17	Slav Defence: Czech Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5
D17	Slav Defence: Czech Variation, Bled Attack	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Nh4
D17	Slav Defence: Czech Variation, Krause Attack	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5
D17	Slav Defence: Czech Variation, Wiesbaden Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5 e6
D17	Slav Defence: Czech Variation, Krause Attack, Fazekas Gambit	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5 Na6 e4
D17	Slav Defence: Czech Variation, Wiesbaden Variation, Sharp Line	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5 e6 f3 Bb4 e4
D17	Slav Defence: Czech Variation, Carlsbad Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5 Nbd7 Nxc4 Qc7 g3 e5
D17	Slav Defence: Czech Variation, Carlsbad Variation, Morozevich Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 Ne5 Nbd7 Nxc4 Qc7 g3 e5 dxe5 Nxe5 Bf4 Nfd7 Bg2 g5
D18	Slav Defence: Czech Variation, Classical System	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3
D18	Slav Defence: Czech Variation, Lasker Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 Na6
D19	Slav Defence: Czech Variation, Dutch Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O
D19	Slav Defence: Czech Variation, Classical System, Main Line	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2
D19	Slav Defence: Czech Variation, Dutch Variation, Sämisch Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4 a4 Bf5 e3 e6 Bxc4 Bb4 O-O O-O Qe2 Ne4 g4
D20	Queen’s Gambit Accepted	d4 d5 c4 dxc4
D20	Queen’s Gambit Accepted: Accelerated Mannheim Variation	d4 d5 c4 dxc4 Qa4+
D20	Queen’s Gambit Accepted: Old Variation	d4 d5 c4 dxc4 e3
D20	Queen’s Gambit Accepted: Saduleto Variation	d4 d5 c4 dxc4 e4
D20	Queen’s Gambit Accepted: Central Variation, Alekhine System	d4 d5 c4 dxc4 e4 Nf6
D20	Queen’s Gambit Accepted: Central Variation, Greco Variation	d4 d5 c4 dxc4 e4 b5
D20	Queen’s Gambit Accepted: Central Variation, McDonnell Defence	d4 d5 c4 dxc4 e4 e5
D20	Queen’s Gambit Accepted: Central Variation, Modern Defence	d4 d5 c4 dxc4 e4 Nc6
D20	Queen’s Gambit Accepted: Central Variation, Rubinstein Defence	d4 d5 c4 dxc4 e4 c5
D20	Queen’s Gambit Accepted: Schwartz Defence	d4 d5 c4 dxc4 e4 f5
D20	Queen’s Gambit Accepted: Central Variation, McDonnell Defence, Somov Gambit	d4 d5 c4 dxc4 e4 e5 Bxc4
D20	Queen’s Gambit Accepted: Central Variation, Rubinstein Defence, Yefimov Gambit	d4 d5 c4 dxc4 e4 c5 d5 b5
D20	Queen’s Gambit Accepted: Linares Variation	d4 d5 c4 dxc4 e4 c5 d5 Nf6 Nc3 b5
D20	Queen’s Gambit Accepted: Old Variation, Billinger Gambit	d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 Qb3 Qe7 a3
D20	Queen’s Gambit Accepted: Old Variation, Christensen Gambit	d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 Qb3 Qe7 Nf3
D20	Queen’s Gambit Accepted: Old Variation, Korchnoi Gambit	d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 Qb3 Qe7 Kf1
D20	Queen’s Gambit Accepted: Old Variation, Novikov Gambit	d4 d5 c4 dxc4 e3 e5 Bxc4 exd4 Qb3 Qe7 Nd2
D21	Queen’s Gambit Accepted: Normal Variation	d4 d5 c4 dxc4 Nf3
D21	Queen’s Gambit Accepted: Godes Variation	d4 d5 c4 dxc4 Nf3 Nd7
D21	Queen’s Gambit Accepted: Gunsberg Defence	d4 d5 c4 dxc4 Nf3 c5
D21	Queen’s Gambit Accepted: Rosenthal Variation	d4 d5 c4 dxc4 Nf3 e6
D21	Queen’s Gambit Accepted: Slav Gambit	d4 d5 c4 dxc4 Nf3 b5
D21	Queen’s Gambit Accepted: Alekhine Defence, Borisenko-Furman Variation	d4 d5 c4 dxc4 Nf3 a6 e4
D22	Queen’s Gambit Accepted: Alekhine Defence	d4 d5 c4 dxc4 Nf3 a6
D22	Queen’s Gambit Accepted: Alekhine Defence, Haberditz Variation	d4 d5 c4 dxc4 Nf3 a6 e3 b5
D22	Queen’s Gambit Accepted: Alekhine Defence, Alatortsev Variation	d4 d5 c4 dxc4 Nf3 a6 e3 Bg4 Bxc4 e6 d5
D23	Queen’s Gambit Accepted	d4 d5 c4 dxc4 Nf3 Nf6
D23	Queen’s Gambit Accepted: Mannheim Variation	d4 d5 c4 dxc4 Nf3 Nf6 Qa4+
D24	Queen’s Gambit Accepted: Showalter Variation	d4 d5 c4 dxc4 Nf3 Nf6 Nc3
D24	Queen’s Gambit Accepted	d4 d5 c4 e6 Nf3 Nf6 Nc3 dxc4 e4
D24	Queen’s Gambit Accepted	d4 d5 c4 e6 Nf3 Nf6 Nc3 dxc4 Bg5
D24	Queen’s Gambit Accepted: Bogoljubow Defence	d4 d5 c4 dxc4 Nf3 Nf6 Nc3 a6 e4
D24	Queen’s Gambit Accepted: Gunsberg Defence, Prianishenmo Gambit	d4 d5 c4 dxc4 Nf3 Nf6 Nc3 c5 d5 e6 e4 exd5 e5
D25	Queen’s Gambit Accepted: Normal Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3
D25	Queen’s Gambit Accepted: Janowski-Larsen Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 Bg4
D25	Queen’s Gambit Accepted: Smyslov Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 g6
D25	Queen’s Gambit Accepted: Winawer Defence	d4 d5 c4 dxc4 Nf3 Nf6 e3 Be6
D26	Queen’s Gambit Accepted: Normal Variation, Traditional System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6
D26	Queen’s Gambit Accepted: Classical Defence	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5
D26	Queen’s Gambit Accepted: Classical Defence, Normal Line	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O
D26	Queen’s Gambit Accepted: Classical Defence, Steinitz Variation, Development Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O Nc6
D26	Queen’s Gambit Accepted: Classical Defence, Steinitz Variation, Exchange Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O cxd4
D26	Queen’s Gambit Accepted: Normal Variation, Traditional System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 Be7 O-O a6
D26	Queen’s Gambit Accepted: Normal Variation, Traditional System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 Be7 O-O O-O
D26	Queen’s Gambit Accepted: Normal Variation, Traditional System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 Be7 O-O O-O Nc3
D26	Queen’s Gambit Accepted: Classical, Furman Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 Qe2 a6 dxc5 Bxc5 O-O Nc6 e4 b5 e5
D27	Queen’s Gambit Accepted: Classical Defence, Main Line	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6
D27	Queen’s Gambit Accepted: Classical Defence, Main Line	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Nc3
D27	Queen’s Gambit Accepted: Classical Defence, Rubinstein Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 a4
D27	Queen’s Gambit Accepted: Classical Defence, Russian Gambit	d4 d5 c4 dxc4 e3 Nf6 Bxc4 e6 Nf3 c5 O-O a6 e4
D27	Queen’s Gambit Accepted: Furman Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 dxc5 Bxc5
D27	Queen’s Gambit Accepted: Classical Defence, Rubinstein Variation	d4 d5 c4 dxc4 Nf3 e6 e3 Nf6 Bxc4 Be7 O-O O-O Nc3 a6 a4 c5
D28	Queen’s Gambit Accepted: Classical Defence, Alekhine System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2
D28	Queen’s Gambit Accepted: Classical Defence, Alekhine System	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5
D28	Queen’s Gambit Accepted: Classical, Flohr Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Nc6 Rd1 c4 Bc2 Nb4 Nc3 Nxc2 Qxc2 Bb7 d5 Qc7
D29	Queen’s Gambit Accepted: Classical Defence, Alekhine System, Main Line	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7
D29	Queen’s Gambit Accepted: Classical Defence, Alekhine System, Main Line	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7 Nc3
D29	Queen’s Gambit Accepted: Classical Defence, Alekhine System, Smyslov Variation	d4 d5 c4 dxc4 Nf3 Nf6 e3 e6 Bxc4 c5 O-O a6 Qe2 b5 Bb3 Bb7 Rd1 Nbd7 Nc3 Bd6
D30	Queen’s Gambit Declined	d4 d5 c4 e6
D30	Queen’s Gambit Declined: Tarrasch Defence, Pseudo-Tarrasch	d4 d5 c4 e6 Nf3 c5
D30	Queen’s Gambit Declined: Traditional Variation	d4 Nf6 c4 e6 Nf3 d5 Bg5
D30	Queen’s Gambit Declined: Capablanca Variation	d4 Nf6 c4 e6 Nf3 d5 Bg5 h6
D30	Queen’s Gambit Declined: Vienna Variation	d4 Nf6 c4 e6 Nf3 d5 Bg5 Bb4+
D30	Queen’s Gambit Declined: Tarrasch Defence, Pseudo-Tarrasch Bishop Attack	d4 d5 c4 e6 Nf3 c5 cxd5 exd5 Bg5
D30	Semi-Slav Defence: Quiet Variation	d4 d5 c4 c6 Nf3 Nf6 e3 e6 Nbd2
D30	Queen’s Gambit Declined: Spielmann Variation	d4 d5 c4 e6 Nf3 Nf6 e3 c6 Nbd2 g6
D30	Semi-Slav Defence: Quiet Variation	d4 d5 c4 c6 Nf3 Nf6 e3 e6 Nbd2 Nbd7
D30	Queen’s Gambit Declined: Capablanca Variation	d4 Nf6 Nf3 e6 c4 d5 Bg5 c6 Nbd2 Nbd7 e3
D30	Queen’s Gambit Declined: Semmering Variation	d4 d5 c4 c6 Nf3 Nf6 e3 e6 Nbd2 Nbd7 Bd3 c5
D30	Queen’s Gambit Declined: Stonewall Variation	d4 d5 c4 c6 Nf3 Nf6 e3 e6 Nbd2 Ne4 Bd3 f5
D31	Queen’s Gambit Declined: Queen’s Knight Variation	d4 d5 c4 e6 Nc3
D31	Queen’s Gambit Declined: Alapin Variation	d4 e6 c4 b6 Nc3 d5
D31	Queen’s Gambit Declined: Charousek Variation	d4 d5 c4 e6 Nc3 Be7
D31	Queen’s Gambit Declined: Janowski Variation	d4 d5 c4 e6 Nc3 a6
D31	Semi-Slav Defence: Accelerated Move Order	d4 d5 c4 e6 Nc3 c6
D31	Semi-Slav Defence: Marshall Gambit	d4 d5 c4 e6 Nc3 c6 e4
D31	Semi-Slav Defence: Anti-Noteboom, Stonewall Variation	d4 d5 c4 e6 Nc3 c6 e3 f5
D31	Semi-Slav Defence: Noteboom Variation	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4
D31	Queen’s Gambit Declined: Charousek Variation, Miladinovic Gambit	d4 d5 c4 e6 Nc3 Be7 e4 dxe4 f3
D31	Semi-Slav Defence: Anti-Noteboom, Stonewall Variation, Portisch Gambit	d4 d5 c4 e6 Nc3 c6 e3 f5 g4
D31	Semi-Slav Defence: Gunderam Gambit	d4 d5 c4 e6 Nc3 c6 e4 dxe4 f3
D31	Semi-Slav Defence: Noteboom Variation, Anti-Noteboom Gambit	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 g3
D31	Semi-Slav Defence: Noteboom Variation, Anti-Noteboom Variation	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 Bg5
D31	Semi-Slav Defence: Noteboom Variation, Anti-Noteboom Variation, Belyavsky Line	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 Bg5 f6
D31	Semi-Slav Defence: Marshall Gambit, Forgotten Variation	d4 d5 c4 e6 Nc3 c6 e4 dxe4 Nxe4 Bb4+ Nc3
D31	Semi-Slav Defence: Marshall Gambit, Main Line	d4 d5 c4 e6 Nc3 c6 e4 dxe4 Nxe4 Bb4+ Bd2
D31	Queen’s Gambit Declined: Semi-Slav, Abrahams Variation	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 a4 Bb4 e3 b5 Bd2 a5
D31	Queen’s Gambit Declined: Semi-Slav, Junge Variation	d4 d5 c4 e6 Nf3 c6 Nc3 dxc4 a4 Bb4 e3 b5 Bd2 Qb6
D31	Queen’s Gambit Declined: Semi-Slav, Koomen Variation	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 e3 b5 a4 Bb4 Bd2 Qe7
D31	Semi-Slav Defence: Noteboom Variation, Abrahams Variation	d4 d5 c4 e6 Nc3 c6 Nf3 dxc4 a4 Bb4 e3 Bxc3+ bxc3 b5 axb5 cxb5
D31	Semi-Slav Defence: Marshall Gambit, Tolush Variation	d4 d5 c4 e6 Nc3 c6 e4 dxe4 Nxe4 Bb4+ Bd2 Qxd4 Bxb4 Qxe4+ Be2 c5 Bxc5 Qxg2
D32	Tarrasch Defence	d4 d5 c4 e6 Nc3 c5
D32	Queen’s Gambit Declined: Tarrasch Defence	d4 d5 c4 e6 Nc3 c5 cxd5 exd5
D32	Tarrasch Defence: Schara Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 cxd4
D32	Tarrasch Defence: Marshall Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 e4
D32	Tarrasch Defence: Two Knights Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3
D32	Tarrasch Defence: Symmetrical Variation	d4 d5 c4 e6 Nc3 c5 e3 Nf6 Nf3 Nc6
D32	Queen’s Gambit Declined: Tarrasch Defence	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 Bg5 Be7
D32	Tarrasch Defence: Symmetrical Variation	c4 c5 Nf3 Nc6 Nc3 Nf6 e3 e6 d4 d5 cxd5 exd5
D32	Tarrasch Defence: Tarrasch Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 dxc5 d4 Na4 b5
D32	Queen’s Gambit Declined: Tarrasch Defence	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 Bg5 Be7 Bxe7 Ngxe7
D32	Queen’s Gambit Declined: Tarrasch Defence	d4 Nf6 c4 e6 Nf3 d5 e3 c5 cxd5 exd5 Nc3 a6 Be2 Nc6
D32	Tarrasch Defence: Grünfeld Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 dxc5 d4 Na4 b5
D32	Tarrasch Defence: von Hennig Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 cxd4 Qxd4 Nc6 Qd1 exd5 Qxd5 Be6
D33	Tarrasch Defence: Rubinstein System	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3
D33	Tarrasch Defence: Prague Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6
D33	Tarrasch Defence: Swedish Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 c4
D33	Tarrasch Defence: Swedish Variation, Central Break	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 c4 e4
D33	Tarrasch Defence: Wagner Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Bg4
D33	Tarrasch Defence: Dubov Tarrasch	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 cxd4 Nxd4 Bc5
D34	Tarrasch Defence: Prague Variation, Main Line	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7
D34	Tarrasch Defence: Classical Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O
D34	Tarrasch Defence: Classical Variation, Carlsbad Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5
D34	Tarrasch Defence: Classical Variation, Advance Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 c4
D34	Tarrasch Defence: Classical Variation, Classical Tarrasch Gambit	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O dxc5 d4
D34	Tarrasch Defence: Classical Variation, Endgame Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 Be6
D34	Tarrasch Defence: Classical Variation, Réti Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O dxc5 Bxc5 Na4
D34	Queen’s Gambit Declined: Tarrasch Defence, Stoltz Variation	d4 d5 c4 e6 Nf3 c5 cxd5 exd5 g3 Nc6 Bg2 Nf6 O-O Be7 Nc3 O-O Bg5 Be6 Rc1 b6
D34	Tarrasch Defence: Classical Variation, Bogoljubow Variation	d4 Nf6 c4 e6 Nc3 c5 Nf3 d5 cxd5 exd5 g3 Nc6 Bg2 Be7 O-O O-O Bg5 Be6 Rc1 c4
D34	Tarrasch Defence: Classical Variation, Petursson Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 Re8
D34	Tarrasch Defence: Classical Variation, Main Line	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3 Re8
D34	Tarrasch Defence: Classical Variation, Spassky Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3 Bg4
D34	Tarrasch Defence: Classical Variation, Chandler Variation	d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6 g3 Nf6 Bg2 Be7 O-O O-O Bg5 cxd4 Nxd4 h6 Be3 Re8 Rc1 Be6
D35	Queen’s Gambit Declined: Normal Defence	d4 d5 c4 e6 Nc3 Nf6
D35	Queen’s Gambit Declined: Exchange Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5
D35	Queen’s Gambit Declined: Harrwitz Attack	d4 d5 c4 e6 Nc3 Nf6 Bf4
D35	Queen’s Gambit Declined: Exchange Variation, Positional Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5
D35	Queen’s Gambit Declined: Exchange Variation, Positional Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 c6
D35	Queen’s Gambit Declined: Exchange Variation, Sämisch Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Nbd7 cxd5 exd5 Bf4
D35	Queen’s Gambit Declined: Exchange Variation	d4 Nf6 c4 e6 Nf3 d5 e3 b6 Nc3 Bd6 cxd5 exd5
D35	Queen’s Gambit Declined: Exchange Variation	d4 d5 c4 e6 Nc3 Nf6 e3 Be7 cxd5 exd5 Bd3 O-O Nf3 c6
D35	Queen’s Gambit Declined: Exchange Variation, Carlsen Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 Be7 e3 h6 Bh4 Bg4
D35	Queen’s Gambit Declined: Exchange Variation, Chameleon Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 Be7 e3 O-O Bd3 Nbd7 Qc2 Re8 Nge2 Nf8 O-O-O
D36	Queen’s Gambit Declined: Exchange Variation, Reshevsky Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 c6 Qc2
D36	Queen’s Gambit Declined: Exchange Variation, Reshevsky Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 c6 Qc2 Be7 e3 Nbd7 Bd3
D36	Queen’s Gambit Declined: Exchange Variation, Reshevsky Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 c6 Qc2 Be7 e3 O-O Bd3
D36	Queen’s Gambit Declined: Exchange Variation, Reshevsky Variation	d4 Nf6 c4 e6 Nc3 d5 cxd5 exd5 Bg5 c6 Qc2 Be7 e3 O-O Bd3 h6 Bh4
D37	Queen’s Gambit Declined: Three Knights Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3
D37	Queen’s Gambit Declined: Barmen Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Nbd7
D37	Queen’s Gambit Declined: Three Knights, Vienna Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 dxc4
D37	Queen’s Gambit Declined: Harrwitz Attack	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bf4
D37	Queen’s Gambit Declined: Vienna Variation, Quiet Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 dxc4 e3
D37	Queen’s Gambit Declined: Three Knights Variation	d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 e3 O-O
D37	Queen’s Gambit Declined: Miles Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O Qc2
D37	Queen’s Gambit Declined: Harrwitz Attack, Fianchetto Defence	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bf4 O-O e3 b6
D37	Queen’s Gambit Declined: Harrwitz Attack, Orthodox Defence	d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4 O-O e3 c6
D37	Queen’s Gambit Declined: Harrwitz Attack, Two Knights Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bf4 O-O e3 Nbd7
D37	Queen’s Gambit Declined: Knight Defence, Alekhine Gambit	d4 Nf6 c4 e6 Nf3 d5 Nc3 Nbd7 Bg5 h6 Bh4 dxc4
D37	Queen’s Gambit Declined: Harrwitz Attack, Two Knights Defence, Blockade Line	d4 Nf6 c4 e6 Nc3 d5 Nf3 Be7 Bf4 O-O e3 Nbd7 c5
D37	Queen’s Gambit Declined: Harrwitz Attack, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5
D37	Queen’s Gambit Declined: Harrwitz Attack	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5 Qc2 Nc6 Rd1 Qa5 a3
D37	Queen’s Gambit Declined: Harrwitz Attack	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5 Qc2 Nc6 a3 Qa5 O-O-O
D38	Queen’s Gambit Declined: Ragozin Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 Bb4
D38	Queen’s Gambit Declined: Ragozin Defence, Alekhine Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Bb4 Qa4+
D38	Queen’s Gambit Declined: Westphalian Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Bb4 Bg5 Nbd7 e3 c5
D39	Queen’s Gambit Declined: Ragozin Defence, Vienna Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Bb4 Bg5 dxc4
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence, Pillsbury Variation	d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 Bg5
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence, with e3	d4 d5 c4 c5 Nf3 Nf6 Nc3 e6 e3 Nc6 Bd3
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence	d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 e3 Nc6 a3 cxd4 exd4 Bd6
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence, Symmetrical Variation	d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 e3 Nc6 Bd3 Bd6 O-O O-O
D40	Queen’s Gambit Declined: Semi-Tarrasch Defence, Levenfish Variation	d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 e3 Nc6 Bd3 Bd6 O-O O-O Qe2 Qe7 dxc5 Bxc5 e4
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence	c4 c5 Nf3 Nf6 Nc3 Nc6 g3 d5 d4 e6
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 g3
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, Exchange Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 e4
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, Pillsbury Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 e3
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 g3 Nc6 Bg2
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, Exchange Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 e4 Nxc3 bxc3
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, Endgame Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 cxd4 Qxd4 exd5 e4 dxe4 Qxd8+
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, San Sebastian Variation	d4 d5 c4 e6 Nc3 Nf6 cxd5 Nxd5 e4 Nxc3 bxc3 c5 Nf3 cxd4 cxd4 Bb4+ Bd2 Qa5
D41	Queen’s Gambit Declined: Semi-Tarrasch Defence, Kmoch Variation	d4 d5 c4 e6 Nc3 Nf6 Nf3 c5 cxd5 Nxd5 e4 Nxc3 bxc3 cxd4 cxd4 Bb4+ Bd2 Bxd2+ Qxd2 O-O Bb5
D42	Queen’s Gambit Declined: Semi-Tarrasch Defence, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 c5 cxd5 Nxd5 e3 Nc6 Bd3
D43	Semi-Slav Defence	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6
D43	Semi-Slav Defence: Anti-Moscow Gambit	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 h6 Bh4
D43	Semi-Slav Defence: Moscow Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 h6 Bxf6 Qxf6
D43	Semi-Slav Defence: Hastings Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 h6 Bxf6 Qxf6 Qb3
D44	Semi-Slav Defence Accepted	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4
D44	Semi-Slav Defence: Botvinnik Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4
D44	Semi-Slav Defence: Botvinnik Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 Nxg5
D44	Semi-Slav Defence: Botvinnik Variation, Alatortsev System	d4 Nf6 c4 e6 Nf3 d5 Nc3 c6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 Nxg5 Nd5
D44	Semi-Slav Defence: Botvinnik Variation, Ekstrom Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 exf6 gxh4 Ne5
D44	Semi-Slav Defence: Botvinnik Variation, Lilienthal Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Nbd7 g3
D44	Semi-Slav Defence: Botvinnik Variation, Szabo Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 c6 Bg5 dxc4 e4 b5 e5 h6 Bh4 g5 Nxg5 hxg5 Bxg5 Nbd7 Qf3
D45	Semi-Slav Defence: Main Line	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3
D45	Semi-Slav Defence: Accelerated Meran Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 a6
D45	Semi-Slav Defence: Normal Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7
D45	Semi-Slav Defence: Rubinstein System	d4 d5 c4 e6 Nc3 c6 Nf3 Nf6 e3 Nbd7 Ne5
D45	Semi-Slav Defence: Stoltz Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2
D45	Semi-Slav Defence: Stonewall Defence	d4 d5 Nf3 Nf6 c4 c6 Nc3 e6 e3 Ne4 Bd3 f5
D45	Semi-Slav Defence: Stoltz Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 b6 b3
D45	Semi-Slav Defence: Stoltz Variation	d4 d5 Nf3 Nf6 c4 c6 e3 e6 Nc3 Nbd7 Qc2 Bd6 b3
D45	Semi-Slav Defence: Stoltz Variation, Center Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Qc2 Bd6 e4
D45	Semi-Slav Defence: Stoltz Variation, Shabalov Attack	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Qc2 Bd6 g4
D45	Semi-Slav Defence: Normal Variation	Nf3 d5 e3 Nf6 c4 c6 Nc3 e6 b3 Bd6 Bb2 O-O d4 Nbd7
D45	Semi-Slav Defence: Stoltz Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 b6 b3 Bb7
D45	Semi-Slav Defence: Normal Variation	d4 d5 c4 e6 Nc3 c6 Nf3 Nf6 e3 Nbd7 b3 Bd6 Bb2 O-O Be2
D45	Semi-Slav Defence: Stoltz Variation	d4 d5 Nf3 Nf6 c4 c6 e3 e6 Nc3 Nbd7 Qc2 Bd6 b3 O-O Bb2
D45	Semi-Slav Defence: Stoltz Variation, Center Variation, Mikhalchishin Line	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Qc2 Bd6 e4 dxe4 Nxe4 Nxe4 Qxe4 e5 dxe5
D46	Semi-Slav Defence: Main Line	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3
D46	Semi-Slav Defence: Bogoljubow Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 Be7
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 Bd6
D46	Semi-Slav Defence: Romih Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 Bb4
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 Bd6 Qc2
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 b3 Bd6 Bb2 O-O Bd3
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 b6 b3 Bb7 Bd3
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 Bd6 b3 O-O Bb2 Re8 Bd3
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 Bd6 b3 O-O Bb2 Qe7 Bd3
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nf3 e6 e3 Nf6 Nc3 Bd6 Bd3 dxc4 Bxc4 b5 Bd3 Nbd7 O-O O-O Qc2
D46	Semi-Slav Defence: Main Line	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Qc2 b6 b3 Bb7 Bd3 Be7 O-O O-O Bb2
D46	Semi-Slav Defence: Chigorin Defence	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bd6 O-O Bb7 a3 O-O Qc2
D47	Semi-Slav Defence: Semi-Meran Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4
D47	Semi-Slav Defence: Meran Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5
D47	Semi-Slav Defence: Meran Variation, Lundin Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 b4
D47	Semi-Slav Defence: Meran Variation, Wade Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7
D47	Semi-Slav Defence: Meran Variation, Wade Variation, Larsen Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7 e4 b4 Na4 c5 e5 Nd5
D47	Semi-Slav Defence: Meran Variation, Wade Variation, Kaidanov Gambit	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 Bb7 e4 b4 Na4 c5 e5 Nd5 O-O cxd4 Nxd4
D48	Semi-Slav Defence: Meran Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6
D48	Semi-Slav Defence: Meran Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5
D48	Semi-Slav Defence: Meran Variation, Pirc Variation	d4 d5 c4 e6 Nc3 c6 e3 Nf6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 b4
D48	Semi-Slav Defence: Meran Variation, Old Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5
D48	Semi-Slav Defence: Meran Variation, Reynolds’ Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 d5
D49	Semi-Slav Defence: Meran Variation, Blumenfeld Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5
D49	Semi-Slav Defence: Meran Variation, Rabinovich Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5 Ng4
D49	Semi-Slav Defence: Meran Variation, Sozin Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5 Nxe5
D49	Semi-Slav Defence: Meran Variation, Sozin Variation	d4 d5 Nf3 Nf6 c4 c6 Nc3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5 Nxe5 Nxe5 axb5 O-O
D49	Semi-Slav Defence: Meran Variation, Stahlberg Variation	d4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5 Nxe5 Nxe5 axb5 Qf3
D49	Semi-Slav Defence: Meran Variation, Rellstab Attack	d4 d5 c4 c6 Nc3 Nf6 Nf3 e6 e3 Nbd7 Bd3 dxc4 Bxc4 b5 Bd3 a6 e4 c5 e5 cxd4 Nxb5 Nxe5 Nxe5 axb5 O-O Qd5 Qe2 Ba6 Bg5
D50	Queen’s Gambit Declined: Modern Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5
D50	Queen’s Gambit Declined: Been-Koomen Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5
D50	Queen’s Gambit Declined: Pseudo-Tarrasch Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5 cxd5
D50	Queen’s Gambit Declined: Pseudo-Tarrasch Variation, Canal Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5 cxd5 Qb6
D50	Queen’s Gambit Declined: Pseudo-Tarrasch Variation, Primitive Pillsbury Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5 Nf3 cxd4 Qxd4
D50	Queen’s Gambit Declined: Semi-Tarrasch Defence, Krause Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c5 Nf3 cxd4 Nxd4 e5 Ndb5 a6 Qa4
D51	Queen’s Gambit Declined: Modern Variation, Knight Defence	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7
D51	Queen’s Gambit Declined: Modern Variation, Knight Defence	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3
D51	Queen’s Gambit Declined: Manhattan Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 Bb4
D51	Queen’s Gambit Declined: Modern Variation, Knight Defence	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6
D51	Queen’s Gambit Declined: Alekhine Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 Nf3 c6 e4
D51	Queen’s Gambit Declined: Capablanca Variation, Anti-Cambridge Springs Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6 a3
D51	Queen’s Gambit Declined: Rochlin Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 Nf3 c6 Rc1 Qa5 Bd2
D52	Queen’s Gambit Declined	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3
D52	Queen’s Gambit Declined: Cambridge Springs Defence	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3 Qa5
D52	Queen’s Gambit Declined: Cambridge Springs Defence	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3 Qa5 cxd5
D52	Queen’s Gambit Declined: Cambridge Springs Defence, Capablanca Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6 Nf3 Qa5 Bxf6
D52	Queen’s Gambit Declined: Cambridge Springs Defence, Rubinstein Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3 Qa5 Nd2 dxc4
D52	Queen’s Gambit Declined: Cambridge Springs Defence, Yugoslav Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3 Qa5 cxd5 Nxd5
D52	Queen’s Gambit Declined: Cambridge Springs Defence, Bogoljubow Variation	d4 d5 c4 c6 Nf3 Nf6 Nc3 e6 Bg5 Nbd7 e3 Qa5 Nd2 Bb4 Qc2
D52	Queen’s Gambit Declined: Cambridge Springs Defence, Argentine Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 c6 Nf3 Qa5 Nd2 Bb4 Qc2 O-O Bh4
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 Nf3
D53	Queen’s Gambit Declined: Modern Variation, Heral Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 Bxf6
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nf3 Nf6 Nc3 dxc4 Bg5 Be7
D53	Queen’s Gambit Declined: Lasker Defence	d4 Nf6 c4 e6 Nc3 d5 Bg5 Be7 e3 Ne4
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nf3 Nf6 Nc3 dxc4 Bg5 Be7 e4
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nf3 Nf6 Nc3 Nc6 Bg5 Be7 e3 O-O
D53	Queen’s Gambit Declined	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 Nf3 c6 e3 dxc4 Bxc4
D53	Queen’s Gambit Declined: Uhlmann Variation	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O Rc1 dxc4
D54	Queen’s Gambit Declined: Neo-Orthodox Variation	d4 Nf6 c4 e6 Nc3 d5 Bg5 Be7 e3 O-O Rc1
D55	Queen’s Gambit Declined: Modern Variation, Normal Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3
D55	Queen’s Gambit Declined: Neo-Orthodox Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 h6
D55	Queen’s Gambit Declined: Anti-Tartakower Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 h6 Bxf6
D55	Queen’s Gambit Declined: Neo-Orthodox Variation, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 h6 Bh4 O-O e3
D55	Queen’s Gambit Declined: Pillsbury Attack	d4 Nf6 c4 e6 Nf3 b6 Nc3 d5 cxd5 exd5 Bg5 Be7 e3 O-O Bd3 Bb7 Ne5
D55	Queen’s Gambit Declined: Anti-Tartakower Variation, Petrosian Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 h6 Bxf6 Bxf6 e3 O-O Rc1 c6 Bd3 Nd7 O-O dxc4 Bxc4
D56	Queen’s Gambit Declined: Lasker Defence	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O e3 Ne4
D56	Queen’s Gambit Declined	d4 d5 c4 e6 Nf3 Nf6 Nc3 Nc6 Bg5 Be7 e3 O-O Rc1 h6 Bh4
D56	Queen’s Gambit Declined: Lasker Defence	d4 d5 c4 e6 Nf3 Nf6 Nc3 Nc6 Bg5 Be7 e3 O-O Rc1 h6 Bh4 Ne4
D56	Queen’s Gambit Declined: Lasker Defence, Teichmann Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 h6 Bh4 O-O e3 Ne4 Bxe7 Qxe7 Qc2
D56	Queen’s Gambit Declined: Lasker Defence, Russian Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 Ne4 Bxe7 Qxe7 Qc2 Nf6 Bd3 dxc4 Bxc4 c5 O-O Nc6 Rfd1 Bd7
D57	Queen’s Gambit Declined: Lasker Defence, Main Line	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O e3 Ne4 Bxe7 Qxe7 cxd5 Nxc3 bxc3
D57	Queen’s Gambit Declined: Lasker Defence, Bernstein Variation	d4 Nf6 c4 e6 Nc3 d5 Bg5 Be7 e3 h6 Bh4 O-O Nf3 Ne4 Bxe7 Qxe7 cxd5 Nxc3 bxc3 exd5 Qb3 Qd6
D57	Queen’s Gambit Declined: Lasker Defence, Bernstein Variation, Mar del Plata Gambit	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 h6 Bh4 Ne4 Bxe7 Qxe7 cxd5 Nxc3 bxc3 exd5 Qb3 Rd8 c4 Be6
D58	Queen’s Gambit Declined: Tartakower Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 h6 Bh4 O-O e3 b6
D58	Queen’s Gambit Declined: Tartakower Defence, Exchange Variation	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O e3 b6 cxd5 exd5
D59	Queen’s Gambit Declined: Tartakower Defence, Makogonov Exchange Variation	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O e3 b6 cxd5 Nxd5
D59	Queen’s Gambit Declined: Tartakower Defence	d4 d5 c4 e6 Nc3 Be7 Nf3 Nf6 Bg5 h6 Bh4 O-O e3 b6 cxd5 Nxd5 Bxe7 Qxe7 Nxd5 exd5 Rc1 Be6
D60	Queen’s Gambit Declined: Orthodox Defence	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7
D60	Queen’s Gambit Declined: Orthodox Defence, Botvinnik Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Bd3
D60	Queen’s Gambit Declined: Orthodox Defence, Rauzer Variation	d4 d5 Nf3 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Qb3
D60	Queen’s Gambit Declined: Orthodox Defence, Botvinnik Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Bd3 c6
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2 c5
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2 c6
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2 c6 a3
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2 c6 Rd1 a6
D61	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Qc2 a6 cxd5 exd5 Bd3 Re8
D62	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Variation, Flohr Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Qc2 c5 cxd5
D63	Queen’s Gambit Declined: Orthodox Defence, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1
D63	Queen’s Gambit Declined: Orthodox Defence, Henneberger Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 a6
D63	Queen’s Gambit Declined: Orthodox Defence, Main Line	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6
D63	Queen’s Gambit Declined: Orthodox Defence, Henneberger Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 a6 c5
D63	Queen’s Gambit Declined: Orthodox Defence, Swiss, Carlsbad Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 a6 cxd5
D63	Queen’s Gambit Declined: Orthodox Defence, Henneberger Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 a6 c5 c6
D63	Queen’s Gambit Declined: Orthodox Defence, Main Line	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 Nbd7 Nf3 O-O Rc1 h6 Bh4 c5
D63	Queen’s Gambit Declined: Orthodox Defence, Capablanca Variation	Nf3 d5 d4 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 b6 cxd5 exd5 Bb5
D63	Queen’s Gambit Declined: Orthodox Defence, Henneberger Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 a6 c5 c6 Bd3
D63	Queen’s Gambit Declined: Orthodox Defence, Pillsbury Variation	d4 Nf6 c4 e6 Nc3 d5 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 b6 cxd5 exd5 Bd3
D64	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Qc2
D64	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Qc2 a6
D64	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	Nf3 d5 d4 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Qc2 Ne4
D64	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	d4 Nf6 c4 e6 Nc3 d5 Nf3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 a3 a6 Qc2
D65	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	d4 d5 Nf3 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Qc2 a6 cxd5
D65	Queen’s Gambit Declined: Orthodox Defence, Rubinstein Attack	d4 d5 Nf3 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Qc2 a6 cxd5 exd5 Bd3
D66	Queen’s Gambit Declined: Orthodox Defence, Bd3 Line	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3
D66	Queen’s Gambit Declined: Orthodox Defence, Bd3 Line	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 h6 Bh4
D66	Queen’s Gambit Declined: Orthodox Defence, Fianchetto Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 c6 Nf3 Be7 e3 Nbd7 Rc1 O-O Bd3 dxc4 Bxc4 b5
D67	Queen’s Gambit Declined: Orthodox Defence, Capablanca System	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5
D67	Queen’s Gambit Declined: Orthodox Defence, Janowski Variation	d4 d5 Nf3 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 h4
D67	Queen’s Gambit Declined: Orthodox Defence, Bd3 Line	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7
D67	Queen’s Gambit Declined: Orthodox Defence, Alekhine Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 Ne4
D67	Queen’s Gambit Declined: Orthodox Defence, Main Line	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O
D68	Queen’s Gambit Declined: Orthodox Defence, Classical Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O Nxc3 Rxc3 e5
D68	Queen’s Gambit Declined: Orthodox Defence, Classical Variation	d4 d5 c4 e6 Nf3 Nf6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O Nxc3 Rxc3 e5 Qb1
D68	Queen’s Gambit Declined: Orthodox Defence, Classical Variation	d4 Nf6 c4 e6 Nf3 d5 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O Nxc3 Rxc3 e5 Qc2
D69	Queen’s Gambit Declined: Orthodox Defence, Classical Variation	d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7 Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O Nxc3 Rxc3 e5 dxe5 Nxe5 Nxe5 Qxe5
D70	Neo-Grünfeld Defence: Goglidze Attack	d4 Nf6 c4 g6 f3 d5
D70	Neo-Grünfeld Defence: with g3	d4 Nf6 c4 g6 g3 d5
D70	Neo-Grünfeld Defence: with Nf3	d4 Nf6 c4 g6 Nf3 d5
D71	Neo-Grünfeld Defence: Exchange Variation	d4 Nf6 c4 g6 g3 Bg7 Bg2 d5 cxd5 Nxd5
D71	Neo-Grünfeld Defence: Exchange Variation	c4 Nf6 g3 g6 Bg2 Bg7 d4 d5 cxd5 Nxd5 Nf3
D72	Neo-Grünfeld Defence: with g3	d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 cxd5 Nxd5 e4 Nb6 Ne2
D73	Neo-Grünfeld Defence: with g3	d4 Nf6 c4 g6 g3 d5 Bg2 Bg7 Nf3
D74	Neo-Grünfeld Defence: Delayed Exchange Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d5 cxd5 Nxd5 O-O
D75	Neo-Grünfeld Defence: Delayed Exchange Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O g3 d5 cxd5 Nxd5 Bg2 c5 O-O
D75	Neo-Grünfeld Defence: Delayed Exchange Variation	d4 Nf6 Nf3 g6 c4 Bg7 g3 O-O Bg2 d5 cxd5 Nxd5 O-O c5 dxc5
D76	Neo-Grünfeld Defence: Delayed Exchange Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d5 cxd5 Nxd5 O-O Nb6
D77	Neo-Grünfeld Defence: Classical Variation	d4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O d5 c4
D77	Neo-Grünfeld Defence: Classical Variation, Modern Defence	d4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O d5 c4 dxc4
D77	Neo-Grünfeld Defence: Classical Variation, Polgar Variation	d4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O O-O d5 c4 Nc6
D78	Neo-Grünfeld Defence: Classical Variation, Original Defence	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 c6 O-O d5
D79	Neo-Grünfeld Defence: Ultra-Delayed Exchange Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 c6 O-O d5 cxd5 cxd5
D80	Grünfeld Defence	d4 Nf6 c4 g6 Nc3 d5
D80	Grünfeld Defence: Gibbon Gambit	d4 Nf6 c4 g6 Nc3 d5 g4
D80	Grünfeld Defence: Lutikov Variation	d4 Nf6 c4 g6 Nc3 d5 f3
D80	Grünfeld Defence: Stockholm Variation	d4 Nf6 c4 g6 Nc3 d5 Bg5
D80	Grünfeld Defence: Zaitsev Gambit	d4 Nf6 c4 g6 Nc3 d5 h4
D80	Grünfeld Defence: Lutikov Variation, Murrey Attack	d4 Nf6 c4 g6 Nc3 d5 f3 c5 cxd5 Nxd5 Na4
D80	Grünfeld Defence: Lundin Variation	d4 Nf6 c4 g6 Nc3 d5 Bg5 Ne4 Nxe4 dxe4 Qd2 c5
D81	Grünfeld Defence: Russian Variation, Accelerated Variation	d4 Nf6 c4 g6 Nc3 d5 Qb3
D82	Grünfeld Defence: Brinckmann Attack	d4 Nf6 c4 g6 Nc3 d5 Bf4
D83	Grünfeld Defence: Brinckmann Attack, Grünfeld Gambit	d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 O-O
D83	Grünfeld Defence: Brinckmann Attack, Grünfeld Gambit, Capablanca Variation	d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 O-O Rc1
D83	Grünfeld Defence: Brinckmann Attack, Grünfeld Gambit, Botvinnik Variation	d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 O-O Rc1 c5 dxc5 Be6
D83	Grünfeld Defence: Brinckmann Attack, Reshevsky Gambit	d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 Rc1 O-O e3 c5 dxc5 Qa5
D84	Grünfeld Defence: Brinckmann Attack, Grünfeld Gambit Accepted	d4 Nf6 c4 g6 Nc3 d5 Bf4 Bg7 e3 O-O cxd5 Nxd5 Nxd5 Qxd5 Bxc7
D85	Grünfeld Defence: Exchange Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5
D85	Grünfeld Defence: Exchange Variation, Nadanian Attack	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 Na4
D85	Grünfeld Defence: Exchange Variation, Modern Exchange Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3
D85	Grünfeld Defence: Exchange Variation, Modern Exchange Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5
D85	Grünfeld Defence: Exchange Variation, Modern Exchange Variation	d4 Nf6 Nf3 g6 c4 Bg7 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 c5 Rb1
D85	Grünfeld Defence: Exchange Variation, Modern Exchange Variation, Kramnik’s Line	d4 Nf6 Nf3 g6 c4 Bg7 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 c5 h3
D85	Grünfeld Defence: Exchange Variation, Modern Exchange Variation, Pawn Grab Line	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Nf3 c5 Rb1 O-O Be2 Nc6 d5 Bxc3+
D86	Grünfeld Defence: Exchange Variation, Classical Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4
D86	Grünfeld Defence: Exchange Variation, Larsen Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 O-O Ne2 Qd7
D86	Grünfeld Defence: Exchange Variation, Simagin’s Improved Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 O-O Ne2 Nc6
D86	Grünfeld Defence: Exchange Variation, Simagin’s Lesser Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 O-O Ne2 b6
D86	Grünfeld Defence: Exchange Variation, Larsen Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 O-O Ne2 Qd7 O-O b6
D87	Grünfeld Defence: Exchange Variation, Spassky Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 O-O
D87	Grünfeld Defence: Exchange Variation, Seville Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O Bg4 f3 Na5 Bxf7+
D88	Grünfeld Defence: Exchange Variation, Spassky Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O cxd4 cxd4
D89	Grünfeld Defence: Exchange Variation, Spassky Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 Nc6 Be3 O-O O-O Bg4 f3 Na5 Bd3 cxd4 cxd4 Be6
D89	Grünfeld Defence: Exchange Variation, Sokolsky Variation	d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5 e4 Nxc3 bxc3 Bg7 Bc4 c5 Ne2 O-O O-O Nc6 Be3 Bg4 f3 Na5 Bd3 cxd4 cxd4 Be6 d5
D90	Grünfeld Defence: Three Knights Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3
D90	Grünfeld Defence: Three Knights Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7
D90	Grünfeld Defence: Flohr Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qa4+
D91	Grünfeld Defence: Three Knights Variation, Petrosian System	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bg5
D92	Grünfeld Defence: Three Knights Variation, Hungarian Attack	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bf4
D93	Grünfeld Defence: Three Knights Variation, Hungarian Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Bf4 O-O e3
D94	Grünfeld Defence: Three Knights Variation, Burille Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3
D94	Grünfeld Defence: Makogonov Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O b4
D94	Grünfeld Defence: Opocensky Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O Bd2
D94	Grünfeld Defence: Three Knights Variation, Paris Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O Bd3
D94	Grünfeld Defence: Flohr Defence	d4 d5 c4 c6 Nc3 Nf6 e3 g6 Nf3 Bg7 Bd3 O-O O-O Bf5
D94	Grünfeld Defence: Smyslov Defence	d4 d5 c4 c6 Nc3 Nf6 e3 g6 Nf3 Bg7 Bd3 O-O O-O Bg4
D95	Grünfeld Defence: Three Knights Variation, Vienna Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O Qb3
D95	Grünfeld Defence: Botvinnik Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 e3 O-O Qb3 e6
D95	Grünfeld Defence: Pachman Variation	d4 Nf6 c4 g6 Nc3 d5 e3 Bg7 Qb3 dxc4 Bxc4 O-O Nf3 Nbd7 Ng5
D96	Grünfeld Defence: Russian Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3
D97	Grünfeld Defence: Russian Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4
D97	Grünfeld Defence: Russian Variation, Byrne Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Nc6
D97	Grünfeld Defence: Russian Variation, Hungarian Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 a6
D97	Grünfeld Defence: Russian Variation, Levenfish Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 b6
D97	Grünfeld Defence: Russian Variation, Prins Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Na6
D97	Grünfeld Defence: Russian Variation, Szabo Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 c6
D98	Grünfeld Defence: Russian Variation, Smyslov Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4
D98	Grünfeld Defence: Russian Variation, Keres Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7 Be2 Nb6 Qd3 Nc6 O-O-O
D99	Grünfeld Defence: Russian Variation, Smyslov Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7 Qb3
D99	Grünfeld Defence: Russian Variation, Yugoslav Variation	d4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3 dxc4 Qxc4 O-O e4 Bg4 Be3 Nfd7 Qb3 c5
E00	Catalan Opening	d4 Nf6 c4 e6 g3
E00	Indian Defence	d4 Nf6 c4 e6 Qb3
E00	Indian Defence: Devin Gambit	d4 Nf6 c4 e6 g4
E00	Indian Defence: Seirawan Attack	d4 Nf6 c4 e6 Bg5
E00	Catalan Opening	d4 Nf6 c4 e6 g3 d5
E00	Catalan Opening: Hungarian Gambit	d4 Nf6 c4 e6 g3 e5
E01	Catalan Opening: Open Defence	d4 Nf6 c4 e6 g3 d5 Bg2
E01	Catalan Opening: Tarrasch Defence	d4 Nf6 c4 e6 g3 d5 Bg2 c5 Nf3 Nc6
E02	Catalan Opening: Open Defence	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4
E03	Catalan Opening: Open Defence	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4+ Nbd7 Qxc4
E03	Catalan Opening: Open Defence, Alekhine Variation	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Qa4+ Nbd7 Qxc4 a6 Qc2
E04	Catalan Opening: Open Defence	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3
E04	Catalan Opening: Open Defence	d4 Nf6 c4 e6 Nf3 d5 g3 c6 Bg2 dxc4
E04	Catalan Opening: Open Defence, Modern Sharp Variation	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 Nc6 Qa4 Bb4+
E05	Catalan Opening: Open Defence, Classical Line	d4 Nf6 c4 e6 g3 d5 Bg2 dxc4 Nf3 Be7
E05	Catalan Opening: Open Defence, Classical Line	d4 Nf6 c4 e6 Nf3 d5 g3 Be7 Bg2 O-O O-O dxc4
E06	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3
E06	Catalan Opening: Closed	c4 e6 Nf3 d5 g3 Nf6 Bg2 Be7 d4 O-O O-O c6
E06	Catalan Opening: Closed	d4 Nf6 c4 e6 Nf3 d5 g3 Bb4+ Bd2 Be7 Bg2 O-O O-O c6 Bf4 b6
E06	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O c6 Qc2 b6 Nbd2 Bb7 e4 Na6
E07	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7
E07	Catalan Opening: Closed, Botvinnik Variation	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Nc3 c6 Qd3
E08	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2
E08	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 b3
E08	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 b3 b6
E08	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O c6 Qc2 b6 Rd1 Nbd7 Bf4
E08	Catalan Opening: Closed, Zagoryansky Variation	d4 e6 c4 Nf6 Nf3 d5 g3 Be7 Bg2 O-O O-O Nbd7 Qc2 c6 Rd1 b6 a4
E08	Catalan Opening: Closed	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 Bf4 b6 Nbd2 Bb7 e4
E08	Catalan Opening: Closed, Spassky Gambit	d4 Nf6 c4 e6 g3 Be7 Bg2 d5 Nf3 O-O O-O Nbd7 Qc2 c6 b3 b6 Rd1 Bb7 Nc3 b5
E09	Catalan Opening: Closed, Main Line	d4 Nf6 c4 e6 Nf3 d5 g3 Be7 Bg2 O-O O-O Nbd7 Qc2 c6 Nbd2
E09	Catalan Opening: Closed Variation, Rabinovich Variation	d4 d5 c4 c6 Nf3 Nf6 Qc2 e6 Nbd2 Be7 g3 Nbd7 Bg2 O-O O-O b5
E09	Catalan Opening: Closed Variation, Traditional Variation	d4 Nf6 c4 e6 Nf3 d5 g3 Be7 Bg2 O-O O-O Nbd7 Qc2 c6 Nbd2 b6
E09	Catalan Opening: Closed, Main Line	d4 Nf6 c4 e6 Nf3 d5 g3 Be7 Bg2 O-O O-O c6 Qc2 b6 Nbd2 Bb7 e4 Nbd7
E09	Catalan Opening: Closed, Sokolsky Variation	d4 Nf6 c4 e6 g3 d5 Bg2 Be7 Nf3 O-O O-O Nbd7 Qc2 c6 Nbd2 b6 b3 a5 Bb2 Ba6
E09	Catalan Opening: Closed, Main Line	d4 Nf6 c4 e6 Nf3 d5 g3 Be7 Bg2 O-O O-O Nbd7 Qc2 c6 Bf4 b6 Nbd2 Bb7 e4 dxe4 Nxe4 Nxe4 Qxe4
E10	Indian Defence: Anti-Nimzo-Indian	d4 Nf6 c4 e6 Nf3
E10	Indian Defence: Döry Indian	d4 Nf6 c4 e6 Nf3 Ne4
E10	Indian Defence: Dzindzi-Indian Defence	d4 Nf6 c4 e6 Nf3 a6
E10	Blumenfeld Countergambit	d4 Nf6 c4 e6 Nf3 c5 d5 b5
E10	Blumenfeld Countergambit: Duz-Khotimirsky Variation	d4 Nf6 c4 e6 Nf3 c5 d5 b5 Bg5
E10	Blumenfeld Countergambit Accepted	d4 Nf6 c4 e6 Nf3 c5 d5 b5 dxe6 fxe6 cxb5 d5
E10	Blumenfeld Countergambit: Spielmann Variation	d4 Nf6 c4 e6 Nf3 c5 d5 b5 Bg5 exd5 cxd5 h6
E11	Bogo-Indian Defence	d4 Nf6 c4 e6 Nf3 Bb4+
E11	Bogo-Indian Defence: Grünfeld Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2
E11	Bogo-Indian Defence: New England Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Nfd2
E11	Bogo-Indian Defence: Exchange Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Bxd2+
E11	Bogo-Indian Defence: Haiti Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Nc6
E11	Bogo-Indian Defence: Nimzowitsch Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Qe7
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 Be7
E11	Bogo-Indian Defence: Vitolins Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 c5
E11	Bogo-Indian Defence: Wade-Smyslov Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 a5
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 O-O
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 O-O O-O
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 O-O Qc2 c6 O-O
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 Nbd7 O-O O-O Qc2 c6
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 Nbd7 O-O O-O Qc2 c6 b3
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 Nbd7 O-O O-O Qc2 c6 Rc1
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 Nbd7 O-O O-O Qc2 c6 Rd1
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 g3 Bb4+ Bd2 Be7 Bg2 d5 Nf3 Nbd7 O-O O-O Qc2 c6 Rd1 h6
E11	Bogo-Indian Defence: Monticelli Trap	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Bb4+ Bd2 Bxd2+ Qxd2 O-O Nc3 Ne4 Qc2 Nxc3 Ng5
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 Nf3 d5 g3 Bb4+ Bd2 Be7 Bg2 O-O O-O c6 Qc2 Nbd7 Bf4 b6 Nbd2
E11	Bogo-Indian Defence: Retreat Variation	d4 Nf6 c4 e6 Nf3 d5 g3 Bb4+ Bd2 Be7 Bg2 O-O O-O c6 Qc2 Nbd7 Bf4 b6 Nbd2 Ba6
E12	Queen’s Indian Defence	d4 Nf6 c4 e6 Nf3 b6
E12	Queen’s Indian Defence: Kasparov Variation	d4 Nf6 c4 e6 Nf3 b6 Nc3
E12	Queen’s Indian Defence: Miles Variation	d4 Nf6 c4 e6 Nf3 b6 Bf4
E12	Queen’s Indian Defence: Petrosian Variation	d4 Nf6 c4 e6 Nf3 b6 a3
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Andersson Variation	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 Ne4
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Hedgehog Variation	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 g6
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Main Line	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Marco Defence	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 Be7
E12	Queen’s Indian Defence: Petrosian Variation, Farago Defence	d4 Nf6 c4 e6 Nf3 b6 a3 Ba6 Qc2 Bb7
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Classical Variation	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 exd5
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Modern Variation	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Kasparov Attack	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Qc2
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Petrosian Attack	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 e3
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Polovodin Gambit	d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb7 a3 d5 cxd5 Nxd5 e4
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Rashkovsky Attack	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Qa4+
E12	Queen’s Indian Defence: Kasparov-Petrosian Variation, Romanishin Attack	d4 Nf6 c4 e6 Nf3 b6 a3 Bb7 Nc3 d5 cxd5 Nxd5 Bd2
E12	Queen’s Indian Defence: Kasparov Variation, Botvinnik Attack	d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb7 Bg5 h6 Bh4 g5 Bg3 Nh5
E13	Queen’s Indian Defence: Kasparov Variation	d4 Nf6 c4 e6 Nf3 b6 Nc3 Bb4 Bg5 h6 Bh4 Bb7
E14	Queen’s Indian Defence: Spassky System	d4 Nf6 c4 e6 Nf3 b6 e3
E14	Queen’s Indian Defence: Spassky System	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7
E14	Queen’s Indian Defence: Spassky System	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 b6 Nc3 Bb7
E14	Queen’s Indian Defence, with e3, Bb4+ Line	d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 b6 e3 Bb7
E14	Queen’s Indian Defence: Spassky System	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 d5
E14	Queen’s Indian Defence: Spassky System3	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 c5
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O c5 c4
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 b6 Nc3 Bd6 Bd3
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O c5 c4 Be7
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O c5 c4 g6
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 Be7 Nc3 O-O b3 b6
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 Be7 b3 O-O Bd3 b6
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 O-O Be7 c4 O-O Nc3
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 Bb4+ Nbd2 b6 a3 Bxd2+ Qxd2 Bb7 e3
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 b6 Nc3 Bd6 Bd3 O-O O-O Bb7
E14	Queen’s Indian Defence, with e3	d4 Nf6 c4 e6 Nf3 d5 e3 Be7 b3 O-O Bb2 b6 Nbd2 Bb7 Bd3
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 e6 e3 b6 Bd3 Bb7 Nbd2 c5 b3 Be7 Bb2 d6 O-O O-O c4
E14	Queen’s Indian Defence, with e3	Nf3 d5 e3 Nf6 c4 e6 Nc3 Be7 d4 O-O b3 b6 cxd5 exd5 Bb2 Bb7 Bd3
E14	Queen’s Indian Defence, with e3	d4 Nf6 Nf3 d5 c4 e6 e3 b6 b3 Bb7 Bd3 Nbd7 O-O Bd6 Bb2 O-O Nbd2
E14	Queen’s Indian Defence: Averbakh Variation	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 c5 O-O Be7 b3 O-O Bb2 cxd4 Nxd4
E14	Queen’s Indian Defence: Spassky System3	d4 Nf6 c4 e6 Nf3 b6 e3 Bb7 Bd3 c5 Nc3 cxd4 exd4 Be7 O-O d5 cxd5 Nxd5
E15	Queen’s Indian Defence: Fianchetto Variation	d4 Nf6 c4 e6 Nf3 b6 g3
E15	Queen’s Indian Defence: Fianchetto Variation, Nimzowitsch Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6
E15	Queen’s Indian Defence: Fianchetto Variation, Traditional Line	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7
E15	Queen’s Indian Defence: Fianchetto Variation, Nimzowitsch Variation, Nimzowitsch Attack	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 Qa4
E15	Queen’s Indian Defence: Fianchetto Variation, Nimzowitsch Variation, Quiet Line	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3
E15	Queen’s Indian Defence: Fianchetto Variation, Nimzowitsch Variation, Timman’s Line	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 Qb3
E15	Queen’s Indian Defence: Fianchetto Variation, Check Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+
E15	Queen’s Indian Defence: Fianchetto Variation, Sämisch Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 c5
E15	Queen’s Indian Defence: Fianchetto Variation, Check Variation, Intermezzo Line	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+ Bd2 Be7
E15	Queen’s Indian Defence: Fianchetto Variation, Check Variation, Modern Line	d4 Nf6 c4 e6 Nf3 b6 g3 Ba6 b3 Bb4+ Bd2 Qe7
E15	Queen’s Indian Defence: Buerger Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 c5 d5 exd5 Ng5
E15	Queen’s Indian Defence: Fianchetto Variation, Rubinstein Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 c5 d5 exd5 Nh4
E16	Queen’s Indian Defence: Capablanca Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Bb4+
E16	Queen’s Indian Defence: Riumin Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Bb4+ Bd2 Be7
E16	Queen’s Indian Defence: Yates Variation	d4 Nf6 c4 e6 Nf3 Bb4+ Bd2 a5 g3 b6 Bg2 Bb7
E17	Queen’s Indian Defence: Traditional Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7
E17	Queen’s Indian Defence: Anti-Queen’s Indian System	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 Nc3
E17	Queen’s Indian Defence: Classical Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O
E17	Queen’s Indian Defence: Euwe Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O b3
E17	Queen’s Indian Defence: Fianchetto Variation, Kramnik Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Re1
E17	Queen’s Indian Defence: Opocensky Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 Nc3 Ne4 Bd2
E17	Queen’s Indian Defence: Classical Variation, Polugaevsky Gambit	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O d5 exd5 Nh4
E17	Queen’s Indian Defence: Classical Variation, Taimanov Gambit	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O d5 exd5 Nd4
E18	Queen’s Indian Defence: Classical Variation, Traditional Variation	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3
E18	Queen’s Indian Defence: Classical Variation, Tiviakov Defence	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3 Na6
E18	Queen’s Indian Defence: Classical Variation, Traditional Variation, Nimzowitsch Line	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3 d5
E19	Queen’s Indian Defence: Classical Variation, Traditional Variation, Main Line	d4 Nf6 c4 e6 Nf3 b6 g3 Bb7 Bg2 Be7 O-O O-O Nc3 Ne4 Qc2 Nxc3 Qxc3
E20	Nimzo-Indian Defence	d4 Nf6 c4 e6 Nc3 Bb4
E20	Nimzo-Indian Defence: Dilworth Gambit	d4 Nf6 c4 e6 Nc3 Bb4 e4
E20	Nimzo-Indian Defence: Kmoch Variation	d4 Nf6 c4 e6 Nc3 Bb4 f3
E20	Nimzo-Indian Defence: Mikenas Attack	d4 Nf6 c4 e6 Nc3 Bb4 Qd3
E20	Nimzo-Indian Defence: Romanishin Variation	d4 Nf6 c4 e6 Nc3 Bb4 g3
E20	Nimzo-Indian Defence: Romanishin Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 c5 g3 O-O Bg2
E20	Nimzo-Indian Defence: Romanishin Variation, English Hybrid	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 c5 g3 cxd4 Nxd4 O-O Bg2 d5 cxd5 Nxd5
E21	Nimzo-Indian Defence: Three Knights Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3
E21	Nimzo-Indian Defence: Three Knights Variation, Korchnoi Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 c5 d5
E21	Nimzo-Indian Defence: Three Knights Variation, Euwe Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 c5 d5 Ne4
E21	Nimzo-Indian Defence: Three Knights Variation, Shocron Gambit	d4 Nf6 c4 e6 Nf3 Bb4+ Nc3 c5 d5 b5
E22	Nimzo-Indian Defence: Spielmann Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qb3
E23	Nimzo-Indian Defence: Spielmann Variation, Romanovsky Gambit	d4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5 dxc5 Nc6
E23	Nimzo-Indian Defence: Spielmann Variation, Carlsbad Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5 dxc5 Nc6 Nf3 Ne4 Bd2 Nxd2
E23	Nimzo-Indian Defence: Spielmann Variation, Stahlberg Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5 dxc5 Nc6 Nf3 Ne4 Bd2 Nxc5
E23	Nimzo-Indian Defence: Spielmann Variation, Stahlberg Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qb3 c5 dxc5 Nc6 Nf3 Ne4 Bd2 Nxc5 Qc2 f5 g3
E24	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 a3
E24	Nimzo-Indian Defence: Sämisch Variation, Botvinnik Variation	d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5 e3 O-O cxd5 Nxd5
E25	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5 cxd5
E25	Nimzo-Indian Defence: Sämisch Variation, Keres Variation	d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5 cxd5 Nxd5 dxc5
E25	Nimzo-Indian Defence: Sämisch Variation, Romanovsky Variation	d4 Nf6 c4 e6 Nc3 Bb4 f3 d5 a3 Bxc3+ bxc3 c5 cxd5 Nxd5 dxc5 f5
E26	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 c5 e3
E26	Nimzo-Indian Defence: Sämisch Variation, O’Kelly Variation	d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 c5 e3 b6
E27	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 a3 Bxc3+ bxc3 O-O
E28	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O a3 Bxc3+ bxc3
E29	Nimzo-Indian Defence: Sämisch Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3 Nc6 a3 Bxc3+ bxc3 O-O
E29	Nimzo-Indian Defence: Sämisch Variation, Capablanca Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3 Nc6 a3 Bxc3+ bxc3 O-O Ne2 b6 e4 Ne8
E30	Nimzo-Indian Defence: Leningrad Variation	d4 Nf6 c4 e6 Nc3 Bb4 Bg5
E30	Nimzo-Indian Defence: Leningrad Variation, Averbakh Gambit	d4 Nf6 c4 e6 Nc3 Bb4 Bg5 h6 Bh4 c5 d5 b5
E31	Nimzo-Indian Defence: Leningrad Variation, Benoni Defence	d4 Nf6 c4 e6 Nc3 Bb4 Bg5 h6 Bh4 c5 d5 d6
E32	Nimzo-Indian Defence: Classical Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2
E32	Nimzo-Indian Defence: Classical Variation, Keres Defence	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3 Bxc3+ Qxc3 b6
E32	Nimzo-Indian Defence: Classical Variation, Vitolins-Adorjan Gambit	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O a3 Bxc3+ Qxc3 b5
E33	Nimzo-Indian Defence: Classical Variation, Zurich Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 Nc6
E33	Nimzo-Indian Defence: Classical Variation, Milner-Barry Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 Nc6 Nf3 d6
E34	Nimzo-Indian Defence: Classical Variation, Noa Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5
E34	Nimzo-Indian Defence: Classical Variation, Belyavsky Gambit	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 cxd5 Qxd5 Nf3 Qf5 Qd1 e5
E35	Nimzo-Indian Defence: Classical Variation, Noa Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 cxd5 exd5
E36	Nimzo-Indian Defence: Classical Variation, Noa Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3
E36	Nimzo-Indian Defence: Classical Variation, Noa Variation, Botvinnik Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 Nc6
E36	Nimzo-Indian Defence: Classical Variation, Noa Variation, Main Line	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 Ne4
E36	Nimzo-Indian Defence: Classical Variation, Romanishin Gambit	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 c5
E37	Nimzo-Indian Defence: Classical Variation, Noa Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 Ne4 Qc2
E37	Nimzo-Indian Defence: Classical Variation, Modern Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 Ne4 Qc2 c5
E37	Nimzo-Indian Defence: Classical Variation, Noa Variation, San Remo Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 d5 a3 Bxc3+ Qxc3 Ne4 Qc2 Nc6 e3 e5
E38	Nimzo-Indian Defence: Classical Variation, Berlin Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 c5
E38	Nimzo-Indian Defence: Classical Variation, Berlin Variation, Steiner Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 c5 dxc5 Bxc3+
E38	Nimzo-Indian Defence: Classical Variation, Berlin Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 O-O e3 d5 Nf3 c5
E39	Nimzo-Indian Defence: Classical Variation, Berlin Variation, Pirc Variation	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 c5 dxc5 O-O
E39	Nimzo-Indian Defence: Classical Variation, Berlin Variation, Macieja System	d4 Nf6 c4 e6 Nc3 Bb4 Qc2 c5 dxc5 O-O a3 Bxc5 Nf3 b6
E40	Nimzo-Indian Defence: Rubinstein System	d4 Nf6 c4 e6 Nc3 Bb4 e3
E40	Nimzo-Indian Defence: Rubinstein System, Taimanov Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 Nc6
E41	Nimzo-Indian Defence: Rubinstein System	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5
E41	Nimzo-Indian Defence: Rubinstein System, Hübner Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3 Nc6 Nf3 Bxc3+ bxc3 d6
E41	Nimzo-Indian Defence: Rubinstein System, Hübner Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Bd3 Nc6 Nf3 Bxc3+ bxc3 d6 O-O O-O
E42	Nimzo-Indian Defence: Rubinstein System, Rubinstein Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Ne2
E42	Nimzo-Indian Defence: Rubinstein System, Rubinstein Variation, Main Line	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Ne2 cxd4 exd4 O-O a3
E42	Nimzo-Indian Defence: Rubinstein System, Rubinstein Variation, Sherbakov Attack	d4 Nf6 c4 e6 Nc3 Bb4 e3 c5 Ne2 cxd4 exd4 O-O c5
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 b6 e3 Ne4 Qc2
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 O-O
E43	Nimzo-Indian Defence: St. Petersburg Variation, with Ne4	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 Ne4
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 O-O O-O
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 O-O O-O c5
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 Ne4 Qc2 f5 Nf3 b6 Bd3 Bb7
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 Bxc3+ bxc3 b6 e3 Bb7 Bd3 O-O O-O
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 c5 Nf3 b6 O-O Bb7 Na4 Qe7
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 Nf3 b6 e3 Ne4 Qc2 Bb7 Bd3 Bxc3+ bxc3 f5 O-O
E43	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 O-O O-O c5 Na4 cxd4 a3 Be7
E44	Nimzo-Indian Defence: St. Petersburg Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Ne2
E44	Nimzo-Indian Defence: St. Petersburg Variation, American Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Ne2 Ne4
E44	Nimzo-Indian Defence: St. Petersburg Variation, Romanishin-Psakhis Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Ne2 c5 a3 Ba5
E45	Nimzo-Indian Defence: St. Petersburg Variation, Fischer Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Ne2 Ba6
E46	Nimzo-Indian Defence: Normal Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O
E46	Nimzo-Indian Defence: Reshevsky Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Ne2
E46	Nimzo-Indian Defence: Simagin Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Ne2 d5 a3 Bd6
E47	Nimzo-Indian Defence: Normal Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3
E48	Nimzo-Indian Defence: Normal Variation, Classical Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5
E48	Nimzo-Indian Defence: Ragozin Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 Nc6 O-O
E49	Nimzo-Indian Defence: Normal Variation, Botvinnik System	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 a3 Bxc3+ bxc3
E50	Nimzo-Indian Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Nf3
E51	Nimzo-Indian Defence: Normal Variation, Ragozin Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Nf3 d5
E51	Nimzo-Indian Defence: Normal Variation, Sämisch Deferred	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Nf3 d5 a3
E51	Nimzo-Indian Defence: Ragozin Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 Nc6 O-O dxc4
E52	Nimzo-Indian Defence: Normal Variation, Schlechter Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 b6
E52	Nimzo-Indian Defence: Normal Variation, Schlechter Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 b6 Bd3 Bb7 Nf3 O-O O-O d5
E53	Nimzo-Indian Defence: Normal Variation, Gligoric System	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5
E53	Nimzo-Indian Defence: Normal Variation, Gligoric System	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nbd7
E53	Nimzo-Indian Defence: Normal Variation, Gligoric System, Keres Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O b6
E54	Nimzo-Indian Defence: Normal Variation, Gligoric System, Exchange Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O dxc4 Bxc4
E54	Nimzo-Indian Defence: Normal Variation, Gligoric System, Smyslov Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O dxc4 Bxc4 Qe7
E54	Nimzo-Indian Defence: Normal Variation, Gligoric System, Exchange Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O dxc4 Bxc4 cxd4 exd4
E55	Nimzo-Indian Defence: Normal Variation, Gligoric System, Bronstein Variation	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O dxc4 Bxc4 Nbd7
E56	Nimzo-Indian Defence: Normal Variation, Gligoric System, Bernstein Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6
E57	Nimzo-Indian Defence: Normal Variation, Gligoric System, Bernstein Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6 a3 dxc4 Bxc4 cxd4
E58	Nimzo-Indian Defence: Normal Variation, Bernstein Defence, Exchange Line	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6 a3 Bxc3 bxc3
E59	Nimzo-Indian Defence: Normal Variation, Bernstein Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 Nf3 c5 O-O Nc6 a3 Bxc3 bxc3 dxc4 Bxc4
E59	Nimzo-Indian Defence: Normal Variation, Bernstein Defence	d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O Bd3 d5 a3 Bxc3+ bxc3 dxc4 Bxc4 c5 Nf3 Nc6 O-O Qc7 Qc2
E60	Indian Defence: West Indian Defence	d4 Nf6 c4 g6
E60	Indian Defence: Anti-Grünfeld, Advance Variation	d4 Nf6 c4 g6 d5
E60	Indian Defence: Anti-Grünfeld, Alekhine Variation	d4 Nf6 c4 g6 f3
E60	Indian Defence: Anti-Grünfeld, Basman-Williams Attack	d4 Nf6 c4 g6 h4
E60	King’s Indian Defence: Fianchetto Variation, Immediate Fianchetto	d4 Nf6 c4 g6 g3
E60	King’s Indian Defence: Normal Variation, King’s Knight Variation	d4 Nf6 Nf3 g6 c4
E60	Queen’s Pawn, Mengarini Attack	d4 Nf6 c4 g6 Qc2
E60	Indian Defence: Anti-Grünfeld, Adorjan Gambit	d4 Nf6 c4 g6 d5 b5
E60	Indian Defence: Anti-Grünfeld, Alekhine Variation, Leko Gambit	d4 Nf6 c4 g6 f3 e5
E60	King’s Indian Defence: Fianchetto Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3
E60	King’s Indian Defence: Santasiere Variation	d4 Nf6 c4 g6 Nf3 Bg7 b4
E60	Grünfeld Defence: Counterthrust Variation	d4 Nf6 c4 g6 g3 Bg7 Bg2 d5
E60	King’s Indian Defence: Semi-Classical Variation, Benoni Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O e3 d6 Be2 c6
E60	King’s Indian Defence: Semi-Classical Variation, Hollywood Variation	d4 Nf6 Nf3 g6 c4 Bg7 Nc3 O-O e3 d6 Be2 Nc6
E61	King’s Indian Defence	d4 Nf6 c4 g6 Nc3
E61	King’s Indian Defence: Smyslov Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 Bg5
E61	King’s Indian Defence: Semi-Classical Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O e3 d6 Be2
E61	King’s Indian Defence: Fianchetto Variation, Benjamin Defence	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 g3 O-O Bg2 c6 O-O Qb6
E61	King’s Indian Defence: Semi-Classical Variation, Queenside Storm Line	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O e3 d6 Be2 Nbd7 O-O e5 b4
E61	King’s Indian Defence: Semi-Classical Variation, Exchange Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O e3 d6 Be2 Nbd7 O-O e5 dxe5 dxe5
E62	King’s Indian Defence: Fianchetto Variation, Delayed Fianchetto	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 g3
E62	King’s Indian Defence: Fianchetto Variation, Carlsbad Variation	d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O Nc3 d6 Nf3 Nc6
E62	King’s Indian Defence: Fianchetto Variation, Kavalek Defence	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O c6 Nc3 Qa5
E62	King’s Indian Defence: Fianchetto Variation, Larsen Defence	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 g3 O-O Bg2 c6 O-O Bf5
E62	King’s Indian Defence: Fianchetto Variation, Lesser Simagin (Spassky)	d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O Nc3 d6 Nf3 Nc6 O-O Bf5
E62	King’s Indian Defence: Fianchetto Variation, Simagin Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 g3 O-O Bg2 Nc6 O-O Bg4
E62	King’s Indian Defence: Fianchetto Variation, Uhlmann-Szabo System	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nc6 Nc3 e5
E63	King’s Indian Defence: Fianchetto Variation, Panno Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nc6 Nc3 a6
E63	King’s Indian Defence: Fianchetto Variation, Panno Variation, Korchnoi Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nc6 Nc3 a6 h3 Rb8 Be3 b5 Nd2
E63	King’s Indian Defence: Fianchetto Variation, Panno Variation, Blockade Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nc6 Nc3 a6 d5 Na5 Nd2 c5 Qc2 e5
E63	King’s Indian Defence: Fianchetto Variation, Panno Variation, Donner Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nc6 Nc3 a6 d5 Na5 Nd2 c5 Qc2 Rb8 b3 b5 Bb2 bxc4 bxc4 Bh6
E64	King’s Indian Defence: Fianchetto Variation, Pterodactyl Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 c5 Bg2 Qa5+
E64	King’s Indian Defence: Fianchetto Variation, Yugoslav System	d4 Nf6 c4 g6 Nf3 Bg7 g3 d6 Bg2 O-O O-O c5
E64	King’s Indian Defence: Fianchetto Variation, Yugoslav Variation, Rare Line	d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O Nc3 d6 Nf3 c5
E64	King’s Indian Defence: Fianchetto Variation, Hungarian Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 d6 Bg2 O-O O-O Nbd7 Nc3 a6
E64	King’s Indian Defence: Fianchetto Variation, Double Fianchetto Attack	d4 Nf6 c4 g6 Nf3 Bg7 g3 d6 Bg2 O-O O-O Nbd7 Nc3 e5 b3
E65	King’s Indian Defence: Fianchetto Variation, Yugoslav Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O c5 Nc3
E65	King’s Indian Defence: Fianchetto Variation, Yugoslav Variation, Exchange Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O c5 Nc3 Nc6 dxc5 dxc5
E66	King’s Indian Defence: Fianchetto Variation, Yugoslav Variation, Advance Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O c5 Nc3 Nc6 d5
E67	King’s Indian Defence: Fianchetto Variation, Debrecen Defence	d4 Nf6 c4 g6 g3 Bg7 Bg2 O-O Nc3 d6 Nf3 Nbd7
E67	King’s Indian Defence: Fianchetto Variation, Classical Fianchetto	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5
E68	King’s Indian Defence: Fianchetto Variation, Classical Variation	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5 e4
E68	King’s Indian Defence: Fianchetto Variation, Long Variation	d4 Nf6 c4 g6 Nc3 Bg7 Nf3 d6 g3 O-O Bg2 Nbd7 O-O e5 e4 Re8 h3 exd4 Nxd4 Nc5 Re1 a5
E69	King’s Indian Defence: Fianchetto Variation, Classical Main Line	d4 Nf6 c4 g6 Nf3 Bg7 g3 O-O Bg2 d6 O-O Nbd7 Nc3 e5 e4 c6 h3
E70	King’s Indian Defence: Normal Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4
E70	King’s Indian Defence: Normal Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6
E70	King’s Indian Defence: Accelerated Averbakh Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Bg5
E70	King’s Indian Defence: Kramer Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nge2
E71	King’s Indian Defence: Makogonov Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 h3
E71	King’s Indian Defence: Karpov System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 h3 O-O Be3
E72	King’s Indian Defence: Normal Variation, Deferred Fianchetto	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 g3
E72	King’s Indian Defence: Pomar System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 g3 O-O Bg2 e5 Nge2
E73	King’s Indian Defence: Normal Variation, Standard Development	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2
E73	King’s Indian Defence: Averbakh Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5
E73	King’s Indian Defence: Semi-Averbakh System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Be3
E73	King’s Indian Defence: Averbakh Variation, Flexible Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 h6
E73	King’s Indian Defence: Averbakh Variation, Geller Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 Nbd7
E73	King’s Indian Defence: Averbakh Variation, Modern Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 Na6
E73	King’s Indian Defence: Averbakh Variation, Nc6 Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 Nc6
E73	King’s Indian Defence: Averbakh Variation, Spanish Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 a6
E73	King’s Indian Defence: Averbakh Variation, Modern Defence, Burgess Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 Na6 Qd2 c6
E74	King’s Indian Defence: Averbakh Variation, Benoni Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 c5
E74	King’s Indian Defence: Averbakh Variation, Benoni Defence, Advance Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 c5 d5
E74	King’s Indian Defence: Averbakh Variation, Benoni Defence, Exchange Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 c5 dxc5
E75	King’s Indian Defence: Averbakh Variation, Main Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5 c5 d5 e6
E76	King’s Indian Defence: Four Pawns Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4
E76	King’s Indian Defence: Four Pawns Attack, Modern Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 Na6
E76	King’s Indian Defence: Four Pawns Attack, Dynamic Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5
E77	King’s Indian Defence: Four Pawns Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O f4
E77	King’s Indian Defence: Four Pawns Attack, Normal Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 e6 Be2
E77	King’s Indian Defence: Four Pawns Attack, Florentine Gambit	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 d5 e6 Be2 exd5 e5
E77	King’s Indian Defence: Six Pawns Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Be2 c5 d5 e6 dxe6 fxe6 g4 Nc6 h4
E78	King’s Indian Defence: Four Pawns Attack, Fluid Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 Be2
E79	King’s Indian Defence: Four Pawns Attack, Exchange Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f4 O-O Nf3 c5 Be2 cxd4 Nxd4 Nc6 Be3
E80	King’s Indian Defence: Sämisch Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3
E81	King’s Indian Defence: Sämisch Variation, Normal Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O
E81	King’s Indian Defence: Sämisch Variation, Bobotsov-Korchnoi-Petrosian Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Nge2
E81	King’s Indian Defence: Steiner Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5
E81	King’s Indian Defence: Sämisch Variation, Sämisch Gambit	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 c5
E81	King’s Indian Defence: Sämisch Variation, Byrne Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 c6 Bd3 a6
E81	King’s Indian Defence: Steiner Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5 c5 d5 h6 Bf4
E81	King’s Indian Defence: Sämisch Variation, Sämisch Gambit Accepted	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 c5 dxc5 dxc5 Qxd8 Rxd8 Bxc5
E81	King’s Indian Defence: Steiner Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5 c5 d5 e6 Qd2 exd5 Nxd5
E81	King’s Indian Defence: Steiner Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Bg5 c5 d5 e6 Qd2 h6 Bxh6
E82	King’s Indian Defence: Sämisch Variation, Double Fianchetto	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 b6
E83	King’s Indian Defence: Sämisch Variation, Yates Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 Nc6
E83	King’s Indian Defence: Sämisch Variation, Panno Formation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 Nc6 Nge2 a6
E83	King’s Indian Defence: Sämisch Variation, Ruban Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 Nc6 Nge2 Rb8
E84	King’s Indian Defence: Sämisch Variation, Panno Main Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 Nc6 Nge2 a6 Qd2 Rb8
E85	King’s Indian Defence: Sämisch Variation, Orthodox Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5
E86	King’s Indian Defence: Sämisch Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 Nge2 c6
E87	King’s Indian Defence: Sämisch Variation, Closed Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5
E87	King’s Indian Defence: Sämisch Variation, Bronstein Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 Qh4+ g3 Nxg3 Qf2 Nxf1 Qxh4 Nxe3 Ke2
E87	King’s Indian Defence: Sämisch Variation, Orthodox Variation, Bronstein Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 Nh5 Qd2 Qh4+ g3 Nxg3 Qf2 Nxf1 Qxh4 Nxe3 Ke2 Nxc4
E88	King’s Indian Defence: Sämisch Variation, Closed Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 d5 c6
E89	King’s Indian Defence: Sämisch Variation, Closed Variation, Main Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3 O-O Be3 e5 Nge2 c6 d5 cxd5
E90	King’s Indian Defence: Normal Variation, Rare Defenses	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3
E90	King’s Indian Defence: Larsen Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be3
E90	King’s Indian Defence: Zinnowitz Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Bg5
E91	King’s Indian Defence: Orthodox Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2
E91	King’s Indian Defence: Kazakh Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 Na6
E92	King’s Indian Defence: Orthodox Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5
E92	King’s Indian Defence: Exchange Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 dxe5
E92	King’s Indian Defence: Orthodox Variation, Gligoric-Taimanov System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 Be3
E92	King’s Indian Defence: Petrosian Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5
E92	King’s Indian Defence: Petrosian Variation, Stein Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5 a5
E93	King’s Indian Defence: Petrosian Variation, Normal Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5 Nbd7
E93	King’s Indian Defence: Petrosian Variation, Keres Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 d5 Nbd7 Bg5 h6 Bh4 g5 Bg3 Nh5 h4
E94	King’s Indian Defence: Orthodox Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O
E94	King’s Indian Defence: Orthodox Variation, Donner Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O c6
E94	King’s Indian Defence: Orthodox Variation, Glek Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Na6
E94	King’s Indian Defence: Orthodox Variation, Positional Defence	d4 Nf6 c4 d6 Nc3 Nbd7 e4 e5 Nf3 g6 Be2 Bg7 O-O O-O
E94	King’s Indian Defence: Orthodox Variation, Ukrainian Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O a5
E94	King’s Indian Defence: Orthodox Variation, Positional Defence, Closed Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 Nbd7 O-O e5 d5
E95	King’s Indian Defence: Orthodox Variation	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nbd7 Re1
E96	King’s Indian Defence: Orthodox Variation, Positional Defence, Main Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nbd7 Re1 c6 Bf1 a5
E97	King’s Indian Defence: Orthodox Variation, Aronin-Taimanov Defence	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6
E97	King’s Indian Defence: Orthodox Variation, Bayonet Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 b4
E97	King’s Indian Defence: Orthodox Variation, Korchnoi Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Bd2
E97	King’s Indian Defence: Orthodox Variation, Modern System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Nd2
E97	King’s Indian Defence: Orthodox Variation, Bayonet Attack, Sokolov’s Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 b4 Nh5 Re1
E97	King’s Indian Defence: Orthodox Variation, Bayonet Attack, Yepishin’s Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 b4 Nh5 Qc2
E98	King’s Indian Defence: Orthodox Variation, Classical System	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1
E98	King’s Indian Defence: Orthodox Variation, Classical System, Neo-Classical Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Be3
E98	King’s Indian Defence: Orthodox Variation, Classical System, Kozul Gambit	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 Be3 f5 f3 f4 Bf2 g5 Rc1 Ng6 c5
E99	King’s Indian Defence: Orthodox Variation, Classical System, Traditional Line	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 f3 f5
E99	King’s Indian Defence: Orthodox Variation, Classical System, Benko Attack	d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6 d5 Ne7 Ne1 Nd7 f3 f5 g4`;
