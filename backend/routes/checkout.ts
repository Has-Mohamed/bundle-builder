import { Router } from "express";
import { postCheckout } from "../controllers/checkout";

const router = Router();

router.post("/", postCheckout);

module.exports = router;
