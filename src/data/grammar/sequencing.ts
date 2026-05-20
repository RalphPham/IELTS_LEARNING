import type { SequencingRule } from '@/types/grammar'

// "Sự phối thì" — how tenses combine with time conjunctions.
// Rules are standard grammar facts; examples are written in everyday contexts.

export const SEQUENCING_INTRO =
  'Sự phối thì là cách chia động từ ở hai vế câu cho ăn khớp với nhau khi có liên từ thời gian (when, while, as soon as, since, by the time, after, before, until...). Nắm chắc 10 nhóm dưới đây là xử lý được hầu hết bài tập chia động từ.'

export const SEQUENCING_RULES: SequencingRule[] = [
  {
    conjunction: 'WHEN',
    meaningVi: 'khi (hành động nối tiếp, xen vào, hoặc xảy ra trước)',
    patterns: [
      {
        situation: 'Hai hành động NỐI TIẾP nhau trong quá khứ',
        pattern: 'WHEN + S + V(quá khứ đơn), S + V(quá khứ đơn)',
        example: 'When the alarm went off, I jumped out of bed.',
      },
      {
        situation: 'Hai hành động NỐI TIẾP nhau trong tương lai',
        pattern: 'WHEN + S + V(hiện tại đơn), S + V(tương lai đơn)',
        example: 'When I see her tomorrow, I will tell her the news.',
      },
      {
        situation: 'Hành động đang xảy ra thì hành động khác XEN VÀO (quá khứ)',
        pattern: 'WHEN + S + V(quá khứ đơn), S + V(quá khứ tiếp diễn)',
        example: 'When I called her, she was cooking dinner.',
      },
      {
        situation: 'Hành động sẽ đang xảy ra thì hành động khác xen vào (tương lai)',
        pattern: 'WHEN + S + V(hiện tại đơn), S + V(tương lai tiếp diễn)',
        example: 'When you arrive, I will be working in the garden.',
      },
      {
        situation: 'Một hành động XẢY RA XONG TRƯỚC hành động kia (quá khứ)',
        pattern: 'WHEN + S + V(quá khứ đơn), S + V(quá khứ hoàn thành)',
        example: 'When we got to the cinema, the film had already started.',
      },
      {
        situation: 'Một hành động sẽ hoàn tất trước một mốc tương lai',
        pattern: 'WHEN + S + V(hiện tại đơn), S + V(tương lai hoàn thành)',
        example: 'When you come back, I will have finished cleaning the house.',
      },
    ],
  },
  {
    conjunction: 'WHILE',
    meaningVi: 'trong khi (hai hành động song song, hoặc xen vào)',
    patterns: [
      {
        situation: 'Hai hành động xảy ra SONG SONG trong quá khứ',
        pattern: 'WHILE + S + V(quá khứ tiếp diễn), S + V(quá khứ tiếp diễn)',
        example: 'While I was washing the dishes, my husband was watching TV.',
      },
      {
        situation: 'Hành động đang xảy ra thì hành động khác XEN VÀO',
        pattern: 'WHILE + S + V(quá khứ tiếp diễn), S + V(quá khứ đơn)',
        example: 'While she was sleeping, someone knocked on the door.',
      },
    ],
  },
  {
    conjunction: 'AS SOON AS',
    meaningVi: 'ngay khi (hành động nối tiếp tức thì)',
    patterns: [
      {
        situation: 'Hai hành động nối tiếp tức thì trong quá khứ',
        pattern: 'AS SOON AS + S + V(quá khứ đơn), S + V(quá khứ đơn)',
        example: 'As soon as I saw the spider, I screamed and ran.',
      },
      {
        situation: 'Hai hành động nối tiếp tức thì trong tương lai',
        pattern: 'AS SOON AS + S + V(hiện tại đơn / hiện tại hoàn thành), S + V(tương lai đơn)',
        example: 'I will text you as soon as I land in Tokyo.',
      },
    ],
  },
  {
    conjunction: 'SINCE',
    meaningVi: 'từ khi',
    patterns: [
      {
        situation: 'Hành động kéo dài từ một mốc trong quá khứ đến hiện tại',
        pattern: 'S + V(hiện tại hoàn thành) + SINCE + S + V(quá khứ đơn)',
        example: 'We have known each other since we were in high school.',
      },
    ],
  },
  {
    conjunction: 'BY + thời gian',
    meaningVi: 'tính đến (một mốc thời gian)',
    patterns: [
      {
        situation: 'Hành động hoàn tất tính đến một mốc trong quá khứ',
        pattern: 'BY + trạng từ quá khứ, S + V(quá khứ hoàn thành)',
        example: 'By last month, I had worked here for three years.',
      },
      {
        situation: 'Hành động sẽ hoàn tất tính đến một mốc trong tương lai',
        pattern: 'BY + trạng từ tương lai, S + V(tương lai hoàn thành)',
        example: 'By next year, I will have saved enough for a house.',
      },
    ],
  },
  {
    conjunction: 'AT THIS / THAT TIME',
    meaningVi: 'vào thời điểm này/đó (hành động đang diễn ra)',
    patterns: [
      {
        situation: 'Hành động đang xảy ra tại một thời điểm xác định trong quá khứ',
        pattern: 'AT THIS/THAT TIME + trạng từ quá khứ, S + V(quá khứ tiếp diễn)',
        example: 'At this time last week, we were preparing for Tet.',
      },
      {
        situation: 'Hành động sẽ đang xảy ra tại một thời điểm trong tương lai',
        pattern: 'AT THIS/THAT TIME + trạng từ tương lai, S + V(tương lai tiếp diễn)',
        example: 'At this time tomorrow, I will be flying to Da Nang.',
      },
    ],
  },
  {
    conjunction: 'BY THE TIME',
    meaningVi: 'vào lúc mà',
    patterns: [
      {
        situation: 'Trong quá khứ: hành động kia đã hoàn tất trước đó',
        pattern: 'BY THE TIME + S + V(quá khứ đơn), S + V(quá khứ hoàn thành)',
        example: 'By the time she got home, everyone had gone to bed.',
      },
      {
        situation: 'Trong tương lai: hành động kia sẽ hoàn tất trước đó',
        pattern: 'BY THE TIME + S + V(hiện tại đơn), S + V(tương lai hoàn thành)',
        example: 'By the time the movie starts, we will have bought our snacks.',
      },
    ],
  },
  {
    conjunction: 'AFTER',
    meaningVi: 'sau khi',
    patterns: [
      {
        situation: 'Trong quá khứ: hành động xong rồi mới tới hành động kia',
        pattern: 'AFTER + S + V(quá khứ hoàn thành), S + V(quá khứ đơn)',
        example: 'After she had finished her homework, she went out.',
      },
      {
        situation: 'Trong tương lai/hiện tại: dùng hiện tại hoàn thành + hiện tại đơn',
        pattern: 'AFTER + S + V(hiện tại hoàn thành), S + V(hiện tại đơn / tương lai đơn)',
        example: 'After I have saved enough money, I will travel abroad.',
      },
    ],
  },
  {
    conjunction: 'BEFORE',
    meaningVi: 'trước khi',
    patterns: [
      {
        situation: 'Trong quá khứ: hành động xong trước khi hành động kia tới',
        pattern: 'BEFORE + S + V(quá khứ đơn), S + V(quá khứ hoàn thành)',
        example: 'Before she went to bed, she had locked all the doors.',
      },
      {
        situation: 'Trong tương lai: hành động sẽ hoàn tất trước hành động kia',
        pattern: 'BEFORE + S + V(hiện tại đơn), S + V(tương lai hoàn thành / tương lai đơn)',
        example: 'Hurry up, or the film will have ended before we get there.',
      },
    ],
  },
  {
    conjunction: 'UNTIL / TILL',
    meaningVi: 'cho tới khi',
    patterns: [
      {
        situation: 'Hành động kéo dài cho tới một mốc — vế until dùng thì hiện tại',
        pattern: 'S + V(tương lai đơn / V-bare) + UNTIL/TILL + S + V(hiện tại đơn / hiện tại hoàn thành)',
        example: 'I will wait here until the rain stops.',
      },
    ],
  },
]
