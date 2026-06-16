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

const MODALS_DEDUCTION: SpecialTopic = {
  id: 'modals_deduction',
  name: 'Modals of Deduction (Must / Can\'t / May / Might)',
  nameVi: 'Modal Verbs — Suy luận logic (Must / Can\'t / May / Might)',
  emoji: '🔎',
  intro:
    'Nhóm modal dùng để SUY LUẬN/PHÁN ĐOÁN về sự thật, không phải khả năng. Mức độ chắc chắn từ cao xuống thấp: MUST (chắc chắn 99% là CÓ) — MAY/MIGHT/COULD (có thể 50/50) — CAN\'T (chắc chắn 99% là KHÔNG). Murphy U28: must & can\'t. Murphy U29: may & might. Cấu trúc hiện tại: modal + V(bare). Cấu trúc quá khứ: modal + have + V3.',
  rules: [
    {
      conjunction: 'MUST (chắc chắn CÓ)',
      meaningVi: 'suy luận logic dương — bạn chắc chắn 99% chuyện đó đúng',
      patterns: [
        {
          situation: 'Suy luận hiện tại — chắc chắn dương',
          pattern: 'S + must + V(bare) / be + adj',
          example: "He's been coding all day — he must be tired.",
        },
        {
          situation: 'Suy luận trạng thái đang diễn ra',
          pattern: 'S + must + be + V-ing',
          example: 'The lights are on — they must be working late.',
        },
        {
          situation: '⭐ Suy luận về QUÁ KHỨ — chắc chắn đã xảy ra',
          pattern: 'S + must have + V3',
          example: 'The grass is wet — it must have rained last night.',
        },
      ],
    },
    {
      conjunction: "CAN'T / COULDN'T (chắc chắn KHÔNG)",
      meaningVi: 'suy luận logic âm — bạn chắc chắn 99% chuyện đó SAI. Đây là phủ định của "must" trong suy luận (KHÔNG dùng "mustn\'t")',
      patterns: [
        {
          situation: 'Suy luận hiện tại — chắc chắn âm',
          pattern: "S + can't + V(bare) / be + adj",
          example: "He just ate three bowls of rice — he can't be hungry.",
        },
        {
          situation: '⚠️ KHÔNG dùng "mustn\'t" cho suy luận. "Mustn\'t" = cấm.',
          pattern: "must (chắc chắn CÓ)  ⟷  can't (chắc chắn KHÔNG)",
          example: 'This can\'t be the right address — there\'s no number 99 here.',
        },
        {
          situation: '⭐ Suy luận về QUÁ KHỨ — chắc chắn KHÔNG xảy ra',
          pattern: "S + can't have / couldn't have + V3",
          example: "She can't have stolen the laptop — she was with me.",
        },
      ],
    },
    {
      conjunction: 'MAY / MIGHT / COULD (có thể — 50/50)',
      meaningVi: 'suy luận khả năng — có thể đúng, có thể sai, bạn không chắc',
      patterns: [
        {
          situation: 'Khả năng ở hiện tại/tương lai (3 modal gần như tương đương)',
          pattern: 'S + may/might/could + V(bare)',
          example: 'I might upgrade my laptop next month — not sure yet.',
        },
        {
          situation: 'Trạng thái đang diễn ra (có thể)',
          pattern: 'S + may/might/could + be + V-ing',
          example: "She isn't answering — she may be sleeping.",
        },
        {
          situation: 'Phủ định: may not / might not (KHÔNG viết tắt "mightn\'t" trong văn viết)',
          pattern: 'S + may not / might not + V(bare)',
          example: 'I might not come to the party — I have work to finish.',
        },
        {
          situation: '⭐ Khả năng đã xảy ra trong QUÁ KHỨ',
          pattern: 'S + may/might/could have + V3',
          example: 'I can\'t find my phone — I might have left it at the café.',
        },
      ],
    },
    {
      conjunction: 'BẢNG TÓM TẮT MỨC ĐỘ CHẮC CHẮN',
      meaningVi: 'thang chắc chắn giúp chọn đúng modal',
      patterns: [
        {
          situation: 'Chắc chắn CÓ (99%)',
          pattern: 'MUST + V(bare)   |   MUST HAVE + V3',
          example: 'He must be exhausted. ⟶ He must have worked all night.',
        },
        {
          situation: 'Có thể (40-60%)',
          pattern: 'MAY / MIGHT / COULD + V(bare)   |   ... + HAVE + V3',
          example: "She may be at lunch. ⟶ She may have gone home already.",
        },
        {
          situation: 'Chắc chắn KHÔNG (99%)',
          pattern: "CAN'T + V(bare)   |   CAN'T HAVE / COULDN'T HAVE + V3",
          example: "That can't be true. ⟶ He can't have done it alone.",
        },
      ],
    },
    {
      conjunction: 'LƯU Ý NHANH',
      meaningVi: 'những bẫy thường gặp',
      patterns: [
        {
          situation: '"Mustn\'t" KHÁC "can\'t" — đừng nhầm!',
          pattern: "mustn't = cấm (rule)   |   can't = suy luận âm",
          example: "You mustn't park here. (cấm)  ⟷  That can't be Minh — he's in Da Lat. (suy luận)",
        },
        {
          situation: 'Sau modal LUÔN V(bare); quá khứ thì modal + have + V3 (KHÔNG có "to")',
          pattern: 'modal + V(bare)   |   modal + have + V3',
          example: 'She must have known. (KHÔNG: must to know / must known)',
        },
      ],
    },
  ],
}

