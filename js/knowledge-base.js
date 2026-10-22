/**
 * Innayatullah International School Knowledge Base
 * Official Knowledge Data for Innaya-GPT
 */

const SCHOOL_KNOWLEDGE_BASE = {
  schoolInfo: {
    name: "Innayatullah International School",
    shortName: "IIS",
    motto: "Excellence, Integrity, and Global Impact",
    arabicMotto: "العلم والعمل والصلاح",
    established: "2011",
    campus: "Knowledge Valley Campus, 14 Innayatullah Boulevard",
    grades: "Creche, Primary, Junior High (JSS 1-3), Senior High (SS 1-3)",
    accreditation: "Cambridge International School & WAEC/NECO Accredited Center of Excellence",
    colors: {
      primary: "Deep Academic Navy & Emerald Green",
      secondary: "Royal Gold & Ivory White"
    },
    houses: [
      { name: "Emerald Falcon", color: "Emerald Green", patron: "Sheikh Innayatullah" },
      { name: "Sapphire Hawk", color: "Royal Navy Blue", patron: "Prof. Chinua Achebe" },
      { name: "Ruby Phoenix", color: "Crimson Red", patron: "Dr. Nelson Mandela" },
      { name: "Gold Eagle", color: "Sunburst Gold", patron: "Queen Amina of Zaria" }
    ]
  },

  leadership: {
    principal: {
      name: "Dr. Hajia Amina Innayatullah",
      title: "Principal & Chief Academic Officer",
      qualifications: "Ph.D. in Educational Administration & Leadership (Oxford), M.Ed. (Unilag)",
      office: "Administrative Complex, Level 2, Suite A-204",
      officeHours: "Monday to Friday: 10:00 AM – 1:00 PM (Appointments via front desk)",
      message: "Our commitment is nurturing inquisitive minds, moral fortitude, and future global pioneers who lead with empathy and knowledge."
    },
    vicePrincipalAcademics: {
      name: "Mr. Emmanuel Adeleke",
      title: "Vice Principal (Academics & Curricula)",
      qualifications: "M.Sc. Curriculum Studies, Cambridge Certified Lead Educator",
      office: "Admin Wing Room A-108"
    },
    vicePrincipalStudentAffairs: {
      name: "Mrs. Fatima Bello",
      title: "Vice Principal (Student Affairs & Pastoral Care)",
      qualifications: "M.Ed. Guidance & Counseling",
      office: "Admin Wing Room A-112"
    },
    headSeniorSchool: {
      name: "Dr. Kenneth Okafor",
      title: "Head of Senior Secondary (SS1 - SS3)",
      office: "Science & Humanities Block, Room B-201"
    },
    schoolCounselor: {
      name: "Mrs. Zainab Al-Mansoor",
      title: "Lead Student Wellbeing & Career Counselor",
      office: "Student Wellness Center, Ground Floor"
    }
  },

  feedingTimetable: {
    overview: "The IIS Cafeteria ('The Scholars' Dining Hall') operates under strict ISO-grade hygiene protocols. Meals are prepared daily by our certified culinary team, providing balanced nutrition, fresh fruits, and dietary accommodations (Vegetarian, Halal, Gluten-conscious).",
    mealTimes: [
      { meal: "Morning Breakfast / Energy Boost", time: "7:00 AM – 7:40 AM", description: "Oatmeal porridge, scrambled eggs, wholewheat toast, baked beans, warm beverage or fresh milk." },
      { meal: "Morning Snack & Fruit Break", time: "10:15 AM – 10:45 AM", description: "Fresh fruit cups, pastries/meat pies, yogurt smoothies, or granola bars." },
      { meal: "Main Lunch Break (Senior School)", time: "12:45 PM – 1:30 PM", description: "Full hot nutritious lunch with protein choices and salad bar." },
      { meal: "Boarders' Dinner / Evening Meal", time: "6:30 PM – 7:45 PM", description: "Balanced dinner followed by light evening dessert." }
    ],
    weeklyMenu: [
      {
        day: "Monday",
        theme: "Energy Kickoff",
        lunch: "Smokey Nigerian Party Jollof Rice with Golden Dodo (Fried Plantain), Grilled Chicken Supreme or Herb Fish, Steamed Vegetables & Chilled Apple Juice.",
        vegOption: "Vegetable Jollof Rice with Roasted Tofu & Bean Ragout"
      },
      {
        day: "Tuesday",
        theme: "Mediterranean & Continental",
        lunch: "Creamy Chicken & Mushroom Penne Pasta (or Tomato Basil Pasta), Garlic Baguette, Tossed Caesar Salad & Fresh Watermelon Slices.",
        vegOption: "Creamy Spinach & Sweet Corn Fettuccine"
      },
      {
        day: "Wednesday",
        theme: "Traditional Heritage",
        lunch: "Fluffy Pounded Yam or Semovita with Rich Egusi or Efo Riro Soup, Tender Beef/Goat Meat or Catfish, plus chilled Zobo-Hibiscus infusion.",
        vegOption: "Efo Riro with Sautéed Mushrooms & Bean Loaf (Moi Moi)"
      },
      {
        day: "Thursday",
        theme: "Asian Fusion & Stir-Fry",
        lunch: "Egg & Vegetable Fried Rice with Sweet & Sour Crispy Chicken or Glazed Beef, Spring Rolls & Orange Wedges.",
        vegOption: "Stir-fry Noodles with Broccoli, Snow Peas and Crispy Tofu"
      },
      {
        day: "Friday",
        theme: "Chef's Special & Comfort Treat",
        lunch: "Spiced Basmati Rice or Potato Wedges with Flame-Grilled Herb Chicken, Coleslaw, Sweetcorn Medley & Ice Cream / Sorbet cup.",
        vegOption: "Stuffed Bell Peppers with Spiced Quinoa and Grilled Corn"
      }
    ],
    guidelines: [
      "Students must present their RFID Smart School Cards at the cafeteria turnstiles.",
      "Queuing etiquette: Orderly single-file line; please respect dining hall attendants.",
      "Waste sorting: Compostable food scraps, recyclable drink bottles, and non-recyclables must go to designated bins.",
      "Outside food delivery (e.g. UberEats/Chowdeck) is strictly prohibited without written housemaster approval."
    ]
  },

  dailyRoutine: [
    { time: "07:30 AM", event: "Arrival & Gate Check", notes: "Students must be properly dressed in uniform" },
    { time: "07:45 AM – 08:15 AM", event: "Morning Assembly / Homeroom", notes: "National anthem, school pledge, principal's announcements" },
    { time: "08:15 AM – 09:15 AM", event: "Period 1", notes: "Academic core instruction" },
    { time: "09:15 AM – 10:15 AM", event: "Period 2", notes: "Academic core instruction" },
    { time: "10:15 AM – 10:45 AM", event: "Short Break", notes: "Healthy snack & hydration" },
    { time: "10:45 AM – 11:45 AM", event: "Period 3", notes: "Laboratory / Classroom sessions" },
    { time: "11:45 AM – 12:45 PM", event: "Period 4", notes: "Laboratory / Classroom sessions" },
    { time: "12:45 PM – 01:30 PM", event: "Long Lunch Break", notes: "Dining hall, Dhuhr prayer for Muslim students, library reading" },
    { time: "01:30 PM – 02:30 PM", event: "Period 5", notes: "Electives and special subjects" },
    { time: "02:30 PM – 03:30 PM", event: "Period 6 & Prep", notes: "Daily review, homework briefings" },
    { time: "03:30 PM – 04:45 PM", event: "Extracurriculars & Sports", notes: "Clubs, athletics, choir, robotics lab" },
    { time: "05:00 PM", event: "Day Students Departure / Boarders Prep", notes: "School buses depart promptly at 5:15 PM" }
  ],

  examinations: {
    gradingScale: [
      { grade: "A1 (Distinction)", range: "85% - 100%", gpa: "4.0" },
      { grade: "B2 (Very Good)", range: "75% - 84%", gpa: "3.5" },
      { grade: "B3 (Good)", range: "65% - 74%", gpa: "3.0" },
      { grade: "C4 - C6 (Credit)", range: "50% - 64%", gpa: "2.0 - 2.5" },
      { grade: "D7 - E8 (Pass)", range: "40% - 49%", gpa: "1.0 - 1.5" },
      { grade: "F9 (Fail)", range: "0% - 39%", gpa: "0.0" }
    ],
    assessmentBreakdown: "Continuous Assessment 1 (15%) + CA 2 Mid-Term (15%) + Projects & Homework (10%) + End of Term Exam (60%) = 100%",
    examRules: [
      "All students must arrive at the examination hall at least 15 minutes before reading time.",
      "Students must display their official IIS Examination Photo Card on the corner of their desk.",
      "Strictly prohibited: Smartphones, smartwatches, programmable calculators, unauthorized paper or notes.",
      "Clear plastic pencil cases only.",
      "Any violation of exam integrity results in immediate cancellation of papers and referral to the Disciplinary Committee."
    ],
    upcomingKeyDates: [
      { event: "Mid-Term Continuous Assessment", date: "October 26 – 30, 2026" },
      { event: "Science Practicals Mock Exams (SS3)", date: "November 16 – 20, 2026" },
      { event: "First Term Final Examinations", date: "December 01 – 11, 2026" },
      { event: "Term Break & Vacation Begins", date: "December 15, 2026" },
      { event: "Resumption for Second Term", date: "January 11, 2027" }
    ]
  },

  clubsAndSports: [
    {
      name: "Robotics, AI & STEM Innovation Club",
      lead: "Engr. David Chukwu",
      meets: "Tuesdays & Thursdays, 3:30 PM in Tech Lab 1",
      description: "Build autonomous robots, Arduino & Raspberry Pi hardware programming, 3D printing, and enter the First Lego League & National STEM Olympiads."
    },
    {
      name: "Literary & National Debate Society",
      lead: "Mrs. Victoria Danjuma",
      meets: "Wednesdays, 3:45 PM in the Amphitheatre",
      description: "Hone public speaking, British Parliamentary debate formats, creative writing, and compete in international debate championships."
    },
    {
      name: "Junior Engineers, Technicians & Scientists (JETS)",
      lead: "Mr. Abdulmalik Sani",
      meets: "Mondays, 3:30 PM in Chemistry Lab",
      description: "Hands-on scientific experiments, renewable energy prototypes, and science fair projects."
    },
    {
      name: "Model United Nations (IIS-MUN)",
      lead: "Mr. Adeleke / Miss Chidinma",
      meets: "Fridays, 3:30 PM in Senior Hall",
      description: "Represent nations, debate global crises, draft international resolutions, and attend overseas MUN conferences."
    },
    {
      name: "Sports & Athletics Academy",
      lead: "Coach Babatunde Adele",
      meets: "Daily after school",
      description: "Football Academy, Basketball court, Swimming Olympic pool, Track & Field, Table Tennis, and Volleyball leagues."
    },
    {
      name: "Music, Performing Arts & Orchestra",
      lead: "Maestro Gabriel Kalu",
      meets: "Tuesdays & Saturdays in Arts Auditorium",
      description: "Strings, brass, piano, choral training, traditional African percussion, and annual musical theater productions."
    }
  ],

  uniformAndDressCode: {
    seniorBoys: "Crisp white long/short-sleeved shirt with gold IIS monogram, tailored charcoal grey trousers, official navy-blue school blazer with gold embroidered crest, official striped school tie, polished black leather lace-up dress shoes, and dark socks.",
    seniorGirls: "Crisp white blouse with school crest, pleated navy blue skirt (below the knee) or charcoal grey tailored trousers, navy-blue blazer with gold crest, school tie or neck ribbon, navy blue or white modest headscarf/hijab for Muslim girls, and black flat/low-heeled dress shoes.",
    sportsDay: "House T-shirt (Falcon, Hawk, Phoenix, or Eagle) with navy breathable shorts/trackpants, white athletic trainers, and white sports socks.",
    hairAndGrooming: "Neat, modest, and well-groomed hair in natural colors. Jewelry is limited to a simple wristwatch and small stud earrings for girls."
  },

  libraryAndResources: {
    name: "Sultan Bello Memorial Knowledge Hub",
    hours: "Monday – Friday: 7:30 AM to 5:30 PM | Saturday: 9:00 AM to 1:00 PM",
    features: [
      "Over 25,000 physical volumes covering sciences, humanities, classics, and African literature.",
      "High-speed e-Library with 40 computer terminals and access to JSTOR, EBSCO, and Cambridge University Press.",
      "Comprehensive 10-year past question bank for WAEC, JAMB/UTME, Cambridge IGCSE, and SAT.",
      "Soundproof group study pods and silent individual study cubicles.",
      "Borrowing allowance: 3 books for up to 14 days with student smart badge."
    ]
  },

  transportation: {
    routes: [
      "Route A: Knowledge Valley – Lekki Phase 1 – Victoria Island",
      "Route B: Ikeja GRA – Maryland – Anthony – Campus",
      "Route C: Magodo Phase 2 – Alausa – Oregun – Campus",
      "Route D: Surulere – Yaba – Gbagada Expressway – Campus"
    ],
    coordinator: "Mr. Sunday Peters (Transport Manager: ext. 402)"
  }
};

