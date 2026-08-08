export const enCommon = {
  meta: {
    title: "Sport Gear | Sports equipment",
  },
  language: {
    label: "Language",
    change: "Change language",
    menu: "Available languages",
    selected: "Current language: {{language}}",
  },
} as const;

export type CommonTranslations = {
  [Key in keyof typeof enCommon]: {
    [NestedKey in keyof (typeof enCommon)[Key]]: string;
  };
};