const CONDITIONALS: SpecialTopic = {
  id: 'conditionals',
  name: 'Conditionals (If clauses)',
  nameVi: 'Câu điều kiện (If clauses) — Loại 0/1/2/3',
  emoji: '🧩',
  intro:
    'Câu điều kiện kết nối 2 mệnh đề: IF + điều kiện → kết quả. Bốn loại chính, phân biệt bằng "có thật không" và "thì nào": Loại 0 (sự thật chung), Loại 1 (có thể xảy ra ở hiện tại/tương lai), Loại 2 (trái với thực tế hiện tại — giả định), Loại 3 (trái với thực tế quá khứ — nuối tiếc). Mixed là kết hợp Loại 3 + Loại 2 (giả thiết quá khứ → kết quả hiện tại).',
  rules: [
    {
      conjunction: 'LOẠI 0 (sự thật chung — General truth)',
      meaningVi: 'sự thật hiển nhiên, quy luật khoa học, luôn đúng',
      patterns: [
        {
          situation: 'Quy luật/sự thật — cả 2 vế đều hiện tại đơn',
          pattern: 'IF + S + V(s/es), S + V(s/es)',
          example: 'If you heat water to 100°C, it boils.',
        },
        {
          situation: 'Có thể thay "if" bằng "when" mà nghĩa không đổi',
          pattern: 'WHEN + present, present',
          example: 'When I drink coffee at night, I can\'t sleep.',
        },
      ],
    },
    {
      conjunction: 'LOẠI 1 (có thật — Real future)',
      meaningVi: 'điều kiện có khả năng xảy ra ở hiện tại/tương lai',
      patterns: [
        {
          situation: 'Mệnh đề IF: hiện tại đơn — vế kết quả: will + V(bare)',
          pattern: 'IF + S + V(s/es), S + will + V(bare)',
          example: 'If it rains tomorrow, we will cancel the picnic.',
        },
        {
          situation: '⚠️ TUYỆT ĐỐI KHÔNG dùng will trong mệnh đề IF',
          pattern: 'KHÔNG: If you will help me, ...',
          example: 'If you help me (KHÔNG: will help me), I\'ll finish on time.',
        },
        {
          situation: 'Có thể thay will bằng can/may/might/should ở vế kết quả',
          pattern: 'IF + present, S + can/may/might/should + V(bare)',
          example: 'If you arrive early, you can grab a good seat.',
        },
        {
          situation: 'Lệnh/đề nghị ở vế kết quả',
          pattern: 'IF + present, imperative',
          example: 'If you see Lan, tell her to call me.',
        },
      ],
    },
    {
      conjunction: 'LOẠI 2 (giả định — Unreal present)',
      meaningVi: 'trái với thực tế HIỆN TẠI — giả sử/giả định không có thật',
      patterns: [
        {
          situation: 'IF: quá khứ đơn — vế kết quả: would + V(bare)',
          pattern: 'IF + S + V(quá khứ), S + would + V(bare)',
          example: 'If I had more RAM, I could run this virtual machine. (Thực tế: không có)',
        },
        {
          situation: '⭐ Với "be", DÙNG "were" cho tất cả ngôi (kể cả I/he/she)',
          pattern: 'IF + S + were, S + would + V(bare)',
          example: 'If I were you, I would accept the offer. (KHÔNG: If I was you)',
        },
        {
          situation: 'Thay would bằng could/might để diễn tả khả năng/sự cho phép',
          pattern: 'IF + V(quá khứ), S + could/might + V(bare)',
          example: 'If we had more time, we could visit the museum.',
        },
        {
          situation: 'Đưa ra lời khuyên gián tiếp với "If I were you, I would..."',
          pattern: 'If I were you, I would + V(bare)',
          example: 'If I were you, I would talk to a doctor.',
        },
      ],
    },
    {
      conjunction: 'LOẠI 3 (nuối tiếc — Unreal past)',
      meaningVi: 'trái với thực tế QUÁ KHỨ — chuyện đã không xảy ra, thường thể hiện nuối tiếc',
      patterns: [
        {
          situation: 'IF: quá khứ hoàn thành — vế kết quả: would have + V3',
          pattern: 'IF + S + had + V3, S + would have + V3',
          example: 'If I had checked the log more carefully, the system wouldn\'t have crashed. (Thực tế: đã không check kỹ → đã crash)',
        },
        {
          situation: 'Thay would have bằng could have / might have',
          pattern: 'IF + had + V3, S + could/might have + V3',
          example: 'If she had studied harder, she could have passed the exam.',
        },
        {
          situation: 'Phủ định ở vế IF: had + not + V3 (= hadn\'t V3)',
          pattern: "IF + S + hadn't + V3, ...",
          example: "If I hadn't missed the train, I would have arrived on time.",
        },
      ],
    },
    {
      conjunction: 'MIXED (Loại 3 + 2)',
      meaningVi: 'giả thiết quá khứ → kết quả ở HIỆN TẠI',
      patterns: [
        {
          situation: 'Vế IF dùng L3 (had + V3), vế kết quả dùng L2 (would + V bare)',
          pattern: 'IF + S + had + V3, S + would + V(bare)',
          example: 'If I had studied medicine, I would be a doctor now. (QK: không học y → HT: không là bác sĩ)',
        },
        {
          situation: 'Thường có "now"/"today" ở vế kết quả',
          pattern: '..., S + would + V(bare) + now/today',
          example: 'If she had saved her money, she wouldn\'t be in debt now.',
        },
      ],
    },
    {
      conjunction: 'LƯU Ý NHANH',
      meaningVi: 'những lỗi kinh điển',
      patterns: [
        {
          situation: '⚠️ KHÔNG bao giờ dùng "will/would" trong mệnh đề IF (chỉ ngoài thực tế)',
          pattern: 'IF + present  (KHÔNG IF + will)',
          example: "If you will help → ❌  |  If you help → ✓",
        },
        {
          situation: 'Mệnh đề IF có thể đứng trước hoặc sau, không đổi nghĩa',
          pattern: '[IF clause, main]  =  [main IF clause]',
          example: 'If it rains, we\'ll stay home. = We\'ll stay home if it rains.',
        },
        {
          situation: 'Khi IF đứng trước, có DẤU PHẨY ngăn 2 vế; đứng sau thì không',
          pattern: 'IF ..., ...   |   ... IF ...',
          example: 'If I had time, I\'d come. ⟷ I\'d come if I had time.',
        },
        {
          situation: '"Unless" = "if not" — kéo theo động từ KHẲNG ĐỊNH',
          pattern: 'UNLESS + S + V (= If S + don\'t/doesn\'t V)',
          example: "I won't go unless you come with me. (= if you don't come)",
        },
      ],
    },
  ],
}