/**
 * Dynamic Knowledge Store for DIY High School Data Ingestion (RAG)
 * Allows teachers and students to upload custom .txt files
 */
const DynamicKnowledgeStore = {
  documents: [],

  init() {
    try {
      const stored = localStorage.getItem('innaya_uploaded_documents');
      if (stored) {
        this.documents = JSON.parse(stored);
      } else {
        this.documents = [];
      }
    } catch (e) {
      console.warn('Error reading dynamic knowledge store:', e);
      this.documents = [];
    }
  },

  save() {
    try {
      localStorage.setItem('innaya_uploaded_documents', JSON.stringify(this.documents));
    } catch (e) {
      console.error('Error saving dynamic knowledge store:', e);
    }
  },

  addDocument(filename, textContent) {
    this.init();
    const cleanText = textContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    if (!cleanText) return null;

    // Split text into semantic paragraphs (chunks)
    const rawParagraphs = cleanText.split(/\n\s*\n+/);
    const chunks = [];

    rawParagraphs.forEach((para, idx) => {
      const trimmed = para.trim();
      if (trimmed.length > 15) {
        chunks.push({
          id: `${filename}_chunk_${idx}`,
          text: trimmed,
          tokens: this.tokenize(trimmed),
          docName: filename
        });
      }
    });

    const docEntry = {
      id: 'doc_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      filename: filename,
      uploadDate: new Date().toLocaleDateString(),
      chunkCount: chunks.length,
      wordCount: cleanText.split(/\s+/).length,
      chunks: chunks
    };

    // Replace if file with same name already uploaded
    this.documents = this.documents.filter(d => d.filename !== filename);
    this.documents.push(docEntry);
    this.save();
    return docEntry;
  },

  removeDocument(docId) {
    this.init();
    this.documents = this.documents.filter(d => d.id !== docId);
    this.save();
  },

  clearAll() {
    this.documents = [];
    this.save();
  },

  tokenize(str) {
    const stopwords = new Set([
      'the','a','an','is','are','was','were','in','on','at','to','for','of','and','or',
      'with','about','what','who','when','where','why','how','does','do','did','can',
      'could','would','should','i','you','we','they','it','this','that','these','those',
      'their','there','have','has','had','be','been','by','from','as','all','any'
    ]);
    return str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));
  },

  search(query, topK = 3) {
    this.init();
    if (this.documents.length === 0) return [];

    const queryLower = query.toLowerCase().trim();
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0 && queryLower.length < 3) return [];

    const allChunks = [];
    this.documents.forEach(doc => {
      doc.chunks.forEach(chunk => {
        allChunks.push(chunk);
      });
    });

    const scored = allChunks.map(chunk => {
      let score = 0;
      const chunkTextLower = chunk.text.toLowerCase();

      // Exact substring or key phrase match boost
      if (chunkTextLower.includes(queryLower)) {
        score += 25;
      }

      // Check for partial multi-word phrases
      const subPhrases = queryLower.split(/\s+/);
      if (subPhrases.length > 1) {
        let matchedPhraseCount = 0;
        subPhrases.forEach(sp => {
          if (sp.length > 3 && chunkTextLower.includes(sp)) matchedPhraseCount++;
        });
        score += (matchedPhraseCount / subPhrases.length) * 15;
      }

      // Keyword token overlap
      queryTokens.forEach(t => {
        const matches = chunk.tokens.filter(tok => tok === t || tok.includes(t) || t.includes(tok));
        score += matches.length * 4;
      });

      return { chunk, score };
    });

    const results = scored
      .filter(s => s.score >= 4)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.chunk);

    return results;
  }
};

