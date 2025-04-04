import { isValidObjectId } from "mongoose";
import { ITypePayload } from "interfaces";

const typeValidation = (
  type: ITypePayload
): { valid: boolean; errors: Record<string, string> } => {
  const { name, createdBy } =
    type;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "Name is required";
  }

  // if (!createdBy || createdBy.trim() === "") {
  //   errors.createdBy = "Created by is required";
  // } else {
  //   if (!isValidObjectId(createdBy)) {
  //     errors.createdBy = "Created by should be valid id";
  //   }
  // }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { typeValidation };
