# How does GPS know where you are? — research

**The one true thing:** your phone never sends anything; it times signals from clocks in orbit, and those clocks
have to be corrected for relativity (+38 µs a day) or positions would drift about 10 km a day.

## Facts (with sources)
- GPS satellites orbit at about 20,200 km and circle the Earth twice a day; 31 operational satellites as of
  July 2023; the US commits to at least 24. — GPS.gov, Space Segment.
- Smartphones are typically accurate to within 4.9 m under open sky (worse near buildings, bridges, trees). — GPS.gov, GPS Accuracy (citing ION).
- Each satellite broadcasts its time (from onboard atomic clocks) and its position; the receiver measures the delay;
  at least four satellites are needed (three coordinates + the receiver clock bias). 1 µs of clock error ≈ 300 m. — GNSS course notes / NH DFL GPS intro.
- Signal travel time from directly overhead: 20,200 km / 300,000 km/s ≈ 0.067 s ("about seven hundredths"). — arithmetic.
- Relativity: about −7 µs/day from orbital speed (special), +45 µs/day from weaker gravity (general), net +38 µs/day;
  uncorrected ≈ 10–11 km/day of error; clocks are set to 10.22999999543 MHz instead of 10.23 MHz before launch.
  — N. Ashby, "Relativity in the Global Positioning System", Living Reviews in Relativity (2003), as widely quoted.

## Hedges
- "about thirty satellites", "about ten kilometres a day", "about five metres": all said with "about".
- The trilateration scene shows circles on the ground (a 2D picture); the card states the 3D version (sphere, circle, two points).

## Style
isometric: hairline product illustration suits satellites, a phone on a plinth, clocks and a map grid.
One dark accent = the dot (you) or the satellite that matters.
