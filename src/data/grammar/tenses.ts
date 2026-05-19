import type { Tense } from '@/types/grammar'

export const TENSES: Tense[] = [
  // ============ PRESENT ============
  {
    id: 'present_simple',
    group: 'present',
    name: 'Present Simple',
    nameVi: 'Hiện tại đơn',
    emoji: '⏰',
    formula: {
      affirmative: 'S + V(s/es)   |   S + am/is/are + N/Adj',
      negative: 'S + do/does + not + V   |   S + am/is/are + not + ...',
      question: 'Do/Does + S + V?   |   Am/Is/Are + S + ...?',
    },
    usages: [
      {
        description: 'Thói quen, hành động lặp đi lặp lại hằng ngày.',
        examples: [
          'My iPhone alarm goes off at 6:30 every weekday.',
          'I check Slack about ten times a day — it’s a bad habit.',
          'She drinks two coffees before she even opens her laptop.',
        ],
      },
      {
        description: 'Sự thật hiển nhiên, chân lý khoa học.',
        examples: [
          'Water boils at 100°C at sea level.',
          'The earth revolves around the sun.',
          'Hanoi has four seasons, but only really feels two.',
        ],
      },
      {
        description: 'Lịch trình cố định, thời gian biểu (tàu, máy bay, lớp học).',
        examples: [
          'The Hanoi–Saigon train leaves at 7:15 every evening.',
          'My English class starts at 8 a.m. on Mondays and Wednesdays.',
          'The shop opens at 9 and closes at 10 p.m.',
        ],
      },
      {
        description: 'Quan điểm, sở thích, cảm xúc, nghề nghiệp.',
        examples: [
          'I love spicy food but I hate coriander.',
          'He works as a frontend developer at a fintech startup.',
          'She prefers tea over coffee.',
        ],
      },
    ],
    signalWords: [
      'every day / week / year',
      'always',
      'usually',
      'often',
      'sometimes',
      'rarely / seldom',
      'never',
      'on Mondays',
    ],
  },

  {
    id: 'present_continuous',
    group: 'present',
    name: 'Present Continuous',
    nameVi: 'Hiện tại tiếp diễn',
    emoji: '🔄',
    formula: {
      affirmative: 'S + am/is/are + V-ing',
      negative: 'S + am/is/are + not + V-ing',
      question: 'Am/Is/Are + S + V-ing?',
    },
    usages: [
      {
        description: 'Hành động đang xảy ra ngay tại thời điểm nói.',
        examples: [
          'Hold on — I’m typing a reply to my boss right now.',
          'Listen! The neighbours are arguing again.',
          'I can’t talk, I’m driving.',
        ],
      },
      {
        description: 'Kế hoạch tương lai gần đã sắp xếp trước.',
        examples: [
          'We’re flying to Da Nang next Friday.',
          'I’m meeting Linh for lunch at 12.',
          'They’re moving to a new apartment this weekend.',
        ],
      },
      {
        description: 'Thay đổi đang diễn ra (xu hướng, tình huống tạm thời).',
        examples: [
          'Rent in Saigon is rising fast these days.',
          'My English is getting better, slowly but surely.',
          'More and more people are working from home.',
        ],
      },
      {
        description: 'Phàn nàn về thói quen khó chịu (với always, constantly).',
        examples: [
          'He’s always interrupting me in meetings!',
          'My laptop is constantly crashing this week.',
          'You’re always leaving dirty dishes in the sink.',
        ],
      },
    ],
    signalWords: [
      'now',
      'right now',
      'at the moment',
      'at present',
      'currently',
      'look! / listen!',
      'these days',
    ],
    notes: 'KHÔNG dùng với stative verbs (know, love, want, believe, own...). Sai: "I am knowing him." Đúng: "I know him."',
  },

  {
    id: 'present_perfect',
    group: 'present',
    name: 'Present Perfect',
    nameVi: 'Hiện tại hoàn thành',
    emoji: '✅',
    formula: {
      affirmative: 'S + have/has + V3/V-ed',
      negative: 'S + have/has + not + V3',
      question: 'Have/Has + S + V3?',
    },
    usages: [
      {
        description: 'Hành động bắt đầu trong quá khứ, kéo dài đến hiện tại.',
        examples: [
          'I’ve worked at this company for three years.',
          'We have lived in this apartment since 2020.',
          'She has known him since they were in high school.',
        ],
      },
      {
        description: 'Hành động vừa hoàn thành, có dấu hiệu/hậu quả ở hiện tại.',
        examples: [
          'I’ve just finished my morning standup — what’s up?',
          'Someone has eaten my pizza! The box is empty.',
          'Look — they’ve painted the wall a new colour.',
        ],
      },
      {
        description: 'Trải nghiệm trong đời, không nói rõ khi nào.',
        examples: [
          'I’ve never tried durian, and I don’t plan to.',
          'Have you ever been to Japan?',
          'She’s seen that Marvel movie four times already.',
        ],
      },
      {
        description: 'Hành động lặp lại nhiều lần tính đến hiện tại.',
        examples: [
          'I’ve called him five times today but he doesn’t answer.',
          'We’ve had three power cuts this week.',
        ],
      },
    ],
    signalWords: [
      'for + khoảng thời gian',
      'since + mốc thời gian',
      'just',
      'already',
      'yet (negative/question)',
      'ever / never',
      'so far',
      'recently / lately',
      'up to now',
    ],
  },

  {
    id: 'present_perfect_continuous',
    group: 'present',
    name: 'Present Perfect Continuous',
    nameVi: 'Hiện tại hoàn thành tiếp diễn',
    emoji: '⏳',
    formula: {
      affirmative: 'S + have/has + been + V-ing',
      negative: 'S + have/has + not + been + V-ing',
      question: 'Have/Has + S + been + V-ing?',
    },
    usages: [
      {
        description: 'Nhấn mạnh thời lượng của hành động kéo dài từ quá khứ đến hiện tại (vẫn đang tiếp tục).',
        examples: [
          'I’ve been studying English for over five years.',
          'She’s been working on that pitch deck all afternoon.',
          'We’ve been waiting for the food for 40 minutes — where is it?',
        ],
      },
      {
        description: 'Hành động vừa kết thúc nhưng để lại kết quả/dấu vết.',
        examples: [
          'My eyes hurt — I’ve been staring at the screen too long.',
          'You’re soaked! Have you been running in the rain?',
          'The floor is wet because the kids have been playing with water.',
        ],
      },
    ],
    signalWords: ['for ... hours/days', 'since ...', 'all day/morning', 'lately', 'recently'],
    notes: 'Khác Present Perfect: nhấn mạnh QUÁ TRÌNH thay vì kết quả. So sánh: "I’ve read the book" (xong rồi) vs "I’ve been reading the book" (đang đọc dở).',
  },

  // ============ PAST ============
  {
    id: 'past_simple',
    group: 'past',
    name: 'Past Simple',
    nameVi: 'Quá khứ đơn',
    emoji: '📅',
    formula: {
      affirmative: 'S + V2/V-ed   |   S + was/were + ...',
      negative: 'S + did + not + V   |   S + was/were + not + ...',
      question: 'Did + S + V?   |   Was/Were + S + ...?',
    },
    usages: [
      {
        description: 'Hành động đã hoàn tất, có mốc thời gian rõ ràng trong quá khứ.',
        examples: [
          'I had pho for breakfast yesterday.',
          'We bought our first apartment in 2021.',
          'She graduated three years ago.',
        ],
      },
      {
        description: 'Chuỗi hành động xảy ra liên tiếp trong quá khứ.',
        examples: [
          'I woke up, brushed my teeth, and ran out the door.',
          'He paid the bill, grabbed his jacket, and left.',
        ],
      },
      {
        description: 'Thói quen trong quá khứ (nay không còn nữa).',
        examples: [
          'When I was a kid, I played football every afternoon.',
          'My grandfather smoked a pipe before he quit.',
        ],
      },
    ],
    signalWords: [
      'yesterday',
      'last week / month / year',
      'ago',
      'in 1999 / in 2010',
      'when I was a child',
    ],
  },

  {
    id: 'past_continuous',
    group: 'past',
    name: 'Past Continuous',
    nameVi: 'Quá khứ tiếp diễn',
    emoji: '🌀',
    formula: {
      affirmative: 'S + was/were + V-ing',
      negative: 'S + was/were + not + V-ing',
      question: 'Was/Were + S + V-ing?',
    },
    usages: [
      {
        description: 'Hành động đang xảy ra tại một thời điểm xác định trong quá khứ.',
        examples: [
          'At 9 p.m. last night I was watching Squid Game season 3.',
          'This time yesterday I was stuck in traffic on Pham Hung.',
        ],
      },
      {
        description: 'Hành động đang xảy ra thì bị một hành động khác xen vào (hành động dài chia tiếp diễn, hành động ngắn chia quá khứ đơn).',
        examples: [
          'I was deploying to production when the internet died.',
          'She was making coffee when the doorbell rang.',
          'We were having dinner when the power went out.',
        ],
      },
      {
        description: 'Hai hành động song song trong quá khứ.',
        examples: [
          'While I was cooking, my husband was washing the car.',
          'He was playing games while she was studying for the IELTS.',
        ],
      },
    ],
    signalWords: ['at + giờ + last night/yesterday', 'while', 'when', 'this time yesterday'],
  },

  {
    id: 'past_perfect',
    group: 'past',
    name: 'Past Perfect',
    nameVi: 'Quá khứ hoàn thành',
    emoji: '⏮️',
    formula: {
      affirmative: 'S + had + V3/V-ed',
      negative: 'S + had + not + V3',
      question: 'Had + S + V3?',
    },
    usages: [
      {
        description: 'Hành động xảy ra TRƯỚC một hành động khác trong quá khứ.',
        examples: [
          'By the time I arrived, the meeting had already started.',
          'She had left the office before I got there.',
          'He realised he had forgotten his passport at home.',
        ],
      },
      {
        description: 'Hành động xảy ra trước một mốc thời gian cụ thể trong quá khứ.',
        examples: [
          'By 2020, I had been to Japan three times.',
          'Before last summer, she had never tried surfing.',
        ],
      },
    ],
    signalWords: [
      'by the time + past simple',
      'before + past simple',
      'after + past perfect',
      'already',
      'just',
      'when (clause 2)',
    ],
    notes: 'Quy tắc: trong câu có before/after, mệnh đề "trước" dùng Past Perfect, mệnh đề "sau" dùng Past Simple.',
  },

  {
    id: 'past_perfect_continuous',
    group: 'past',
    name: 'Past Perfect Continuous',
    nameVi: 'Quá khứ hoàn thành tiếp diễn',
    emoji: '⌛',
    formula: {
      affirmative: 'S + had + been + V-ing',
      negative: 'S + had + not + been + V-ing',
      question: 'Had + S + been + V-ing?',
    },
    usages: [
      {
        description: 'Nhấn mạnh thời lượng của hành động kéo dài đến trước một mốc khác trong quá khứ.',
        examples: [
          'I had been working at that startup for five years before it shut down.',
          'She was tired because she had been studying all night.',
          'They had been dating for two years when they finally got married.',
        ],
      },
    ],
    signalWords: ['for + khoảng thời gian + before ...', 'until then', 'prior to that'],
  },

  // ============ FUTURE ============
  {
    id: 'future_simple',
    group: 'future',
    name: 'Future Simple',
    nameVi: 'Tương lai đơn',
    emoji: '🔮',
    formula: {
      affirmative: 'S + will + V (bare)',
      negative: 'S + will + not (won’t) + V',
      question: 'Will + S + V?',
    },
    usages: [
      {
        description: 'Quyết định nói ra ngay tại thời điểm nói.',
        examples: [
          '"I’m thirsty." — "OK, I’ll grab you some water."',
          '"The printer is broken." — "Don’t worry, I’ll fix it."',
        ],
      },
      {
        description: 'Dự đoán không chắc chắn, dựa trên cảm nhận/ý kiến cá nhân.',
        examples: [
          'I think VN will win the next SEA Games.',
          'It’ll probably rain tomorrow.',
          'You’ll love this restaurant, I promise.',
        ],
      },
      {
        description: 'Lời hứa, lời đề nghị, lời cảnh báo.',
        examples: [
          'I will call you the moment I land.',
          'I’ll lend you the money — no problem.',
          'Don’t touch that — you’ll burn yourself!',
        ],
      },
    ],
    signalWords: [
      'tomorrow',
      'next week / month / year',
      'soon',
      'in the future',
      'I think / I believe / probably',
    ],
    notes: 'Khác "be going to": will = quyết định/dự đoán TỨC THÌ; be going to = kế hoạch đã có sẵn hoặc dự đoán có bằng chứng rõ.',
  },

  {
    id: 'future_continuous',
    group: 'future',
    name: 'Future Continuous',
    nameVi: 'Tương lai tiếp diễn',
    emoji: '🚀',
    formula: {
      affirmative: 'S + will + be + V-ing',
      negative: 'S + will + not + be + V-ing',
      question: 'Will + S + be + V-ing?',
    },
    usages: [
      {
        description: 'Hành động đang diễn ra tại một thời điểm cụ thể trong tương lai.',
        examples: [
          'This time next Friday I’ll be flying to Da Nang.',
          'At 8 p.m. tomorrow I’ll be having dinner with my parents.',
        ],
      },
      {
        description: 'Hành động sẽ đang xảy ra thì có hành động khác xen vào (cấu trúc song song với quá khứ tiếp diễn).',
        examples: [
          'I’ll be working when you arrive, so just text me.',
          'They’ll be having lunch when we get there.',
        ],
      },
    ],
    signalWords: [
      'at + giờ + tomorrow',
      'this time next week',
      'in + khoảng thời gian (in 2 hours)',
    ],
  },

  {
    id: 'future_perfect',
    group: 'future',
    name: 'Future Perfect',
    nameVi: 'Tương lai hoàn thành',
    emoji: '🏁',
    formula: {
      affirmative: 'S + will + have + V3/V-ed',
      negative: 'S + will + not + have + V3',
      question: 'Will + S + have + V3?',
    },
    usages: [
      {
        description: 'Hành động sẽ hoàn tất trước một mốc thời gian trong tương lai.',
        examples: [
          'By next Monday, I will have finished the report.',
          'She’ll have graduated by this time next year.',
          'By 2030, we’ll have switched to electric vehicles entirely.',
        ],
      },
    ],
    signalWords: ['by + tomorrow/next week/2030', 'by the time + present simple', 'before + then'],
  },

  {
    id: 'future_perfect_continuous',
    group: 'future',
    name: 'Future Perfect Continuous',
    nameVi: 'Tương lai hoàn thành tiếp diễn',
    emoji: '⏱️',
    formula: {
      affirmative: 'S + will + have + been + V-ing',
      negative: 'S + will + not + have + been + V-ing',
      question: 'Will + S + have + been + V-ing?',
    },
    usages: [
      {
        description: 'Nhấn mạnh thời lượng của một hành động sẽ tiếp tục đến một mốc trong tương lai.',
        examples: [
          'By next June, I will have been studying English for 6 years.',
          'When you arrive, I’ll have been waiting for two hours.',
          'By the end of this project, we’ll have been working together for almost a decade.',
        ],
      },
    ],
    signalWords: ['by + mốc tương lai + for + khoảng thời gian'],
  },
]

export function findTense(id: string): Tense | undefined {
  return TENSES.find((t) => t.id === id)
}
