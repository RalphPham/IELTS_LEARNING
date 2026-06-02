import type { SequencingRule } from '@/types/grammar'
import { SEQUENCING_INTRO, SEQUENCING_RULES } from './sequencing'

// A "special topic" is a rule-based grammar topic (not one of the 12 tenses):
// tense coordination, future forms, have/have got, used to, etc.
// They reuse the SequencingRule structure (conjunction → patterns).
export interface SpecialTopic {
  id: string
  name: string
  nameVi: string
  emoji: string
  intro: string
  rules: SequencingRule[]
}

const FUTURE_FORMS: SpecialTopic = {
  id: 'future_forms',
  name: 'Future Forms',
  nameVi: 'Cách diễn đạt tương lai',
  emoji: '🔮',
  intro:
    'Tiếng Anh có nhiều cách nói về tương lai. Chọn đúng dạng tuỳ vào: đã lên kế hoạch trước hay quyết định tức thì, có lịch trình cố định hay chỉ là dự đoán. 4 dạng chính: be going to · will · Present Continuous · Present Simple.',
  rules: [
    {
      conjunction: 'BE GOING TO',
      meaningVi: 'kế hoạch/dự định đã quyết định trước, hoặc dự đoán có bằng chứng',
      patterns: [
        {
          situation: 'Kế hoạch, dự định đã quyết định từ trước (intention)',
          pattern: 'S + am/is/are + going to + V(bare)',
          example: "I'm going to upgrade my hard drive this weekend.",
        },
        {
          situation: 'Dự đoán có bằng chứng rõ ràng ngay trước mắt',
          pattern: 'S + am/is/are + going to + V(bare)',
          example: 'Look at those clouds — it’s going to rain.',
        },
      ],
    },
    {
      conjunction: 'WILL',
      meaningVi: 'quyết định tức thì, dự đoán cảm tính, lời hứa/đề nghị',
      patterns: [
        {
          situation: 'Quyết định bộc phát ngay tại thời điểm nói',
          pattern: 'S + will + V(bare)',
          example: '"The phone is ringing." — "I\'ll get it."',
        },
        {
          situation: 'Dự đoán cá nhân không có căn cứ chắc (I think / probably)',
          pattern: 'S + will + V(bare)',
          example: 'I think our team will win tomorrow.',
        },
        {
          situation: 'Lời hứa, lời đề nghị, lời cảnh báo',
          pattern: 'S + will + V(bare)',
          example: "I'll call you the moment I land.",
        },
      ],
    },
    {
      conjunction: 'PRESENT CONTINUOUS',
      meaningVi: 'kế hoạch đã sắp xếp cụ thể (có giờ/địa điểm)',
      patterns: [
        {
          situation: 'Sự sắp xếp cá nhân cho tương lai gần (đã chốt giờ, người, chỗ)',
          pattern: 'S + am/is/are + V-ing',
          example: "I'm meeting the designer at 3 p.m. tomorrow.",
        },
      ],
    },
    {
      conjunction: 'PRESENT SIMPLE',
      meaningVi: 'lịch trình cố định (tàu xe, lịch chiếu, thời khoá biểu)',
      patterns: [
        {
          situation: 'Sự kiện theo thời gian biểu cố định',
          pattern: 'S + V(s/es)',
          example: 'The train leaves at 7:15 tomorrow morning.',
        },
      ],
    },
  ],
}

