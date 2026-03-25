let activeMaps = [];
let carrierCount = 0;
let drainClicks = 0;
let dolphinCount = 0;
let crudeClicks = 0;
let crudePrice = 69.42;
let crudeHistory = [69.42];
let trebAnimating = false;

function cleanupMaps() { activeMaps.forEach(m => { try { m.remove(); } catch(e) {} }); activeMaps = []; }

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

function makeMap(id, center, zoom) {
  const map = L.map(id, { zoomControl: true, scrollWheelZoom: true }).setView(center, zoom);
  L.tileLayer(DARK_TILES, { attribution: TILE_ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  activeMaps.push(map);
  return map;
}

// Share text for each solution
const shareData = {
  canal: { text: "My solution to the Strait of Hormuz is to dig a massive canal through the Arabian Peninsula. I drew a route and the budget evaporated instantly.", emoji: "\u26cf\ufe0f" },
  ask: { text: "My solution to the Strait of Hormuz crisis is to just send a really nice email. This is our third follow-up. Please RSVP.", emoji: "\u2709\ufe0f" },
  carriers: { text: "My solution to the Strait of Hormuz is to park 100 aircraft carriers side by side and lay plywood across them. Total cost: $1.16 trillion.", emoji: "\u26f5" },
  drain: { text: "My solution to the Strait of Hormuz is to simply drain all 31.4 trillion gallons of water out of it. Only takes 1,194 years.", emoji: "\ud83d\udca7" },
  trebuchet: { text: "My solution to the Strait of Hormuz is a giant trebuchet that yeets oil barrels 33km at Mach 1.7. The Geneva Convention has concerns.", emoji: "\ud83c\udff0" },
  moveit: { text: "My solution to the Strait of Hormuz is to physically relocate Iran using tectonic engineering. ETA: 200 million years.", emoji: "\ud83c\udf0d" },
  straw: { text: "My solution to the Strait of Hormuz is a covert underwater pipeline disguised as a giant drinking straw. Iran must never know.", emoji: "\ud83e\udd64" },
  dolphins: { text: "My solution to the Strait of Hormuz is to strap oil barrels to 21 million trained dolphins. The dolphins said no. Their union rep is also a dolphin.", emoji: "\ud83d\udc2c" },
  flood: { text: "My solution to the Strait of Hormuz is to melt the ice caps and raise sea levels 70m until the strait is irrelevant. We're already working on it apparently.", emoji: "\ud83c\udf0a" },
  crude: { text: "My solution to the Strait of Hormuz is to tokenize every barrel of oil as an NFT. The oil never moves. You own the JPEG. Already rugpulled.", emoji: "\ud83d\udcb0" },
  rename: { text: "My solution to the Strait of Hormuz is to just rename it. If the Gulf of Mexico can become the Gulf of America, the strait can become \"The Friendship Funnel.\u2122\"", emoji: "\ud83d\udcdd" },
  timetravel: { text: "My solution to the Strait of Hormuz is to go back 200 million years and prevent the tectonic plates from forming it. Don't try to understand it. Feel it.", emoji: "\u23f0" }
};

function shareSolution(id) {
  var d = shareData[id];
  if (!d) return;
  var url = 'https://fixthestrait.com/#' + id;
  var text = d.emoji + ' ' + d.text + '\n\n';

  // Try native share (mobile), fall back to copy
  if (navigator.share) {
    navigator.share({ text: text, url: url }).catch(function() {});
  } else {
    // Copy to clipboard
    var full = text + url;
    navigator.clipboard.writeText(full).then(function() {
      var btn = document.querySelector('.share-btn');
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '<span class="share-icon">\u2713</span> COPIED TO CLIPBOARD';
        btn.classList.add('share-copied');
        setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('share-copied'); }, 2000);
      }
    });
  }
}

const modalData = {
  canal: {
    overline: 'Solution 08 — Extreme Landscaping',
    title: 'Dig a Massive Canal',
    body: '<p>The Suez Canal is 193km long and took about 10 years to build. A canal bypassing the Strait of Hormuz would need to cut through the UAE or Oman — through mountains, desert, and sovereign territory that might have opinions about a giant trench.</p><p><strong>Click on the map below to draw your canal route.</strong> Each click adds a waypoint. We\'ll calculate the cost in real-time. Real-world canal construction runs roughly $1-2 billion per kilometer.</p>',
    interactive: 'canal',
    facts: '<p>There actually is a real pipeline bypass — the Habshan-Fujairah pipeline, which can move about 1.5 million barrels per day from Abu Dhabi to Fujairah on the Gulf of Oman. Saudi Arabia also has the East-West pipeline (Petroline) carrying about 5 million bpd to the Red Sea.</p><p>Together these cover only a fraction of the 21 million bpd through Hormuz. A canal would be orders of magnitude more expensive than expanding pipeline capacity. Estimated cost: $200-800 billion before the inevitable overruns.</p>'
  },
  ask: {
    overline: 'Solution 01 — Radical Diplomacy',
    title: 'Just Ask Nicely',
    body: '<p>What if — and hear us out — we just sent a really nice email? Like, <em>really</em> nice. With a subject line that shows we care. Below is a draft prepared by our top diplomatic AI (third follow-up, the first two were ignored):</p>',
    interactive: 'email',
    facts: '<p>Diplomatic negotiations over the strait have been ongoing for decades. The 1982 UN Convention on the Law of the Sea (UNCLOS) establishes the right of "transit passage" through international straits, which Iran has intermittently acknowledged and challenged.</p><p>Iran has threatened to close the strait multiple times, most notably during tensions in 2012 and 2019. The international consensus is that closing the strait would be an act of war — but "consensus" and "reality" are different departments.</p>'
  },
  carriers: {
    overline: 'Solution 04 — Naval Architecture',
    title: 'Aircraft Carrier Bridge',
    body: '<p>A Nimitz-class aircraft carrier is 333 meters long and 77 meters wide. The Strait at its narrowest is about 33,000 meters. So you\'d only need roughly <strong>100 aircraft carriers</strong> parked side by side to form a bridge.</p><p>The US Navy currently has 11. So we\'d need to build 89 more. At roughly $13 billion each, that\'s only about <strong>$1.16 trillion</strong>. Click below to start deploying.</p>',
    interactive: 'carriers',
    facts: '<p>The US Fifth Fleet, headquartered in Bahrain, is responsible for naval operations in the Persian Gulf. Multiple nations maintain naval presences in the area.</p><p>Aircraft carriers are not, to our knowledge, used as bridges in any current naval doctrine. We reached out to the Pentagon for comment and they hung up.</p>'
  },
  drain: {
    overline: 'Solution 07 — Hydrological Warfare',
    title: 'Drain the Strait',
    body: '<p>The Strait of Hormuz contains roughly <strong>119 billion cubic meters</strong> of water — about 31.4 trillion gallons. Simply pump it out, walk the oil across the seabed, and call it a day.</p><p>The world\'s most powerful pump moves about 50,000 gallons per minute. At that rate, draining the strait takes approximately <strong>1,194 years</strong> — assuming the Indian Ocean doesn\'t notice, which it absolutely would. Click the pump and watch your progress.</p>',
    interactive: 'drain',
    facts: '<p>The Strait has an average depth of about 60 meters with the deepest point around 90 meters. The water volume is enormous and is connected to the entire Indian Ocean.</p><p>Even if you could drain it, the exposed seabed would be a muddy, salt-encrusted wasteland. Also, you\'d destroy one of the most important marine ecosystems in the Persian Gulf. But sure, let\'s pump.</p>'
  },
  trebuchet: {
    overline: 'Solution 03 — Medieval Engineering',
    title: 'Giant Trebuchet',
    body: '<p>A standard oil barrel weighs about 136kg (300 lbs). To launch one 33 kilometers, you\'d need a launch velocity of approximately <strong>569 m/s — that\'s Mach 1.7</strong>, or about twice the speed of sound.</p><p>The barrel would need to survive supersonic flight, extreme heat from air friction, and then somehow land intact. Each barrel contains 159 liters of crude oil that would very much like to not be going Mach 1.7.</p><p>Adjust the launch angle and fire away. We\'ve run the physics. It doesn\'t work at any angle.</p>',
    interactive: 'trebuchet',
    facts: '<p>The largest trebuchet ever built, the Warwolf, could hurl projectiles about 200 meters. That\'s 0.6% of the distance needed. You\'d need a trebuchet roughly 165 times larger than the largest siege weapon in medieval history.</p><p>Launching 21 million barrels per day via trebuchet would require approximately 243 launches per second. The noise alone would register on seismographs.</p>'
  },
  moveit: {
    overline: 'Solution 06 — Tectonic Engineering',
    title: 'Physically Move Iran',
    body: '<p>Iran sits on the boundary of the Arabian and Eurasian tectonic plates. These plates are already moving — just very slowly (about 2.5cm per year). What if we... sped that up?</p><p>Iran has an area of 1,648,195 km\u00B2 and an average crustal thickness of about 45km. That\'s roughly <strong>74 trillion cubic meters of rock</strong> weighing about 200 quadrillion tonnes. But with the right attitude and a really big lever, anything is possible.</p><p>Choose a new location for Iran below:</p>',
    interactive: 'moveit',
    facts: '<p>Tectonic plates move at roughly the speed your fingernails grow — about 2-10cm per year. Iran is already slowly moving northward into the Eurasian plate, which is why the Zagros Mountains exist.</p><p>In about 50 million years, the Persian Gulf will likely close entirely. So plate tectonics will solve the Strait of Hormuz problem. You just have to wait.</p>'
  },
  straw: {
    overline: 'Solution 05 — Covert Infrastructure',
    title: 'Operation Krazy Straw',
    body: '<p>Classified briefing: the plan is simple. Lay a <strong>giant drinking straw</strong> along the ocean floor, from the Persian Gulf side to the Gulf of Oman side, completely bypassing Iranian waters. Disguise it as a natural seafloor formation. Pipe 21 million barrels per day through it.</p><p>Iran must never know. This is a <strong>covert slurping operation</strong>. Adjust the straw diameter below and assess operational viability:</p>',
    interactive: 'straw',
    facts: '<p>Subsea pipelines are very much real — the Nord Stream pipelines ran 1,224km along the Baltic seabed. The Langeled pipeline carries gas 1,166km from Norway to the UK. So underwater pipes aren\'t insane.</p><p>What IS insane is calling it a straw, making it "covert" (subsea construction involves dozens of ships visible from space), and the idea that Iran wouldn\'t notice a massive pipeline running past their coastline. But the engineering community appreciates the enthusiasm.</p>'
  },
  dolphins: {
    overline: 'Solution 02 — Marine Logistics',
    title: 'Train the Dolphins',
    body: '<p>The US Navy Marine Mammal Program has been training dolphins since 1960. They can detect mines, retrieve objects, and guard harbors. So why not strap a barrel of oil to each one and have them swim it across?</p><p>A barrel of crude oil weighs 136kg. A bottlenose dolphin can carry about... significantly less than that. But what they lack in carrying capacity, they make up for in enthusiasm and sonar.</p><p>To move 21 million barrels per day, you\'d need <strong>21 million dolphins</strong>. The entire global bottlenose dolphin population is about 600,000. Click below to start recruiting:</p>',
    interactive: 'dolphins',
    facts: '<p>The US Navy Marine Mammal Program is real, headquartered in San Diego, with about 70 bottlenose dolphins and 30 California sea lions trained for mine detection and harbor patrol, not oil logistics.</p><p>A bottlenose dolphin swims at about 20 km/h and would take roughly 1.5 hours to cross the strait. Even if they could carry a full barrel (they absolutely cannot — it weighs more than they do), you\'d need every dolphin on Earth, times 35. The dolphins\' union has formally declined.</p>'
  },
  flood: {
    overline: 'Solution 10 — Accelerated Climate Engineering',
    title: 'Melt It All',
    body: '<p>The Strait of Hormuz is narrow because geography said so. But what if we <strong>raised sea levels</strong> enough to flood the entire Arabian Peninsula coastline, turning the Persian Gulf into a vast, open sea? No more chokepoint — just vibes and water.</p><p>Earth\'s ice caps contain enough frozen water to raise sea levels by approximately <strong>70 meters</strong>. At that point, half of the world\'s coastal cities are underwater, but the Strait of Hormuz is now 200km wide. Problem. Solved.</p><p>Use the slider below to choose your preferred level of planetary destruction:</p>',
    interactive: 'flood',
    facts: '<p>Current climate models predict 0.3–1.0 meters of sea level rise by 2100 under various emissions scenarios. A 1-meter rise would displace roughly 150 million people worldwide and flood significant portions of Bangladesh, the Netherlands, and Florida.</p><p>To raise sea levels by the 5+ meters needed to meaningfully widen the strait, you\'d need to melt most of Greenland\'s ice sheet (7.4m worth) or a significant portion of Antarctica (58m worth). At current warming rates, the Greenland scenario takes centuries. The "good" news: we\'re already working on it. The bad news: everything else about this.</p>'
  },
  crude: {
    overline: 'Solution 09 — Blockchain Disruption',
    title: 'CrudeCoin\u2122',
    body: '<p>Why physically move oil when you could simply <strong>tokenize it</strong>? Each barrel becomes an NFT on the CrudeCoin\u2122 blockchain. Refineries purchase the token, which represents ownership of one barrel of crude currently sitting in the ground. The oil never actually moves. The strait becomes irrelevant.</p><p>The fact that refineries need <em>actual physical oil</em> to refine into fuel is, frankly, a legacy-thinking problem. We\'re disrupting petroleum the way Uber disrupted taxis — by ignoring the fundamental physics.</p><p>Click below to mine CrudeCoin\u2122 and watch the market do its thing:</p>',
    interactive: 'crude',
    facts: '<p>Commodity tokenization is actually a real and growing area of fintech. Several platforms offer tokenized ownership of physical commodities including oil. However, someone still needs to physically move the oil to a refinery.</p><p>The irony: Bitcoin mining alone consumes about 150 TWh per year — roughly the energy content of 260 million barrels of oil. You\'d be burning digital oil to digitize physical oil. The thermodynamics department would like a word.</p>'
  },
  rename: {
    overline: 'Solution 11 — Strategic Rebranding',
    title: 'Just Rename It',
    body: '<p>In January 2025, the Gulf of Mexico was officially renamed to the "Gulf of America" by executive order. The body of water did not change. The maps did. The vibes shifted. If it worked for the Gulf of Mexico, why not for the <strong>Strait of Hormuz</strong>?</p><p>The theory is simple: the word "Hormuz" sounds threatening. It sounds like something that\'s about to close. Rename it to something friendlier and the geopolitical tension evaporates. Nobody\'s going to threaten to "close the Friendship Funnel." You can\'t blockade "Steve."</p><p>Select your preferred rebrand below and watch the diplomatic fallout unfold in real time:</p>',
    interactive: 'rename',
    facts: '<p>The Gulf of Mexico was officially renamed to the "Gulf of America" in U.S. federal documents in January 2025 by executive order. Other countries did not recognize the name change. Google Maps briefly showed both names depending on where you were searching from. Mexico responded by renaming North America to "America Mexicana" on their official maps.</p><p>The Strait of Hormuz gets its name from the island of Hormuz (Hormoz), derived from the Persian god Ahura Mazda. The strait has been called various names throughout history by different civilizations. Renaming it would require international consensus through the International Hydrographic Organization — or, alternatively, just a really confident executive order and the willingness to be ignored by 194 countries.</p>'
  },
  timetravel: {
    overline: 'Solution 12 — Temporal Engineering',
    title: 'Time Travel',
    body: '<p>200 million years ago, the Arabian and Eurasian tectonic plates hadn\'t yet collided. There was no Persian Gulf. There was no Strait of Hormuz. There was no problem. The solution is obvious: <strong>go back in time and prevent the plates from converging.</strong></p><p>We don\'t need to understand how time travel works. As a great physicist once said: "Don\'t try to understand it. Feel it." (That physicist worked for a secret organization running temporal operations, so he\'s basically one of us.)</p><p>The only question is <em>when</em> to go. Choose your temporal destination below and assess the consequences:</p>',
    interactive: 'timetravel',
    facts: '<p>The Strait of Hormuz formed as a result of the Arabian Plate colliding with the Eurasian Plate, a process that began roughly 20-30 million years ago and created the Zagros Mountains. The Persian Gulf itself is geologically young — a shallow basin that flooded as sea levels rose after the last ice age about 14,000 years ago.</p><p>As for time travel: general relativity technically permits closed timelike curves (time loops) in certain exotic spacetime geometries, but they require negative energy densities that may not exist in nature. The grandfather paradox remains unresolved. Christopher Nolan\'s <em>Tenet</em> proposed temporal inversion via "inverted entropy," which physicists have described as "not how entropy works" but "an excellent movie." Doc Brown\'s flux capacitor requires 1.21 gigawatts, which is about the output of a single nuclear reactor. The DeLorean, however, is out of production.</p>'
  }
};

