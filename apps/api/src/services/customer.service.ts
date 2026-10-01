import { customerRepository } from "../repositories/customer.repository.js";

export const customerService = {
  getAllCustomers() {
    return customerRepository.findAll();
  },

  getCustomerById(id: number) {
    return customerRepository.findById(id);
  },

  createCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) {
    return customerRepository.create(data);
  },

  updateCustomer(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return customerRepository.update(id, data);
  },
  deleteCustomer(id: number) {
    return customerRepository.delete(id);
  },  
};