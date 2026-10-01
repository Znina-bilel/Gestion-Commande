import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customer.controller.js";

const customerRouter = Router();

customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.post("/", createCustomer);
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id", deleteCustomer);

export default customerRouter;