const MODALS_OBLIGATION: SpecialTopic = {
  id: 'modals_obligation',
  name: "Modals — Obligation, Necessity & Advice (Must/Have to/Should/Had better)",
  nameVi: 'Modal — Bắt buộc, Cần thiết & Lời khuyên',
  emoji: '⚠️',
  intro:
    'Nhóm modal về NGHĨA VỤ (must, have to), CẤM (mustn\'t), KHÔNG CẦN (needn\'t / don\'t have to), LỜI KHUYÊN (should, ought to, had better) và VIỆC ĐÁNG LẼ NÊN LÀM trong quá khứ (should have done). Murphy Units 31-35. Bẫy lớn nhất: phân biệt MUSTN\'T (cấm) vs DON\'T HAVE TO / NEEDN\'T (không bắt buộc) — nghĩa hoàn toàn khác nhau.',
  rules: [
    {
      conjunction: 'MUST vs HAVE TO (bắt buộc)',
      meaningVi: 'cả 2 đều = phải làm, nhưng sắc thái khác nhau',
      patterns: [
        {
          situation: 'MUST: nghĩa vụ từ NGƯỜI NÓI (cảm xúc cá nhân, quy định mạnh)',
          pattern: 'S + must + V(bare)',
          example: "I must finish this report tonight. (Tôi tự ép mình)",
        },
        {
          situation: 'HAVE TO: nghĩa vụ từ BÊN NGOÀI (quy định, luật, sếp, hoàn cảnh)',
          pattern: 'S + have/has to + V(bare)',
          example: "I have to wear a uniform at work. (Quy định công ty)",
        },
        {
          situation: 'Quá khứ CHỈ DÙNG "had to" — KHÔNG có "musted"',
          pattern: 'S + had to + V(bare)',
          example: 'Yesterday I had to work until midnight.',
        },
        {
          situation: 'Tương lai: will have to (KHÔNG dùng "will must")',
          pattern: 'S + will have to + V(bare)',
          example: 'You will have to apply for a visa next month.',
        },
      ],
    },
    {
      conjunction: "MUSTN'T vs DON'T HAVE TO / NEEDN'T ⭐",
      meaningVi: 'BẪY KINH ĐIỂN — nghĩa hoàn toàn khác nhau',
      patterns: [
        {
          situation: "MUSTN'T = CẤM (don't do it)",
          pattern: "S + mustn't + V(bare)",
          example: "You mustn't smoke in the hospital. (CẤM hút thuốc)",
        },
        {
          situation: "DON'T HAVE TO = KHÔNG BẮT BUỘC (bạn có thể làm hoặc không)",
          pattern: "S + don't/doesn't have to + V(bare)",
          example: "You don't have to come if you're busy. (Không bắt buộc)",
        },
        {
          situation: "NEEDN'T = không cần thiết (đồng nghĩa với don't have to)",
          pattern: "S + needn't + V(bare)",
          example: "You needn't bring food — we have plenty.",
        },
        {
          situation: '⚠️ So sánh:',
          pattern: "mustn't (cấm)  ⟷  don't have to / needn't (không bắt buộc)",
          example: "You mustn't tell anyone (cấm) ⟷ You don't have to tell anyone (tuỳ bạn).",
        },
        {
          situation: "Quá khứ của needn't: didn't need to (KHÔNG cần làm) ⟷ needn't have V3 (đã làm dù không cần)",
          pattern: "S + didn't need to + V   |   S + needn't have + V3",
          example: "I didn't need to buy bread (không mua) ⟷ I needn't have bought bread (đã mua, hoá ra dư).",
        },
      ],
    },
    {
      conjunction: 'SHOULD / OUGHT TO (lời khuyên)',
      meaningVi: 'đưa ra lời khuyên hoặc nói điều đáng lẽ nên xảy ra',
      patterns: [
        {
          situation: 'Lời khuyên ở hiện tại — should + V(bare)',
          pattern: 'S + should + V(bare)',
          example: 'You should drink more water.',
        },
        {
          situation: '"Ought to" = should (mạnh hơn 1 chút, formal hơn)',
          pattern: 'S + ought to + V(bare)',
          example: 'You ought to apologise to her.',
        },
        {
          situation: 'Phủ định: shouldn\'t / ought not to',
          pattern: "S + shouldn't + V(bare)",
          example: "You shouldn't work so late every night.",
        },
        {
          situation: 'Nhận xét điều đáng lẽ đang xảy ra ở HT (chỉ trích/dự đoán)',
          pattern: 'S + should + V(bare)',
          example: 'The bus should be here by now — where is it?',
        },
      ],
    },
    {
      conjunction: 'SHOULD HAVE + V3 ⭐ (Murphy U34)',
      meaningVi: 'đáng lẽ NÊN làm gì trong QUÁ KHỨ nhưng đã không làm (nuối tiếc/chỉ trích)',
      patterns: [
        {
          situation: 'Hành động đáng lẽ nên làm — nhưng đã KHÔNG làm',
          pattern: 'S + should have + V3',
          example: "You should have told me earlier. (Bạn đã KHÔNG nói)",
        },
        {
          situation: 'Phủ định: đáng lẽ KHÔNG nên làm — nhưng đã làm',
          pattern: "S + shouldn't have + V3",
          example: "I shouldn't have eaten so much. (Tôi đã ăn quá nhiều)",
        },
        {
          situation: 'Tương tự với "ought to"',
          pattern: 'S + ought to have + V3',
          example: 'She ought to have called us when she arrived.',
        },
        {
          situation: '⚠️ Giống "could have done" nhưng khác sắc thái: could have = đã có thể; should have = đáng lẽ nên',
          pattern: 'could have V3 (cơ hội)  ⟷  should have V3 (nghĩa vụ/khuyên)',
          example: 'I could have helped (đã có thể) ⟷ I should have helped (đáng lẽ phải).',
        },
      ],
    },
    {
      conjunction: 'HAD BETTER (cảnh báo/khuyên mạnh)',
      meaningVi: 'tốt hơn hết là nên làm gì — mạnh hơn "should", thường ngụ ý hậu quả xấu nếu không làm',
      patterns: [
        {
          situation: 'Khẳng định — viết tắt: \'d better',
          pattern: "S + had better ('d better) + V(bare)",
          example: "You'd better leave now or you'll miss the train.",
        },
        {
          situation: 'Phủ định — \'d better not (KHÔNG had better don\'t)',
          pattern: "S + had better not + V(bare)",
          example: "You'd better not be late again.",
        },
        {
          situation: '⚠️ KHÔNG có "to": had better V(bare), KHÔNG "had better to V"',
          pattern: "had better + V(bare)",
          example: "You'd better hurry (KHÔNG: had better to hurry).",
        },
        {
          situation: 'Dù dùng "had", nó nói về HIỆN TẠI/TƯƠNG LAI (không phải quá khứ)',
          pattern: "Present/future meaning",
          example: "We'd better book tickets now — they sell out fast.",
        },
      ],
    },
    {
      conjunction: "IT'S TIME + V(quá khứ) ⭐",
      meaningVi: 'đã đến lúc làm gì rồi (giả định/đáng lẽ đã phải bắt đầu) — dùng cấu trúc giả định',
      patterns: [
        {
          situation: '⭐ Sau "It\'s time" + S → dùng V(quá khứ) (subjunctive)',
          pattern: "It's time + S + V(quá khứ)",
          example: "It's time you went to bed. (Đến giờ bạn đi ngủ rồi — KHÔNG \"go to bed\")",
        },
        {
          situation: 'Mạnh hơn: It\'s high time / It\'s about time',
          pattern: "It's (high/about) time + S + V(quá khứ)",
          example: "It's high time the government did something.",
        },
        {
          situation: 'Hoặc cấu trúc đơn giản: It\'s time + to V (chung chung, không chỉ ai)',
          pattern: "It's time to + V(bare)",
          example: "It's time to leave.",
        },
      ],
    },
    {
      conjunction: 'LƯU Ý NHANH',
      meaningVi: 'những lỗi hay gặp',
      patterns: [
        {
          situation: 'Sau modal LUÔN V(bare). Quá khứ: modal + have + V3',
          pattern: 'modal + V(bare)   |   modal + have + V3',
          example: "should call (KHÔNG should to call)  |  should have called",
        },
        {
          situation: 'Have to chia theo thì (have/has/had/will have to); must KHÔNG đổi',
          pattern: "must = same all tenses  |  have to = changes",
          example: "He has to work. ⟷ He must work. (HT cả 2)",
        },
        {
          situation: 'Có thể dùng "need to" thay "have to" (cả 2 đồng nghĩa)',
          pattern: "S + need to + V(bare)  ≈  S + have to + V(bare)",
          example: 'You need to study more. = You have to study more.',
        },
      ],
    },
  ],
}