const iranLocations = {
  'The Pacific Ocean': {
    text: "Iran is now a large island nation in the middle of the Pacific Ocean, somewhere between Wake Island and absolutely nothing. The strait problem is solved! New problems: Iran is now the world's most remote country, has no oil export infrastructure, 83 million people need to be told, and the nearest Costco is 4,000km away. The Pacific Ring of Fire welcomes its newest member. Also, there's no longer a Persian Gulf, just an Arabian Gulf-shaped void that's rapidly flooding.",
    center: [15, -175], zoom: 4
  },
  'East of Australia': {
    text: "Iran is now floating in the Coral Sea, well east of Australia. The Australians are confused but characteristically relaxed about it. 'Yeah nah, there's a whole country there now, bit weird innit.' The strait is gone, replaced by a scenic coastline. Unfortunately, Iran's entire oil export infrastructure now faces open ocean with no refineries for 5,000km. New Zealand is pretending not to notice. Several confused island nations have lodged formal complaints.",
    center: [-18, 165], zoom: 4
  },
  'Antarctica': {
    text: "Iran has been relocated to Antarctica. The strait problem is technically solved. However: temperatures of -60\u00B0C have frozen all oil pipelines solid, 83 million residents are upset, penguins are confused, and the Antarctic Treaty of 1959 has been violated in ways its authors could never have imagined. On the plus side, Iran now has the world's largest ski resort. Oil exports have been replaced with ice exports.",
    center: [-80, 0], zoom: 3
  },
  'The Moon': {
    text: "We've placed Iran on the Moon. This definitively solves the Strait of Hormuz problem. However, oil is now 384,400km away from any refinery, there is no atmosphere for the 83 million residents, and the logistics of lunar oil extraction make the strait look trivial. NASA has filed a formal complaint. Iran's new neighbors (nobody) have no comment. On the bright side, property taxes are very low and the commute is non-existent.",
    center: [32.5, 53.5], zoom: 5
  },
  'Northern Canada': {
    text: "Iran is now located in Northern Canada, between Hudson Bay and the Arctic Ocean. The strait is gone, replaced by pleasant arctic tundra. Iran's climate has changed from 'hot desert' to 'please no.' Oil reserves are now trapped under permafrost. 83 million people are learning about parkas. Canada is too polite to complain but is visibly stressed. Tim Hortons has opened 4,000 locations overnight. The Northwest Passage just got significantly more geopolitically complicated.",
    center: [62, -90], zoom: 4
  }
};

