export interface FAQItem {
  id: number;
  category: 'gameplay' | 'account' | 'technical' | 'content';
}

export const faqItems: FAQItem[] = [
  { id: 0, category: 'gameplay' },
  { id: 1, category: 'gameplay' },
  { id: 2, category: 'gameplay' },
  { id: 3, category: 'content' },
  { id: 4, category: 'gameplay' },
  { id: 5, category: 'gameplay' },
  { id: 6, category: 'gameplay' },
  { id: 7, category: 'account' },
  { id: 8, category: 'account' },
  { id: 9, category: 'technical' },
  { id: 10, category: 'technical' },
  { id: 11, category: 'content' },
  { id: 12, category: 'content' },
  { id: 13, category: 'content' },
  { id: 14, category: 'gameplay' },
];