const PASSIVE: SpecialTopic = {
  id: 'passive',
  name: 'Passive Voice (Active vs Passive across all tenses + special structures)',
  nameVi: 'Bị động — Mọi thì + cấu trúc đặc biệt (It is said that…)',
  emoji: '🔄',
  intro:
    'Câu bị động dùng khi chủ thể KHÔNG quan trọng / không biết / muốn nhấn mạnh hành động. Công thức gốc: BE + V3. Mỗi thì có dạng bị động riêng — phải nhớ. Murphy U40-41: dạng nâng cao (be done / been done / being done) và cấu trúc tường thuật khách quan "It is said that..." (vũ khí Writing Task 2).',
  rules: [
    {
      conjunction: 'CÔNG THỨC CHUNG',
      meaningVi: 'BE + V3 — chia "be" theo thì của câu chủ động',
      patterns: [
        {
          situation: 'Chủ động → Bị động: đảo tân ngữ lên đầu, dùng be + V3',
          pattern: 'O + be + V3 (+ by S)',
          example: 'They cleaned the room. → The room was cleaned (by them).',
        },
        {
          situation: '"By + agent" CHỈ thêm khi cần (thường bỏ nếu chủ thể không quan trọng)',
          pattern: '(by + agent) — optional',
          example: 'My bike was stolen. (KHÔNG cần "by someone")',
        },
      ],
    },
    {
      conjunction: 'BỊ ĐỘNG THEO 12 THÌ',
      meaningVi: 'thuộc bảng này là xử lý được mọi câu',
      patterns: [
        {
          situation: 'Present Simple: am/is/are + V3',
          pattern: 'S + am/is/are + V3',
          example: 'Rice is grown in Vietnam.',
        },
        {
          situation: 'Present Continuous: am/is/are + being + V3',
          pattern: 'S + am/is/are + being + V3',
          example: 'The system is being updated right now.',
        },
        {
          situation: 'Present Perfect: have/has + been + V3',
          pattern: 'S + have/has + been + V3',
          example: 'The report has been completed.',
        },
        {
          situation: 'Past Simple: was/were + V3',
          pattern: 'S + was/were + V3',
          example: 'The bridge was built in 1980.',
        },
        {
          situation: 'Past Continuous: was/were + being + V3',
          pattern: 'S + was/were + being + V3',
          example: 'The road was being repaired yesterday.',
        },
        {
          situation: 'Past Perfect: had + been + V3',
          pattern: 'S + had + been + V3',
          example: 'The letter had been sent before he arrived.',
        },
        {
          situation: 'Future Simple: will + be + V3',
          pattern: 'S + will + be + V3',
          example: 'The new app will be released next month.',
        },
        {
          situation: 'Future Perfect: will + have + been + V3',
          pattern: 'S + will + have + been + V3',
          example: 'By Friday, the project will have been finished.',
        },
        {
          situation: 'Be going to: am/is/are + going to + be + V3',
          pattern: 'S + going to be + V3',
          example: 'The results are going to be announced soon.',
        },
        {
          situation: 'Modal + passive: modal + be + V3',
          pattern: 'S + modal + be + V3',
          example: 'This must be done immediately. / It can be solved.',
        },
        {
          situation: 'Modal perfect passive: modal + have been + V3',
          pattern: 'S + modal + have been + V3',
          example: 'The window must have been broken last night.',
        },
      ],
    },
    {
      conjunction: 'IT IS SAID THAT… / S + IS SUPPOSED TO + V ⭐',
      meaningVi: 'cấu trúc tường thuật khách quan — Murphy U41, vũ khí Writing Task 2',
      patterns: [
        {
          situation: 'Cấu trúc 1: It + be + V3 + that + clause',
          pattern: 'It is said/believed/thought/reported that + S + V',
          example: 'It is said that the new policy will reduce traffic. (Người ta nói rằng…)',
        },
        {
          situation: 'Cấu trúc 2: S + be + V3 + to V/to have V3',
          pattern: 'S + is/are said/believed + to + V(bare)',
          example: 'He is said to be one of the richest men in Asia. (Người ta cho rằng…)',
        },
        {
          situation: 'Với hành động đã xảy ra: be + V3 + to have V3',
          pattern: 'S + is + V3 + to have + V3',
          example: 'The painting is believed to have been stolen.',
        },
        {
          situation: 'Verbs hay dùng: say, believe, think, report, expect, know, suppose, consider',
          pattern: '...',
          example: 'She is reported to be missing. / Vaccines are believed to be effective.',
        },
      ],
    },
    {
      conjunction: '2 TÂN NGỮ — give/send/show + sb + sth',
      meaningVi: 'verb có 2 tân ngữ → có 2 cách chuyển bị động',
      patterns: [
        {
          situation: 'Active: S + V + O(person) + O(thing)',
          pattern: 'They gave me a book. → 2 cách:',
          example: '1) I was given a book. (chủ thể là người)  2) A book was given to me. (chủ thể là vật)',
        },
        {
          situation: 'Cách 1 thường tự nhiên hơn trong tiếng Anh',
          pattern: 'O(person) + be + V3 + O(thing)',
          example: 'She was sent a letter. / We are taught English by Mr Khoa.',
        },
      ],
    },
    {
      conjunction: 'LƯU Ý',
      meaningVi: 'những điểm hay nhầm',
      patterns: [
        {
          situation: 'Verb intransitive (KHÔNG có tân ngữ) → KHÔNG có dạng bị động',
          pattern: 'arrive, happen, exist, die, fall... → no passive',
          example: '"The accident happened" KHÔNG → "was happened"',
        },
        {
          situation: 'Sau modal/help/let/make + V(bare) chủ động; bị động: be + V3',
          pattern: 'modal + be + V3',
          example: 'He must do it. → It must be done. (KHÔNG "must to be done")',
        },
        {
          situation: 'Be born = bị động cố định — không có "born" chủ động',
          pattern: 'S + was/were + born',
          example: 'I was born in 1995. (KHÔNG: I born)',
        },
      ],
    },
  ],
}

const CAUSATIVE: SpecialTopic = {
  id: 'causative',
  name: 'Causative — Have/Get Something Done (Outsource)',
  nameVi: 'Causative — Have/Get sth done (Nhờ/Thuê người làm)',
  emoji: '🛠️',
  intro:
    'Cấu trúc "have/get sth done" = thuê/nhờ ai đó làm hộ bạn (không tự làm). Bạn TRẢ TIỀN hoặc YÊU CẦU, người khác thực hiện. Murphy U42. Cực hữu dụng để mô tả dịch vụ: cắt tóc, sửa xe, làm nail, lắp đặt... Đừng nhầm với "have done sth" (Hiện tại hoàn thành — bạn tự làm xong).',
  rules: [
    {
      conjunction: 'CÔNG THỨC CHÍNH',
      meaningVi: 'S + have/get + O + V3',
      patterns: [
        {
          situation: '"Have" — trung lập, formal hơn',
          pattern: 'S + have/has/had + O + V3',
          example: 'I had my car repaired yesterday. (Tôi đem xe đi sửa)',
        },
        {
          situation: '"Get" — informal, văn nói',
          pattern: 'S + get/got + O + V3',
          example: 'I got my hair cut last weekend. (Tôi đi cắt tóc)',
        },
        {
          situation: 'Chia "have/get" theo thì câu',
          pattern: '...',
          example: "I'm getting my nails done now. / She'll have her photo taken tomorrow.",
        },
      ],
    },
    {
      conjunction: 'PHÂN BIỆT QUAN TRỌNG ⭐',
      meaningVi: 'have/get sth done vs have done sth',
      patterns: [
        {
          situation: '"Have sth done" = nhờ/thuê (passive, người khác làm)',
          pattern: 'S + have + O + V3',
          example: 'I have my car cleaned every week. (Người ta rửa xe cho tôi)',
        },
        {
          situation: '"Have done sth" = HTHT, TÔI tự làm xong',
          pattern: 'S + have + V3 + O',
          example: 'I have cleaned my car. (Tôi tự rửa xe)',
        },
        {
          situation: '⚠️ Ý nghĩa khác hẳn nhau — phân biệt qua VỊ TRÍ của V3',
          pattern: 'O ĐỨNG TRƯỚC V3 → causative   |   V3 đứng trước O → HTHT',
          example: 'I had the report typed. (nhờ đánh máy) ⟷ I had typed the report. (tự đánh máy xong)',
        },
      ],
    },
    {
      conjunction: 'KHI CÓ BIẾN CỐ XẤU (Have something happen to you)',
      meaningVi: 'còn có nghĩa: bị ai đó làm gì với bạn (không mong muốn)',
      patterns: [
        {
          situation: '"Have/get sth done" trong ngữ cảnh tiêu cực',
          pattern: 'S + had + O + V3 (= bị mất/bị hỏng do người khác)',
          example: 'He had his wallet stolen on the bus. (Hắn bị móc ví — không mong muốn)',
        },
      ],
    },
  ],
}

