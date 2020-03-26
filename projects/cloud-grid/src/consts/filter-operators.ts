export const EQ_OPERATOR: string = 'eq';
export const LIKE_OPERATOR: string = 'like';
export const NLIKE_OPERATOR: string = 'nlike';
export const NE_OPERATOR: string = 'ne';
export const LT_OPERATOR: string = 'lt';
export const GT_OPERATOR: string = 'gt';
export const LTE_OPERATOR: string = 'lte';
export const GTE_OPERATOR: string = 'gte';
export const IN_OPERATOR: string = 'in';

export const FILTEROPERATORS: Array<any> = [
    { label: '包含', value: LIKE_OPERATOR },
    { label: '不包含', value: NLIKE_OPERATOR },
    { label: '等于', value: EQ_OPERATOR },
    { label: '不等于', value: NE_OPERATOR },
    { label: '小于', value: LT_OPERATOR },
    { label: '大于', value: GT_OPERATOR },
    { label: '小于等于', value: LTE_OPERATOR },
    { label: '大于等于', value: GTE_OPERATOR },
    { label: '多选', value: IN_OPERATOR }
];
