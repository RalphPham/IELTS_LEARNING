export interface SpeakingPrompt {
  id: string
  part: 1 | 2
  category: string
  question: string
  /** Target structures to push the learner to use */
  targets: string[]
  /** Handy phrases shown as a hint */
  phrases: string[]
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  // ===== Part 1 — Plans / Future (matches the will vs going to lesson) =====
  {
    id: 'sp_plans_weekend',
    part: 1,
    category: 'Plans & Future',
    question: 'What are your plans for this weekend?',
    targets: ['≥2 câu be going to (kế hoạch chắc)', '≥1 câu will (dự đoán)'],
    phrases: ["I'm going to...", "I'm planning to...", "I'll probably...", "I might..."],
  },
  {
    id: 'sp_future_life',
    part: 1,
    category: 'Plans & Future',
    question: 'Do you think your life will change much in the future?',
    targets: ['≥2 câu will (dự đoán)', '≥1 câu be going to (dự định)'],
    phrases: ["I think I'll...", "I'm going to...", "In ten years, I'll probably...", "I doubt I'll..."],
  },
  {
    id: 'sp_next_holiday',
    part: 1,
    category: 'Plans & Future',
    question: 'What are you going to do on your next holiday?',
    targets: ['≥2 câu be going to', '≥1 câu Present Continuous (kế hoạch đã chốt)'],
    phrases: ["I'm going to...", "I'm flying to...", "We're staying at...", "I'll definitely..."],
  },
  {
    id: 'sp_goals_year',
    part: 1,
    category: 'Plans & Future',
    question: 'What goals do you have for this year?',
    targets: ['≥2 câu be going to', '≥1 câu will'],
    phrases: ["I'm going to focus on...", "My main goal is to...", "I'll try to...", "I'm hoping to..."],
  },

  // ===== Part 1 — Hometown =====
  {
    id: 'sp_hometown',
    part: 1,
    category: 'Hometown',
    question: 'Can you describe your hometown?',
    targets: ['≥3 tính từ miêu tả', 'dùng Present Simple cho sự thật'],
    phrases: ['It’s a city in...', 'It’s famous for...', 'There are lots of...', 'People there are...'],
  },
  {
    id: 'sp_hometown_change',
    part: 1,
    category: 'Hometown',
    question: 'How has your hometown changed in recent years?',
    targets: ['≥2 câu Present Perfect', 'so sánh quá khứ vs hiện tại'],
    phrases: ['It has become...', 'They have built...', 'It used to be..., but now...', 'There has been...'],
  },

  // ===== Part 1 — Work / Study =====
  {
    id: 'sp_work_study',
    part: 1,
    category: 'Work & Study',
    question: 'Do you work or are you a student? Tell me about it.',
    targets: ['Present Simple cho thói quen', '≥1 câu Present Continuous (việc đang làm)'],
    phrases: ['I work as...', 'I’m currently studying...', 'My job involves...', 'At the moment, I’m...'],
  },
  {
    id: 'sp_daily_routine',
    part: 1,
    category: 'Work & Study',
    question: 'What does your typical day look like?',
    targets: ['Present Simple', 'trạng từ tần suất (usually, often...)'],
    phrases: ['I usually...', 'First, I...', 'After that, I...', 'In the evening, I...'],
  },

  // ===== Part 1 — Hobbies / Free time =====
  {
    id: 'sp_freetime',
    part: 1,
    category: 'Hobbies',
    question: 'What do you like to do in your free time?',
    targets: ['Present Simple', '≥2 lý do (because/so)'],
    phrases: ['I’m really into...', 'I love... because...', 'Whenever I have time, I...', 'It helps me relax.'],
  },
  {
    id: 'sp_music',
    part: 1,
    category: 'Hobbies',
    question: 'What kind of music do you enjoy?',
    targets: ['Present Simple', 'từ vựng cảm xúc'],
    phrases: ['I’m a big fan of...', 'It depends on my mood.', 'I tend to listen to...', 'It cheers me up.'],
  },
  {
    id: 'sp_reading',
    part: 1,
    category: 'Hobbies',
    question: 'Do you like reading? What do you read?',
    targets: ['Present Simple', '≥1 câu Present Perfect (trải nghiệm)'],
    phrases: ['I prefer...', 'I’ve recently read...', 'I usually read on...', 'I’m not much of a reader.'],
  },

  // ===== Part 1 — Food =====
  {
    id: 'sp_food',
    part: 1,
    category: 'Food',
    question: 'What is your favourite food and why?',
    targets: ['Present Simple', '≥2 tính từ miêu tả vị'],
    phrases: ['My favourite is...', 'It’s really...', 'I could eat it every day.', 'It reminds me of...'],
  },
  {
    id: 'sp_cooking',
    part: 1,
    category: 'Food',
    question: 'Do you cook? How often?',
    targets: ['Present Simple + tần suất', 'động từ nấu nướng'],
    phrases: ['I cook... times a week.', 'I’m not a great cook, but...', 'I usually make...', 'I tend to...'],
  },

  // ===== Part 1 — Weather / Seasons =====
  {
    id: 'sp_weather',
    part: 1,
    category: 'Weather',
    question: 'What is the weather like in your country?',
    targets: ['Present Simple', 'từ vựng thời tiết'],
    phrases: ['It’s usually...', 'In summer, it gets...', 'We have... seasons.', 'It can be quite...'],
  },
  {
    id: 'sp_season',
    part: 1,
    category: 'Weather',
    question: 'Which season do you like best?',
    targets: ['Present Simple', '≥2 lý do'],
    phrases: ['My favourite season is...', 'I love it because...', 'The weather is...', 'You can...'],
  },

  // ===== Part 1 — Technology =====
  {
    id: 'sp_phone',
    part: 1,
    category: 'Technology',
    question: 'How do you use your smartphone every day?',
    targets: ['Present Simple', '≥1 câu Present Continuous (xu hướng)'],
    phrases: ['I mainly use it for...', 'I’m always checking...', 'I rely on it to...', 'These days, I’m using...'],
  },
  {
    id: 'sp_social_media',
    part: 1,
    category: 'Technology',
    question: 'Do you use social media a lot?',
    targets: ['Present Simple + tần suất', 'ý kiến cá nhân'],
    phrases: ['I spend about... on...', 'I mostly use...', 'To be honest, I...', 'It can be a waste of time.'],
  },

  // ===== Part 1 — Travel =====
  {
    id: 'sp_travel',
    part: 1,
    category: 'Travel',
    question: 'Do you like travelling? Where have you been?',
    targets: ['≥2 câu Present Perfect (đã đi đâu)', '≥1 câu Past Simple (chi tiết 1 chuyến)'],
    phrases: ['I’ve been to...', 'Last year, I went to...', 'I’d love to visit...', 'My favourite trip was...'],
  },
  {
    id: 'sp_transport',
    part: 1,
    category: 'Travel',
    question: 'How do you usually get around your city?',
    targets: ['Present Simple', 'từ vựng giao thông'],
    phrases: ['I usually...', 'It’s faster to...', 'I avoid... because...', 'During rush hour, I...'],
  },

  // ===== Part 2 — Cue cards =====
  {
    id: 'sp_p2_plan',
    part: 2,
    category: 'Cue Card',
    question:
      'Describe a plan you have for the near future. You should say: what it is, when you will do it, who you will do it with, and why it is important to you.',
    targets: ['≥3 câu be going to', '≥2 câu will', 'nói liền 2 phút'],
    phrases: ["I'm going to...", "I'm planning to...", "I'll probably...", "The reason is..."],
  },
  {
    id: 'sp_p2_skill',
    part: 2,
    category: 'Cue Card',
    question:
      'Describe a skill you would like to learn. You should say: what it is, why you want to learn it, how you will learn it, and how it will help you.',
    targets: ['≥2 câu will', '≥1 câu be going to', 'used to / present perfect nếu hợp'],
    phrases: ["I'd like to learn...", "I'm going to start by...", "It'll help me...", "I've always wanted to..."],
  },
  {
    id: 'sp_p2_place',
    part: 2,
    category: 'Cue Card',
    question:
      'Describe a place you would like to visit. You should say: where it is, how you know about it, what you would do there, and why you want to go.',
    targets: ['≥2 câu would/will', 'từ vựng miêu tả nơi chốn'],
    phrases: ["I'd love to visit...", "I would spend my time...", "I've heard that...", "The main reason is..."],
  },
]

export function promptsByCategory(): Record<string, SpeakingPrompt[]> {
  const map: Record<string, SpeakingPrompt[]> = {}
  SPEAKING_PROMPTS.forEach((p) => {
    ;(map[p.category] ??= []).push(p)
  })
  return map
}