const REPORTED_SPEECH: SpecialTopic = {
  id: 'reported_speech',
  name: 'Reported Speech — Tense Backshift',
  nameVi: 'Câu tường thuật — Lùi thì',
  emoji: '🗣️',
  intro:
    'Câu tường thuật = thuật lại lời người khác nói (indirect speech). Quy tắc vàng: nếu động từ tường thuật (said, told...) ở QUÁ KHỨ → LÙI THÌ thì trong mệnh đề tường thuật xuống 1 bậc. Đổi đại từ + trạng từ thời gian/vị trí cho phù hợp. Murphy U43.',
  rules: [
    {
      conjunction: 'BẢNG LÙI THÌ',
      meaningVi: 'tense trong trích dẫn → tense sau "said"',
      patterns: [
        {
          situation: 'Present Simple → Past Simple',
          pattern: '"I work here" → He said (that) he worked there.',
          example: '"I love coffee." → She said she loved coffee.',
        },
        {
          situation: 'Present Continuous → Past Continuous',
          pattern: '"I am coding" → He said he was coding.',
          example: '"I\'m working." → He said he was working.',
        },
        {
          situation: 'Present Perfect → Past Perfect',
          pattern: '"I have finished" → He said he had finished.',
          example: '"I have eaten." → She said she had eaten.',
        },
        {
          situation: 'Past Simple → Past Perfect',
          pattern: '"I saw it" → He said he had seen it.',
          example: '"I went home." → She said she had gone home.',
        },
        {
          situation: 'Will → Would',
          pattern: '"I will help" → He said he would help.',
          example: '"I will call you." → He said he would call me.',
        },
        {
          situation: 'Can → Could; May → Might; Must → Had to',
          pattern: '"I can swim" → He said he could swim.',
          example: '"I must leave." → She said she had to leave.',
        },
      ],
    },
    {
      conjunction: 'ĐỔI ĐẠI TỪ VÀ THỜI GIAN',
      meaningVi: 'đổi cho phù hợp với người tường thuật + thời điểm tường thuật',
      patterns: [
        {
          situation: 'Đại từ thay đổi theo ngữ cảnh',
          pattern: 'I → he/she ; you → I/he/she ; we → they',
          example: '"I love you." → He said he loved me.',
        },
        {
          situation: 'Trạng từ thời gian',
          pattern: 'now → then ; today → that day ; tomorrow → the next day ; yesterday → the day before ; tonight → that night',
          example: '"I\'ll call tomorrow." → She said she would call the next day.',
        },
        {
          situation: 'Trạng từ vị trí: here → there ; this → that ; these → those',
          pattern: 'this → that',
          example: '"I live here." → He said he lived there.',
        },
      ],
    },
    {
      conjunction: 'SAID vs TOLD',
      meaningVi: 'phân biệt 2 verb tường thuật chính',
      patterns: [
        {
          situation: 'TOLD luôn theo sau bởi NGƯỜI nghe (tân ngữ)',
          pattern: 'S + told + sb + (that) + clause',
          example: 'He told me (that) he was tired.',
        },
        {
          situation: 'SAID không có người nghe trực tiếp; nếu có thì "to sb"',
          pattern: 'S + said + (to sb) + (that) + clause',
          example: 'He said (that) he was tired. / He said to me he was tired.',
        },
        {
          situation: '⚠️ KHÔNG nói "He said me…" hoặc "He told (that)…" (thiếu người nghe)',
          pattern: 'said + clause   |   told + sb + clause',
          example: 'KHÔNG: She told that... / She said me...',
        },
      ],
    },
    {
      conjunction: 'CÂU HỎI TƯỜNG THUẬT',
      meaningVi: 'reported questions — KHÔNG đảo trợ động từ + KHÔNG có dấu hỏi',
      patterns: [
        {
          situation: 'Wh- question: dùng asked + wh- + S + V (lùi thì)',
          pattern: 'S + asked + wh-word + S + V',
          example: '"Where do you live?" → She asked where I lived.',
        },
        {
          situation: 'Yes/No question: dùng asked + if/whether + S + V',
          pattern: 'S + asked + if/whether + S + V',
          example: '"Do you smoke?" → He asked if I smoked.',
        },
        {
          situation: '⚠️ KHÔNG đảo trợ động từ trong reported question',
          pattern: 'asked where SHE WORKED, KHÔNG "where did she work"',
          example: 'KHÔNG: He asked where did I live.',
        },
      ],
    },
    {
      conjunction: 'KHI KHÔNG LÙI THÌ',
      meaningVi: 'các trường hợp giữ nguyên thì',
      patterns: [
        {
          situation: '1. Sự thật hiển nhiên / chân lý',
          pattern: 'no backshift',
          example: 'He said (that) the Earth is round. (vẫn hiện tại)',
        },
        {
          situation: '2. Verb tường thuật ở HIỆN TẠI (says, tells)',
          pattern: 'no backshift',
          example: 'She says she is busy.',
        },
        {
          situation: '3. Việc còn liên quan tới hiện tại',
          pattern: 'optional backshift',
          example: 'He said the train leaves at 8 (vẫn đang sáng).',
        },
      ],
    },
  ],
}

const QUESTIONS_TOPIC: SpecialTopic = {
  id: 'questions',
  name: 'Question Forms — Wh-, Yes/No, Tags & Prep Position',
  nameVi: 'Câu hỏi — Wh-, Yes/No, đuôi & vị trí giới từ',
  emoji: '❓',
  intro:
    'Câu hỏi tiếng Anh = ĐẢO trợ động từ lên trước chủ ngữ. Wh-question dùng từ để hỏi đầu câu. Yes/No question bắt đầu bằng auxiliary. Murphy U45-46: trật tự câu hỏi, vị trí giới từ (Who are you talking TO?) và câu hỏi đuôi (tag questions) — vũ khí Speaking để xác nhận / mềm hóa lời nói.',
  rules: [
    {
      conjunction: 'YES/NO QUESTIONS',
      meaningVi: 'đảo trợ động từ (be, do, have, will, can...) lên trước chủ ngữ',
      patterns: [
        {
          situation: 'Be: đảo trực tiếp am/is/are/was/were',
          pattern: 'Be + S + ...?',
          example: 'Are you tired? / Were they at home?',
        },
        {
          situation: 'Mọi thì khác cần do/does/did',
          pattern: 'Do/Does/Did + S + V(bare)?',
          example: 'Do you smoke? / Does she like coffee? / Did they come?',
        },
        {
          situation: 'Có sẵn auxiliary (have/will/can) — chỉ cần đảo',
          pattern: 'Aux + S + V?',
          example: 'Have you finished? / Will you help me? / Can you swim?',
        },
      ],
    },
    {
      conjunction: 'WH-QUESTIONS',
      meaningVi: 'từ để hỏi (Wh-) đầu câu + trật tự câu hỏi như Yes/No',
      patterns: [
        {
          situation: 'Wh-word đứng đầu + đảo aux + S',
          pattern: 'Wh- + aux + S + V?',
          example: 'Where do you live? / What time did she arrive?',
        },
        {
          situation: 'Khi Wh- LÀ chủ ngữ → KHÔNG đảo, KHÔNG dùng do/does',
          pattern: 'Wh-(S) + V?',
          example: 'Who broke the window? (NOT: Who did break) / What happened?',
        },
        {
          situation: '⚠️ "Who" là S → V chia bình thường; "Who" là O → cần do/does',
          pattern: 'Who broke? (S) ⟷ Who did you see? (O)',
          example: 'Who called you? (S) vs Who(m) did you call? (O)',
        },
      ],
    },
    {
      conjunction: 'PREPOSITION POSITION ⭐',
      meaningVi: 'giới từ thường ở CUỐI câu hỏi tiếng Anh nói (KHÔNG đầu câu)',
      patterns: [
        {
          situation: 'Câu hỏi với prepositional verb',
          pattern: 'Wh- + aux + S + V + ... + prep?',
          example: 'Who are you talking TO? (KHÔNG: To whom are you talking?)',
        },
        {
          situation: 'Một số ví dụ thông dụng',
          pattern: '...',
          example: 'Where are you from? / What are you looking AT? / Who did you go WITH?',
        },
        {
          situation: 'Formal writing: "To whom..." vẫn dùng được nhưng văn nói thì giới từ ở cuối',
          pattern: 'spoken: end / formal written: front',
          example: 'For whom is this gift? (formal) ⟷ Who is this gift FOR? (spoken)',
        },
      ],
    },
    {
      conjunction: 'TAG QUESTIONS ⭐ (câu hỏi đuôi)',
      meaningVi: 'thêm câu hỏi ngắn ở cuối câu khẳng định/phủ định để xác nhận hoặc tạo hội thoại',
      patterns: [
        {
          situation: '⭐ Quy tắc vàng: câu KHẲNG ĐỊNH → đuôi PHỦ ĐỊNH (và ngược lại)',
          pattern: 'positive + negative tag  |  negative + positive tag',
          example: "You are tired, aren't you? / She isn't here, is she?",
        },
        {
          situation: 'Đuôi dùng cùng trợ động từ của câu',
          pattern: 'main aux → tag aux',
          example: "He works hard, doesn't he? / They have left, haven't they?",
        },
        {
          situation: 'Trường hợp đặc biệt: "I am" → tag dùng "aren\'t I?"',
          pattern: "I am ..., aren't I?",
          example: "I'm late, aren't I?",
        },
        {
          situation: 'Câu mệnh lệnh: dùng "will you?" hoặc "won\'t you?" / "shall we?" cho "Let\'s"',
          pattern: "imperative + will you?  |  Let's + shall we?",
          example: "Close the window, will you? / Let's go, shall we?",
        },
        {
          situation: '"There is/are" — tag dùng "isn\'t/aren\'t there?"',
          pattern: "There is/are ..., isn't/aren't there?",
          example: "There's a problem, isn't there?",
        },
        {
          situation: 'Đại từ "no one / nobody / everyone" → tag dùng THEY',
          pattern: "nobody / everyone + ... + they?",
          example: "Nobody called, did they? / Everyone agreed, didn't they?",
        },
      ],
    },
    {
      conjunction: 'INDIRECT/EMBEDDED QUESTIONS',
      meaningVi: 'câu hỏi gián tiếp / lồng trong câu khác — KHÔNG đảo trợ động từ',
      patterns: [
        {
          situation: 'Sau "Do you know / Can you tell me / I wonder..." → trật tự DECLARATIVE',
          pattern: 'Do you know + wh- + S + V?',
          example: "Do you know where she lives? (KHÔNG: where does she live)",
        },
        {
          situation: 'Yes/No question lồng: dùng if/whether',
          pattern: 'Do you know if/whether + S + V?',
          example: "I wonder if he is coming. / Can you tell me whether the shop is open?",
        },
      ],
    },
  ],
}

