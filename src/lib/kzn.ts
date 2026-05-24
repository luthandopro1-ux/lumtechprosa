export const KZN_MUNICIPALITIES = [
  "eThekwini Metropolitan (Durban)",
  "uMgungundlovu (Pietermaritzburg)",
  "uMzinyathi",
  "uThukela",
  "Amajuba (Newcastle)",
  "Zululand",
  "King Cetshwayo (Richards Bay)",
  "uMkhanyakude",
  "Harry Gwala",
  "Ugu",
  "iLembe (Ballito / KwaDukuza)",
] as const;

export type KznMunicipality = (typeof KZN_MUNICIPALITIES)[number];
