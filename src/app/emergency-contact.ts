// Validation for the Emergency contact step of Set up your profile.
// Only the mobile message is lifted; the file has no frame for the others.
//   Error - invalid mobile (1836:310166): "Mobile number is not a valid number."

import { isValidUkMobile } from "./contact-info.ts";

export type EmergencyContactChoice = "" | "provide" | "decline";

export type EmergencyContactErrors = {
  choice?: string;
  name?: string;
  mobile?: string;
  relationship?: string;
};

export type EmergencyContactInput = {
  choice: EmergencyContactChoice;
  name: string;
  countryCode: string;
  mobile: string;
  relationship: string;
};

// Taken from the open dropdown on 1836:310188, in that order.
export const RELATIONSHIP_OPTIONS = [
  "Parent/Guardian",
  "Sibling",
  "Spouse",
  "Child",
  "Friend",
  "Other",
];

export function validateEmergencyContact(input: EmergencyContactInput): EmergencyContactErrors {
  const e: EmergencyContactErrors = {};

  if (!input.choice) {
    e.choice = "Please provide an emergency contact, or choose not to.";
    return e;
  }
  if (input.choice === "decline") return e;

  if (!input.name.trim()) e.name = "Please provide their name.";

  if (!input.mobile.trim()) e.mobile = "Please provide their mobile number.";
  else if (!isValidUkMobile(input.mobile)) e.mobile = "Mobile number is not a valid number.";

  if (!input.relationship) e.relationship = "Please select their relationship to you.";

  return e;
}

const BLANK: EmergencyContactInput = {
  choice: "", name: "", countryCode: "United Kingdom (+44)", mobile: "", relationship: "",
};

// The mistakes this form actually sees, each with the input that caused it.
const DEMO_INPUTS: Record<string, EmergencyContactInput> = {
  noChoice: { ...BLANK },
  detailsMissing: { ...BLANK, choice: "provide" },
  lettersInMobile: { ...BLANK, choice: "provide", name: "Jane Smith", mobile: "07aaa", relationship: "Sibling" },
  relationshipNotPicked: { ...BLANK, choice: "provide", name: "Jane Smith", mobile: "07123 456 789" },
  declined: { ...BLANK, choice: "decline" },
};

export const DEMO_EMERGENCY_CONTACT: Record<string, { input: EmergencyContactInput; errors: EmergencyContactErrors }> =
  Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validateEmergencyContact(input) }]),
  );
