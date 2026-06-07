const fs = require('fs');
const path = require('path');

const formations = {
  "4-3-3": ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CAM", "LW", "ST", "RW"],
  "4-4-2": ["GK", "LB", "CB", "CB", "RB", "LM", "CM", "CM", "RM", "ST", "ST"],
  "3-5-2": ["GK", "LWB", "CB", "CB", "RWB", "CM", "CM", "CAM", "ST", "ST", "ST"],
  "4-2-3-1": ["GK", "LB", "CB", "CB", "RB", "CDM", "CM", "LW", "CAM", "RW", "ST"]
};

const groups = [
  { id: "A", name: "Group A", teams: ["usa", "england", "mexico", "nigeria"] },
  { id: "B", name: "Group B", teams: ["canada", "france", "japan", "morocco"] },
  { id: "C", name: "Group C", teams: ["brazil", "spain", "australia", "algeria"] },
  { id: "D", name: "Group D", teams: ["argentina", "germany", "saudi_arabia", "egypt"] },
  { id: "E", name: "Group E", teams: ["portugal", "netherlands", "south_korea", "ghana"] },
  { id: "F", name: "Group F", teams: ["belgium", "switzerland", "iran", "cameroon"] },
  { id: "G", name: "Group G", teams: ["croatia", "denmark", "qatar", "tunisia"] },
  { id: "H", name: "Group H", teams: ["serbia", "poland", "uae", "south_africa"] },
  { id: "I", name: "Group I", teams: ["sweden", "norway", "ecuador", "peru"] },
  { id: "J", name: "Group J", teams: ["italy", "colombia", "chile", "new_zealand"] },
  { id: "K", name: "Group K", teams: ["austria", "uruguay", "venezuela", "panama"] },
  { id: "L", name: "Group L", teams: ["senegal", "costa_rica", "jamaica", "uzbekistan"] }
];

const fixtures = groups.flatMap((group) => {
  const matches = [];
  for (let i = 0; i < group.teams.length; i += 1) {
    for (let j = i + 1; j < group.teams.length; j += 1) {
      matches.push({ groupId: group.id, home: group.teams[i], away: group.teams[j] });
    }
  }
  return matches;
});

const knockoutBracket = {
  roundOf32: [
    { home: { group: "A", position: 1 }, away: { thirdSeed: 8 } },
    { home: { group: "C", position: 1 }, away: { thirdSeed: 7 } },
    { home: { group: "E", position: 1 }, away: { thirdSeed: 6 } },
    { home: { group: "G", position: 1 }, away: { thirdSeed: 5 } },
    { home: { group: "I", position: 1 }, away: { thirdSeed: 4 } },
    { home: { group: "K", position: 1 }, away: { thirdSeed: 3 } },
    { home: { group: "B", position: 1 }, away: { thirdSeed: 2 } },
    { home: { group: "D", position: 1 }, away: { thirdSeed: 1 } },
    { home: { group: "F", position: 1 }, away: { group: "H", position: 2 } },
    { home: { group: "J", position: 1 }, away: { group: "L", position: 2 } },
    { home: { group: "H", position: 1 }, away: { group: "F", position: 2 } },
    { home: { group: "L", position: 1 }, away: { group: "J", position: 2 } },
    { home: { group: "A", position: 2 }, away: { group: "B", position: 2 } },
    { home: { group: "C", position: 2 }, away: { group: "D", position: 2 } },
    { home: { group: "E", position: 2 }, away: { group: "G", position: 2 } },
    { home: { group: "I", position: 2 }, away: { group: "K", position: 2 } }
  ],
  roundOf16: [
    { home: { winnerOfIndex: 0 }, away: { winnerOfIndex: 1 } },
    { home: { winnerOfIndex: 2 }, away: { winnerOfIndex: 3 } },
    { home: { winnerOfIndex: 4 }, away: { winnerOfIndex: 5 } },
    { home: { winnerOfIndex: 6 }, away: { winnerOfIndex: 7 } },
    { home: { winnerOfIndex: 8 }, away: { winnerOfIndex: 9 } },
    { home: { winnerOfIndex: 10 }, away: { winnerOfIndex: 11 } },
    { home: { winnerOfIndex: 12 }, away: { winnerOfIndex: 13 } },
    { home: { winnerOfIndex: 14 }, away: { winnerOfIndex: 15 } }
  ],
  quarterfinals: [
    { home: { winnerOfIndex: 0 }, away: { winnerOfIndex: 1 } },
    { home: { winnerOfIndex: 2 }, away: { winnerOfIndex: 3 } },
    { home: { winnerOfIndex: 4 }, away: { winnerOfIndex: 5 } },
    { home: { winnerOfIndex: 6 }, away: { winnerOfIndex: 7 } }
  ],
  semifinals: [
    { home: { winnerOfIndex: 0 }, away: { winnerOfIndex: 1 } },
    { home: { winnerOfIndex: 2 }, away: { winnerOfIndex: 3 } }
  ],
  final: [
    { home: { winnerOfIndex: 0 }, away: { winnerOfIndex: 1 } }
  ]
};