const AUXILIARY_VERBS: SpecialTopic = {
  id: 'auxiliary_verbs',
  name: 'Auxiliary Verbs — Short Answers, Echo, So/Neither',
  nameVi: 'Trợ động từ — câu trả lời ngắn, lặp lại, so/neither',
  emoji: '🔁',
  intro:
    'Trợ động từ (be, do, have + modals) dùng để TRÁNH LẶP động từ chính: câu trả lời ngắn, "so do I" / "neither do I", lặp lại với "I do" (nhấn mạnh), tag questions. Murphy U47 — rút gọn câu nói, nghe tự nhiên hơn nhiều.',
  rules: [
    {
      conjunction: 'SHORT ANSWERS',
      meaningVi: 'trả lời ngắn dùng trợ động từ thay vì lặp lại cả câu',
      patterns: [
        {
          situation: 'Câu hỏi Yes/No → "Yes/No + S + aux"',
          pattern: 'Yes, S + aux. / No, S + aux + not.',
          example: '"Do you smoke?" — "Yes, I do." / "No, I don\'t."',
        },
        {
          situation: 'Be: "Are you tired?" — "Yes, I am." / "No, I\'m not."',
          pattern: '...',
          example: '"Is she Vietnamese?" — "Yes, she is."',
        },
        {
          situation: 'Có modal: "Can you help?" — "Yes, I can."',
          pattern: 'Yes, S + modal.',
          example: '"Will you come?" — "Yes, I will."',
        },
      ],
    },
    {
      conjunction: 'SO / NEITHER (NOR) — đồng ý',
      meaningVi: '"so" = cũng vậy (positive); "neither/nor" = cũng không (negative)',
      patterns: [
        {
          situation: 'Tôi cũng vậy (khẳng định) → SO + aux + S',
          pattern: 'So + aux + S',
          example: '"I like Java." — "So do I." / "She is tired." — "So am I."',
        },
        {
          situation: 'Tôi cũng không → NEITHER/NOR + aux + S',
          pattern: 'Neither/Nor + aux + S',
          example: '"I don\'t smoke." — "Neither do I." / "I can\'t swim." — "Nor can I."',
        },
        {
          situation: '⚠️ Phải dùng aux cùng dạng với câu trước',
          pattern: 'match the auxiliary',
          example: '"I went home." — "So did I." (KHÔNG: So do I)',
        },
        {
          situation: '⚠️ Thứ tự ĐẢO: aux ĐỨNG TRƯỚC S',
          pattern: 'So/Neither + aux + S (KHÔNG S + aux)',
          example: '"So do I." (KHÔNG: "So I do")',
        },
      ],
    },
    {
      conjunction: 'NHẤN MẠNH (Emphatic DO)',
      meaningVi: 'thêm do/does/did để nhấn mạnh hành động (có thật/quan trọng)',
      patterns: [
        {
          situation: 'Hiện tại đơn: do/does + V(bare)',
          pattern: 'S + do/does + V(bare)',
          example: 'I DO like you! / She DOES study hard.',
        },
        {
          situation: 'Quá khứ đơn: did + V(bare)',
          pattern: 'S + did + V(bare)',
          example: 'I DID call you yesterday — check your phone.',
        },
        {
          situation: 'Mệnh lệnh: do + V(bare) để mời/khuyến khích',
          pattern: 'Do + V(bare)!',
          example: 'Do come in! / Do tell us more!',
        },
      ],
    },
    {
      conjunction: 'AVOID REPETITION (Echo)',
      meaningVi: 'lặp lại bằng aux thay vì lặp lại cả động từ',
      patterns: [
        {
          situation: 'So sánh: "X likes/can/has...; Y does/can/has TOO"',
          pattern: 'S1 V; S2 aux too',
          example: 'I like Java, and he does too. / She can swim and so can I.',
        },
        {
          situation: 'Trái nghĩa: but',
          pattern: 'S1 V; but S2 aux not',
          example: 'I like Java, but he doesn\'t. / She arrived early but he didn\'t.',
        },
        {
          situation: 'Tránh lặp trong câu hỏi',
          pattern: '...',
          example: '"I work hard." — "Do you?" (= Really?)',
        },
      ],
    },
    {
      conjunction: 'LƯU Ý',
      meaningVi: 'điểm hay nhầm',
      patterns: [
        {
          situation: 'Phải chọn ĐÚNG aux của câu trước (be cho be, do cho V thường)',
          pattern: '"He is..." → so AM I (be)  |  "He likes..." → so DO I (do)',
          example: '"She\'s tired." — "So am I." (KHÔNG "So do I")',
        },
        {
          situation: 'Phủ định: dùng "I don\'t" / "neither do I" — KHÔNG "Me neither" trong formal',
          pattern: 'formal: Neither do I / Me neither (informal)',
          example: '"I don\'t like fish." — "Neither do I." (formal) / "Me neither." (casual)',
        },
      ],
    },
  ],
}

