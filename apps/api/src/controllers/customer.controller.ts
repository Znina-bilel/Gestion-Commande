import type { Request, Response } from "express";
import { customerService } from "../services/customer.service.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customer.schema.js";

export async function getCustomers(
  _req: Request,
  res: Response,
): Promise<void> {
  const customers = await customerService.getAllCustomers();

  res.status(200).json({
    data: customers,
  });
}

export async function getCustomerById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  const customer = await customerService.getCustomerById(id);

  if (!customer) {
    res.status(404).json({
      message: "Customer not found",
    });
    return;
  }

  res.status(200).json({
    data: customer,
  });
}

export async function createCustomer(
  req: Request,
  res: Response,
): Promise<void> {
  const result = createCustomerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });
    return;
  }

  const customer = await customerService.createCustomer(result.data);

  res.status(201).json({
    data: customer,
  });
}

export async function updateCustomer(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid customer ID",
    });
    return;
  }

  const existingCustomer = await customerService.getCustomerById(id);

  if (!existingCustomer) {
    res.status(404).json({
      message: "Customer not found",
    });
    return;
  }

  const result = updateCustomerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Validation error",
      errors: result.error.issues,
    });
    return;
  }

  const customer = await customerService.updateCustomer(
    id,
    result.data,
  );

  res.status(200).json({
    data: customer,
  });
}

export async function deleteCustomer(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid customer ID",
    });
    return;
  }

  const existingCustomer = await customerService.getCustomerById(id);

  if (!existingCustomer) {
    res.status(404).json({
      message: "Customer not found",
    });
    return;
  }

  await customerService.deleteCustomer(id);

  res.status(204).send();
}