/**
 * Intelligent Query Matching & Educational AI Response Generator
 */
function findSchoolAnswer(query) {
  const q = query.toLowerCase().trim();

  // STEP 1: Check dynamic uploaded .txt documents first (Local RAG)
  DynamicKnowledgeStore.init();
  const matchedChunks = DynamicKnowledgeStore.search(query);
  if (matchedChunks && matchedChunks.length > 0) {
    const topChunk = matchedChunks[0];
    const additionalChunks = matchedChunks.slice(1);
    const sourceFiles = Array.from(new Set(matchedChunks.map(c => c.docName))).join(', ');

    let response = `### 📖 Extracted From School Document Knowledge Base\n\n`;
    response += `${topChunk.text}\n\n`;

    if (additionalChunks.length > 0) {
      response += `#### 📌 Additional Relevant Details:\n`;
      additionalChunks.forEach(c => {
        response += `* ${c.text.replace(/\n+/g, ' ')}\n`;
      });
      response += `\n`;
    }

    response += `> 📄 **Source Document:** \`${sourceFiles}\` (Loaded in Innaya-GPT Knowledge Store)`;
    return response;
  }

  // STEP 2: Built-in Knowledge Base fallback for Innayatullah International School
  // 1. Feeding / Cafeteria / Food / Lunch / Breakfast / Timetable
  if (q.includes("feed") || q.includes("food") || q.includes("lunch") || q.includes("cafeteria") || 
      q.includes("menu") || q.includes("breakfast") || q.includes("meal") || q.includes("diet") || q.includes("eat")) {
    const ft = SCHOOL_KNOWLEDGE_BASE.feedingTimetable;
    
    // Check if asking about specific day
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const matchedDay = days.find(d => q.includes(d));

    if (matchedDay) {
      const dayItem = ft.weeklyMenu.find(m => m.day.toLowerCase() === matchedDay);
      return `### 🍽️ ${dayItem.day} Cafeteria Menu (${dayItem.theme})

Here is the dining schedule for **${dayItem.day}** at the Scholars' Dining Hall:

* **Main Lunch:** ${dayItem.lunch}
* **Vegetarian / Special Diet:** ${dayItem.vegOption}

**Meal Hours:**
* **Breakfast:** 7:00 AM – 7:40 AM
* **Snack Break:** 10:15 AM – 10:45 AM
* **Lunch Break:** 12:45 PM – 1:30 PM

> **Tip for Students:** Remember to tap your RFID Smart Badge at the entrance turnstile!`;
    }

    // Full timetable response
    let menuRows = ft.weeklyMenu.map(m => 
      `| **${m.day}** | ${m.lunch} | *${m.vegOption}* |`
    ).join("\n");

    let mealTimeList = ft.mealTimes.map(mt => 
      `* **${mt.meal}** (${mt.time}): ${mt.description}`
    ).join("\n");

    return `### 🍽️ Innayatullah International School Feeding Timetable

Welcome to **The Scholars' Dining Hall**! All meals are freshly prepared under ISO-grade hygiene standards to nourish both body and mind.

#### ⏰ Daily Serving Times:
${mealTimeList}

#### 📋 Weekly Lunch Menu:
| Day | Main Entrée | Vegetarian Alternative |
| :--- | :--- | :--- |
${menuRows}

#### 📌 Cafeteria Etiquette & Rules:
* Tap your **RFID Student Smart Card** upon entry.
* Queuing is single-file; please extend courteous greetings to dining staff.
* Sort your tray into designated **Compost**, **Recyclables**, and **Trash** stations.
* Outside commercial deliveries (e.g. food delivery apps) are strictly restricted during school hours.`;
  }

  // 2. Principal / Head / Administrator / Leadership / Vice Principal
  if (q.includes("principal") || q.includes("headmaster") || q.includes("head") || 
      q.includes("who is in charge") || q.includes("director") || q.includes("admin") || q.includes("counselor") || q.includes("leadership")) {
    const l = SCHOOL_KNOWLEDGE_BASE.leadership;

    if (q.includes("counselor") || q.includes("wellbeing") || q.includes("mental health")) {
      return `### 🌿 School Guidance & Counseling Office

* **Lead Counselor:** **${l.schoolCounselor.name}**
* **Title:** ${l.schoolCounselor.title}
* **Location:** ${l.schoolCounselor.office}
* **Services:** Academic mentoring, career & university pathway planning, stress management, personal counseling.
* **Confidentiality:** Student consultations are completely private and safe. Walk-ins are welcome during breaks or book via the student portal.`;
    }

    if (q.includes("vice") || q.includes("vp")) {
      return `### 🏛️ Innayatullah International School - Vice Principals

* **Vice Principal (Academics & Curricula):** **${l.vicePrincipalAcademics.name}** (${l.vicePrincipalAcademics.qualifications})
  * *Office:* ${l.vicePrincipalAcademics.office}
* **Vice Principal (Student Affairs & Pastoral Care):** **${l.vicePrincipalStudentAffairs.name}** (${l.vicePrincipalStudentAffairs.qualifications})
  * *Office:* ${l.vicePrincipalStudentAffairs.office}
* **Head of Senior Secondary (SS1 - SS3):** **${l.headSeniorSchool.name}**
  * *Office:* ${l.headSeniorSchool.office}`;
    }

    return `### 🎓 Meet Our Principal: ${l.principal.name}

* **Position:** ${l.principal.title}
* **Academic Credentials:** ${l.principal.qualifications}
* **Office Location:** ${l.principal.office}
* **Student & Parent Visiting Hours:** ${l.principal.officeHours}

> *"Our commitment is nurturing inquisitive minds, moral fortitude, and future global pioneers who lead with empathy and knowledge."*
> — **Dr. Hajia Amina Innayatullah**

#### Other Key Academic Leaders:
* **Vice Principal (Academics):** ${l.vicePrincipalAcademics.name}
* **Vice Principal (Student Affairs):** ${l.vicePrincipalStudentAffairs.name}
* **Head of Senior Secondary:** ${l.headSeniorSchool.name}
* **Lead Student Counselor:** ${l.schoolCounselor.name}

If you need an appointment with the Principal's office, please speak with the administrative receptionist in Room A-201.`;
  }

  // 3. School Motto, Anthem, Houses, About
  if (q.includes("motto") || q.includes("anthem") || q.includes("vision") || q.includes("mission") || 
      q.includes("house") || q.includes("color") || q.includes("founded") || q.includes("history")) {
    const s = SCHOOL_KNOWLEDGE_BASE.schoolInfo;
    const housesList = s.houses.map(h => `* **${h.name}** (${h.color}) — Named in honour of ${h.patron}`).join("\n");

    return `### 🏛️ About Innayatullah International School (IIS)

* **School Motto:** *"Excellence, Integrity, and Global Impact"* (العلم والعمل والصلاح)
* **Established:** ${s.established}
* **Campus:** ${s.campus}
* **Accreditations:** ${s.accreditation}
* **School Brand Colors:** ${s.colors.primary} with ${s.colors.secondary} accents.

#### 🛡️ The Four School Houses:
${housesList}

#### 🎵 School Anthem Excerpt:
> *"Arise, O noble scholars of Innayatullah,*
> *With minds enlightened and hearts of grace,*
> *Pursuing truth beneath the morning sun,*
> *To build a brighter dawn for every race.*
> *In faith and diligence we proudly stand,*
> *For God, for honor, and our motherland!"*`;
  }

  // 4. Daily Routine / Timetable / Bell Schedule / Assembly
  if (q.includes("routine") || q.includes("schedule") || q.includes("bell") || q.includes("assembly") || 
      q.includes("period") || q.includes("closing time") || q.includes("resumption time")) {
    let rows = SCHOOL_KNOWLEDGE_BASE.dailyRoutine.map(r => 
      `| ${r.time} | **${r.event}** | ${r.notes} |`
    ).join("\n");

    return `### ⏰ Daily High School Schedule & Bell Routine

Classes run Monday through Friday with the following structured bell times:

| Time | Activity / Period | Notes |
| :--- | :--- | :--- |
${rows}

* **Late Coming Policy:** Gates close promptly at **7:45 AM**. Late arrivals must sign in at Security Station 1 and require a pass from Student Affairs.`;
  }

  // 5. Exams, Dates, Tests, Grading, WAEC, Cambridge, Assessment
  if (q.includes("exam") || q.includes("grade") || q.includes("grading") || q.includes("test") || 
      q.includes("waec") || q.includes("cambridge") || q.includes("calendar") || q.includes("dates") || q.includes("ca")) {
    const e = SCHOOL_KNOWLEDGE_BASE.examinations;
    
    let datesList = e.upcomingKeyDates.map(d => `* **${d.date}:** ${d.event}`).join("\n");
    let gradeRows = e.gradingScale.map(g => `| ${g.grade} | ${g.range} | ${g.gpa} |`).join("\n");
    let rulesList = e.examRules.map(r => `* ${r}`).join("\n");

    return `### 📚 Examinations & Academic Grading

#### 📅 Upcoming Academic Calendar & Exam Dates:
${datesList}

#### 📊 Continuous Assessment Structure:
${e.assessmentBreakdown}

#### 🎯 IIS Official Grading Scale:
| Grade | Score Range | GPA Equivalent |
| :--- | :--- | :--- |
${gradeRows}

#### ⚠️ Hall Rules for Examinations:
${rulesList}`;
  }

  // 6. Clubs, Sports, Extracurriculars
  if (q.includes("club") || q.includes("sport") || q.includes("football") || q.includes("robotics") || 
      q.includes("debate") || q.includes("extra") || q.includes("music") || q.includes("swimming")) {
    let clubsList = SCHOOL_KNOWLEDGE_BASE.clubsAndSports.map(c => 
      `#### 🚀 ${c.name}
* **Faculty Advisor:** ${c.lead}
* **Meeting Time:** ${c.meets}
* **Overview:** ${c.description}`
    ).join("\n\n");

    return `### ⚽ Co-Curricular Clubs & Sports Societies

High school students at IIS are required to participate in at least **one academic club** and **one athletic or artistic society**:

${clubsList}

> **Registration:** Speak with Mrs. Fatima Bello (VP Student Affairs) or sign up through your student portal under the *'Clubs'* tab!`;
  }

  // 7. Uniform, Dress Code, Grooming
  if (q.includes("uniform") || q.includes("dress") || q.includes("wear") || q.includes("clothes") || 
      q.includes("hair") || q.includes("shoes") || q.includes("grooming")) {
    const u = SCHOOL_KNOWLEDGE_BASE.uniformAndDressCode;
    return `### 👔 Innayatullah International School Dress Code

Our uniform represents pride, discipline, and unity across our student body.

* **Senior High Boys (SS1 - SS3):**
  ${u.seniorBoys}

* **Senior High Girls (SS1 - SS3):**
  ${u.seniorGirls}

* **Sports & PE Days (Tuesdays / House Sports):**
  ${u.sportsDay}

* **Grooming & Accessories Policy:**
  ${u.hairAndGrooming}

> **Note:** Uniform inspection takes place every morning during homeroom assembly. Infractions will be recorded on the student demerit card.`;
  }

  // 8. Library, Books, Research, Study
  if (q.includes("library") || q.includes("book") || q.includes("borrow") || q.includes("study") || 
      q.includes("past question") || q.includes("jamb") || q.includes("research")) {
    const l = SCHOOL_KNOWLEDGE_BASE.libraryAndResources;
    let featList = l.features.map(f => `* ${f}`).join("\n");

    return `### 📖 ${l.name}

Welcome to our multi-level research library and digital resource hub!

* **Operating Hours:** ${l.hours}
* **Chief Librarian:** Mr. Alistair Vance (M.Inf.Sc)

#### 🌟 Facility Resources:
${featList}

#### 💡 How to Borrow Books:
1. Scan your barcode student ID at the circulation desk.
2. You can borrow up to **3 titles** simultaneously for a 14-day loan period.
3. Overdue fines are ₦100/day per volume to encourage fair circulation.`;
  }

  // 9. Transportation, School Bus
  if (q.includes("bus") || q.includes("transport") || q.includes("route") || q.includes("pickup") || q.includes("dropoff")) {
    let routes = SCHOOL_KNOWLEDGE_BASE.transportation.routes.map(r => `* **${r}**`).join("\n");
    return `### 🚌 School Bus Transportation Services

The IIS Fleet provides air-conditioned, GPS-tracked transportation for day students across key city corridors:

${routes}

* **Coordinator:** ${SCHOOL_KNOWLEDGE_BASE.transportation.coordinator}
* **Departure Times:** Buses leave campus at **5:15 PM** sharp following club and sports activities.
* **Safety:** Every bus is accompanied by an adult transit matron and real-time parent SMS notifications.`;
  }

  // 10. Clinic, Health, Medical, Sick bay
  if (q.includes("clinic") || q.includes("nurse") || q.includes("doctor") || q.includes("sick") || 
      q.includes("health") || q.includes("hospital") || q.includes("medicine")) {
    return `### 🏥 School Health Center & Sick Bay

* **Location:** Ground Floor, adjacent to Gate 2 (West Wing)
* **Staffing:** 2 Registered Pediatric Nurses and Resident Physician on campus during school hours.
* **Services:** First aid, emergency treatment, medication administration, rest pods, and certified referral to our partner tertiary hospital.
* **Protocol:** If you feel unwell in class, inform your subject teacher to receive a Clinic Slip before proceeding to the clinic.`;
  }

  // 11. Academic Help / High School Subjects (Math, Physics, Chemistry, Biology, English)
  if (q.includes("help") || q.includes("math") || q.includes("physics") || q.includes("chemistry") || 
      q.includes("biology") || q.includes("essay") || q.includes("solve") || q.includes("homework")) {
    return `### 🧠 Academic Tutoring & Homework Guidance

Innaya-GPT is equipped to guide you through your high school curriculum! Here are some common topics I can help you with:

* **Mathematics:** Quadratic equations, trigonometry, calculus, circle theorems, statistics & probability.
* **Physics:** Newton’s laws of motion, electricity & Ohm’s law, optics, thermodynamics, wave equations.
* **Chemistry:** Periodic trends, stoichiometry, organic chemistry nomenclature, acid-base titrations.
* **Biology:** Photosynthesis, genetics & Punnett squares, cellular respiration, human circulatory system.
* **English & Literature:** Essay structures (Argumentative, Expository), poetry analysis, Shakespearean drama, literary devices.

👉 **How to ask:** Just type your specific question or homework prompt (e.g., *"Explain Newton's Second Law with an example"* or *"How do I balance the chemical equation for combustion of propane?"*).`;
  }

  // 12. Smart fallback educational response
  return generateIntelligentFallback(query);
}