// ===== OPEN MODAL =====
function openModal(id) {
  const data = modalData[id];
  const overlay = document.getElementById('modalOverlay');
  const inner = document.getElementById('modalInner');
  carrierCount = 0; drainClicks = 0; dolphinCount = 0;
  crudeClicks = 0; crudePrice = 69.42; crudeHistory = [69.42];

  let ih = '';
  if (data.interactive === 'canal') {
    ih = '<div class="map-container"><div class="leaflet-map" id="canalMap" style="height:400px;cursor:crosshair"></div><div class="map-controls"><button class="action-btn secondary" onclick="clearCanal()">CLEAR CANAL</button><span style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);letter-spacing:1px;">CLICK MAP TO PLACE WAYPOINTS</span></div></div><div class="canal-calc"><div class="canal-results"><div class="canal-result"><div class="cr-val" id="canalDist">0 km</div><div class="cr-label">Canal Length</div></div><div class="canal-result"><div class="cr-val" id="canalCost">$0</div><div class="cr-label">Estimated Cost</div></div><div class="canal-result"><div class="cr-val" id="canalYears">0 yrs</div><div class="cr-label">Construction Time</div></div></div><div class="canal-commentary" id="canalCommentary">Click on the map to start drawing your canal route. Each click adds a waypoint. Cost estimated at ~$1.2B per km for canal construction in difficult terrain.</div></div>';
  } else if (data.interactive === 'email') {
    ih = '<div class="diplo-email"><div class="email-header"><div class="email-field"><span class="ef-label">From:</span> concerned_citizen@fixthestrait.com</div><div class="email-field"><span class="ef-label">To:</span> everyone@middleeast.gov</div><div class="email-field"><span class="ef-label">CC:</span> united_nations@un.org, opec@opec.org, jeff@amazon.com (he has boats), elonmusk@x-twitter-x-whatever.com, your_mom@aol.com</div><div class="email-field"><span class="ef-label">BCC:</span> cia@langley.gov (don\'t tell anyone)</div><div class="email-field"><span class="ef-label">Subject:</span> RE: RE: RE: FWD: Quick Question About the Strait (URGENT — 3rd Follow-Up)</div><div class="email-field"><span class="ef-label">Priority:</span> <span style="color:var(--danger)">MAXIMUM</span></div><div class="email-field"><span class="ef-label">Attach:</span> motivational_poster.pptx, shared_custody_schedule.xlsx, strait_vibes_playlist.spotify</div></div><div class="email-body">Dear Esteemed/Tolerated Leaders of the Greater Hormuz Metropolitan Area,\n\nPer my last email (and the two before that which were also ignored), I\'m circling back regarding the Strait of Hormuz situation. As per the attached PowerPoint (slide 7 is particularly moving — it\'s a stock photo of a tanker captain crying), we\'d like to propose the following:\n\n1. A "Strait Sharing Schedule." Iran gets Monday-Thursday, UAE/Oman get Friday-Sunday. The US Navy gets federal holidays and every other Wednesday. Qatar gets the third Sunday of months that start with \'J.\' Oman can have April 14th because we like Oman.\n\n2. A mandatory "Feelings Circle" every quarter, held at the Marriott in Muscat. They have a breakfast buffet, which we feel could de-escalate most geopolitical conflicts. The omelette station alone has resolved three border disputes.\n\n3. A Strait of Hormuz group chat. We\'ve already created it. It\'s called "Hormuz &amp; Chill." Iran, please stop leaving the group. UAE, please stop changing the group name. America, please stop sending aircraft carrier selfies.\n\n4. Renaming the strait to something less threatening. Current proposals include: "The Friendship Funnel," "Oily McWaterway," "The Vibe Corridor," and "Steve."\n\n5. Installation of a giant "PLEASE BE NICE" neon sign at both ends of the strait, funded by whoever lost the most money last time someone tweeted about closing it. Current bid: BP, $4.7 billion.\n\nWe understand this is a complex geopolitical situation involving centuries of territorial disputes, nuclear negotiations, proxy wars, economic sanctions, and fundamental disagreements about sovereignty and international law.\n\nHowever, we\'ve made a Google Form. It has only 47 questions. Question 23 is a vibe check. Question 38 asks you to rate the strait on a scale of 1 to 10 ("1 = major chokepoint, 10 = chill waterway"). We expect honest answers.\n\nIf we do not hear back by Friday 5pm GMT, we will be forced to escalate this to... actually, we\'re not sure who\'s above all of you. God? The ocean? Poseidon? We\'ll figure it out. We have a committee forming a subcommittee to investigate the formation of a task force.\n\nWith aggressive optimism and moderate delusion,\nThe International Community\n\nP.S. We noticed Iran changed their out-of-office to "gone fishing in the strait." We don\'t think that\'s funny. But also it kind of is.\n\nP.P.S. Bahrain, you weren\'t on the original CC list but you keep replying-all anyway, so here we are. Please stop attaching your vacation photos.\n\nP.P.P.S. Whoever keeps marking these emails as spam: we see you, Kuwait. We have read receipts.\n\nP.P.P.P.S. The Marriott in Muscat is asking for a headcount. Please RSVP. They need to know about dietary restrictions. Last time, the Iranian delegation was upset about the hummus being labeled "Israeli-style" and we really can\'t do that again.\n\nP.P.P.P.P.S. We have now spent more time writing postscripts than actually negotiating. This may be part of the problem.</div><div class="email-stamp">UNDELIVERABLE — MAILBOX FULL<br><span style="font-size:12px;letter-spacing:1px;">auto-reply: "gone fishing in the strait"</span></div></div>';
  } else if (data.interactive === 'carriers') {
    ih = '<div class="carrier-game" id="carrierGame"><div class="carrier-visual" id="carrierVisual"><div class="carrier-land-top">IRAN</div><div class="carrier-water"></div><div class="carrier-land-bottom">OMAN</div></div><div class="carrier-stats"><div><div class="carrier-stat-val" id="carrierDeployed">0</div><div class="carrier-stat-label">Carriers Deployed</div></div><div><div class="carrier-stat-val" id="carrierCost">$0</div><div class="carrier-stat-label">Total Cost</div></div><div><div class="carrier-stat-val" id="carrierYears">0 yrs</div><div class="carrier-stat-label">Build Time</div></div></div><div class="carrier-controls"><button class="action-btn" onclick="deployCarrier()">DEPLOY CARRIER ($13B)</button><button class="action-btn secondary" onclick="resetCarriers()">RESET</button></div><div class="carrier-message" id="carrierMsg">&nbsp;</div></div>';
  } else if (data.interactive === 'drain') {
    ih = '<div class="drain-game"><div class="drain-progress"><div class="drain-fill" id="drainFill"></div><div class="drain-label" id="drainPercent">0.000000000%</div></div><div style="text-align:center;margin:16px 0;"><button class="action-btn" onclick="pumpWater()" style="font-size:14px;padding:16px 40px;">PUMP WATER</button></div><div class="drain-stats"><div class="drain-stat"><div class="ds-val" id="drainPumped">0 gallons</div><div class="ds-label">Water Pumped</div></div><div class="drain-stat"><div class="ds-val" id="drainRemaining">31.4 trillion gal</div><div class="ds-label">Water Remaining</div></div><div class="drain-stat"><div class="ds-val" id="drainETA">1,194 years</div><div class="ds-label">ETA at Current Rate</div></div><div class="drain-stat"><div class="ds-val" id="drainRefill">Constant</div><div class="ds-label">Ocean Refill Rate</div></div></div><div class="canal-commentary" id="drainCommentary">Click "PUMP WATER" to start draining the Strait of Hormuz. Each click pumps 50,000 gallons. Total needed: 31.4 trillion gallons. You can do this.</div></div>';
  } else if (data.interactive === 'trebuchet') {
    ih = '<div class="trebuchet-game"><div class="trebuchet-scene"><svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0a1a"/><stop offset="60%" stop-color="#0c1929"/><stop offset="100%" stop-color="#1a2744"/></linearGradient></defs><rect width="700" height="220" fill="url(#skyGrad)"/><rect x="180" y="148" width="440" height="22" fill="#0c1929" opacity="0.7"/><text x="400" y="162" fill="#3b82f6" font-family="monospace" font-size="8" text-anchor="middle" opacity="0.4">~ ~ ~ S T R A I T ~ ~ ~</text><rect x="0" y="170" width="200" height="50" fill="#2a2a28"/><text x="30" y="188" fill="#4a4640" font-family="monospace" font-size="9">LAUNCH SITE</text><rect x="620" y="170" width="80" height="50" fill="#2a2a28"/><text x="632" y="188" fill="#4a4640" font-family="monospace" font-size="9">TARGET</text><text x="200" y="198" fill="#4a464044" font-family="monospace" font-size="8">0km</text><text x="400" y="198" fill="#4a464044" font-family="monospace" font-size="8">16km</text><text x="610" y="198" fill="#4a464044" font-family="monospace" font-size="8">33km</text><rect x="50" y="155" width="100" height="15" fill="#4a4640" rx="2"/><circle cx="65" cy="170" r="6" fill="none" stroke="#4a4640" stroke-width="2"/><circle cx="135" cy="170" r="6" fill="none" stroke="#4a4640" stroke-width="2"/><line x1="75" y1="155" x2="100" y2="90" stroke="#7a756e" stroke-width="4" stroke-linecap="round"/><line x1="125" y1="155" x2="100" y2="90" stroke="#7a756e" stroke-width="4" stroke-linecap="round"/><line x1="85" y1="130" x2="115" y2="130" stroke="#7a756e" stroke-width="2"/><circle cx="100" cy="90" r="4" fill="#e8e4df"/><g id="trebArmG" style="transform-origin:100px 90px;transition:transform 0.4s cubic-bezier(0.2,0.8,0.3,1);"><line x1="55" y1="110" x2="165" y2="60" stroke="#e8e4df" stroke-width="3" stroke-linecap="round"/><rect x="45" y="110" width="20" height="22" fill="#7a756e" rx="3" stroke="#5a5650" stroke-width="1"/><text x="55" y="124" fill="#4a4640" font-family="monospace" font-size="7" text-anchor="middle">5t</text><line x1="165" y1="60" x2="175" y2="78" stroke="#ff6b2b" stroke-width="1.5" opacity="0.8"/><line x1="165" y1="60" x2="155" y2="78" stroke="#ff6b2b" stroke-width="1.5" opacity="0.8"/><path d="M153,78 Q165,85 177,78" fill="none" stroke="#ff6b2b" stroke-width="1.5" opacity="0.8"/></g><g id="trebBarrelG"><rect id="trebBarrel" x="158" y="68" width="14" height="18" fill="#ff6b2b" rx="3" stroke="#cc5520" stroke-width="1"/><line x1="160" y1="73" x2="170" y2="73" stroke="#cc5520" stroke-width="0.5"/><line x1="160" y1="80" x2="170" y2="80" stroke="#cc5520" stroke-width="0.5"/></g><g id="trebSplash" opacity="0"><text x="500" y="148" font-size="24">\uD83D\uDCA6</text><circle cx="510" cy="145" r="8" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.5"/><circle cx="510" cy="145" r="16" fill="none" stroke="#3b82f6" stroke-width="0.5" opacity="0.3"/></g><g id="trebSelfHit" opacity="0"><text x="80" y="148" font-size="24">\uD83D\uDCA5</text></g></svg></div><div class="trebuchet-slider"><label>Launch Angle:</label><input type="range" min="5" max="85" value="45" oninput="updateAngle(this.value)"><div class="angle-val" id="angleVal">45&deg;</div></div><div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;"><button class="action-btn" onclick="launchBarrel()">FIRE TREBUCHET</button><span style="font-family:var(--font-mono);font-size:11px;color:var(--text-dimmer);" id="launchSpeed">Required velocity: 569 m/s (Mach 1.7)</span></div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);"><div class="canal-result"><div class="cr-val" id="trebVelocity">569 m/s</div><div class="cr-label">Launch Velocity</div></div><div class="canal-result"><div class="cr-val" id="trebMach" style="color:var(--danger);">Mach 1.7</div><div class="cr-label">Speed vs Sound</div></div><div class="canal-result"><div class="cr-val" id="trebLanding" style="color:var(--danger);">Splash</div><div class="cr-label">Landing Status</div></div></div><div class="canal-commentary" id="trebCommentary">At 45&deg;, a barrel needs to travel at 569 m/s (Mach 1.7) to clear 33km. It would reach an altitude of 8.3km — cruising altitude for regional jets. The crude oil inside would be having the worst day of its geological existence.</div></div>';
  } else if (data.interactive === 'moveit') {
    var locs = Object.keys(iranLocations);
    ih = '<div class="map-container"><div class="leaflet-map" id="moveMap" style="height:350px"></div><div class="map-controls" style="flex-wrap:wrap;"><span style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);letter-spacing:1px;width:100%;margin-bottom:8px;">RELOCATE IRAN TO:</span>' + locs.map(function(loc) { return '<button class="action-btn secondary" onclick="moveIran(this,\'' + loc + '\')" style="font-size:10px;padding:8px 14px;">' + loc + '</button>'; }).join('') + '</div></div><div class="response-panel" id="moveResponse"><div class="advisor">Tectonic Advisor</div><em>Select a new location for Iran...</em></div>';
  } else if (data.interactive === 'straw') {
    ih = '<div class="straw-game"><div style="background:var(--bg-card);border:1px solid var(--border);padding:12px 16px;margin-bottom:16px;border-radius:4px;"><span style="font-family:var(--font-mono);font-size:10px;color:var(--danger);letter-spacing:2px;">&#9650; TOP SECRET — OPERATION KRAZY STRAW — EYES ONLY &#9650;</span></div><div class="straw-slider"><label>Straw Diameter:</label><input type="range" min="1" max="1000" value="100" oninput="updateStraw(this.value)"><div class="straw-val" id="strawVal">100 cm</div></div><div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);letter-spacing:1px;margin-bottom:8px;">STEALTH RATING:</div><div class="stealth-meter"><div class="stealth-fill" id="stealthFill" style="width:50%;background:var(--warn);"></div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--warn);margin-bottom:16px;" id="stealthLabel">SUSPICIOUS</div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);"><div class="canal-result"><div class="cr-val" id="strawFlow">2,400 bpd</div><div class="cr-label">Flow Rate / Straw</div></div><div class="canal-result"><div class="cr-val" id="strawCount">8,750</div><div class="cr-label">Straws Needed</div></div><div class="canal-result"><div class="cr-val" id="strawCost">$35B</div><div class="cr-label">Est. Cost</div></div></div><div class="canal-commentary" id="strawCommentary">At 100cm diameter, each straw moves about 2,400 barrels per day. You\'d need 8,750 straws running in parallel on the ocean floor. That\'s a lot of straws to hide. Iran\'s sonar operators are going to have questions.</div></div>';
  } else if (data.interactive === 'dolphins') {
    ih = '<div class="dolphin-game"><div class="dolphin-ocean" id="dolphinOcean"></div><div class="dolphin-stats"><div class="drain-stat"><div class="ds-val" id="dolphinRecruited">0</div><div class="ds-label">Dolphins Recruited</div></div><div class="drain-stat"><div class="ds-val" id="dolphinCapacity">0 bpd</div><div class="ds-label">Barrel Capacity / Day</div></div><div class="drain-stat"><div class="ds-val" id="dolphinMorale">Curious</div><div class="ds-label">Fleet Morale</div></div><div class="drain-stat"><div class="ds-val" id="dolphinUnion">Not Yet</div><div class="ds-label">Unionized?</div></div></div><div class="dolphin-controls"><button class="action-btn" onclick="recruitDolphin()">RECRUIT DOLPHIN ($100K)</button><button class="action-btn secondary" onclick="recruitDolphin10()">RECRUIT 10</button><span style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);">NEED: 21,000,000</span></div><div class="dolphin-message" id="dolphinMsg">&nbsp;</div></div>';
  } else if (data.interactive === 'flood') {
    ih = '<div class="flood-game"><div class="flood-slider" style="margin-bottom:16px;"><label style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);letter-spacing:1px;">SEA LEVEL RISE:</label><input type="range" min="0" max="70" value="0" step="0.5" oninput="updateFlood(this.value)" style="width:100%;margin:8px 0;"><div style="font-family:var(--font-brand);font-size:28px;font-weight:800;color:var(--blue);" id="floodVal">0 m</div></div><div class="stealth-meter"><div class="stealth-fill" id="floodFill" style="width:0%;background:var(--blue);"></div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dimmer);margin-bottom:16px;letter-spacing:1px;" id="floodLabel">CURRENT LEVELS \u2014 THE STRAIT IS STILL NARROW</div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);"><div class="canal-result"><div class="cr-val" id="floodWidth">33 km</div><div class="cr-label">Strait Width</div></div><div class="canal-result"><div class="cr-val" id="floodDisplaced">0</div><div class="cr-label">People Displaced</div></div><div class="canal-result"><div class="cr-val" id="floodCities">0</div><div class="cr-label">Cities Underwater</div></div></div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);margin-top:8px;"><div class="canal-result"><div class="cr-val" id="floodTemp">+0\u00B0C</div><div class="cr-label">Warming Required</div></div><div class="canal-result"><div class="cr-val" id="floodTimeline">Now</div><div class="cr-label">ETA (Business as Usual)</div></div><div class="canal-result"><div class="cr-val" id="floodCO2">0 Gt</div><div class="cr-label">Extra CO\u2082 Needed</div></div></div><div class="canal-commentary" id="floodCommentary">Drag the slider to raise sea levels. The strait will widen. Everything else will get worse. This is the only solution on the list that humanity is actually pursuing.</div></div>';
  } else if (data.interactive === 'crude') {
    ih = '<div class="crude-game"><div style="text-align:center;margin-bottom:16px;"><div style="font-family:var(--font-brand);font-size:32px;font-weight:800;color:var(--accent);">CRUDE<span style="color:var(--warn);">COIN</span>\u2122</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);letter-spacing:2px;">THE FUTURE OF PETROLEUM IS DIGITAL</div></div><div class="crude-chart"><canvas id="crudeCanvas" width="600" height="80"></canvas><div class="crude-chart-label" id="crudeChartLabel" style="color:var(--success);">$69.42</div></div><div style="text-align:center;margin:16px 0;"><button class="action-btn" onclick="mineCrude()" style="font-size:13px;padding:14px 36px;">MINE CRUDECOIN</button></div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);"><div class="canal-result"><div class="cr-val" id="crudeTokens">0</div><div class="cr-label">Tokens Mined</div></div><div class="canal-result"><div class="cr-val" id="crudeMarketCap">$0</div><div class="cr-label">Market Cap</div></div><div class="canal-result"><div class="cr-val" id="crudeEnergy" style="color:var(--danger);">0 MWh</div><div class="cr-label">Energy Wasted</div></div></div><div class="canal-commentary" id="crudeCommentary">Click MINE CRUDECOIN to begin tokenizing petroleum. Each token represents one barrel of crude oil that will never actually move. The future is now. The future is stupid.</div></div>';
  } else if (data.interactive === 'rename') {
    ih = '<div class="rename-game"><div style="background:var(--bg-card);border:1px solid var(--border);padding:16px;margin-bottom:16px;border-radius:4px;"><div style="font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:2px;margin-bottom:8px;">EXECUTIVE ORDER — STRATEGIC REBRANDING INITIATIVE</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);">Precedent: Gulf of Mexico \u2192 Gulf of America (Jan 2025)</div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);letter-spacing:1px;margin-bottom:8px;">SELECT NEW NAME:</div><div class="rename-options" id="renameOptions"><button class="action-btn secondary" onclick="renameTo(this,0)" style="font-size:11px;padding:10px 16px;">The Friendship Funnel\u2122</button><button class="action-btn secondary" onclick="renameTo(this,1)" style="font-size:11px;padding:10px 16px;">Freedom Strait\u2122</button><button class="action-btn secondary" onclick="renameTo(this,2)" style="font-size:11px;padding:10px 16px;">Steve</button><button class="action-btn secondary" onclick="renameTo(this,3)" style="font-size:11px;padding:10px 16px;">The Vibe Corridor\u2122</button><button class="action-btn secondary" onclick="renameTo(this,4)" style="font-size:11px;padding:10px 16px;">Gulf of America 2</button><button class="action-btn secondary" onclick="renameTo(this,5)" style="font-size:11px;padding:10px 16px;">Oily McWaterway</button></div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);margin-top:16px;"><div class="canal-result"><div class="cr-val" id="renameApproval">0</div><div class="cr-label">Countries Recognizing</div></div><div class="canal-result"><div class="cr-val" id="renameProtests">0</div><div class="cr-label">Formal Protests Filed</div></div><div class="canal-result"><div class="cr-val" id="renameCost">$0</div><div class="cr-label">Rebranding Cost</div></div></div><div class="stealth-meter" style="margin-top:12px;"><div class="stealth-fill" id="renameFill" style="width:0%;background:var(--accent);"></div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dimmer);margin-top:4px;margin-bottom:12px;letter-spacing:1px;" id="renameStatus">AWAITING EXECUTIVE ORDER</div><div class="response-panel" id="renameResponse"><div class="advisor">State Department Advisor</div><em>Select a new name for the Strait of Hormuz...</em></div></div>';
  } else if (data.interactive === 'timetravel') {
    ih = '<div class="timetravel-game"><div style="background:var(--bg-card);border:1px solid var(--border);padding:16px;margin-bottom:16px;border-radius:4px;"><div style="font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:2px;margin-bottom:4px;">TEMPORAL OPERATIONS DIVISION</div><div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dimmer);">"Don\'t try to understand it. Feel it." \u2014 Neil, <em>Tenet</em></div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);letter-spacing:1px;margin-bottom:8px;">SELECT TEMPORAL DESTINATION:</div><div class="rename-options" id="timeOptions"><button class="action-btn secondary" onclick="timeTravel(this,0)" style="font-size:11px;padding:10px 16px;">200 Million Years Ago</button><button class="action-btn secondary" onclick="timeTravel(this,1)" style="font-size:11px;padding:10px 16px;">14,000 Years Ago</button><button class="action-btn secondary" onclick="timeTravel(this,2)" style="font-size:11px;padding:10px 16px;">1507 AD</button><button class="action-btn secondary" onclick="timeTravel(this,3)" style="font-size:11px;padding:10px 16px;">1953 AD</button><button class="action-btn secondary" onclick="timeTravel(this,4)" style="font-size:11px;padding:10px 16px;">October 21, 2015</button><button class="action-btn secondary" onclick="timeTravel(this,5)" style="font-size:11px;padding:10px 16px;">Tomorrow</button></div><div class="canal-results" style="grid-template-columns:repeat(3,1fr);margin-top:16px;"><div class="canal-result"><div class="cr-val" id="ttParadoxes">0</div><div class="cr-label">Paradoxes Created</div></div><div class="canal-result"><div class="cr-val" id="ttEnergy">0 GW</div><div class="cr-label">Energy Required</div></div><div class="canal-result"><div class="cr-val" id="ttStraightFixed" style="color:var(--text-dim);">No</div><div class="cr-label">Strait Fixed?</div></div></div><div class="stealth-meter" style="margin-top:12px;"><div class="stealth-fill" id="ttFill" style="width:0%;background:var(--blue);"></div></div><div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dimmer);margin-top:4px;margin-bottom:12px;letter-spacing:1px;" id="ttStatus">TEMPORAL COORDINATES NOT SET</div><div class="response-panel" id="ttResponse"><div class="advisor">Temporal Advisor</div><em>Select a destination in time... What\'s happened, happened. Or has it?</em></div></div>';
  }

  var shareBtn = shareData[id] ? '<div class="share-bar"><button class="share-btn" onclick="shareSolution(\'' + id + '\')"><span class="share-icon">\u{1F4E4}</span> SHARE THIS SOLUTION</button></div>' : '';

  inner.innerHTML = '<div class="m-overline">' + data.overline + '</div><h2>' + data.title + '</h2>' + shareBtn + '<div class="m-body">' + data.body + '</div>' + ih + '<div class="real-talk">' + data.facts + '</div>';
  overlay.classList.add('active');
  requestAnimationFrame(function() { overlay.classList.add('visible'); setTimeout(function() { initMaps(id); }, 200); });
  document.body.style.overflow = 'hidden';

  // Update hash without scrolling
  history.replaceState(null, '', '#' + id);
}

