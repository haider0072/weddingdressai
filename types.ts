
export enum EventType {
  Nikkah = "Nikkah",
  Baraat = "Baraat",
  Valima = "Valima",
}

export type DressCombination = {
  bride: string;
  groom: string;
};

export type ColorSuggestion = {
  name: string;
  hex: string;
};