const HAVE_GOT: SpecialTopic = {
  id: 'have_got',
  name: 'Have / Have got',
  nameVi: 'Have & Have got',
  emoji: '🎒',
  intro:
    '"Have got" và "have" đều diễn tả sở hữu, quan hệ, đặc điểm, hay bệnh tật — nghĩa giống nhau. "Have got" thiên về Anh-Anh và văn nói; "have" trung lập hơn. Khác nhau ở cách tạo phủ định/câu hỏi.',
  rules: [
    {
      conjunction: 'SỞ HỮU (POSSESSION)',
      meaningVi: 'có cái gì / có quan hệ / đặc điểm',
      patterns: [
        {
          situation: 'Khẳng định — hai cách nói cùng nghĩa',
          pattern: "S + have/has got + N   =   S + have/has + N",
          example: "I've got two brothers. = I have two brothers.",
        },
        {
          situation: 'Phủ định',
          pattern: "S + haven't/hasn't got + N   =   S + don't/doesn't have + N",
          example: "She hasn't got a car. = She doesn't have a car.",
        },
        {
          situation: 'Câu hỏi',
          pattern: 'Have/Has + S + got + N?   =   Do/Does + S + have + N?',
          example: 'Have you got a charger? = Do you have a charger?',
        },
      ],
    },
    {
      conjunction: 'BỆNH TẬT (ILLNESS)',
      meaningVi: 'bị bệnh gì đó',
      patterns: [
        {
          situation: 'Nói về triệu chứng/bệnh',
          pattern: "S + have/has got + a cold/headache...",
          example: "I've got a terrible headache. = I have a terrible headache.",
        },
      ],
    },
    {
      conjunction: 'LƯU Ý',
      meaningVi: 'những điểm hay nhầm',
      patterns: [
        {
          situation: '"Have got" chỉ dùng ở hiện tại. Quá khứ phải dùng "had" (KHÔNG dùng "had got")',
          pattern: 'Past: S + had + N',
          example: 'When I was a kid, I had a dog. (KHÔNG nói "had got")',
        },
        {
          situation: '"Have" khi là hành động (ăn, tắm, nghỉ) thì KHÔNG dùng "got"',
          pattern: 'have breakfast / have a shower (no "got")',
          example: 'I have breakfast at 7. (KHÔNG nói "have got breakfast")',
        },
      ],
    },
  ],
}

const USED_TO: SpecialTopic = {
  id: 'used_to',
  name: 'Used to',
  nameVi: 'Used to & be/get used to',
  emoji: '⏪',
  intro:
    '"Used to + V" diễn tả thói quen/trạng thái trong quá khứ nay không còn. Đừng nhầm với "be used to + V-ing" (đã quen với) và "get used to + V-ing" (đang quen dần) — đây là lỗi kinh điển.',
  rules: [
    {
      conjunction: 'USED TO + V',
      meaningVi: 'thói quen/trạng thái quá khứ nay không còn nữa',
      patterns: [
        {
          situation: 'Khẳng định — thói quen quá khứ',
          pattern: 'S + used to + V(bare)',
          example: 'I used to smoke, but I quit years ago.',
        },
        {
          situation: 'Phủ định',
          pattern: "S + didn't use to + V(bare)   (hoặc never used to)",
          example: "She didn't use to like coffee, but now she loves it.",
        },
        {
          situation: 'Câu hỏi',
          pattern: 'Did + S + use to + V(bare)?',
          example: 'Did you use to play any sports at school?',
        },
      ],
    },
    {
      conjunction: 'BE USED TO + V-ing / N',
      meaningVi: 'đã quen với việc gì (trạng thái hiện tại)',
      patterns: [
        {
          situation: 'Diễn tả đã quen, không còn thấy lạ/khó',
          pattern: 'S + am/is/are + used to + V-ing / N',
          example: "I'm used to working late now — it doesn't bother me.",
        },
      ],
    },
    {
      conjunction: 'GET USED TO + V-ing / N',
      meaningVi: 'đang dần quen với việc gì (quá trình)',
      patterns: [
        {
          situation: 'Diễn tả quá trình làm quen',
          pattern: 'S + get/got used to + V-ing / N',
          example: 'It took me a month to get used to the Hanoi traffic.',
        },
      ],
    },
  ],
}

