import express from "express";
import {
  addDesignation,
  getDesignations,
  updateDesignation,
  deleteDesignation
} from "../controllers/designation.route.js";

const router = express.Router();

router.post("/", addDesignation);

router.get("/", getDesignations);

router.put("/:id", updateDesignation);

router.delete("/:id", deleteDesignation);

export default router;