const VERB_PATTERNS: SpecialTopic = {
  id: 'verb_patterns',
  name: 'Verb Patterns — V-ing, to V, V + object + to V',
  nameVi: 'V + V-ing / V + to V (4 nhóm chính + verb đổi nghĩa)',
  emoji: '🧩',
  intro:
    'Sau một động từ chính, động từ thứ hai phải ở DẠNG NÀO? Có 4 nhóm cơ bản: (1) V + V-ing (enjoy, mind, suggest...) (2) V + to V (decide, hope, promise...) (3) V + O + to V (want sb to, tell sb to, ask sb to...) (4) V + V-ing HOẶC to V — một số có nghĩa GIỐNG nhau, một số ĐỔI NGHĨA hoàn toàn (remember/regret/try/stop/forget). Murphy U48-51. Học thuộc nhóm = giải quyết 80% bài tập.',
  rules: [
    {
      conjunction: 'NHÓM 1: V + V-ing',
      meaningVi: 'những verb này LUÔN theo sau bởi V-ing',
      patterns: [
        {
          situation: 'Cảm xúc & sở thích: enjoy, like (chung), love, hate, dislike, mind, miss',
          pattern: 'S + enjoy + V-ing',
          example: 'I enjoy learning English. / Do you mind opening the window?',
        },
        {
          situation: 'Đề nghị/suy nghĩ: suggest, recommend, consider, imagine',
          pattern: 'S + suggest + V-ing',
          example: 'I suggest going by train. / She considered changing jobs.',
        },
        {
          situation: 'Phủ định/tránh: deny, avoid, give up, postpone, put off, can\'t help',
          pattern: 'S + avoid + V-ing',
          example: "He denied stealing the money. / I can't help laughing at this.",
        },
        {
          situation: 'Hoàn thành/tiếp tục: finish, keep, keep on, practise, spend time',
          pattern: 'S + keep + V-ing',
          example: 'She keeps phoning me. / I spend hours coding every day.',
        },
        {
          situation: 'Sau giới từ (about, of, in, on, before, after, by, without, instead of...) → LUÔN V-ing',
          pattern: 'preposition + V-ing',
          example: "I'm interested IN learning Korean. / Thanks FOR helping me.",
        },
      ],
    },
    {
      conjunction: 'NHÓM 2: V + to V',
      meaningVi: 'những verb này LUÔN theo sau bởi TO + V(bare)',
      patterns: [
        {
          situation: 'Kế hoạch & mong muốn: decide, hope, plan, want, would like, expect, intend',
          pattern: 'S + decide + to V',
          example: 'I decided to study abroad. / She hopes to find a job soon.',
        },
        {
          situation: 'Lời hứa/đe doạ: promise, threaten, agree, refuse, offer',
          pattern: 'S + promise + to V',
          example: 'He promised to call me. / She refused to answer.',
        },
        {
          situation: 'Khả năng/cố gắng: learn, manage, fail, afford, seem, appear, tend',
          pattern: 'S + manage + to V',
          example: 'I managed to fix the bug. / We can\'t afford to buy a car.',
        },
      ],
    },
    {
      conjunction: 'NHÓM 3: V + O + to V (Murphy U50)',
      meaningVi: 'cấu trúc "muốn/bảo/khuyên AI ĐÓ làm gì"',
      patterns: [
        {
          situation: 'Yêu cầu/bảo: tell, ask, advise, warn, remind, order, allow, encourage',
          pattern: 'S + V + O(person) + to V',
          example: 'She told me to wait. / The teacher asked us to be quiet.',
        },
        {
          situation: 'Mong muốn: want, expect, would like, would prefer',
          pattern: 'S + want + O + to V',
          example: 'I want you to help me. / She would like him to apologise.',
        },
        {
          situation: '⭐ "Make" và "let" KHÔNG có "to": make/let + O + V(bare)',
          pattern: 'S + make/let + O + V(bare) — KHÔNG "to"',
          example: 'My boss made me work overtime. / Let me explain.',
        },
        {
          situation: '"Help" có thể dùng cả 2 cách',
          pattern: 'S + help + O + (to) V',
          example: 'She helped me (to) carry the bags.',
        },
      ],
    },
    {
      conjunction: 'NHÓM 4A: V + V-ing HOẶC to V (cùng nghĩa)',
      meaningVi: 'không khác biệt rõ về nghĩa, có thể dùng cả 2 dạng',
      patterns: [
        {
          situation: 'begin, start, continue, prefer, like, love, hate',
          pattern: 'S + start + V-ing  =  S + start + to V',
          example: 'It started raining. = It started to rain.',
        },
        {
          situation: '⚠️ "Like / love / hate" dùng to-V thường là tương lai cụ thể; V-ing là sở thích chung',
          pattern: '...',
          example: 'I like swimming (sở thích). / I would like to swim (cụ thể).',
        },
      ],
    },
    {
      conjunction: "NHÓM 4B: V + V-ing HOẶC to V — KHÁC NGHĨA ⭐⭐",
      meaningVi: 'những verb cực kỳ bẫy — chọn sai dạng = đổi hoàn toàn nghĩa',
      patterns: [
        {
          situation: 'REMEMBER + V-ing: nhớ chuyện ĐÃ làm rồi (memory)',
          pattern: 'remember + V-ing = nhớ chuyện đã xảy ra',
          example: 'I remember locking the door. (đã khoá rồi, giờ nhớ lại)',
        },
        {
          situation: 'REMEMBER + to V: nhớ PHẢI làm (chưa làm, sẽ làm)',
          pattern: 'remember + to V = nhớ phải làm',
          example: "Remember to lock the door. (chưa khoá, hãy nhớ làm)",
        },
        {
          situation: 'FORGET + V-ing: quên mất chuyện đã làm (hiếm, thường phủ định)',
          pattern: "forget + V-ing",
          example: "I'll never forget meeting her. (sẽ không quên)",
        },
        {
          situation: 'FORGET + to V: quên phải làm gì',
          pattern: 'forget + to V',
          example: 'I forgot to call you. (đã quên gọi)',
        },
        {
          situation: 'REGRET + V-ing: tiếc về chuyện ĐÃ làm trong QK',
          pattern: 'regret + V-ing',
          example: 'I regret saying that. (đã nói rồi, giờ tiếc)',
        },
        {
          situation: 'REGRET + to V: tiếc PHẢI thông báo (formal, khi nói tin xấu)',
          pattern: 'regret + to V',
          example: 'I regret to inform you that... (đáng tiếc phải thông báo...)',
        },
        {
          situation: 'TRY + V-ing: THỬ làm gì (xem có giải quyết được không)',
          pattern: 'try + V-ing = thử nghiệm',
          example: "If it doesn't work, try restarting your computer.",
        },
        {
          situation: 'TRY + to V: CỐ GẮNG làm gì (nỗ lực)',
          pattern: 'try + to V = nỗ lực',
          example: 'I tried to lift the box but it was too heavy.',
        },
        {
          situation: 'STOP + V-ing: NGỪNG làm gì (kết thúc hành động đó)',
          pattern: 'stop + V-ing = dừng cái đang làm',
          example: 'He stopped smoking last year. (cai thuốc)',
        },
        {
          situation: 'STOP + to V: DỪNG LẠI ĐỂ làm gì khác',
          pattern: 'stop + to V = dừng để làm việc khác',
          example: 'He stopped to smoke. (dừng lại để hút thuốc)',
        },
        {
          situation: 'MEAN + V-ing: nghĩa là (sẽ kéo theo)',
          pattern: 'mean + V-ing = involve',
          example: 'Taking this job means moving to Hanoi.',
        },
        {
          situation: 'MEAN + to V: có ý/định làm gì',
          pattern: 'mean + to V = intend',
          example: "I meant to call you but I forgot.",
        },
      ],
    },
    {
      conjunction: 'LƯU Ý NHANH',
      meaningVi: 'những điểm cần khắc cốt ghi tâm',
      patterns: [
        {
          situation: 'Sau ANY preposition → LUÔN V-ing',
          pattern: 'prep + V-ing',
          example: "I'm good AT coding. / Thanks FOR helping. / I'm tired OF waiting.",
        },
        {
          situation: 'Sau "to" của to-infinitive → V(bare); sau "to" giới từ → V-ing',
          pattern: 'want TO go (infinitive) ⟷ look forward TO going (prep)',
          example: 'I look forward TO meeting you. (to là giới từ → V-ing)',
        },
        {
          situation: 'Modal + V(bare) — không có "to" cũng không V-ing',
          pattern: 'modal + V(bare)',
          example: 'She can SWIM. (KHÔNG can to swim / can swimming)',
        },
      ],
    },
  ],
}

