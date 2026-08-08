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
  brand: {
    home: "Sport Gear home",
  },
  announcement: {
    region: "Promotional announcement",
    message: "Sign up and get 20% off your first order.",
    signUp: "Sign Up Now",
    dismiss: "Dismiss promotion",
  },
  header: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    openSearch: "Open search",
    closeSearch: "Close search",
  },
  navigation: {
    primary: "Primary navigation",
    home: "Home",
    shop: "Shop",
    about: "About",
  },
  search: {
    region: "Product search",
    submit: "Search products",
    input: "Search for products",
    placeholder: "Search for products...",
  },
  headerActions: {
    cartEmpty: "Shopping cart, empty",
    cartItems_one: "Shopping cart, {{count}} item",
    cartItems_few: "Shopping cart, {{count}} items",
    cartItems_many: "Shopping cart, {{count}} items",
    cartItems_other: "Shopping cart, {{count}} items",
    checkingAccount: "Checking account status",
    signIn: "Sign in",
    openNamedAccount: "Open {{name}}'s account",
    openAccount: "Open your account",
    greeting: "Hi, {{name}}",
    myAccount: "My account",
    yourAccount: "Your account",
  },
} as const;

export type CommonTranslations = {
  [Key in keyof typeof enCommon]: {
    [NestedKey in keyof (typeof enCommon)[Key]]: string;
  };
};