// ===== MAP INIT =====
function initMaps(id) {
  if (id === 'canal') {
    window._canalMap = makeMap('canalMap', [24.5, 56], 6);
    window._canalPoints = []; window._canalMarkers = []; window._canalLine = null;
    L.marker([26.5, 56.3], {icon:L.divIcon({html:'<span style="color:var(--accent);font-family:var(--font-mono);font-size:9px;white-space:nowrap">STRAIT</span>',className:''})}).addTo(window._canalMap);
    window._canalMap.on('click', function(e) {
      window._canalPoints.push(e.latlng);
      window._canalMarkers.push(L.circleMarker(e.latlng, {radius:5,color:'#ff6b2b',fillColor:'#ff6b2b',fillOpacity:1}).addTo(window._canalMap));
      updateCanalRoute();
    });
  }
  if (id === 'moveit') {
    window._moveMap = makeMap('moveMap', [32, 53], 5);
    window._iranPolygon = L.polygon([[39.8,44.8],[39.4,48],[38.4,48.6],[37.3,54.8],[37.6,56.2],[36.7,57.1],[36.9,59.5],[35.6,61.2],[33.7,60.1],[31.3,61.8],[27.2,63.3],[26.6,57.2],[26.4,56.1],[25.7,54.7],[27.2,51.6],[28.9,50.8],[29.3,50.1],[30.4,48.4],[31.5,47.3],[32.4,45.4],[33.7,45.5],[35.1,46],[36.2,45.2],[37.7,44.8],[38.5,44.2],[39.8,44.8]], {color:'#ff6b2b',fillColor:'#ff6b2b',fillOpacity:0.2,weight:2}).addTo(window._moveMap);
    L.marker([32.5,53.5], {icon:L.divIcon({html:'<span style="color:#ff6b2b;font-family:var(--font-brand);font-size:14px;font-weight:800;">IRAN</span>',className:''})}).addTo(window._moveMap);
  }
}