/**
 * Intelligent educational assistant fallback for general academic or school questions
 */
function generateIntelligentFallback(query) {
  const cleanQ = query.replace(/[?.,!]/g, "").trim();

  // Handle greetings
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good day", "salam", "assalam", "yo"];
  if (greetings.some(g => cleanQ.toLowerCase() === g || cleanQ.toLowerCase().startsWith(g + " "))) {
    return `### 👋 Assalamu Alaikum & Hello!

Welcome to **Innaya-GPT**, your personal high school AI study companion at **Innayatullah International School**! 

I'm here to assist you with:
* 🍽️ **Cafeteria & Feeding Timetable** (daily breakfast & lunch menus)
* 👨‍🏫 **School Leadership & Principal's Office Hours**
* 📅 **Term Dates, Exam Schedules & Continuous Assessment**
* 🥋 **Sports, Clubs & STEM Societies**
* 👔 **Uniform Guidelines & School Rules**
* 📚 **Homework explanations across Math, Sciences, and Arts**

What would you like to explore today?`;
  }

  // General helpful educational answer format
  return `### 🎓 Innaya-GPT Guidance

Thank you for your question: **"${query}"**

As your AI assistant at **Innayatullah International School**, here is the guidance for your query:

1. **Academic & School Policy Context:**
   Innayatullah International School emphasizes independent critical inquiry alongside moral discipline. For school-specific documentation on this topic, refer to your **Student Handbook 2026/2027** or the **Student Portal**.

2. **Key Recommendations:**
   * Review the relevant chapters in your syllabus or lecture notes.
   * If this relates to administrative approvals, course registration, or fee payments, please consult the **Administration Desk in Room A-101**.
   * If this is an academic subject problem, feel free to break it down and ask me specific sub-questions (e.g. formulas, definitions, step-by-step solutions).

3. **Suggested Next Prompts:**
   * *"Show me the feeding timetable for Wednesday"*
   * *"Who is the Principal of Innayatullah International School?"*
   * *"What are the upcoming exam dates?"*
   * *"Tell me about the Robotics and STEM club"*

Can I help you with any other school detail?`;
}

// Export for usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCHOOL_KNOWLEDGE_BASE, findSchoolAnswer };
}