const PREFER_WOULD_RATHER: SpecialTopic = {
  id: 'prefer_would_rather',
  name: 'Prefer & Would rather — Expressing Preference',
  nameVi: 'Prefer & Would rather — Diễn đạt sự ưu tiên',
  emoji: '⚖️',
  intro:
    'Cách nói "thích cái này hơn cái kia". Có 3 cấu trúc chính: PREFER (sở thích chung), WOULD PREFER (1 lần cụ thể), WOULD RATHER (giả định / 1 lần cụ thể). Mỗi cái có cú pháp riêng dễ nhầm. Murphy U53.',
  rules: [
    {
      conjunction: 'PREFER (sở thích chung)',
      meaningVi: 'thích cái gì hơn cái khác — nói chung, theo thói quen',
      patterns: [
        {
          situation: 'Prefer + V-ing TO + V-ing (so sánh 2 hành động)',
          pattern: 'S + prefer + V-ing + TO + V-ing',
          example: 'I prefer reading TO watching TV. (Thích đọc hơn xem TV — chung)',
        },
        {
          situation: 'Prefer + noun + TO + noun',
          pattern: 'S + prefer + noun + TO + noun',
          example: 'I prefer tea to coffee.',
        },
        {
          situation: 'Hoặc: prefer + to V + rather than + V(bare)',
          pattern: 'S + prefer + to V + rather than + V(bare)',
          example: 'I prefer to read rather than watch TV.',
        },
      ],
    },
    {
      conjunction: 'WOULD PREFER (1 lần cụ thể)',
      meaningVi: 'thích cái gì hơn trong tình huống cụ thể — thường tương lai gần / lời mời',
      patterns: [
        {
          situation: "Would prefer + TO V (KHÔNG dùng V-ing sau would prefer)",
          pattern: "S + would prefer + to V",
          example: "I'd prefer to stay home tonight. (Tối nay — cụ thể)",
        },
        {
          situation: 'Phủ định: would prefer NOT to V',
          pattern: "S + would prefer not to V",
          example: "I'd prefer not to talk about it.",
        },
        {
          situation: 'So sánh: would prefer + to V + rather than + V(bare)',
          pattern: "S + would prefer to V + rather than + V(bare)",
          example: "I'd prefer to walk rather than take the bus.",
        },
      ],
    },
    {
      conjunction: 'WOULD RATHER (cùng nghĩa với would prefer) ⭐',
      meaningVi: 'thích/muốn làm gì hơn — đặc biệt cho 1 lần cụ thể',
      patterns: [
        {
          situation: '⭐ Would rather + V(bare) — KHÔNG có "to"',
          pattern: "S + would rather + V(bare)",
          example: "I'd rather stay home. (KHÔNG: I'd rather to stay)",
        },
        {
          situation: 'Phủ định: would rather NOT + V(bare)',
          pattern: "S + would rather not + V(bare)",
          example: "I'd rather not talk about it now.",
        },
        {
          situation: 'So sánh: would rather + V(bare) + THAN + V(bare)',
          pattern: "S + would rather + V + than + V",
          example: "I'd rather walk than take the bus.",
        },
      ],
    },
    {
      conjunction: 'WOULD RATHER + S + V(QUÁ KHỨ) ⭐⭐',
      meaningVi: 'muốn AI KHÁC làm gì — dùng V QUÁ KHỨ (giả định)',
      patterns: [
        {
          situation: 'Khi muốn người khác làm gì (KHÔNG phải mình)',
          pattern: "S + would rather + (S2) + V(quá khứ đơn)",
          example: "I'd rather you stayed at home tonight. (Tôi muốn BẠN ở nhà tối nay)",
        },
        {
          situation: 'Quan trọng: V CHIA QUÁ KHỨ dù nói về hiện tại/tương lai',
          pattern: 'V(quá khứ) cho hiện tại — giả định',
          example: "I'd rather you didn't smoke here. (Tôi muốn bạn không hút ở đây)",
        },
        {
          situation: 'So sánh 2 cấu trúc: bản thân vs người khác',
          pattern: "I'd rather V(bare)  ⟷  I'd rather + S + V(QK)",
          example: "I'd rather go now. (tôi) ⟷ I'd rather you went now. (bạn)",
        },
      ],
    },
    {
      conjunction: 'BẢNG TÓM TẮT',
      meaningVi: 'cheat sheet để chọn đúng cấu trúc',
      patterns: [
        {
          situation: 'Sở thích CHUNG: I prefer reading TO watching TV.',
          pattern: 'prefer + V-ing/N + TO + V-ing/N',
          example: 'I prefer Italian food to French food.',
        },
        {
          situation: '1 lần CỤ THỂ (bản thân): I\'d rather/prefer + to V',
          pattern: "would rather + V(bare)  |  would prefer + to V",
          example: "I'd rather stay home. / I'd prefer to stay home.",
        },
        {
          situation: 'Muốn AI KHÁC làm: I\'d rather + S + V(QK)',
          pattern: "would rather + S + V(past)",
          example: "I'd rather you didn't do that.",
        },
      ],
    },
    {
      conjunction: 'LƯU Ý',
      meaningVi: 'những lỗi điển hình',
      patterns: [
        {
          situation: '"would rather" KHÔNG đi với "to"; "would prefer" PHẢI có "to"',
          pattern: "rather + V(bare)  ⟷  prefer + to V",
          example: "I'd rather GO. (KHÔNG: I'd rather to go)",
        },
        {
          situation: '"prefer ... to ..." vs "would rather ... than ..."',
          pattern: 'TO (với prefer) ⟷ THAN (với would rather)',
          example: 'I prefer X TO Y. / I\'d rather X THAN Y.',
        },
        {
          situation: 'Khi đề cập NGƯỜI KHÁC — luôn V(QK) sau "would rather"',
          pattern: "would rather + S + V(past)",
          example: "I'd rather she came earlier. (KHÔNG: she comes)",
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
  MODALS_DEDUCTION,
  MODALS_OBLIGATION,
  CONDITIONALS,
  PASSIVE,
  CAUSATIVE,
  REPORTED_SPEECH,
  QUESTIONS_TOPIC,
  AUXILIARY_VERBS,
  VERB_PATTERNS,
  PREFER_WOULD_RATHER,
]

export function findSpecialTopic(id: string): SpecialTopic | null {
  return SPECIAL_TOPICS.find((t) => t.id === id) ?? null
}

export function specialTopicName(id: string): string | null {
  return findSpecialTopic(id)?.nameVi ?? null
}
