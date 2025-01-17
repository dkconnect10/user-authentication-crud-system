import { Router } from "express";
import { deleteUserById ,resetUserPassword} from "../controller/admin.controller.js";

import { isAuthenticated, isAuthorized } from "../middlware/auth.middlware.js";

const router = Router();

router
  .route("/delete/:id")
  .delete(isAuthenticated, isAuthorized(["admin"]), deleteUserById);
router.route("/reset-password/:id").patch(isAuthenticated,isAuthorized(["admin"]),resetUserPassword);

export default router;
