import { isValidObjectId } from "mongoose";
import { IDriverPayload } from "interfaces";

const driverValidation = (
  driver: IDriverPayload
): { valid: boolean; errors: Record<string, string> } => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    email,
    address,
    phone,
    createdBy,
  } = driver;
  const errors: Record<string, string> = {};

  if (!firstName || firstName.trim() === "") {
    errors.firstName = "First name is required";
  }

  if (!lastName || lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }

  if (!dateOfBirth || dateOfBirth.trim() === "") {
    errors.dateOfBirth = "Date of birth is required";
  }

  if (!gender || gender.trim() === "") {
    errors.gender = "Gender is required";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(emailRegex)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (!address || address.trim() === "") {
    errors.address = "Address is required";
  }

  if (!phone || phone.trim() === "") {
    errors.phone = "Phone is required";
  }

  if (!createdBy || createdBy.trim() === "") {
    errors.createdBy = "Created by is required";
  } else {
    if (!isValidObjectId(createdBy)) {
      errors.createdBy = "Created by should be valid id";
    }
  }

  return {
    valid: Object.keys(errors).length < 1,
    errors,
  };
};

export { driverValidation };
