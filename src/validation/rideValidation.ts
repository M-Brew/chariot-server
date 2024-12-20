import { isValidObjectId } from "mongoose";
import { IRidePayload } from "interfaces";

const rideValidation = (
  ride: IRidePayload
): { valid: boolean; errors: Record<string, string> } => {
  const { client, driver, car, startDate, endDate, createdBy } = ride;
  const errors: Record<string, string> = {};

  if (!client || client.trim() === "") {
    errors.client = "Client is required";
  } else {
    if (!isValidObjectId(client)) {
      errors.menu = "Client should be valid id";
    }
  }

  if (!driver || driver.trim() === "") {
    errors.driver = "Driver is required";
  } else {
    if (!isValidObjectId(driver)) {
      errors.menu = "Driver should be valid id";
    }
  }

  if (!car || car.trim() === "") {
    errors.car = "Car is required";
  } else {
    if (!isValidObjectId(car)) {
      errors.menu = "Car should be valid id";
    }
  }

  if (!startDate || startDate.trim() === "") {
    errors.startDate = "Start date is required";
  }

  if (!endDate || endDate.trim() === "") {
    errors.endDate = "End date is required";
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

export { rideValidation };
