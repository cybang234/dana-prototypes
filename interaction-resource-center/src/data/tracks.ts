import { Track } from '../types/interaction';

export const tracks: Track[] = [
  {
    id: 'commerce',
    name: 'Commerce',
    cases: [
      {
        id: 'commerce-cart',
        title: '장바구니 담기',
        description: '상품을 장바구니에 담을 때 bounce 피드백으로 성공을 표현합니다.',
        interactionId: 'bounce',
      },
      {
        id: 'commerce-price',
        title: '가격 변경',
        description: '할인 적용 시 숫자가 rolling으로 변경되어 변화를 강조합니다.',
        interactionId: 'rolling',
      },
    ],
  },
];
