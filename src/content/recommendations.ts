import type { L10n } from './types';

export interface RecommendedBook {
  /** Titles and authors are proper names and stay as they are in both languages. */
  title: string;
  author: string;
  text: L10n;
}

export interface ReadingStage {
  title: L10n;
  books: RecommendedBook[];
}

export interface RecommendedPerson {
  /** A name stays as written in both languages. */
  name: string;
  /** The LinkedIn profile, when it was found and clearly matches. */
  url?: string;
  focus: L10n;
}

export interface PeopleGroup {
  title: L10n;
  people: RecommendedPerson[];
}

/**
 * One recommended post or article. Add new ones at the top; the page lists them in this order.
 * An entry with `takeaways` also gets its own page on the site (a summary in my own words); one without goes straight to the original.
 * The summaries are paraphrased and credit the author: the original text is never copied.
 */
export interface Recommendation {
  slug: string;
  title: L10n;
  author: string;
  /** Where it is published, shown next to the author. */
  source: string;
  url: string;
  summary: L10n;
  /** The main points, in my own words. */
  takeaways?: L10n<string[]>;
  /** A reading list in stages, numbered across the stages in the order given. */
  stages?: ReadingStage[];
  /** A list of people to follow, in groups. */
  people?: { heading: L10n; groups: PeopleGroup[] };
  /** More titles suggested elsewhere (for example in the comments), with a heading. */
  more?: { heading: L10n; items: string[] };
}

const p = (name: string, url: string | undefined, en: string, id = en): RecommendedPerson => ({ name, url, focus: { en, id } });

