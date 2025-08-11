import { NewAccount } from "../db/schema";
import { api } from "./axios";

export async function createAccount(account: NewAccount) {
  await api.post("/api/account", account);
}