// ===== CANAL =====
function updateCanalRoute() {
  var map = window._canalMap, pts = window._canalPoints;
  if (window._canalLine) map.removeLayer(window._canalLine);
  if (pts.length > 1) window._canalLine = L.polyline(pts, {color:'#ff6b2b',weight:4,opacity:0.8}).addTo(map);
  var totalDist = 0;
  for (var i = 1; i < pts.length; i++) totalDist += pts[i-1].distanceTo(pts[i]);
  var km = totalDist / 1000, cost = km * 1.2, yrs = km * 0.14;
  document.getElementById('canalDist').textContent = Math.round(km) + ' km';
  document.getElementById('canalCost').textContent = km < 1 ? '$0' : cost >= 1000 ? '$' + (cost/1000).toFixed(1) + 'T' : '$' + Math.round(cost) + 'B';
  document.getElementById('canalYears').textContent = Math.round(yrs) + ' yrs';
  var c = document.getElementById('canalCommentary');
  if (km < 1) c.textContent = 'Click on the map to start drawing your canal route. Each click adds a waypoint.';
  else if (km < 50) c.textContent = 'A modest start. At ' + Math.round(km) + 'km, your canal is shorter than the English Channel Tunnel. Keep going.';
  else if (km < 150) c.textContent = 'At ' + Math.round(km) + 'km, you\'re approaching Suez Canal territory. You\'re digging through sovereign territory that hasn\'t been informed.';
  else if (km < 400) c.textContent = 'Your ' + Math.round(km) + 'km canal is larger than the Suez. You\'re carving through mountains, desert, and at least three countries\' territorial integrity. Estimated wars started: ' + Math.min(Math.floor(km / 150) + 1, 7) + '.';
  else if (km < 800) c.textContent = 'At ' + Math.round(km) + 'km, this is a geological scar visible from space. You\'ve split the Arabian Peninsula in half. Congratulations, you\'ve created a new continent.';
  else c.textContent = 'Your ' + Math.round(km) + 'km trench has fundamentally altered Middle Eastern geography. Tectonic plates are filing complaints. Several fish species have already evolved to live in your canal. You are an expensive, irresponsible god.';
}

function clearCanal() {
  if (!window._canalMap) return;
  window._canalPoints = [];
  window._canalMarkers.forEach(function(m) { window._canalMap.removeLayer(m); });
  window._canalMarkers = [];
  if (window._canalLine) { window._canalMap.removeLayer(window._canalLine); window._canalLine = null; }
  document.getElementById('canalDist').textContent = '0 km';
  document.getElementById('canalCost').textContent = '$0';
  document.getElementById('canalYears').textContent = '0 yrs';
  document.getElementById('canalCommentary').textContent = 'Click on the map to start drawing your canal route.';
}

// ===== CARRIERS =====
var carrierMsgs = [
  [1,"First carrier deployed. Only 99 to go. The Navy hasn't noticed yet."],
  [5,"Five carriers. The Pentagon is getting suspicious phone calls."],
  [11,"You've used every aircraft carrier the US Navy currently has. Time to start building."],
  [20,"Congress is asking where the money went. Tell them it's for 'infrastructure.'"],
  [30,"Thirty carriers. Fishermen are filing lawsuits. Ship traffic backed up for miles."],
  [50,"HALFWAY! The bridge takes shape. Satellites can see it. Iran has tweeted about it."],
  [69,"Nice."],
  [75,"Carrier shipyard workers have unionized. They want hazard pay and better snacks."],
  [90,"Almost there! The plywood order alone has deforested three countries. IKEA is jealous."],
  [100,"BRIDGE COMPLETE! First truck crosses. Second truck falls between carriers 47 and 48. 'Partially successful.'"]
];

function deployCarrier() {
  if (carrierCount >= 110) return;
  carrierCount++;
  var vis = document.getElementById('carrierVisual');
  var c = document.createElement('div');
  c.className = 'carrier-icon';
  c.style.left = Math.min(carrierCount / 100, 1) * (vis.offsetWidth - 20) + 'px';
  if (carrierCount > 100) { c.style.opacity = '0.3'; c.style.background = 'var(--danger)'; }
  vis.appendChild(c);
  var cost = carrierCount * 13;
  document.getElementById('carrierDeployed').textContent = carrierCount;
  document.getElementById('carrierCost').textContent = cost >= 1000 ? '$' + (cost/1000).toFixed(2) + 'T' : '$' + cost + 'B';
  document.getElementById('carrierYears').textContent = Math.round(carrierCount * 0.45) + ' yrs';
  carrierMsgs.forEach(function(m) { if (m[0] === carrierCount) document.getElementById('carrierMsg').textContent = m[1]; });
  if (carrierCount === 100) setTimeout(function() {
    document.querySelectorAll('.carrier-icon').forEach(function(c) { c.style.top = (52 + (Math.random()-0.5)*20)+'px'; c.style.transition = 'top 2s ease-in-out'; });
    setTimeout(function() { document.getElementById('carrierMsg').textContent += " UPDATE: Carriers drifting apart. Bridge integrity: compromised. The plywood is wet."; }, 2000);
  }, 3000);
}

function resetCarriers() {
  carrierCount = 0;
  document.querySelectorAll('.carrier-icon').forEach(function(c) { c.remove(); });
  document.getElementById('carrierDeployed').textContent = '0';
  document.getElementById('carrierCost').textContent = '$0';
  document.getElementById('carrierYears').textContent = '0 yrs';
  document.getElementById('carrierMsg').innerHTML = '&nbsp;';
}

// ===== DRAIN =====
var TOTAL_GAL = 31.4e12, PUMP = 50000;
var drainMsgs = [[1,"First pump activated. The ocean hasn't noticed."],[10,"Half a million gallons! That's 0.0000016% of the total. Keep clicking."],[50,"2.5M gallons pumped. Water level dropped by approximately 0 millimeters."],[100,"5M gallons! Only 628 million more clicks to go. Your mouse is filing for workers' comp."],[200,"The fish have filed a complaint with the International Court of Justice."],[500,"25M gallons. The Indian Ocean sent reinforcements. You're being outpumped by evaporation."],[1000,"MILESTONE: 50M gallons! Estimated completion: year 3220 AD."]];

function pumpWater() {
  drainClicks++;
  var p = drainClicks * PUMP, pct = (p / TOTAL_GAL) * 100;
  document.getElementById('drainFill').style.width = Math.max(pct, 0.1) + '%';
  document.getElementById('drainPercent').textContent = pct < 0.001 ? pct.toFixed(12) + '%' : pct.toFixed(9) + '%';
  document.getElementById('drainPumped').textContent = p >= 1e9 ? (p/1e9).toFixed(1)+' billion gal' : p >= 1e6 ? (p/1e6).toFixed(1)+' million gal' : p.toLocaleString()+' gallons';
  document.getElementById('drainRemaining').textContent = ((TOTAL_GAL-p)/1e12).toFixed(6) + ' trillion gal';
  document.getElementById('drainETA').textContent = Math.round((Math.ceil(TOTAL_GAL/PUMP)-drainClicks)/525600).toLocaleString() + ' years';
  drainMsgs.forEach(function(m) { if (m[0] === drainClicks) document.getElementById('drainCommentary').textContent = m[1]; });
}

// ===== TREBUCHET =====
function updateAngle(val) {
  var a = parseInt(val), g = 9.81, s = Math.sin(2*a*Math.PI/180);
  var v = Math.sqrt(33000*g/Math.abs(s)), m = v/343;
  var h = v*v*Math.pow(Math.sin(a*Math.PI/180),2)/(2*g);
  document.getElementById('angleVal').textContent = a+'\u00B0';
  document.getElementById('trebVelocity').textContent = Math.round(v)+' m/s';
  document.getElementById('trebMach').textContent = 'Mach '+m.toFixed(1);
  document.getElementById('trebMach').style.color = m > 1 ? 'var(--danger)' : 'var(--warn)';
  document.getElementById('launchSpeed').textContent = 'Required velocity: '+Math.round(v)+' m/s (Mach '+m.toFixed(1)+')';
  var c = document.getElementById('trebCommentary'), l = document.getElementById('trebLanding');
  if (a < 15) { c.textContent = 'At '+a+'\u00B0, the barrel fires nearly horizontal at '+Math.round(v)+' m/s (Mach '+m.toFixed(1)+'). It skips across the water like a very expensive, very flammable stone. Max altitude: '+(h/1000).toFixed(1)+'km.'; l.textContent = 'Skipped'; l.style.color = 'var(--accent)'; }
  else if (a > 75) { c.textContent = 'At '+a+'\u00B0, the barrel goes nearly straight up to '+(h/1000).toFixed(1)+'km, then comes straight back down on your own side. You\'ve shelled yourself. This is technically a war crime against your own launch site.'; l.textContent = 'Self-Hit'; l.style.color = 'var(--warn)'; }
  else { c.textContent = 'At '+a+'\u00B0, a barrel needs '+Math.round(v)+' m/s (Mach '+m.toFixed(1)+') to clear 33km. It reaches '+(h/1000).toFixed(1)+'km'+(h>10000?' \u2014 above commercial cruising altitude. The FAA is involved.':' \u2014 roughly cruising altitude for regional jets.')+' The crude oil is having the worst day of its geological existence.'; l.textContent = 'Splash'; l.style.color = 'var(--danger)'; }
}

