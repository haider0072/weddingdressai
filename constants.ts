
import { EventType, DressCombination } from './types';

export const WEDDING_EVENTS: EventType[] = [
  EventType.Nikkah,
  EventType.Baraat,
  EventType.Valima,
];

export const DRESS_CODES: Record<EventType, DressCombination> = {
  [EventType.Nikkah]: {
    bride: "Gharara or Sharara",
    groom: "Kurta Pajama with Waistcoat",
  },
  [EventType.Baraat]: {
    bride: "Lehenga, Gharara or Sharara",
    groom: "Sherwani with Turban",
  },
  [EventType.Valima]: {
    bride: "Gown or Lehenga",
    groom: "3-Piece Suit",
  },
};
