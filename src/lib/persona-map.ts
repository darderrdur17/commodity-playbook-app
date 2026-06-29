import type { PersonaId } from "@/lib/persona-quiz";

export type ApiPersona =
  | "FRESH_GRAD"
  | "CAREER_SWITCHER"
  | "INSIDER"
  | "ANALYST_TRADER"
  | "VENDOR";

export const PERSONA_ID_TO_API: Record<PersonaId, ApiPersona> = {
  fresh_grad: "FRESH_GRAD",
  switcher: "CAREER_SWITCHER",
  insider: "INSIDER",
  analyst: "ANALYST_TRADER",
  vendor: "VENDOR",
};

export function personaIdToApi(personaId: PersonaId): ApiPersona {
  return PERSONA_ID_TO_API[personaId];
}