function launchBarrel() {
  if (trebAnimating) return; trebAnimating = true;
  var a = parseInt(document.querySelector('.trebuchet-slider input').value);
  var arm = document.getElementById('trebArmG'), barrel = document.getElementById('trebBarrel');
  var barrelG = document.getElementById('trebBarrelG'), splash = document.getElementById('trebSplash'), selfHit = document.getElementById('trebSelfHit');
  splash.setAttribute('opacity','0'); selfHit.setAttribute('opacity','0');
  barrel.setAttribute('x','158'); barrel.setAttribute('y','68'); barrelG.style.opacity = '1';
  arm.style.transform = 'rotate(-100deg)';
  setTimeout(function() {
    var self = a > 75, skip = a < 15;
    var endX = self ? 90 : (skip ? 620 : 480+Math.random()*80), endY = 145;
    var peak = Math.min(a*1.5, 120), t = 0, spd = self ? 0.025 : 0.018;
    (function anim() {
      t += spd;
      if (t >= 1) {
        barrelG.style.opacity = '0';
        if (self) { selfHit.setAttribute('opacity','1'); setTimeout(function(){selfHit.setAttribute('opacity','0');},1500); }
        else { splash.querySelector('text').setAttribute('x', endX-10); splash.querySelector('circle').setAttribute('cx', endX); splash.querySelectorAll('circle')[1].setAttribute('cx', endX); splash.setAttribute('opacity','1'); setTimeout(function(){splash.setAttribute('opacity','0');},1500); }
        setTimeout(function() { arm.style.transform=''; barrel.setAttribute('x','158'); barrel.setAttribute('y','68'); barrelG.style.opacity='1'; trebAnimating=false; }, 2000);
        return;
      }
      var x = 165+(endX-165)*t, y = 68+(endY-68)*t - peak*Math.sin(Math.PI*t);
      barrel.setAttribute('x', x-7); barrel.setAttribute('y', y-9);
      requestAnimationFrame(anim);
    })();
  }, 350);
}

// ===== MOVE IRAN =====
function moveIran(btn, loc) {
  document.querySelectorAll('.map-controls .action-btn').forEach(function(b) { b.style.background=''; b.style.color=''; });
  btn.style.background='var(--accent)'; btn.style.color='var(--bg)';
  var data = iranLocations[loc], map = window._moveMap;
  if (loc === 'The Moon') { document.getElementById('moveResponse').innerHTML = '<div class="advisor">Tectonic Advisor \u2014 '+loc+'</div>'+data.text; return; }
  map.flyTo(data.center, data.zoom, {duration:2});
  if (window._iranGhost) map.removeLayer(window._iranGhost);
  if (window._iranLabel) map.removeLayer(window._iranLabel);
  var off = [data.center[0]-32.5, data.center[1]-53.5];
  var nc = window._iranPolygon.getLatLngs()[0].map(function(ll) { return [ll.lat+off[0], ll.lng+off[1]]; });
  window._iranGhost = L.polygon(nc, {color:'#ff6b2b',fillColor:'#ff6b2b',fillOpacity:0.3,weight:2,dashArray:'6,6'}).addTo(map);
  window._iranLabel = L.marker(data.center, {icon:L.divIcon({html:'<span style="color:#ff6b2b;font-family:var(--font-brand);font-size:12px;font-weight:800;">IRAN (relocated)</span>',className:''})}).addTo(map);
  document.getElementById('moveResponse').innerHTML = '<div class="advisor">Tectonic Advisor \u2014 '+loc+'</div>'+data.text;
}

// ===== STRAW =====
function updateStraw(val) {
  var d = parseInt(val), dm = d/100;
  document.getElementById('strawVal').textContent = d >= 100 ? (d/100).toFixed(1)+' m' : d+' cm';
  var area = Math.PI*Math.pow(dm/2,2), flow = area*2*86400/0.159, need = Math.ceil(21e6/flow);
  var cost = need * 0.004 * 33;
  document.getElementById('strawFlow').textContent = flow >= 1e6 ? (flow/1e6).toFixed(1)+'M bpd' : flow >= 1000 ? Math.round(flow/1000)+'K bpd' : Math.round(flow)+' bpd';
  document.getElementById('strawCount').textContent = need.toLocaleString();
  document.getElementById('strawCost').textContent = cost >= 1000 ? '$'+(cost/1000).toFixed(1)+'T' : '$'+Math.round(cost)+'B';
  var f = document.getElementById('stealthFill'), l = document.getElementById('stealthLabel');
  if (d<=5) { f.style.width='95%'; f.style.background='var(--success)'; l.textContent='VIRTUALLY INVISIBLE (but useless)'; l.style.color='var(--success)'; }
  else if (d<=20) { f.style.width='80%'; f.style.background='var(--success)'; l.textContent='COVERT (garden hose energy)'; l.style.color='var(--success)'; }
  else if (d<=100) { f.style.width='50%'; f.style.background='var(--warn)'; l.textContent="SUSPICIOUS (that's a big straw)"; l.style.color='var(--warn)'; }
  else if (d<=300) { f.style.width='25%'; f.style.background='var(--accent)'; l.textContent='COMPROMISED (Iran is calling)'; l.style.color='var(--accent)'; }
  else if (d<=600) { f.style.width='10%'; f.style.background='var(--danger)'; l.textContent='DETECTED (visible from space)'; l.style.color='var(--danger)'; }
  else { f.style.width='2%'; f.style.background='var(--danger)'; l.textContent="WHAT STRAW? THAT'S A TUNNEL"; l.style.color='var(--danger)'; }
  var c = document.getElementById('strawCommentary');
  if (d<=5) c.textContent='At '+d+'cm, your straw is a garden hose. Maximum stealth, minimum utility. You need '+need.toLocaleString()+' of them. The ocean floor would look like spaghetti.';
  else if (d<=50) c.textContent='At '+d+'cm, each straw moves about '+(flow>=1000?Math.round(flow/1000)+'K':Math.round(flow))+' bpd. You need '+need.toLocaleString()+' straws on the ocean floor. Each one is about the width of a pizza. Iran\'s fishermen have questions.';
  else if (d<=200) c.textContent='At '+(d/100).toFixed(1)+'m diameter, each straw is a proper pipe. You need '+need.toLocaleString()+'. The "covert" part of this operation is aspirational. Submarine crews keep bumping into your straws.';
  else if (d<=500) c.textContent='Your '+(d/100).toFixed(1)+'m "straw" is larger than most subway tunnels. Iran can see it on sonar, satellite, and also just by looking. You need '+need.toLocaleString()+'. That\'s a metro system, not a straw.';
  else c.textContent='At '+(d/100).toFixed(1)+'m, you\'ve invented the undersea highway. Only '+need.toLocaleString()+' needed. Each is large enough to drive a truck through. Iran sent a diplomatic note that just says "we can see you." The word "straw" no longer applies.';
}

// ===== DOLPHINS =====
var dolphMsgs = [[1,"First recruit! Name: Flipper Jr. Attitude: willing. Carrying capacity: concerning."],[5,"Five dolphins. They've formed a pod. Asking about benefits and PTO."],[10,"Ten dolphins. Pod leader elected: Steve. Steve wants dental."],[25,"They're requesting a formal employment contract. Saturdays off, fish allowance."],[50,"Fifty dolphins! They can move 50 barrels/day. Only 20,999,950 more to go."],[100,"ONE HUNDRED DOLPHINS. Steve promoted to Regional Manager. Still wants dental."],[200,"The dolphins have unionized. 'United Cetacean Petroleum Workers Local 1.' First demand: no night shifts."],[500,"BREAKING: All captive dolphins recruited. Now recruiting wild ones. They're less enthusiastic."],[1000,"1,000 dolphins. 7 trips/day each = 7,000 barrels. You need 21 million. The math is not mathing."]];

function recruitDolphin() { addDolphins(1); }
function recruitDolphin10() { addDolphins(10); }

function addDolphins(n) {
  dolphinCount += n;
  var oc = document.getElementById('dolphinOcean');
  for (var i = 0; i < Math.min(n,5); i++) {
    if (oc.children.length < 40) {
      var d = document.createElement('span'); d.className='dolphin-emoji'; d.textContent='\uD83D\uDC2C';
      d.style.animationDelay = (Math.random()*2)+'s'; oc.appendChild(d);
    }
  }
  var cap = dolphinCount * 7;
  document.getElementById('dolphinRecruited').textContent = dolphinCount.toLocaleString();
  document.getElementById('dolphinCapacity').textContent = cap >= 1e6 ? (cap/1e6).toFixed(1)+'M bpd' : cap >= 1000 ? Math.round(cap/1000)+'K bpd' : cap+' bpd';
  var mo, un;
  if (dolphinCount<10) { mo='Curious'; un='Not Yet'; }
  else if (dolphinCount<50) { mo='Cautiously Optimistic'; un='Discussing'; }
  else if (dolphinCount<200) { mo='Demanding Benefits'; un='Forming'; }
  else if (dolphinCount<500) { mo='On Strike (Tuesdays)'; un='Local #1'; }
  else { mo='Mutinous'; un='Affiliated with AFL-CIO'; }
  document.getElementById('dolphinMorale').textContent = mo;
  document.getElementById('dolphinMorale').style.color = dolphinCount<50?'var(--success)':dolphinCount<200?'var(--warn)':'var(--danger)';
  document.getElementById('dolphinUnion').textContent = un;
  dolphMsgs.forEach(function(m) { if (m[0]===dolphinCount) document.getElementById('dolphinMsg').textContent = m[1]; });
}

// ===== CRUDECOIN =====
var crudeMsgs = [[1,"First CrudeCoin mined! One barrel of oil that will never move. The blockchain is 'working.'"],[5,"5 tokens. An influencer tweeted about CrudeCoin. Price 'going up.' (It's not.)"],[10,"TechCrunch: 'Is CrudeCoin the Future of Energy?' (No.)"],[25,"A VC firm invested $400M. They don't understand what it does. Neither do we."],[50,"Listed on 3 exchanges. Trading volume: 'suspicious.' The SEC is watching."],[75,"Someone created 'Bored Barrels' NFT collection. Floor price: 0.001 ETH."],[100,"100 CrudeCoins! Energy used to mine them exceeds energy in the oil they represent. Irony noted."],[150,"BREAKING: CrudeCoin founder (you) accused of securities fraud. Defense: 'it was supposed to be funny.'"]];

function mineCrude() {
  crudeClicks++;
  var ch = (Math.random()-0.52)*crudePrice*0.15;
  crudePrice = Math.max(0.01, crudePrice+ch);
  crudeHistory.push(crudePrice);
  if (crudeHistory.length > 60) crudeHistory.shift();
  if (crudeClicks % 20 === 0 && crudeClicks > 10) {
    crudePrice *= 0.3; crudeHistory.push(crudePrice);
    document.getElementById('crudeCommentary').textContent = 'FLASH CRASH: CrudeCoin lost 70% of its value in one block. The Discord is on fire. Someone posted "this is good for CrudeCoin" unironically.';
  }
  var mc = crudeClicks*crudePrice, en = crudeClicks*2.4;
  document.getElementById('crudeTokens').textContent = crudeClicks;
  document.getElementById('crudeMarketCap').textContent = mc >= 1000 ? '$'+(mc/1000).toFixed(1)+'K' : '$'+Math.round(mc);
  document.getElementById('crudeEnergy').textContent = en >= 1000 ? (en/1000).toFixed(1)+' GWh' : Math.round(en)+' MWh';
  var lb = document.getElementById('crudeChartLabel');
  lb.textContent = '$'+crudePrice.toFixed(2);
  lb.style.color = crudePrice>50?'var(--success)':crudePrice>20?'var(--warn)':'var(--danger)';
  drawCrudeChart();
  crudeMsgs.forEach(function(m) { if (m[0]===crudeClicks) document.getElementById('crudeCommentary').textContent = m[1]; });
}