const teamConfigs = [
  {
    id: "usa",
    name: "United States",
    abbreviation: "USA",
    rating: 86,
    players: [
      { name: "Matt Turner", position: "GK", rating: 84 },
      { name: "Zack Steffen", position: "GK", rating: 83 },
      { name: "Sergiño Dest", position: "RB", rating: 84 },
      { name: "Walker Zimmerman", position: "CB", rating: 84 },
      { name: "Miles Robinson", position: "CB", rating: 83 },
      { name: "Antonee Robinson", position: "LB", rating: 82 },
      { name: "Tyler Adams", position: "CDM", rating: 86 },
      { name: "Yunus Musah", position: "CM", rating: 84 },
      { name: "Weston McKennie", position: "CM", rating: 85 },
      { name: "Christian Pulisic", position: "LW", rating: 87 },
      { name: "Giovanni Reyna", position: "CAM", rating: 85 },
      { name: "Josh Sargent", position: "ST", rating: 82 }
    ]
  },
  {
    id: "england",
    name: "England",
    abbreviation: "ENG",
    rating: 89,
    players: [
      { name: "Jordan Pickford", position: "GK", rating: 84 },
      { name: "Aaron Ramsdale", position: "GK", rating: 82 },
      { name: "Kyle Walker", position: "RB", rating: 84 },
      { name: "John Stones", position: "CB", rating: 87 },
      { name: "Luke Shaw", position: "LB", rating: 85 },
      { name: "Declan Rice", position: "CDM", rating: 88 },
      { name: "Jude Bellingham", position: "CM", rating: 89 },
      { name: "Phil Foden", position: "CAM", rating: 90 },
      { name: "Harry Kane", position: "ST", rating: 92 },
      { name: "Raheem Sterling", position: "RW", rating: 87 },
      { name: "Jack Grealish", position: "LM", rating: 84 },
      { name: "Reece James", position: "RB", rating: 85 }
    ]
  },
  {
    id: "mexico",
    name: "Mexico",
    abbreviation: "MEX",
    rating: 83,
    players: [
      { name: "Guillermo Ochoa", position: "GK", rating: 84 },
      { name: "Jesús Corona", position: "RB", rating: 82 },
      { name: "Jesús Gallardo", position: "LB", rating: 80 },
      { name: "Néstor Araujo", position: "CB", rating: 80 },
      { name: "César Montes", position: "CB", rating: 80 },
      { name: "Edson Álvarez", position: "CDM", rating: 84 },
      { name: "Orbelín Pineda", position: "CAM", rating: 81 },
      { name: "Alexis Vega", position: "LW", rating: 81 },
      { name: "Hirving Lozano", position: "RW", rating: 83 },
      { name: "Santiago Giménez", position: "ST", rating: 81 },
      { name: "Raúl Jiménez", position: "ST", rating: 80 },
      { name: "Héctor Herrera", position: "CM", rating: 82 }
    ]
  },
  {
    id: "nigeria",
    name: "Nigeria",
    abbreviation: "NGA",
    rating: 81,
    players: [
      { name: "Francis Uzoho", position: "GK", rating: 80 },
      { name: "Ola Aina", position: "RB", rating: 80 },
      { name: "Calvin Bassey", position: "CB", rating: 79 },
      { name: "William Troost-Ekong", position: "CB", rating: 82 },
      { name: "Olaoluwa Aina", position: "LB", rating: 79 },
      { name: "Wilfred Ndidi", position: "CDM", rating: 85 },
      { name: "Alex Iwobi", position: "CAM", rating: 82 },
      { name: "Ademola Lookman", position: "LW", rating: 82 },
      { name: "Victor Osimhen", position: "ST", rating: 86 },
      { name: "Kelechi Iheanacho", position: "ST", rating: 82 },
      { name: "Samuel Chukwueze", position: "RW", rating: 81 },
      { name: "Joe Aribo", position: "CM", rating: 78 }
    ]
  },
  {
    id: "canada",
    name: "Canada",
    abbreviation: "CAN",
    rating: 82,
    players: [
      { name: "Maxime Crépeau", position: "GK", rating: 82 },
      { name: "Alphonso Davies", position: "LB", rating: 90 },
      { name: "Alistair Johnston", position: "RB", rating: 81 },
      { name: "Scott Kennedy", position: "CB", rating: 78 },
      { name: "Cyle Larin", position: "ST", rating: 83 },
      { name: "Jonathan David", position: "ST", rating: 85 },
      { name: "Tajon Buchanan", position: "RW", rating: 82 },
      { name: "Stephen Eustáquio", position: "CM", rating: 81 },
      { name: "Mark-Anthony Kaye", position: "CDM", rating: 79 },
      { name: "Samuel Adekugbe", position: "LB", rating: 78 },
      { name: "Liam Millar", position: "LW", rating: 79 },
      { name: "Lucas Cavallini", position: "ST", rating: 80 }
    ]
  },
  {
    id: "france",
    name: "France",
    abbreviation: "FRA",
    rating: 92,
    players: [
      { name: "Mike Maignan", position: "GK", rating: 87 },
      { name: "Hugo Lloris", position: "GK", rating: 86 },
      { name: "Raphaël Varane", position: "CB", rating: 87 },
      { name: "Aymeric Laporte", position: "CB", rating: 86 },
      { name: "Theo Hernandez", position: "LB", rating: 86 },
      { name: "Aurélien Tchouaméni", position: "CDM", rating: 87 },
      { name: "Paul Pogba", position: "CM", rating: 86 },
      { name: "Kylian Mbappé", position: "ST", rating: 93 },
      { name: "Antoine Griezmann", position: "CAM", rating: 88 },
      { name: "Kingsley Coman", position: "LW", rating: 86 },
      { name: "Ousmane Dembélé", position: "RW", rating: 87 },
      { name: "N'Golo Kanté", position: "CDM", rating: 90 }
    ]
  },
  {
    id: "japan",
    name: "Japan",
    abbreviation: "JPN",
    rating: 82,
    players: [
      { name: "Shusaku Nishikawa", position: "GK", rating: 82 },
      { name: "Takehiro Tomiyasu", position: "RB", rating: 84 },
      { name: "Maya Yoshida", position: "CB", rating: 80 },
      { name: "Wataru Endo", position: "CDM", rating: 81 },
      { name: "Takumi Minamino", position: "RW", rating: 82 },
      { name: "Takefusa Kubo", position: "CAM", rating: 84 },
      { name: "Kaoru Mitoma", position: "LW", rating: 81 },
      { name: "Yuya Osako", position: "ST", rating: 81 },
      { name: "Ritsu Doan", position: "RW", rating: 80 },
      { name: "Hidemasa Morita", position: "CM", rating: 80 },
      { name: "Ao Tanaka", position: "CM", rating: 79 },
      { name: "Ko Itakura", position: "CB", rating: 79 }
    ]
  },
  {
    id: "morocco",
    name: "Morocco",
    abbreviation: "MAR",
    rating: 84,
    players: [
      { name: "Yassine Bounou", position: "GK", rating: 84 },
      { name: "Achraf Hakimi", position: "RB", rating: 88 },
      { name: "Noussair Mazraoui", position: "RB", rating: 82 },
      { name: "Romain Saïss", position: "CB", rating: 80 },
      { name: "Nayef Aguerd", position: "CB", rating: 82 },
      { name: "Hakim Ziyech", position: "CAM", rating: 84 },
      { name: "Sofiane Boufal", position: "LW", rating: 82 },
      { name: "Youssef En-Nesyri", position: "ST", rating: 82 },
      { name: "Azzedine Ounahi", position: "CM", rating: 80 },
      { name: "Sofiane Amrabat", position: "CDM", rating: 81 },
      { name: "Karim El Ahmadi", position: "CDM", rating: 79 },
      { name: "Sofiane Bahoui", position: "LM", rating: 79 }
    ]
  },
  {
    id: "brazil",
    name: "Brazil",
    abbreviation: "BRA",
    rating: 91,
    players: [
      { name: "Alisson Becker", position: "GK", rating: 89 },
      { name: "Ederson", position: "GK", rating: 88 },
      { name: "Thiago Silva", position: "CB", rating: 86 },
      { name: "Marquinhos", position: "CB", rating: 88 },
      { name: "Casemiro", position: "CDM", rating: 89 },
      { name: "Bruno Guimarães", position: "CM", rating: 87 },
      { name: "Lucas Paquetá", position: "CAM", rating: 86 },
      { name: "Neymar Jr.", position: "LW", rating: 92 },
      { name: "Vinícius Júnior", position: "LW", rating: 90 },
      { name: "Richarlison", position: "ST", rating: 86 },
      { name: "Gabriel Jesus", position: "ST", rating: 87 },
      { name: "João Cancelo", position: "RB", rating: 87 }
    ]
  },
  {
    id: "spain",
    name: "Spain",
    abbreviation: "ESP",
    rating: 89,
    players: [
      { name: "Unai Simón", position: "GK", rating: 85 },
      { name: "David Raya", position: "GK", rating: 84 },
      { name: "Dani Carvajal", position: "RB", rating: 83 },
      { name: "Pau Torres", position: "CB", rating: 84 },
      { name: "Aymeric Laporte", position: "CB", rating: 86 },
      { name: "Jordi Alba", position: "LB", rating: 84 },
      { name: "Rodri", position: "CDM", rating: 90 },
      { name: "Pedri", position: "CM", rating: 88 },
      { name: "Gavi", position: "CM", rating: 85 },
      { name: "Ferran Torres", position: "RW", rating: 84 },
      { name: "Álvaro Morata", position: "ST", rating: 84 },
      { name: "Mikel Oyarzabal", position: "LW", rating: 84 }
    ]
  },
  {
    id: "australia",
    name: "Australia",
    abbreviation: "AUS",
    rating: 80,
    players: [
      { name: "Maty Ryan", position: "GK", rating: 82 },
      { name: "Aaron Mooy", position: "CM", rating: 82 },
      { name: "Ajdin Hrustic", position: "CAM", rating: 81 },
      { name: "Daniel Arzani", position: "LW", rating: 79 },
      { name: "Travis Dodd", position: "RB", rating: 78 },
      { name: "Mitchell Duke", position: "ST", rating: 79 },
      { name: "Riley McGree", position: "CM", rating: 79 },
      { name: "Jackson Irvine", position: "CDM", rating: 82 },
      { name: "Josh Risdon", position: "RB", rating: 78 },
      { name: "Mathew Leckie", position: "RW", rating: 80 },
      { name: "Keanu Baccus", position: "CM", rating: 77 },
      { name: "Andrew Nabbout", position: "ST", rating: 78 }
    ]
  },
  {
    id: "algeria",
    name: "Algeria",
    abbreviation: "DZA",
    rating: 78,
    players: [
      { name: "Raïs M'Bolhi", position: "GK", rating: 82 },
      { name: "Riyad Mahrez", position: "RW", rating: 87 },
      { name: "Islam Slimani", position: "ST", rating: 82 },
      { name: "Sofiane Boufal", position: "LW", rating: 82 },
      { name: "Youcef Atal", position: "RB", rating: 81 },
      { name: "Aïssa Mandi", position: "CB", rating: 79 },
      { name: "Yassine Benzia", position: "CAM", rating: 78 },
      { name: "Adlene Guedioura", position: "CDM", rating: 78 },
      { name: "Adam Ounas", position: "LM", rating: 79 },
      { name: "Yacine Brahimi", position: "LW", rating: 80 },
      { name: "Ramy Bensebaini", position: "CB", rating: 80 },
      { name: "Sofiane Feghouli", position: "RM", rating: 78 }
    ]
  },
  {
    id: "argentina",
    name: "Argentina",
    abbreviation: "ARG",
    rating: 91,
    players: [
      { name: "Emiliano Martínez", position: "GK", rating: 86 },
      { name: "Lionel Messi", position: "RW", rating: 94 },
      { name: "Lautaro Martínez", position: "ST", rating: 89 },
      { name: "Ángel Di María", position: "RW", rating: 87 },
      { name: "Rodrigo De Paul", position: "CM", rating: 86 },
      { name: "Nicolás Otamendi", position: "CB", rating: 83 },
      { name: "Paulo Dybala", position: "CAM", rating: 86 },
      { name: "Julián Álvarez", position: "ST", rating: 86 },
      { name: "Alexis Mac Allister", position: "CM", rating: 86 },
      { name: "Leandro Paredes", position: "CDM", rating: 84 },
      { name: "Cristian Romero", position: "CB", rating: 84 },
      { name: "Lisandro Martínez", position: "CB", rating: 84 }
    ]
  },
  {
    id: "germany",
    name: "Germany",
    abbreviation: "GER",
    rating: 88,
    players: [
      { name: "Manuel Neuer", position: "GK", rating: 88 },
      { name: "Marc-André ter Stegen", position: "GK", rating: 88 },
      { name: "Joshua Kimmich", position: "CDM", rating: 89 },
      { name: "Matthijs de Ligt", position: "CB", rating: 87 },
      { name: "Antonio Rüdiger", position: "CB", rating: 86 },
      { name: "Toni Kroos", position: "CM", rating: 88 },
      { name: "Ilkay Gündogan", position: "CM", rating: 86 },
      { name: "Jamal Musiala", position: "CAM", rating: 89 },
      { name: "Serge Gnabry", position: "RW", rating: 86 },
      { name: "Leroy Sané", position: "LW", rating: 86 },
      { name: "Kai Havertz", position: "ST", rating: 86 },
      { name: "Thomas Müller", position: "CAM", rating: 85 }
    ]
  },
  {
    id: "saudi_arabia",
    name: "Saudi Arabia",
    abbreviation: "KSA",
    rating: 78,
    players: [
      { name: "Mohammed Al-Owais", position: "GK", rating: 80 },
      { name: "Yasser Al-Shahrani", position: "LB", rating: 79 },
      { name: "Mohammed Al-Breik", position: "RB", rating: 79 },
      { name: "Salem Al-Dawsari", position: "RW", rating: 82 },
      { name: "Fahad Al-Muwallad", position: "LW", rating: 81 },
      { name: "Abdullah Otayf", position: "CM", rating: 78 },
      { name: "Sultan Al-Ghanam", position: "LB", rating: 78 },
      { name: "Mohammed Al-Khabrani", position: "CB", rating: 77 },
      { name: "Hassan Al-Tambakti", position: "CB", rating: 78 },
      { name: "Nawaf Al-Abed", position: "CAM", rating: 78 },
      { name: "Saad Al-Shehri", position: "ST", rating: 75 },
      { name: "Abdulmalek Al-Khaibri", position: "CDM", rating: 76 }
    ]
  },
  {
    id: "egypt",
    name: "Egypt",
    abbreviation: "EGY",
    rating: 80,
    players: [
      { name: "Mohamed El Shenawy", position: "GK", rating: 82 },
      { name: "Mohamed Salah", position: "RW", rating: 92 },
      { name: "Trezeguet", position: "LW", rating: 82 },
      { name: "Mohamed Elneny", position: "CM", rating: 83 },
      { name: "Ahmed Hegazi", position: "CB", rating: 81 },
      { name: "Ali Gabr", position: "CB", rating: 79 },
      { name: "Ramadan Sobhi", position: "LW", rating: 79 },
      { name: "Tarek Hamed", position: "CDM", rating: 78 },
      { name: "Omar Marmoush", position: "ST", rating: 78 },
      { name: "Mostafa Mohamed", position: "ST", rating: 79 },
      { name: "Ahmed Elmohamady", position: "RB", rating: 78 },
      { name: "Amr Warda", position: "LM", rating: 77 }
    ]
  },
  {
    id: "portugal",
    name: "Portugal",
    abbreviation: "POR",
    rating: 90,
    players: [
      { name: "Rui Patrício", position: "GK", rating: 85 },
      { name: "Diogo Costa", position: "GK", rating: 84 },
      { name: "João Cancelo", position: "RB", rating: 87 },
      { name: "Rúben Dias", position: "CB", rating: 88 },
      { name: "Pepe", position: "CB", rating: 83 },
      { name: "Bruno Fernandes", position: "CAM", rating: 89 },
      { name: "Bernardo Silva", position: "RW", rating: 89 },
      { name: "Cristiano Ronaldo", position: "ST", rating: 91 },
      { name: "Gonçalo Ramos", position: "ST", rating: 84 },
      { name: "João Félix", position: "CAM", rating: 85 },
      { name: "Vitinha", position: "CM", rating: 84 },
      { name: "Rafael Leão", position: "LW", rating: 86 }
    ]
  },
  {
    id: "netherlands",
    name: "Netherlands",
    abbreviation: "NED",
    rating: 88,
    players: [
      { name: "Virgil van Dijk", position: "CB", rating: 91 },
      { name: "Frenkie de Jong", position: "CM", rating: 88 },
      { name: "Matthijs de Ligt", position: "CB", rating: 87 },
      { name: "Denzel Dumfries", position: "RB", rating: 86 },
      { name: "Memphis Depay", position: "ST", rating: 86 },
      { name: "Cody Gakpo", position: "LW", rating: 86 },
      { name: "Teun Koopmeiners", position: "CDM", rating: 84 },
      { name: "Davy Klaassen", position: "CM", rating: 81 },
      { name: "Daley Blind", position: "LB", rating: 82 },
      { name: "Steven Bergwijn", position: "LW", rating: 82 },
      { name: "Jasper Cillessen", position: "GK", rating: 82 },
      { name: "Noa Lang", position: "RW", rating: 82 }
    ]
  },
  {
    id: "south_korea",
    name: "South Korea",
    abbreviation: "KOR",
    rating: 82,
    players: [
      { name: "Son Heung-min", position: "LW", rating: 90 },
      { name: "Hwang Hee-chan", position: "ST", rating: 82 },
      { name: "Kim Min-jae", position: "CB", rating: 86 },
      { name: "Lee Kang-in", position: "CAM", rating: 84 },
      { name: "Kim Young-gwon", position: "CB", rating: 81 },
      { name: "Paik Seung-ho", position: "CM", rating: 80 },
      { name: "Cho Gue-sung", position: "ST", rating: 81 },
      { name: "Hwang In-beom", position: "CM", rating: 80 },
      { name: "Kim Seung-gyu", position: "GK", rating: 81 },
      { name: "Kwon Chang-hoon", position: "LM", rating: 79 },
      { name: "Lee Jae-sung", position: "RM", rating: 80 },
      { name: "Kim Jin-su", position: "LB", rating: 79 }
    ]
  },
  {
    id: "ghana",
    name: "Ghana",
    abbreviation: "GHA",
    rating: 80,
    players: [
      { name: "Andre Ayew", position: "ST", rating: 82 },
      { name: "Jordan Ayew", position: "ST", rating: 80 },
      { name: "Thomas Partey", position: "CDM", rating: 86 },
      { name: "Mohammed Salisu", position: "CB", rating: 80 },
      { name: "Inaki Williams", position: "ST", rating: 81 },
      { name: "Alidu Seidu", position: "CB", rating: 77 },
      { name: "Joseph Mensah", position: "CM", rating: 84 },
      { name: "Majeed Ashimeru", position: "CM", rating: 79 },
      { name: "Daniel Amartey", position: "RB", rating: 78 },
      { name: "Alexander Djiku", position: "CB", rating: 79 },
      { name: "Denis Odoi", position: "LB", rating: 78 },
      { name: "Frank Acheampong", position: "RW", rating: 78 }
    ]
  },
  {
    id: "belgium",
    name: "Belgium",
    abbreviation: "BEL",
    rating: 88,
    players: [
      { name: "Thibaut Courtois", position: "GK", rating: 90 },
      { name: "Kevin De Bruyne", position: "CAM", rating: 91 },
      { name: "Romelu Lukaku", position: "ST", rating: 88 },
      { name: "Eden Hazard", position: "LW", rating: 86 },
      { name: "Youri Tielemans", position: "CM", rating: 84 },
      { name: "Jan Vertonghen", position: "CB", rating: 82 },
      { name: "Toby Alderweireld", position: "CB", rating: 83 },
      { name: "Leandro Trossard", position: "RW", rating: 83 },
      { name: "Mousa Dembélé", position: "CM", rating: 83 },
      { name: "Axel Witsel", position: "CDM", rating: 84 },
      { name: "Michy Batshuayi", position: "ST", rating: 81 },
      { name: "Thomas Meunier", position: "RB", rating: 82 }
    ]
  },
  {
    id: "switzerland",
    name: "Switzerland",
    abbreviation: "SUI",
    rating: 82,
    players: [
      { name: "Yann Sommer", position: "GK", rating: 84 },
      { name: "Manuel Akanji", position: "CB", rating: 83 },
      { name: "Granit Xhaka", position: "CM", rating: 84 },
      { name: "Breel Embolo", position: "ST", rating: 82 },
      { name: "Xherdan Shaqiri", position: "RW", rating: 82 },
      { name: "Ricardo Rodríguez", position: "LB", rating: 82 },
      { name: "Denis Zakaria", position: "CM", rating: 82 },
      { name: "Sébastien Frey", position: "GK", rating: 78 },
      { name: "Fabian Schär", position: "CB", rating: 81 },
      { name: "Michel Aebischer", position: "CM", rating: 79 },
      { name: "Loris Benito", position: "RB", rating: 79 },
      { name: "Mario Gavranović", position: "ST", rating: 80 }
    ]
  },
  {
    id: "iran",
    name: "Iran",
    abbreviation: "IRN",
    rating: 79,
    players: [
      { name: "Alireza Beiranvand", position: "GK", rating: 82 },
      { name: "Sardar Azmoun", position: "ST", rating: 84 },
      { name: "Mehdi Taremi", position: "ST", rating: 83 },
      { name: "Alireza Jahanbakhsh", position: "RW", rating: 81 },
      { name: "Masoud Shojaei", position: "CM", rating: 79 },
      { name: "Ehsan Hajsafi", position: "LB", rating: 80 },
      { name: "Morteza Pouraliganji", position: "CB", rating: 79 },
      { name: "Majid Hosseini", position: "CB", rating: 78 },
      { name: "Omid Ebrahimi", position: "CM", rating: 79 },
      { name: "Alireza Haghighi", position: "GK", rating: 80 },
      { name: "Mehdi Torabi", position: "LM", rating: 79 },
      { name: "Ashkan Dejagah", position: "RW", rating: 78 }
    ]
  },
  {
    id: "cameroon",
    name: "Cameroon",
    abbreviation: "CMR",
    rating: 80,
    players: [
      { name: "Andre Onana", position: "GK", rating: 85 },
      { name: "Vincent Aboubakar", position: "ST", rating: 82 },
      { name: "Eric Maxim Choupo-Moting", position: "ST", rating: 83 },
      { name: "Joel Matip", position: "CB", rating: 83 },
      { name: "Karl Toko Ekambi", position: "LW", rating: 81 },
      { name: "Nicolas Nkoulou", position: "CB", rating: 79 },
      { name: "Michael Ngadeu", position: "CB", rating: 78 },
      { name: "Dennis Oliech", position: "ST", rating: 77 },
      { name: "Ambroise Oyongo", position: "LB", rating: 78 },
      { name: "Eric Choupo-Moting", position: "ST", rating: 83 },
      { name: "Andre-Frank Zambo Anguissa", position: "CM", rating: 81 },
      { name: "Christian Bassogog", position: "RW", rating: 79 }
    ]
  },
  {
    id: "croatia",
    name: "Croatia",
    abbreviation: "CRO",
    rating: 87,
    players: [
      { name: "Luka Modrić", position: "CM", rating: 89 },
      { name: "Ivan Perišić", position: "LW", rating: 86 },
      { name: "Mateo Kovačić", position: "CM", rating: 86 },
      { name: "Dominik Livaković", position: "GK", rating: 84 },
      { name: "Josko Gvardiol", position: "CB", rating: 86 },
      { name: "Marcelo Brozović", position: "CDM", rating: 85 },
      { name: "Andrej Kramarić", position: "ST", rating: 84 },
      { name: "Bruno Petković", position: "ST", rating: 83 },
      { name: "Borna Sosa", position: "LB", rating: 82 },
      { name: "Nikola Vlašić", position: "CAM", rating: 82 },
      { name: "Duje Ćaleta-Car", position: "CB", rating: 81 },
      { name: "Ante Budimir", position: "ST", rating: 80 }
    ]
  },
  {
    id: "denmark",
    name: "Denmark",
    abbreviation: "DEN",
    rating: 86,
    players: [
      { name: "Kasper Schmeichel", position: "GK", rating: 84 },
      { name: "Simon Kjær", position: "CB", rating: 83 },
      { name: "Joakim Mæhle", position: "LB", rating: 83 },
      { name: "Mathias Jensen", position: "CM", rating: 82 },
      { name: "Christian Eriksen", position: "CAM", rating: 87 },
      { name: "Rasmus Højlund", position: "ST", rating: 84 },
      { name: "Andreas Christensen", position: "CB", rating: 85 },
      { name: "Yussuf Poulsen", position: "ST", rating: 82 },
      { name: "Mikkel Damsgaard", position: "LW", rating: 83 },
      { name: "Robert Skov", position: "RW", rating: 82 },
      { name: "Pierre-Emile Højbjerg", position: "CM", rating: 83 },
      { name: "Thomas Delaney", position: "CDM", rating: 82 }
    ]
  },
  {
    id: "qatar",
    name: "Qatar",
    abbreviation: "QAT",
    rating: 76,
    players: [
      { name: "Saad Al Sheeb", position: "GK", rating: 81 },
      { name: "Akram Afif", position: "RW", rating: 82 },
      { name: "Hassan Al-Haydos", position: "CAM", rating: 80 },
      { name: "Boualem Khoukhi", position: "CB", rating: 78 },
      { name: "Almoez Ali", position: "ST", rating: 81 },
      { name: "Abdulaziz Hatem", position: "CM", rating: 79 },
      { name: "Abdulaziz Hassan", position: "CB", rating: 77 },
      { name: "Mohammed Waad", position: "LB", rating: 77 },
      { name: "Pedro Miguel", position: "ST", rating: 78 },
      { name: "Assim Madibo", position: "CDM", rating: 78 },
      { name: "Fouad Mahmoud", position: "GK", rating: 77 },
      { name: "Karim Boudiaf", position: "CM", rating: 78 }
    ]
  },
  {
    id: "tunisia",
    name: "Tunisia",
    abbreviation: "TUN",
    rating: 79,
    players: [
      { name: "Aymen Mathlouthi", position: "GK", rating: 82 },
      { name: "Wahbi Khazri", position: "ST", rating: 81 },
      { name: "Ellyes Skhiri", position: "CM", rating: 80 },
      { name: "Mohamed Dräger", position: "RB", rating: 79 },
      { name: "Ali Maâloul", position: "LB", rating: 80 },
      { name: "Youssef Msakni", position: "CAM", rating: 80 },
      { name: "Aïssa Laïdouni", position: "CDM", rating: 79 },
      { name: "Elyes Skhiri", position: "CM", rating: 80 },
      { name: "Naim Sliti", position: "RW", rating: 79 },
      { name: "Hannibal Mejbri", position: "CM", rating: 79 },
      { name: "Iheb Msakni", position: "ST", rating: 78 },
      { name: "Hamza Mathlouthi", position: "RB", rating: 78 }
    ]
  },
  {
    id: "serbia",
    name: "Serbia",
    abbreviation: "SRB",
    rating: 84,
    players: [
      { name: "Dusan Vlahovic", position: "ST", rating: 87 },
      { name: "Sergej Milinkovic-Savic", position: "CM", rating: 86 },
      { name: "Dusan Tadic", position: "CAM", rating: 85 },
      { name: "Nemanja Matic", position: "CDM", rating: 84 },
      { name: "Aleksandar Mitrovic", position: "ST", rating: 86 },
      { name: "Marko Dmitrovic", position: "GK", rating: 81 },
      { name: "Filip Kostic", position: "LW", rating: 84 },
      { name: "Stefan Savic", position: "CB", rating: 83 },
      { name: "Milos Veljkovic", position: "CB", rating: 80 },
      { name: "Andrija Zivkovic", position: "RW", rating: 80 },
      { name: "Lazar Markovic", position: "RM", rating: 79 },
      { name: "Sasa Lukic", position: "CM", rating: 80 }
    ]
  },
  {
    id: "poland",
    name: "Poland",
    abbreviation: "POL",
    rating: 83,
    players: [
      { name: "Wojciech Szczęsny", position: "GK", rating: 86 },
      { name: "Robert Lewandowski", position: "ST", rating: 91 },
      { name: "Piotr Zieliński", position: "CM", rating: 86 },
      { name: "Jakub Kiwior", position: "CB", rating: 82 },
      { name: "Kamil Glik", position: "CB", rating: 81 },
      { name: "Krzysztof Piątek", position: "ST", rating: 81 },
      { name: "Grzegorz Krychowiak", position: "CDM", rating: 83 },
      { name: "Sebastian Szymański", position: "RW", rating: 81 },
      { name: "Bartosz Bereszyński", position: "RB", rating: 80 },
      { name: "Maciej Rybus", position: "LB", rating: 79 },
      { name: "Arkadiusz Milik", position: "ST", rating: 83 },
      { name: "Karol Linetty", position: "CM", rating: 80 }
    ]
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    abbreviation: "UAE",
    rating: 76,
    players: [
      { name: "Khalid Eisa", position: "GK", rating: 79 },
      { name: "Ali Mabkhout", position: "ST", rating: 82 },
      { name: "Omar Abdulrahman", position: "CAM", rating: 80 },
      { name: "Khalfan Mubarak", position: "RW", rating: 78 },
      { name: "Abdullah Ramadan", position: "CB", rating: 77 },
      { name: "Mohammed Al-Blooshi", position: "LB", rating: 76 },
      { name: "Juma Al Kaabi", position: "CB", rating: 76 },
      { name: "Omar Khribin", position: "ST", rating: 78 },
      { name: "Salem Sultan", position: "RB", rating: 76 },
      { name: "Walid Abbas", position: "CB", rating: 76 },
      { name: "Amer Abdulrahman", position: "CM", rating: 77 },
      { name: "Mohammed Al Attas", position: "CDM", rating: 76 }
    ]
  },
  {
    id: "south_africa",
    name: "South Africa",
    abbreviation: "RSA",
    rating: 78,
    players: [
      { name: "Ronwen Williams", position: "GK", rating: 80 },
      { name: "Percy Tau", position: "RW", rating: 82 },
      { name: "Teboho Mokoena", position: "CM", rating: 81 },
      { name: "Thulani Hlatshwayo", position: "CB", rating: 80 },
      { name: "Siyanda Xulu", position: "CB", rating: 79 },
      { name: "Thulani Serero", position: "CM", rating: 79 },
      { name: "Sabelo Radebe", position: "LM", rating: 78 },
      { name: "Kamohelo Mokotjo", position: "CDM", rating: 79 },
      { name: "Bongani Zungu", position: "CM", rating: 78 },
      { name: "Nkosingiphile Ngcobo", position: "AM", rating: 78 },
      { name: "Tiyani Mabunda", position: "RB", rating: 77 },
      { name: "Andile Jali", position: "CM", rating: 77 }
    ]
  },
  {
    id: "sweden",
    name: "Sweden",
    abbreviation: "SWE",
    rating: 82,
    players: [
      { name: "Robin Olsen", position: "GK", rating: 82 },
      { name: "Victor Lindelöf", position: "CB", rating: 84 },
      { name: "Alexander Isak", position: "ST", rating: 86 },
      { name: "Emil Forsberg", position: "AM", rating: 84 },
      { name: "Dejan Kulusevski", position: "RW", rating: 84 },
      { name: "Albin Ekdal", position: "CM", rating: 81 },
      { name: "Kristoffer Olsson", position: "CM", rating: 80 },
      { name: "Ludwig Augustinsson", position: "LB", rating: 81 },
      { name: "Marcus Danielson", position: "CB", rating: 80 },
      { name: "Robin Quaison", position: "ST", rating: 79 },
      { name: "Filip Helander", position: "CB", rating: 79 },
      { name: "Sebastian Larsson", position: "CDM", rating: 79 }
    ]
  },
  {
    id: "norway",
    name: "Norway",
    abbreviation: "NOR",
    rating: 83,
    players: [
      { name: "Erling Haaland", position: "ST", rating: 92 },
      { name: "Martin Ødegaard", position: "CAM", rating: 90 },
      { name: "Sander Berge", position: "CM", rating: 84 },
      { name: "Mohamed Elyounoussi", position: "LW", rating: 82 },
      { name: "Joshua King", position: "ST", rating: 82 },
      { name: "Kristoffer Ajer", position: "CB", rating: 82 },
      { name: "Alexander Sørloth", position: "ST", rating: 81 },
      { name: "Mats Møller Dæhli", position: "CAM", rating: 79 },
      { name: "Jonas Svensson", position: "RB", rating: 79 },
      { name: "Håvard Nordtveit", position: "CDM", rating: 79 },
      { name: "Martin Linnes", position: "RB", rating: 78 },
      { name: "Stefan Strandberg", position: "CB", rating: 78 }
    ]
  },
  {
    id: "ecuador",
    name: "Ecuador",
    abbreviation: "ECU",
    rating: 81,
    players: [
      { name: "Moisés Caicedo", position: "CDM", rating: 85 },
      { name: "Enner Valencia", position: "ST", rating: 84 },
      { name: "Pervis Estupiñán", position: "LB", rating: 83 },
      { name: "Gonzalo Plata", position: "RW", rating: 82 },
      { name: "Felix Torres", position: "CB", rating: 81 },
      { name: "Érick Pulgar", position: "CM", rating: 80 },
      { name: "Alan Franco", position: "CB", rating: 79 },
      { name: "Angelo Preciado", position: "RB", rating: 79 },
      { name: "Kevin Rodríguez", position: "ST", rating: 78 },
      { name: "Jhegson Méndez", position: "CM", rating: 78 },
      { name: "Michael Estrada", position: "ST", rating: 79 },
      { name: "Hernán Galíndez", position: "GK", rating: 77 }
    ]
  },
  {
    id: "peru",
    name: "Peru",
    abbreviation: "PER",
    rating: 80,
    players: [
      { name: "Pedro Gallese", position: "GK", rating: 82 },
      { name: "Paolo Guerrero", position: "ST", rating: 84 },
      { name: "Christian Cueva", position: "CAM", rating: 82 },
      { name: "Yoshimar Yotún", position: "CM", rating: 81 },
      { name: "Renato Tapia", position: "CDM", rating: 81 },
      { name: "André Carrillo", position: "RW", rating: 81 },
      { name: "Miguel Trauco", position: "LB", rating: 79 },
      { name: "Luis Advíncula", position: "RB", rating: 79 },
      { name: "Sergio Peña", position: "CM", rating: 79 },
      { name: "Edison Flores", position: "LW", rating: 80 },
      { name: "Yordy Reyna", position: "ST", rating: 79 },
      { name: "Carlos Zambrano", position: "CB", rating: 79 }
    ]
  },
  {
    id: "italy",
    name: "Italy",
    abbreviation: "ITA",
    rating: 87,
    players: [
      { name: "Gianluigi Donnarumma", position: "GK", rating: 89 },
      { name: "Gianluigi Buffon", position: "GK", rating: 85 },
      { name: "Leonardo Bonucci", position: "CB", rating: 86 },
      { name: "Giorgio Chiellini", position: "CB", rating: 84 },
      { name: "Marco Verratti", position: "CM", rating: 87 },
      { name: "Nicolo Barella", position: "CM", rating: 86 },
      { name: "Lorenzo Insigne", position: "LW", rating: 85 },
      { name: "Federico Chiesa", position: "RW", rating: 86 },
      { name: "Ciro Immobile", position: "ST", rating: 85 },
      { name: "Sandro Tonali", position: "CM", rating: 84 },
      { name: "Giacomo Raspadori", position: "ST", rating: 82 },
      { name: "Alessandro Florenzi", position: "RB", rating: 83 }
    ]
  },
  {
    id: "colombia",
    name: "Colombia",
    abbreviation: "COL",
    rating: 83,
    players: [
      { name: "David Ospina", position: "GK", rating: 84 },
      { name: "James Rodríguez", position: "CAM", rating: 86 },
      { name: "Duván Zapata", position: "ST", rating: 84 },
      { name: "Luis Díaz", position: "LW", rating: 86 },
      { name: "Juan Cuadrado", position: "RW", rating: 83 },
      { name: "Yerry Mina", position: "CB", rating: 82 },
      { name: "Davinson Sánchez", position: "CB", rating: 82 },
      { name: "Wilmar Barrios", position: "CDM", rating: 83 },
      { name: "Mateus Uribe", position: "CM", rating: 82 },
      { name: "Johan Mojica", position: "LB", rating: 80 },
      { name: "Luis Muriel", position: "ST", rating: 82 },
      { name: "Santiago Arias", position: "RB", rating: 80 }
    ]
  },
  {
    id: "chile",
    name: "Chile",
    abbreviation: "CHI",
    rating: 81,
    players: [
      { name: "Claudio Bravo", position: "GK", rating: 83 },
      { name: "Alexis Sánchez", position: "ST", rating: 85 },
      { name: "Arturo Vidal", position: "CM", rating: 84 },
      { name: "Eduardo Vargas", position: "ST", rating: 82 },
      { name: "Charles Aránguiz", position: "CM", rating: 82 },
      { name: "Ben Brereton", position: "ST", rating: 81 },
      { name: "Mauricio Isla", position: "RB", rating: 80 },
      { name: "Gonzalo Jara", position: "CB", rating: 79 },
      { name: "Jose Pedro Fuenzalida", position: "RM", rating: 79 },
      { name: "Erick Pulgar", position: "CM", rating: 80 },
      { name: "Fabián Orellana", position: "RW", rating: 79 },
      { name: "Mauricio Pinilla", position: "ST", rating: 78 }
    ]
  },
  {
    id: "new_zealand",
    name: "New Zealand",
    abbreviation: "NZL",
    rating: 76,
    players: [
      { name: "Michael Boxall", position: "CB", rating: 78 },
      { name: "Chris Wood", position: "ST", rating: 83 },
      { name: "Winston Reid", position: "CB", rating: 80 },
      { name: "Ryan Thomas", position: "CM", rating: 78 },
      { name: "Sarpreet Singh", position: "CAM", rating: 78 },
      { name: "Marco Rojas", position: "RW", rating: 78 },
      { name: "Liberato Cacace", position: "LB", rating: 77 },
      { name: "Kosta Barbarouses", position: "RW", rating: 77 },
      { name: "Tyler Boyd", position: "RW", rating: 77 },
      { name: "Fraser Aird", position: "LM", rating: 76 },
      { name: "Deklan Wynne", position: "RB", rating: 76 },
      { name: "Glen Moss", position: "GK", rating: 76 }
    ]
  },
  {
    id: "austria",
    name: "Austria",
    abbreviation: "AUT",
    rating: 82,
    players: [
      { name: "David Alaba", position: "CB", rating: 87 },
      { name: "Marcel Sabitzer", position: "CM", rating: 84 },
      { name: "Konrad Laimer", position: "CM", rating: 82 },
      { name: "Marko Arnautovic", position: "ST", rating: 83 },
      { name: "Michael Gregoritsch", position: "ST", rating: 80 },
      { name: "Christoph Baumgartner", position: "CM", rating: 83 },
      { name: "Stefan Lainer", position: "RB", rating: 81 },
      { name: "Christian Fuchs", position: "LB", rating: 80 },
      { name: "Alexander Prass", position: "CM", rating: 79 },
      { name: "Andreas Ulmer", position: "LB", rating: 79 },
      { name: "Sasa Kalajdzic", position: "LW", rating: 82 },
      { name: "Martin Hinteregger", position: "CB", rating: 80 }
    ]
  },
  {
    id: "uruguay",
    name: "Uruguay",
    abbreviation: "URU",
    rating: 86,
    players: [
      { name: "Fernando Muslera", position: "GK", rating: 84 },
      { name: "Luis Suárez", position: "ST", rating: 88 },
      { name: "Edinson Cavani", position: "ST", rating: 86 },
      { name: "Federico Valverde", position: "CM", rating: 89 },
      { name: "Darwin Núñez", position: "ST", rating: 86 },
      { name: "José Giménez", position: "CB", rating: 84 },
      { name: "Rodrigo Bentancur", position: "CM", rating: 84 },
      { name: "Nicolás Lodeiro", position: "CAM", rating: 83 },
      { name: "Diego Godín", position: "CB", rating: 83 },
      { name: "Maximiliano Araújo", position: "LB", rating: 79 },
      { name: "Sofyan Amrabat", position: "CM", rating: 82 },
      { name: "Matías Vecino", position: "CM", rating: 80 }
    ]
  },
  {
    id: "venezuela",
    name: "Venezuela",
    abbreviation: "VEN",
    rating: 77,
    players: [
      { name: "Salomón Rondón", position: "ST", rating: 82 },
      { name: "Jefferson Savarino", position: "LW", rating: 80 },
      { name: "Yangel Herrera", position: "CM", rating: 80 },
      { name: "Tomás Rincón", position: "CDM", rating: 81 },
      { name: "Adalberto Peñaranda", position: "RW", rating: 79 },
      { name: "Fernando Amorebieta", position: "CB", rating: 79 },
      { name: "Alexander González", position: "LB", rating: 78 },
      { name: "Juanpi", position: "CAM", rating: 79 },
      { name: "Jose Manuel Velazquez", position: "LB", rating: 78 },
      { name: "Rolf Feltscher", position: "RB", rating: 78 },
      { name: "Josef Martínez", position: "ST", rating: 80 },
      { name: "Luis Mago", position: "LB", rating: 77 }
    ]
  },
  {
    id: "panama",
    name: "Panama",
    abbreviation: "PAN",
    rating: 75,
    players: [
      { name: "Jaime Penedo", position: "GK", rating: 79 },
      { name: "Luis Tejada", position: "ST", rating: 80 },
      { name: "Gabriel Torres", position: "ST", rating: 79 },
      { name: "Román Torres", position: "CB", rating: 80 },
      { name: "Alberto Quintero", position: "RW", rating: 78 },
      { name: "Blas Pérez", position: "ST", rating: 78 },
      { name: "Aníbal Godoy", position: "CDM", rating: 79 },
      { name: "Armando Cooper", position: "CM", rating: 78 },
      { name: "Eric Davis", position: "LB", rating: 78 },
      { name: "Gabriel Gómez", position: "CM", rating: 78 },
      { name: "José Luis Rodríguez", position: "RW", rating: 77 },
      { name: "Michael Murillo", position: "RB", rating: 78 }
    ]
  },
  {
    id: "senegal",
    name: "Senegal",
    abbreviation: "SEN",
    rating: 84,
    players: [
      { name: "Édouard Mendy", position: "GK", rating: 85 },
      { name: "Sadio Mané", position: "LW", rating: 89 },
      { name: "Kalidou Koulibaly", position: "CB", rating: 86 },
      { name: "Idrissa Gueye", position: "CDM", rating: 83 },
      { name: "Ismaïla Sarr", position: "RW", rating: 84 },
      { name: "Moussa Niakhate", position: "CB", rating: 82 },
      { name: "Nampalys Mendy", position: "CM", rating: 81 },
      { name: "Habib Diallo", position: "ST", rating: 80 },
      { name: "Abdou Diallo", position: "LB", rating: 82 },
      { name: "Cheikhou Kouyaté", position: "CM", rating: 80 },
      { name: "Pape Matar Sarr", position: "CM", rating: 80 },
      { name: "Amadou Onana", position: "CM", rating: 81 }
    ]
  },
  {
    id: "costa_rica",
    name: "Costa Rica",
    abbreviation: "CRC",
    rating: 78,
    players: [
      { name: "Keylor Navas", position: "GK", rating: 86 },
      { name: "Bryan Ruiz", position: "CAM", rating: 83 },
      { name: "Joel Campbell", position: "RW", rating: 81 },
      { name: "Celso Borges", position: "CM", rating: 80 },
      { name: "Bryan Oviedo", position: "LB", rating: 79 },
      { name: "Francisco Calvo", position: "CB", rating: 79 },
      { name: "Óscar Duarte", position: "CB", rating: 78 },
      { name: "Kendall Waston", position: "CB", rating: 78 },
      { name: "Randall Azofeifa", position: "RM", rating: 79 },
      { name: "Yeltsin Tejeda", position: "CDM", rating: 78 },
      { name: "Michael Umaña", position: "CB", rating: 77 },
      { name: "Marcel Hernández", position: "ST", rating: 79 }
    ]
  },
  {
    id: "jamaica",
    name: "Jamaica",
    abbreviation: "JAM",
    rating: 77,
    players: [
      { name: "Andre Blake", position: "GK", rating: 83 },
      { name: "Leon Bailey", position: "RW", rating: 84 },
      { name: "Michail Antonio", position: "ST", rating: 83 },
      { name: "Bobby De Cordova-Reid", position: "LW", rating: 80 },
      { name: "Joel Latibeaudiere", position: "CB", rating: 78 },
      { name: "Damion Lowe", position: "CB", rating: 78 },
      { name: "Shamar Nicholson", position: "ST", rating: 80 },
      { name: "Rolando Aarons", position: "LM", rating: 78 },
      { name: "Alvas Powell", position: "RB", rating: 78 },
      { name: "Adrian Mariappa", position: "CB", rating: 77 },
      { name: "Ryan Johnson", position: "CM", rating: 76 },
      { name: "Cory Burke", position: "ST", rating: 76 }
    ]
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    abbreviation: "UZB",
    rating: 76,
    players: [
      { name: "Eldor Shomurodov", position: "ST", rating: 81 },
      { name: "Jaloliddin Masharipov", position: "LM", rating: 80 },
      { name: "Odil Ahmedov", position: "CM", rating: 80 },
      { name: "Anvarjon Soliev", position: "CB", rating: 78 },
      { name: "Davron Ergashev", position: "CB", rating: 77 },
      { name: "Sardor Rashidov", position: "RW", rating: 79 },
      { name: "Otabek Shukurov", position: "CM", rating: 79 },
      { name: "Javlon Ergashev", position: "CDM", rating: 78 },
      { name: "Islom Tukhtakhujaev", position: "GK", rating: 77 },
      { name: "Tiago Bezerra", position: "ST", rating: 79 },
      { name: "Oston Urunov", position: "CAM", rating: 78 },
      { name: "Saidjakhon Khasanov", position: "RB", rating: 76 }
    ]
  }
];

