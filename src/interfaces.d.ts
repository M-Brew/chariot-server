export interface IDriverPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  address: string;
  phone: string;
  createdBy: string;
}

export interface ICarPayload {
  name: string;
  type: string;
  brand: string;
  registrationNumber: string;
  capacity: number;
  driver: string;
  createdBy: string;
}

export interface IClientPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdBy: string;
}

export interface IRidePayload {
  client: string;
  driver: string;
  car: string;
  startDate: string;
  endDate: string;
  createdBy: string;
}