const PP_VS_PAST: SpecialTopic = {
  id: 'pp_vs_past',
  name: 'Present Perfect vs Past Simple',
  nameVi: 'Hiện tại hoàn thành vs Quá khứ đơn',
  emoji: '⚖️',
  intro:
    'Lỗi hay gặp nhất khi học thì. Quy tắc vàng: nếu có MỐC THỜI GIAN XÁC ĐỊNH đã qua (yesterday, ago, in 2010, last week, when...) → Quá khứ đơn. Nếu KHÔNG nói rõ thời gian, hoặc còn liên quan/kéo dài đến hiện tại (for, since, just, already, yet, ever, never, recently) → Hiện tại hoàn thành.',
  rules: [
    {
      conjunction: 'QUÁ KHỨ ĐƠN',
      meaningVi: 'hành động đã chấm dứt, có thời gian xác định trong quá khứ',
      patterns: [
        {
          situation: 'Có mốc thời gian rõ ràng đã qua',
          pattern: 'S + V2/V-ed + (yesterday / ago / in 2010 / last week)',
          example: 'I finished the report yesterday.',
        },
        {
          situation: 'Hỏi/nói về thời điểm cụ thể (When...?)',
          pattern: 'When + did + S + V?',
          example: 'When did you buy this laptop?',
        },
        {
          situation: 'Khoảng cách thời gian với "ago"',
          pattern: 'S + V2 + ... + time + ago',
          example: 'They got married three years ago.',
        },
      ],
    },
    {
      conjunction: 'HIỆN TẠI HOÀN THÀNH',
      meaningVi: 'không nói rõ thời gian, hoặc còn liên quan/kéo dài đến hiện tại',
      patterns: [
        {
          situation: 'Kéo dài từ quá khứ đến hiện tại — for / since',
          pattern: 'S + have/has + V3 + for/since ...',
          example: "I've worked here for five years (and still do).",
        },
        {
          situation: 'Vừa xảy ra, có dấu vết/hậu quả ở hiện tại — just/already/yet',
          pattern: 'S + have/has + (just/already) + V3 ... (yet)',
          example: "I've just finished — let's go.",
        },
        {
          situation: 'Trải nghiệm trong đời, không nói khi nào — ever/never',
          pattern: 'S + have/has + (ever/never) + V3',
          example: 'Have you ever been to Japan?',
        },
      ],
    },
    {
      conjunction: 'SO SÁNH NHANH',
      meaningVi: 'cặp tín hiệu hay đối lập',
      patterns: [
        {
          situation: 'for/since (HTHT) vs ago (QKĐ)',
          pattern: "have lived ... for 5 years  ⟷  moved here 5 years ago",
          example: "I've lived here for 5 years. = I moved here 5 years ago.",
        },
        {
          situation: '"this morning" còn đang sáng (HTHT) vs đã hết sáng (QKĐ)',
          pattern: 'have done (sáng chưa hết) ⟷ did (đã quá trưa)',
          example: "I've had two coffees this morning. (vẫn đang buổi sáng)",
        },
      ],
    },
  ],
}