const namePools = {
  europe: { first: ["Luca", "Mason", "Oliver", "Noah", "Ethan", "Julian", "Lucas", "Aaron", "Benjamin", "Alexander", "Kai", "Leo", "Simon", "Max"], last: ["Smith", "Jones", "Brown", "Müller", "Schmidt", "Bianchi", "Carvalho", "Gonzalez", "Silva", "Martinez", "Fernandez", "Giovanni", "Petrov", "Kovacic"] },
  southAmerica: { first: ["Lucas", "Gabriel", "Nicolas", "Matias", "Pedro", "Juan", "Diego", "Santiago", "Bruno", "Thiago", "Fernando", "Andres", "Carlos", "Luis"], last: ["Gonzalez", "Rodriguez", "Martinez", "Silva", "Fernandez", "Alvarez", "Mendoza", "Torres", "Garcia", "Santos", "Mora", "Rios", "Cruz", "Diaz"] },
  northAmerica: { first: ["Tyler", "Jacob", "Ryan", "Dylan", "Logan", "Cameron", "Brandon", "Austin", "Jordan", "Noah", "Evan", "Kyle", "Owen", "Ethan"], last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Taylor"] },
  africa: { first: ["Mohamed", "Sadio", "Riyad", "Hakim", "Kalidou", "Youssef", "Victor", "Jordan", "Abdou", "Ismail", "Simón", "André", "Pierre", "Moussa"], last: ["Salah", "Mané", "Koulibaly", "Ziyech", "Motta", "Diop", "Ndiaye", "Onana", "Aina", "Amah", "Abdel", "Kamara", "N'Guessan", "Diarra"] },
  asia: { first: ["Hiroki", "Takefusa", "Son", "Hwang", "Amin", "Sardar", "Alireza", "Mehdi", "Takumi", "Yuya", "Ritsu", "Rat", "Kang", "Dae"], last: ["Kubo", "Elyounoussi", "Azmoun", "Jahanbakhsh", "Min-jae", "Ritsu", "Lee", "Park", "Kim", "Hasebe", "Yamamoto", "Al-Dawsari", "Hakimi", "Huszti"] },
  default: { first: ["Alex", "Sam", "Jack", "Chris", "Jamie", "Morgan", "Taylor", "Jordan", "Cameron", "Charlie", "Casey", "Ryan", "Max", "Noah"], last: ["Smith", "Jones", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Walker", "Robinson", "Young", "Allen"] }
};

const regionMap = {
  usa: "northAmerica",
  england: "europe",
  mexico: "northAmerica",
  nigeria: "africa",
  canada: "northAmerica",
  france: "europe",
  japan: "asia",
  morocco: "africa",
  brazil: "southAmerica",
  spain: "europe",
  australia: "asia",
  algeria: "africa",
  argentina: "southAmerica",
  germany: "europe",
  saudi_arabia: "asia",
  egypt: "africa",
  portugal: "europe",
  netherlands: "europe",
  south_korea: "asia",
  ghana: "africa",
  belgium: "europe",
  switzerland: "europe",
  iran: "asia",
  cameroon: "africa",
  croatia: "europe",
  denmark: "europe",
  qatar: "asia",
  tunisia: "africa",
  serbia: "europe",
  poland: "europe",
  uae: "asia",
  south_africa: "africa",
  sweden: "europe",
  norway: "europe",
  ecuador: "southAmerica",
  peru: "southAmerica",
  italy: "europe",
  colombia: "southAmerica",
  chile: "southAmerica",
  new_zealand: "oceania",
  austria: "europe",
  uruguay: "southAmerica",
  venezuela: "southAmerica",
  panama: "northAmerica",
  senegal: "africa",
  costa_rica: "northAmerica",
  jamaica: "northAmerica",
  uzbekistan: "asia"
};

const positionCycle = ["GK", "CB", "CB", "RB", "LB", "CM", "CM", "CAM", "RW", "LW", "ST"];

function getPlaceholderName(teamId, index) {
  const region = regionMap[teamId] || "default";
  const pool = namePools[region] || namePools.default;
  const first = pool.first[index % pool.first.length];
  const last = pool.last[(index + teamId.length) % pool.last.length];
  return `${first} ${last}`;
}

function normalizeId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function clampStat(value) {
  return Math.max(45, Math.min(99, Math.round(value)));
}

const positionStatBias = {
  GK: { pace: -40, shooting: -50, passing: -30, dribbling: -45, defending: +5, physical: +18 },
  CB: { pace: -15, shooting: -35, passing: -15, dribbling: -35, defending: +25, physical: +16 },
  LB: { pace: +8, shooting: -20, passing: +5, dribbling: -5, defending: +18, physical: +10 },
  RB: { pace: +8, shooting: -20, passing: +5, dribbling: -5, defending: +18, physical: +10 },
  LWB: { pace: +12, shooting: -18, passing: +8, dribbling: +10, defending: +12, physical: +9 },
  RWB: { pace: +12, shooting: -18, passing: +8, dribbling: +10, defending: +12, physical: +9 },
  CM: { pace: -3, shooting: -8, passing: +10, dribbling: +5, defending: +5, physical: +5 },
  CDM: { pace: -10, shooting: -20, passing: +6, dribbling: -5, defending: +22, physical: +10 },
  CAM: { pace: +1, shooting: +6, passing: +12, dribbling: +10, defending: -15, physical: +3 },
  LM: { pace: +10, shooting: +5, passing: +10, dribbling: +12, defending: -20, physical: +7 },
  RM: { pace: +10, shooting: +5, passing: +10, dribbling: +12, defending: -20, physical: +7 },
  LW: { pace: +14, shooting: +8, passing: +6, dribbling: +14, defending: -30, physical: +6 },
  RW: { pace: +14, shooting: +8, passing: +6, dribbling: +14, defending: -30, physical: +6 },
  ST: { pace: +8, shooting: +20, passing: -10, dribbling: +10, defending: -35, physical: +12 },
  CF: { pace: +6, shooting: +18, passing: -5, dribbling: +12, defending: -25, physical: +10 }
};

function buildPlayerStats(position, rating) {
  const bias = positionStatBias[position] || { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 };
  const base = {
    pace: clampStat(rating + bias.pace),
    shooting: clampStat(rating + bias.shooting),
    passing: clampStat(rating + bias.passing),
    dribbling: clampStat(rating + bias.dribbling),
    defending: clampStat(rating + bias.defending),
    physical: clampStat(rating + bias.physical)
  };

  return {
    pace: {
      overall: base.pace,
      acceleration: clampStat(base.pace + 2),
      sprintSpeed: clampStat(base.pace - 2)
    },
    shooting: {
      overall: base.shooting,
      attPosition: clampStat(base.shooting + 2),
      finishing: clampStat(base.shooting),
      shotPower: clampStat(base.shooting + 1),
      longShots: clampStat(base.shooting - 1),
      volleys: clampStat(base.shooting - 3),
      penalties: clampStat(base.shooting + 1)
    },
    passing: {
      overall: base.passing,
      vision: clampStat(base.passing + 2),
      crossing: clampStat(base.passing + 1),
      fkAccuracy: clampStat(base.passing - 3),
      shortPass: clampStat(base.passing),
      longPass: clampStat(base.passing),
      curve: clampStat(base.passing - 2)
    },
    dribbling: {
      overall: base.dribbling,
      agility: clampStat(base.dribbling + 1),
      balance: clampStat(base.dribbling - 1),
      reactions: clampStat(base.dribbling + 1),
      ballControl: clampStat(base.dribbling),
      dribbling: clampStat(base.dribbling),
      composure: clampStat(base.dribbling - 1)
    },
    defending: {
      overall: base.defending,
      interceptions: clampStat(base.defending + 1),
      heading: clampStat(base.defending),
      defensiveAwareness: clampStat(base.defending + 1),
      standTackle: clampStat(base.defending - 1),
      slideTackle: clampStat(base.defending - 2)
    },
    physical: {
      overall: base.physical,
      jumping: clampStat(base.physical + 3),
      stamina: clampStat(base.physical),
      strength: clampStat(base.physical + 2),
      aggression: clampStat(base.physical - 1)
    }
  };
}

function buildSquad(team) {
  const squad = [];
  const usedIds = new Set();
  team.players.forEach((player, index) => {
    const baseId = `${team.id}_${normalizeId(player.name)}`;
    let pid = baseId;
    if (usedIds.has(pid)) {
      pid = `${baseId}_${index}`;
    }
    usedIds.add(pid);
    squad.push({ id: pid, name: player.name, position: player.position, rating: player.rating, stats: buildPlayerStats(player.position, player.rating), active: true });
  });

  let reserveCount = 1;
  while (squad.length < 23) {
    const position = positionCycle[(reserveCount - 1) % positionCycle.length];
    const rating = Math.max(68, team.rating - 10 + ((reserveCount % 5) - 2));
    const placeholderName = getPlaceholderName(team.id, reserveCount);
    let pid = `${team.id}_reserve_${reserveCount}`;
    while (usedIds.has(pid)) {
      reserveCount += 1;
      pid = `${team.id}_reserve_${reserveCount}`;
    }
    usedIds.add(pid);
    squad.push({ id: pid, name: placeholderName, position, rating, stats: buildPlayerStats(position, rating), active: true });
    reserveCount += 1;
  }

  return squad;
}

const teams = teamConfigs.map((teamConfig) => ({
  id: teamConfig.id,
  name: teamConfig.name,
  abbreviation: teamConfig.abbreviation,
  rating: teamConfig.rating,
  squad: buildSquad(teamConfig)
}));

const worldcupData = {
  name: "FIFA World Cup 2026",
  year: 2026,
  tournamentType: "World Cup",
  formations,
  groups,
  fixtures,
  knockoutBracket,
  teams
};

const outputPath = path.join(__dirname, "..", "data", "worldcup-2026.json");
fs.writeFileSync(outputPath, JSON.stringify(worldcupData, null, 2), "utf8");
console.log(`Wrote ${outputPath}`);
