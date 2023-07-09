export const parseFields = (fields) => {
  const fieldsArray = fields.split(",").map((field) => {
    const optional = field.trim().includes("?");
    const unique = field.trim().includes("!");
    let name, type, size, relatedEntity, relationType, ownerOfRelationship;

    if (field.includes("[")) {
      let relationMatch = field
        .trim()
        .match(/^\[\s*(<|>)?\s*([a-zA-Z0-9]+)-(many-to-one|one-to-many|many-to-many)\s*\]$/);
      if (!relationMatch) {
        relationMatch = field
          .trim()
          .match(/^\s*([a-zA-Z0-9]+)\s*:\s*\[\s*(<|>)?\s*([a-zA-Z0-9]+)-(one-to-many)\s*\]\s*$/);
        if (!relationMatch) throw new Error(`Invalid relation definition: ${field}`);

        [, name, , relatedEntity, relationType] = relationMatch;
      } else {
        [, ownerOfRelationship, relatedEntity, relationType] = relationMatch;
        ownerOfRelationship = ownerOfRelationship === ">";
      }
    } else {
      [name, type] = field.trim().replace(/!/g, "").replace(/\?/g, "").split(":");

      const sizeMatch = type?.match(/([a-zA-Z]+)\((\d+)\)/);
      if (sizeMatch) {
        [, type, size] = sizeMatch;
        size = parseInt(size, 10);
      }
    }

    return {
      name,
      type: type?.trim(),
      size,
      optional,
      unique,
      relatedEntity,
      relationType,
      ownerOfRelationship,
    };
  });

  return fieldsArray;
};