const MODALS: SpecialTopic = {
  id: 'modals',
  name: 'Modal Verbs (Can / Could / Be able to / ...)',
  nameVi: 'Modal Verbs — Can, Could, Be able to & Could have done',
  emoji: '🛡️',
  intro:
    'Modal verbs (can, could, may, might, must, should, have to, be able to...) thêm sắc thái "khả năng / được phép / bắt buộc / suy đoán" vào động từ. Quy tắc chung: theo sau modal là V(bare). Quan trọng nhất ở IELTS: phân biệt CAN/COULD/BE ABLE TO (Murphy U26) và đặc biệt COULD vs COULD HAVE DONE (Murphy U27) — đây là kiến thức nâng cao hay bị sai.',
  rules: [
    {
      conjunction: 'CAN',
      meaningVi: 'khả năng/cho phép ở HIỆN TẠI hoặc tương lai gần',
      patterns: [
        {
          situation: 'Khả năng chung ở hiện tại',
          pattern: 'S + can + V(bare)',
          example: 'I can speak three languages.',
        },
        {
          situation: 'Xin/cho phép (thân mật)',
          pattern: 'Can + S + V(bare)?',
          example: 'Can I borrow your charger?',
        },
        {
          situation: 'Phủ định: cannot / can\'t',
          pattern: "S + can't + V(bare)",
          example: "I can't swim very well.",
        },
      ],
    },
    {
      conjunction: 'COULD (khả năng quá khứ chung)',
      meaningVi: 'khả năng CHUNG/THƯỜNG XUYÊN trong quá khứ — KHÔNG dùng cho 1 lần cụ thể',
      patterns: [
        {
          situation: 'Khả năng chung trong quá khứ (general ability)',
          pattern: 'S + could + V(bare)',
          example: 'When I was a child, I could swim very well.',
        },
        {
          situation: '⚠️ KHÔNG dùng could cho 1 hành động cụ thể đã thành công',
          pattern: 'Dùng "was/were able to" hoặc "managed to" thay thế',
          example: 'The fire spread quickly, but everyone WAS ABLE TO escape. (KHÔNG: "could escape")',
        },
        {
          situation: 'Couldn\'t — dùng được cho cả khả năng chung VÀ 1 lần cụ thể',
          pattern: "S + couldn't + V(bare)",
          example: "I couldn't find my keys this morning. (1 lần cụ thể — vẫn dùng couldn't)",
        },
      ],
    },
    {
      conjunction: 'BE ABLE TO',
      meaningVi: 'khả năng — dùng được ở mọi thì, đặc biệt cần thiết khi quá khứ "1 lần cụ thể"',
      patterns: [
        {
          situation: 'Quá khứ "1 lần cụ thể" thành công → BẮT BUỘC dùng was/were able to',
          pattern: 'S + was/were able to + V(bare)',
          example: 'After hours of trying, I was finally able to fix the bug.',
        },
        {
          situation: 'Tương lai (can KHÔNG đứng được sau will, must, ...)',
          pattern: 'S + will + be able to + V(bare)',
          example: "When the system upgrade is done, you will be able to log in faster.",
        },
        {
          situation: 'Sau modal khác (must, might, should)',
          pattern: 'S + modal + be able to + V(bare)',
          example: 'You must be able to read English for this course.',
        },
      ],
    },
    {
      conjunction: 'COULD DO vs COULD HAVE DONE ⭐',
      meaningVi: 'điểm cao cấp Unit 27 — phân biệt khả năng "đang có" vs cơ hội đã bỏ lỡ trong quá khứ',
      patterns: [
        {
          situation: 'COULD + V: gợi ý/khả năng ở HIỆN TẠI hoặc TƯƠNG LAI (chưa làm)',
          pattern: 'S + could + V(bare)',
          example: 'You look tired — you could take a nap. (gợi ý hiện tại)',
        },
        {
          situation: 'COULD HAVE + V3: đáng lẽ có thể (nhưng đã không làm) — nuối tiếc/nhận định về quá khứ',
          pattern: 'S + could have + V3/V-ed',
          example: 'I could have helped you yesterday — why didn\'t you ask? (Tôi đã có thể giúp nhưng đã không làm)',
        },
        {
          situation: 'COULDN\'T HAVE + V3: chắc chắn đã không thể (suy đoán quá khứ)',
          pattern: "S + couldn't have + V3",
          example: "She couldn't have stolen the laptop — she was with me all evening.",
        },
        {
          situation: 'So sánh tinh tế: "could do" giả định hiện tại vs "could have done" hối tiếc quá khứ',
          pattern: 'I could lend you money (now)  ⟷  I could have lent you money (yesterday — but didn\'t)',
          example: 'I could fix it for you now. ⟷ I could have fixed it yesterday if you\'d called.',
        },
      ],
    },
    {
      conjunction: 'LƯU Ý NHANH',
      meaningVi: 'những điểm Vietnamese learners hay sai',
      patterns: [
        {
          situation: 'Sau modal (can/could/will/should...) LUÔN là V(bare) — KHÔNG to V, KHÔNG -s',
          pattern: 'S + modal + V(bare)',
          example: 'She can SPEAK Japanese. (KHÔNG: can to speak / can speaks)',
        },
        {
          situation: 'Phủ định: cannot viết LIỀN, can\'t có dấu nháy',
          pattern: "cannot = can't",
          example: "I can't (cannot) come tomorrow.",
        },
      ],
    },
  ],
}

export const SPECIAL_TOPICS: SpecialTopic[] = [
  {
    id: 'sequencing',
    name: 'Tense Coordination',
    nameVi: 'Sự phối thì',
    emoji: '🔗',
    intro: SEQUENCING_INTRO,
    rules: SEQUENCING_RULES,
  },
  FUTURE_FORMS,
  HAVE_GOT,
  USED_TO,
  PP_VS_PAST,
  MODALS,
]

export function findSpecialTopic(id: string): SpecialTopic | null {
  return SPECIAL_TOPICS.find((t) => t.id === id) ?? null
}

export function specialTopicName(id: string): string | null {
  return findSpecialTopic(id)?.nameVi ?? null
}
