import { CONCEPTS_METADATA } from "./constants/concepts"

export const getConceptDisplayName = (name) => {
  const concept = CONCEPTS_METADATA.find(c =>
    c.name === name
  );
  return concept.displayName;
}