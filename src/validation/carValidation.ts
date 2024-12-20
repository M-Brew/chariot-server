import { isValidObjectId } from "mongoose";
import { ICarPayload } from "interfaces";

const carValidation = (
  car: ICarPayload
): { valid: boolean; errors: Record<string, string> } => {
  const { name, type, brand, registrationNumber, capacity, driver, createdBy } =
    car;
  const errors: Record<string, string> = {};

  if (!name || name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!type || type.trim() === "") {
    errors.type = "Type is required";
  }

  if (!brand || brand.trim() === "") {
    errors.brand = "Brand is required";
  }

  if (!registrationNumber || registrationNumber.trim() === "") {
    errors.registrationNumber = "Registration number is required";
  }

  if (!capacity || capacity === 0) {
    errors.capacity = "Capacity is required";
  }

  if (!driver || driver.trim() === "") {
    errors.driver = "Driver is required";
  } else {
    if (!isValidObjectId(driver)) {
      errors.menu = "Driver should be valid id";
    }
  }

  if (!createdBy || createdBy.trim() === "") {
    errors.createdBy = "Created by is required";
  } else {
    if (!isValidObjectId(createdBy)) {
      errors.menu = "Created by should be valid id";
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { carValidation };
