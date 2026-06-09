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
  CONDITIONALS,
]

export function findSpecialTopic(id: string): SpecialTopic | null {
  return SPECIAL_TOPICS.find((t) => t.id === id) ?? null
}

export function specialTopicName(id: string): string | null {
  return findSpecialTopic(id)?.nameVi ?? null
}