function drawCrudeChart() {
  var cv = document.getElementById('crudeCanvas'); if (!cv) return;
  var ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
  ctx.clearRect(0,0,w,h);
  var d = crudeHistory; if (d.length < 2) return;
  var mx = Math.max.apply(null,d)*1.1, mn = Math.min.apply(null,d)*0.9, r = mx-mn||1;
  var col = crudePrice>50?'#22c55e':crudePrice>20?'#eab308':'#ef4444';
  ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 2;
  d.forEach(function(p,i) {
    var x = (i/(d.length-1))*w, y = h-((p-mn)/r)*(h-10)-5;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke(); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
  ctx.fillStyle = col+'11'; ctx.fill();
}

// ===== FLOOD =====
function updateFlood(val) {
  var m = parseFloat(val);
  document.getElementById('floodVal').textContent = m.toFixed(1) + ' m';

  var width = 33 + m * 3.5;
  document.getElementById('floodWidth').textContent = Math.round(width) + ' km';

  var displaced = 0;
  if (m <= 1) displaced = Math.round(m * 150e6);
  else if (m <= 5) displaced = Math.round(150e6 + (m - 1) * 200e6);
  else if (m <= 10) displaced = Math.round(950e6 + (m - 5) * 300e6);
  else if (m <= 30) displaced = Math.round(2.45e9 + (m - 10) * 100e6);
  else displaced = Math.round(4.45e9 + (m - 30) * 50e6);
  var dispStr = displaced >= 1e9 ? (displaced / 1e9).toFixed(1) + ' billion' : displaced >= 1e6 ? Math.round(displaced / 1e6).toLocaleString() + ' million' : displaced.toLocaleString();
  document.getElementById('floodDisplaced').textContent = dispStr;

  var cities = m < 1 ? Math.round(m * 20) : m < 5 ? Math.round(20 + (m - 1) * 40) : m < 10 ? Math.round(180 + (m - 5) * 30) : m < 30 ? Math.round(330 + (m - 10) * 15) : Math.round(630 + (m - 30) * 5);
  document.getElementById('floodCities').textContent = cities;

  var temp = m < 1 ? 1.2 + m * 0.8 : m < 10 ? 2 + m * 0.5 : 7 + (m - 10) * 0.2;
  document.getElementById('floodTemp').textContent = '+' + temp.toFixed(1) + '\u00B0C';

  var timeline;
  if (m < 0.5) timeline = '2050';
  else if (m < 1) timeline = '2100';
  else if (m < 3) timeline = '2200';
  else if (m < 7) timeline = '2500';
  else if (m < 15) timeline = '3000+';
  else if (m < 40) timeline = '5000+';
  else timeline = 'Geological';
  document.getElementById('floodTimeline').textContent = timeline;

  var co2 = Math.round(m * 200);
  document.getElementById('floodCO2').textContent = co2 >= 1000 ? (co2 / 1000).toFixed(1) + ' Tt' : co2 + ' Gt';

  var pct = (m / 70) * 100;
  var fill = document.getElementById('floodFill');
  fill.style.width = pct + '%';
  if (m < 1) { fill.style.background = 'var(--blue)'; }
  else if (m < 5) { fill.style.background = 'var(--warn)'; }
  else if (m < 15) { fill.style.background = 'var(--accent)'; }
  else { fill.style.background = 'var(--danger)'; }

  var label = document.getElementById('floodLabel');
  if (m < 0.5) { label.textContent = 'CURRENT TRAJECTORY \u2014 BARELY NOTICEABLE'; label.style.color = 'var(--blue)'; }
  else if (m < 1) { label.textContent = 'PARIS AGREEMENT FAILED \u2014 MIAMI IS NERVOUS'; label.style.color = 'var(--blue)'; }
  else if (m < 3) { label.textContent = 'MALDIVES GONE \u2014 NETHERLANDS ON NOTICE'; label.style.color = 'var(--warn)'; }
  else if (m < 7) { label.textContent = 'COASTAL APOCALYPSE \u2014 STRAIT GETTING WIDER THO'; label.style.color = 'var(--warn)'; }
  else if (m < 15) { label.textContent = 'GREENLAND MELTED \u2014 NEW YORK IS ATLANTIS'; label.style.color = 'var(--accent)'; }
  else if (m < 40) { label.textContent = 'ANTARCTICA JOINING IN \u2014 MAP NEEDS REDRAWING'; label.style.color = 'var(--danger)'; }
  else { label.textContent = 'FULL MELT \u2014 STRAIT NO LONGER EXISTS (NOR DOES MUCH ELSE)'; label.style.color = 'var(--danger)'; }

  var c = document.getElementById('floodCommentary');
  if (m < 0.5) c.textContent = 'At ' + m.toFixed(1) + 'm, this is roughly where we\'re headed by 2050. The strait is still 33km wide. Bangladesh is already stressed. You\'ve solved nothing but you\'re on track.';
  else if (m < 1) c.textContent = 'At ' + m.toFixed(1) + 'm, low-lying island nations are evacuating. ' + dispStr + ' displaced. The strait has widened by a generous ' + Math.round(m * 3.5) + 'km. Tanker captains do not notice. Florida notices.';
  else if (m < 3) c.textContent = m.toFixed(1) + 'm of rise. The Maldives are a memory. ' + dispStr + ' displaced. The strait is ' + Math.round(width) + 'km wide now \u2014 marginally better. You\'ve destroyed several countries to save 15 minutes of tanker routing.';
  else if (m < 7) c.textContent = m.toFixed(1) + 'm! ' + dispStr + ' displaced. ' + cities + ' cities underwater. The strait is ' + Math.round(width) + 'km wide. Iran\'s coastline has moved inland. Oil terminals are also underwater, which rather defeats the purpose.';
  else if (m < 15) c.textContent = 'Greenland is ice-free. ' + m.toFixed(1) + 'm of rise. ' + dispStr + ' people displaced. The strait is ' + Math.round(width) + 'km wide. The Persian Gulf has expanded into parts of Iraq and Kuwait. Most oil infrastructure is submerged. You did it! At an unimaginable cost!';
  else if (m < 40) c.textContent = m.toFixed(1) + 'm. Antarctica is melting. ' + dispStr + ' displaced. The entire geography of the Middle East has changed. The "strait" is now an open sea. There is no chokepoint. There are also no port cities, no refineries, and no civilization to ship oil to. Victory?';
  else c.textContent = m.toFixed(1) + 'm. Maximum melt. The strait is ' + Math.round(width) + 'km wide \u2014 basically open ocean. ' + dispStr + ' displaced. ' + cities + ' cities gone. The world map is unrecognizable. London, Shanghai, New York, Mumbai \u2014 all underwater. But hey, tankers have more room. Mission accomplished. Was it worth it? Absolutely not.';
}

// ===== RENAME =====
var renameData = [
  {
    name: 'The Friendship Funnel\u2122',
    approval: 3, protests: 47, cost: 4.2,
    fill: 15, fillColor: 'var(--warn)', status: 'INTERNATIONAL RIDICULE',
    response: 'The executive order was signed at 3am. By 3:02am, Iran had issued a statement calling it "an act of cartographic aggression." By 3:15am, the name was trending on Twitter. By 3:30am, someone had already registered friendshipfunnel.com and was selling t-shirts. The UAE ambassador was overheard saying "we suggested this as a joke in 2024." Three countries recognize the new name: the US, Palau (by accident), and a micronation in Nevada that doesn\'t count. Google Maps is showing both names. Apple Maps is showing neither. The strait itself has no comment but is widely believed to be embarrassed.'
  },
  {
    name: 'Freedom Strait\u2122',
    approval: 1, protests: 89, cost: 6.8,
    fill: 8, fillColor: 'var(--danger)', status: 'GEOPOLITICAL INCIDENT',
    response: 'The name "Freedom Strait" was announced at a press conference where the word "freedom" was used 47 times in 12 minutes. Iran responded by renaming the Persian Gulf to the "Gulf of Iranian Sovereignty" and the entire Indian Ocean to "Not America\'s Ocean." Russia renamed the Bering Strait to "Definitely Russia\'s Strait." China renamed the South China Sea to "The South China Sea (This Time We Mean It)." Within 72 hours, every country on Earth had renamed at least one body of water out of spite. The International Hydrographic Organization dissolved itself. Google Maps crashed. The UN held an emergency session. The original strait remains functionally identical. Oil prices rose $4 per barrel due to "naming uncertainty."'
  },
  {
    name: 'Steve',
    approval: 12, protests: 23, cost: 0.8,
    fill: 40, fillColor: 'var(--success)', status: 'SURPRISINGLY POPULAR',
    response: 'Against all expectations, "Steve" is performing well. The name polled at 67% favorability in focus groups, outperforming every other option including the strait\'s actual name. Iran\'s foreign minister was asked about "Steve" in a press conference and visibly struggled not to laugh before saying "we reject this" with what reporters described as "a twinkle in his eye." Nobody can threaten to "close Steve." News anchors can\'t say "tensions rising in Steve" with a straight face. Oil traders are confused but amused. A petition to rename all geopolitical chokepoints to first names has gained 2 million signatures. The Suez Canal is now "Karen." The Bosphorus is "Dave." International tension has decreased 12% purely through vibes. Steve the dolphin (Solution 02) has filed a trademark dispute.'
  },
  {
    name: 'The Vibe Corridor\u2122',
    approval: 7, protests: 31, cost: 3.1,
    fill: 25, fillColor: 'var(--accent)', status: 'BRANDING CONSULTANTS DEPLOYED',
    response: 'McKinsey was hired for $340M to develop "The Vibe Corridor" brand identity. Their 400-page deck includes a new color palette (sunset orange and "petroleum teal"), a mascot (a tanker with sunglasses named "Captain Chill"), and a Spotify playlist for ships transiting the corridor. Iran called the rebrand "the most American thing they have ever seen," which is both an insult and a compliment depending on who you ask. The branding package includes suggested Instagram captions for oil tankers: "just vibing through the corridor \u2728 #blessed #oil #corridorlife." Tourism boards from Oman and UAE are cautiously interested. The strait\'s TripAdvisor rating improved from 2.3 to 3.1 stars overnight.'
  },
  {
    name: 'Gulf of America 2',
    approval: 1, protests: 142, cost: 0,
    fill: 5, fillColor: 'var(--danger)', status: 'UNIVERSAL CONDEMNATION',
    response: 'The announcement that the Strait of Hormuz would become "Gulf of America 2" was met with what diplomats described as "a silence so loud it registered on seismographs." Mexico immediately renamed the Gulf of America back to the Gulf of Mexico "plus the Strait of Hormuz is also Mexico\'s now." Iran, in an unprecedented move, agreed with Mexico. The Arab League issued a joint statement consisting entirely of the word "no" in 22 languages. The UK called it "a bit much, even for you lot." Australia called it "yeah nah." Canada said nothing but was visibly disappointed. The name "Gulf of America 2" implies there will be a Gulf of America 3, and 14 countries have preemptively filed objections.'
  },
  {
    name: 'Oily McWaterway',
    approval: 0, protests: 67, cost: 1.2,
    fill: 10, fillColor: 'var(--warn)', status: 'REJECTED BY LITERALLY EVERYONE',
    response: 'The "Boaty McBoatface" strategy was attempted and has failed even harder than the original. The name was proposed via public poll, won with 89% of the vote, and was immediately vetoed by every government on Earth simultaneously \u2014 the first time this has happened in the history of international relations. The UN Security Council achieved unanimous agreement for the first time since 1945, specifically to block the name "Oily McWaterway." Iran and the US issued a joint statement: "We agree on nothing except that this name is unacceptable." The British public, who started this naming convention, expressed pride. The name lives on in memes. The strait remains unnamed in protest by 14 countries who refuse to call it anything now.'
  }
];

function renameTo(btn, idx) {
  document.querySelectorAll('#renameOptions .action-btn').forEach(function(b) { b.style.background=''; b.style.color=''; });
  btn.style.background='var(--accent)'; btn.style.color='var(--bg)';
  var d = renameData[idx];
  document.getElementById('renameApproval').textContent = d.approval + ' / 195';
  document.getElementById('renameApproval').style.color = d.approval > 5 ? 'var(--warn)' : 'var(--danger)';
  document.getElementById('renameProtests').textContent = d.protests;
  document.getElementById('renameProtests').style.color = 'var(--danger)';
  document.getElementById('renameCost').textContent = d.cost > 0 ? '$' + d.cost + 'B' : '$0 (priceless)';
  var fill = document.getElementById('renameFill');
  fill.style.width = d.fill + '%'; fill.style.background = d.fillColor;
  document.getElementById('renameStatus').textContent = d.status;
  document.getElementById('renameStatus').style.color = d.fillColor;
  document.getElementById('renameResponse').innerHTML = '<div class="advisor">State Department Advisor \u2014 "' + d.name + '"</div>' + d.response;
}

// ===== TIME TRAVEL =====
var ttData = [
  {
    era: '200 Million Years Ago',
    paradoxes: '\u221E', energy: '10\u00B2\u2074 GW', fixed: 'Technically',
    fill: 100, fillColor: 'var(--danger)', status: 'FULL TEMPORAL CATASTROPHE',
    response: 'You arrive 200 million years ago. Pangaea is still intact. The Arabian and Eurasian plates are nowhere near each other. There is no Persian Gulf, no strait, no oil, no humans, no problem. You plant a series of "DO NOT CONVERGE" signs along the proto-plate boundaries. You feel accomplished.<br><br>Then you realize: preventing the plate collision means no Zagros Mountains, no Persian Gulf basin, no trapped organic matter, no oil. You haven\'t bypassed the strait. You\'ve deleted the oil. The entire global economy you were trying to protect doesn\'t exist. You\'ve also just erased 200 million years of evolution. Every human who ever lived: gone. Including you. But you\'re standing here. This is a paradox. The universe is confused. A small dinosaur looks at your "DO NOT CONVERGE" sign and eats it.<br><br><em>"What\'s happened, happened. Except you\'ve unhappened everything."</em>'
  },
  {
    era: '14,000 Years Ago',
    paradoxes: '847', energy: '10\u00B9\u2078 GW', fixed: 'Briefly',
    fill: 70, fillColor: 'var(--accent)', status: 'TEMPORAL FLOODING PARADOX',
    response: 'You arrive at the end of the last ice age. Sea levels are 120 meters lower. The Persian Gulf is a river valley. There is no strait because there is no sea. You plant a flag and declare the problem solved.<br><br>Then the ice starts melting. You watch the water rise. Over the next several thousand years, the valley floods and the Strait of Hormuz forms again. You\'ve simply arrived too early for the party. You try to prevent the ice from melting by \u2014 wait, that\'s Solution 10 in reverse. You\'re going in circles. Literally. You are trapped in a time loop of your own making.<br><br>A hunter-gatherer sees your flag, which reads "PROPERTY OF TEMPORAL OPERATIONS DIVISION," and uses it to catch fish. This is the most useful thing the Temporal Operations Division has ever produced.<br><br><em>"We tried to run before we could walk. We can barely crawl." \u2014 Tenet mission debrief, probably</em>'
  },
  {
    era: '1507 AD',
    paradoxes: '12', energy: '1.21 GW', fixed: 'No',
    fill: 35, fillColor: 'var(--warn)', status: 'DIPLOMATIC TIME CRIME',
    response: 'You arrive in 1507, the year the Portuguese under Afonso de Albuquerque seized the island of Hormuz and established control of the strait. Your plan: convince Albuquerque that the strait isn\'t worth it. "Trust me," you say, "in 500 years this is going to be everyone\'s problem."<br><br>Albuquerque does not speak English. He does not understand why you\'re wearing synthetic fabrics. He is, however, very interested in your iPhone, which he believes is witchcraft. You are arrested. Your iPhone dies because there are no chargers in 1507. You are tried for sorcery. Your defense \u2014 "I\'m from the future and the Strait of Hormuz will cause geopolitical anxiety" \u2014 is not well received.<br><br>The Portuguese seize the strait anyway. History is unchanged. You are now a footnote in a 16th-century Portuguese legal document about a "strange prophet who carried a black mirror."<br><br><em>"Where we\'re going, we don\'t need roads." You did, actually. Roads would have helped.</em>'
  },
  {
    era: '1953 AD',
    paradoxes: '2,847', energy: '4.4 GW', fixed: 'Made It Worse',
    fill: 85, fillColor: 'var(--danger)', status: 'CATASTROPHIC BUTTERFLY EFFECT',
    response: 'You arrive in 1953, the year of the CIA-backed coup that overthrew Iran\'s Prime Minister Mossadegh. Your reasoning: prevent the coup, change the trajectory of US-Iran relations, and maybe they\'ll be chill about the strait by 2026.<br><br>You approach the CIA operatives and say "don\'t do this, it causes 70 years of problems." They ask for your credentials. You show them your Temporal Operations Division badge. They\'ve never heard of it. Because it doesn\'t exist yet. Because you haven\'t founded it yet. Because you\'re in 1953. Temporal bureaucracy is a nightmare.<br><br>The coup happens anyway. You\'ve changed nothing except that the CIA now has a classified file titled "TEMPORAL WEIRDO \u2014 STRAIT OBSESSION \u2014 POSSIBLE ASSET, POSSIBLE LUNATIC." This file is rediscovered in 2025 and leaked. It becomes a meme. The strait situation is now worse because Iran thinks America has had time travelers AND still couldn\'t fix relations.<br><br><em>Great Scott. You\'ve made a terrible mistake. 1.21 gigawatts of terrible mistake.</em>'
  },
  {
    era: 'October 21, 2015',
    paradoxes: '3', energy: '1.21 GW', fixed: 'No (But Cool Hoverboard)',
    fill: 20, fillColor: 'var(--blue)', status: 'WRONG FRANCHISE',
    response: 'You arrive on October 21, 2015 \u2014 the exact date Marty McFly traveled to in <em>Back to the Future Part II</em>. You chose this date because you assumed the future would have the technology to fix the strait. It does not. There are no hoverboards (the real kind), no flying cars, and no Mr. Fusion. The Cubs did win the World Series though, which Doc Brown got right, but a year late.<br><br>You attempt to purchase a sports almanac to fund the strait-fixing operation. A wild-eyed old man in a Hawaiian shirt tells you this is "exactly the kind of thing that creates alternate timelines." He seems to know a lot about this. He also has a DeLorean. You do not ask follow-up questions.<br><br>You invest in Bitcoin instead. By 2025 you\'re wealthy enough to fund the strait operation but realize all the solutions are the ones already on this website. You\'ve created a time loop. You are now the reason this website exists. The flux capacitor is fluxing. The strait is still there. The timeline is intact. Heavy.<br><br><em>"Roads? Where we\'re going, we don\'t need roads. We need a functioning geopolitical framework for maritime transit, which roads can\'t help with either."</em>'
  },
  {
    era: 'Tomorrow',
    paradoxes: '1 (you)', energy: '0 GW', fixed: 'Absolutely Not',
    fill: 5, fillColor: 'var(--text-dimmer)', status: 'TECHNICALLY TIME TRAVEL',
    response: 'You travel forward in time by exactly one day. This is technically time travel. Everyone does it. It\'s called "waiting." You arrive tomorrow. The strait is still there. Nothing has changed.<br><br>You check the news. The strait is still 33km wide. Iran is still on one side. Oman is still on the other. Oil is still flowing. The same 21 million barrels are making the same anxious journey. Your time machine \u2014 which is just a chair you sat in overnight \u2014 has not solved anything.<br><br>You try to go back to today to warn yourself not to waste a time travel trip on "tomorrow." But you can\'t, because traveling backward in time violates causality and also you don\'t actually have a time machine, you just waited. An inverted bullet falls up from the ground and into a wall. Wait, no it doesn\'t. That was a different movie. You are not the Protagonist. You are just a person who is now one day older and the strait is still there.<br><br><em>"We live in a twilight world." No. You just took a nap and called it time travel.</em>'
  }
];

function timeTravel(btn, idx) {
  document.querySelectorAll('#timeOptions .action-btn').forEach(function(b) { b.style.background=''; b.style.color=''; });
  btn.style.background='var(--accent)'; btn.style.color='var(--bg)';
  var d = ttData[idx];
  document.getElementById('ttParadoxes').textContent = d.paradoxes;
  document.getElementById('ttParadoxes').style.color = 'var(--danger)';
  document.getElementById('ttEnergy').textContent = d.energy;
  document.getElementById('ttStraightFixed').textContent = d.fixed;
  document.getElementById('ttStraightFixed').style.color = d.fixed === 'No' || d.fixed === 'Absolutely Not' || d.fixed === 'Made It Worse' ? 'var(--danger)' : d.fixed === 'Technically' ? 'var(--warn)' : 'var(--accent)';
  var fill = document.getElementById('ttFill');
  fill.style.width = d.fill + '%'; fill.style.background = d.fillColor;
  document.getElementById('ttStatus').textContent = d.status;
  document.getElementById('ttStatus').style.color = d.fillColor;
  document.getElementById('ttResponse').innerHTML = '<div class="advisor">Temporal Advisor \u2014 ' + d.era + '</div>' + d.response;
}

// ===== CLOSE MODAL =====
function closeModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  var ov = document.getElementById('modalOverlay');
  ov.classList.remove('visible');
  setTimeout(function() { ov.classList.remove('active'); document.body.style.overflow = ''; cleanupMaps(); window._canalMap = null; window._moveMap = null; }, 300);
  history.replaceState(null, '', window.location.pathname);
}

// Auto-open modal from URL hash (for shared links)
window.addEventListener('DOMContentLoaded', function() {
  var hash = window.location.hash.replace('#', '');
  if (hash && modalData[hash]) {
    setTimeout(function() { openModal(hash); }, 400);
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var ov = document.getElementById('modalOverlay');
    ov.classList.remove('visible');
    setTimeout(function() { ov.classList.remove('active'); document.body.style.overflow = ''; cleanupMaps(); }, 300);
  }
});

// ===== HERO STAT COUNT-UP =====
(function() {
  var counted = false;
  function countUp() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.hero-stat .number[data-target]').forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1200;
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
        var val = Math.round(target * ease);
        el.textContent = val + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  // Fire when hero section scrolls into view (or immediately if already visible)
  var hero = document.querySelector('.hero-stats');
  if (!hero) return;
  if (typeof IntersectionObserver !== 'undefined') {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { countUp(); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(hero);
  } else {
    countUp();
  }
})();