export const recommendations: Recommendation[] = [
  {
    slug: 'seven-books-career-restart',
    title: {
      en: 'If I restarted my career today, I’d read these 7 books first',
      id: 'Kalau saya memulai karier lagi hari ini, ini 7 buku yang akan saya baca lebih dulu',
    },
    author: 'Anton Martyniuk',
    source: 'LinkedIn',
    url: 'https://www.linkedin.com/posts/anton-martyniuk_if-i-restarted-my-career-today-id-read-share-7527996323325816833-P3Ov',
    summary: {
      en: 'A reading order for developers from a .NET engineer with 13+ years of experience: seven books in three stages.',
      id: 'Urutan membaca untuk developer dari engineer .NET berpengalaman 13+ tahun: tujuh buku dalam tiga tahap.',
    },
    takeaways: {
      en: [
        'The order of the books matters as much as the books themselves.',
        'Read all seven in about a year.',
        'AI can produce a working implementation, but deciding whether it is the right one still takes someone who knows the trade-offs.',
      ],
      id: [
        'Urutan buku sama pentingnya dengan bukunya sendiri.',
        'Baca ketujuhnya dalam waktu sekitar satu tahun.',
        'AI bisa menghasilkan implementasi yang berjalan, tetapi menentukan apakah itu implementasi yang tepat tetap butuh orang yang paham trade-off.',
      ],
    },
    stages: [
      {
        title: { en: 'Books 1 to 3: become a developer people want on their team', id: 'Buku 1 sampai 3: menjadi developer yang diinginkan tim' },
        books: [
          {
            title: 'The Pragmatic Programmer',
            author: 'Andy Hunt, Dave Thomas',
            text: {
              en: 'Small habits that make others trust the quality of your code. Best read in your first year.',
              id: 'Kebiasaan kecil yang membuat orang lain percaya pada kualitas kode Anda. Sebaiknya dibaca di tahun pertama.',
            },
          },
          {
            title: 'Refactoring: Improving the Design of Existing Code',
            author: 'Martin Fowler',
            text: {
              en: 'Changing code in small, safe steps, a skill used every day on almost any project.',
              id: 'Mengubah kode lewat langkah kecil yang aman, kemampuan yang dipakai setiap hari di hampir semua proyek.',
            },
          },
          {
            title: 'Head First Design Patterns',
            author: 'Eric Freeman, Elisabeth Robson',
            text: {
              en: 'Design patterns explained with pictures and stories. The reason behind each pattern is easier to see once you know refactoring.',
              id: 'Design pattern dijelaskan lewat gambar dan cerita. Alasan di balik tiap pattern lebih mudah dipahami setelah mengenal refactoring.',
            },
          },
        ],
      },
      {
        title: { en: 'Books 4 and 5: understand how real systems behave', id: 'Buku 4 dan 5: memahami cara kerja sistem nyata' },
        books: [
          {
            title: 'Designing Data-Intensive Applications',
            author: 'Martin Kleppmann',
            text: {
              en: 'Databases, replication and message queues: why systems get slow and how distributed systems work. Essential for backend work.',
              id: 'Database, replication, dan message queue: mengapa sistem menjadi lambat dan bagaimana sistem terdistribusi bekerja. Penting untuk backend.',
            },
          },
          {
            title: 'System Design Interview, Volume 1',
            author: 'Alex Xu',
            text: {
              en: 'A four-step method for designing a system, useful in interviews and in daily work.',
              id: 'Metode empat langkah untuk merancang sistem, berguna untuk wawancara maupun pekerjaan sehari-hari.',
            },
          },
        ],
      },
      {
        title: { en: 'Books 6 and 7: make architecture decisions', id: 'Buku 6 dan 7: mengambil keputusan arsitektur' },
        books: [
          {
            title: 'Building Evolutionary Architectures',
            author: 'Neal Ford, Rebecca Parsons, Patrick Kua',
            text: {
              en: 'Architecture that adapts as requirements change, and fitness functions that protect its quality automatically.',
              id: 'Arsitektur yang beradaptasi saat kebutuhan berubah, dan fitness function yang menjaga kualitasnya secara otomatis.',
            },
          },
          {
            title: 'Head First Software Architecture',
            author: 'Raju Gandhi, Mark Richards, Neal Ford',
            text: {
              en: 'The step from senior developer to software architect: architectural styles, trade-offs and how to explain a decision.',
              id: 'Langkah dari senior developer menjadi software architect: architectural style, trade-off, dan cara menjelaskan keputusan.',
            },
          },
        ],
      },
    ],
    more: {
      heading: { en: 'Also suggested by readers in the comments', id: 'Juga disarankan pembaca di kolom komentar' },
      items: [
        'Patterns of Enterprise Application Architecture, Martin Fowler',
        'Domain-Driven Design, Eric Evans',
        'Clean Code and The Clean Coder, Robert C. Martin',
        'Release It!, Michael Nygard',
        'Implementing Domain-Driven Design, Vaughn Vernon',
      ],
    },
  },
  {
    slug: 'best-linkedin-creators',
    title: { en: 'Best LinkedIn Creators to Follow', id: 'Kreator LinkedIn Terbaik untuk Diikuti' },
    author: 'Anton Martyniuk',
    source: 'LinkedIn',
    url: 'https://www.linkedin.com/posts/anton-martyniuk_90-of-linkedin-content-on-software-development-share-7528721115716665346-B0RX',
    summary: {
      en: '30 creators worth following, in three groups: .NET, architecture and system design, and cloud, security, DevOps and AI.',
      id: '30 kreator yang layak diikuti dalam tiga kelompok: .NET, arsitektur dan system design, serta cloud, keamanan, DevOps, dan AI.',
    },
    takeaways: {
      en: [
        'Much of the software development content on LinkedIn is either AI-generated or poor advice. This is a list of 30 people who write proven, good content.',
        'Building apps gives you skills. Watching how others reason about trade-offs gives you judgment.',
      ],
      id: [
        'Banyak konten pengembangan software di LinkedIn dibuat AI atau berisi saran yang buruk. Ini daftar 30 orang yang menulis konten yang teruji dan bagus.',
        'Membangun aplikasi memberi keterampilan. Melihat cara orang lain menimbang trade-off memberi penilaian yang matang.',
      ],
    },
    people: {
      heading: { en: 'The 30 creators', id: '30 kreator' },
      groups: [
        {
          title: { en: '.NET and software architecture', id: '.NET dan arsitektur software' },
          people: [
            p('Anton Martyniuk', 'https://www.linkedin.com/in/anton-martyniuk/', '.NET and software architecture', '.NET dan arsitektur software'),
            p('Milan Jovanović', 'https://www.linkedin.com/in/milan-jovanovic/', '.NET and software architecture', '.NET dan arsitektur software'),
            p('Kristijan Kralj', 'https://www.linkedin.com/in/kristijankralj/', '.NET without over-engineering', '.NET tanpa over-engineering'),
            p('Dave Callan', 'https://www.linkedin.com/in/davidcallan/', '.NET news', 'Berita .NET'),
            p('Stefan Đokić', 'https://www.linkedin.com/in/djokic-stefan/', '.NET newsletter and community', 'Newsletter dan komunitas .NET'),
            p('Dr Milan Milanović', 'https://www.linkedin.com/in/milanmilanovic/', 'Tech world, personal growth, .NET', 'Dunia teknologi, pengembangan diri, .NET'),
            p('Nick Cosentino', 'https://www.linkedin.com/in/nickcosentino/', 'Software engineering management', 'Manajemen software engineering'),
            p('Julio Casal', 'https://www.linkedin.com/in/juliocasal/', '.NET, Azure, backend'),
            p('Pavle Davitković', 'https://www.linkedin.com/in/pavledavitkovic/', '.NET and MAUI', '.NET dan MAUI'),
            p('Mukesh Murugan', 'https://www.linkedin.com/in/iammukeshm/', '.NET and AWS', '.NET dan AWS'),
            p('Gui Ferreira', 'https://www.linkedin.com/in/gferreira/', '.NET and AI', '.NET dan AI'),
            p('Kanaiya Katarmal', 'https://www.linkedin.com/in/kanaiyakatarmal/', '.NET'),
            p('Aram Tchekrekjian', 'https://www.linkedin.com/in/aramt87/', '.NET tips', 'Tips .NET'),
            p('Poorna Soysa', 'https://www.linkedin.com/in/poorna-soysa/', '.NET tips', 'Tips .NET'),
            p('Nikola Knežević', 'https://www.linkedin.com/in/nikola-knez/', '.NET tips', 'Tips .NET'),
            p('Serkut Yildirim', 'https://www.linkedin.com/in/serkutyildirim/', '.NET tips', 'Tips .NET'),
          ],
        },
        {
          title: { en: 'Software architecture and system design', id: 'Arsitektur software dan system design' },
          people: [
            p('Raul Junco', 'https://www.linkedin.com/in/raul-junco/', 'Software architecture', 'Arsitektur software'),
            p('Neo Kim', 'https://www.linkedin.com/in/nk-systemdesign-one/', 'System design'),
            p('Alexandre Zajac', 'https://www.linkedin.com/in/alexandre-zajac/', 'Software engineering, system design, AI'),
            p('Daniel Moka', 'https://www.linkedin.com/in/danielmoka/', 'Software craftsmanship'),
            p('John Crickett', 'https://www.linkedin.com/in/johncrickett/', 'Coding challenges', 'Tantangan coding'),
            p('Nikki Siapno', 'https://www.linkedin.com/in/nikkisiapno/', 'Engineering and leadership', 'Engineering dan kepemimpinan'),
            p('Eric Roby', 'https://www.linkedin.com/in/codingwithroby/', 'Backend developer growth', 'Pengembangan karier backend developer'),
            p('Abdirahman Jama', 'https://www.linkedin.com/in/abdirahman-sj/', 'Software development and AWS', 'Pengembangan software dan AWS'),
          ],
        },
        {
          title: { en: 'Cloud, security, DevOps and AI', id: 'Cloud, keamanan, DevOps, dan AI' },
          people: [
            p('Saed', 'https://www.linkedin.com/in/saedf/', 'Cybersecurity', 'Keamanan siber'),
            p('Vishakha Sadhwani', 'https://www.linkedin.com/in/vsadhwani/', 'Cloud and DevOps', 'Cloud dan DevOps'),
            p('Rocky Bhatia', 'https://www.linkedin.com/in/rocky-bhatia-a4801010/', 'GenAI and systems at scale', 'GenAI dan sistem skala besar'),
            p('Ruben Hassid', 'https://www.linkedin.com/in/ruben-hassid/', 'AI'),
            p('Mayank A.', 'https://www.linkedin.com/in/curiouslearner/', 'AI and software development', 'AI dan pengembangan software'),
            p('Hina Arora', 'https://www.linkedin.com/in/careerwithhina/', 'AI-assisted personal branding', 'Personal branding dengan bantuan AI'),
          ],
        },
      ],
    },
  },
];

export const getRecommendation = (slug: string) => recommendations.find((r) => r.slug === slug);

/** Entries that have a page of their own on the site. */
export const recommendationPages = recommendations.filter((r) => r.takeaways);
