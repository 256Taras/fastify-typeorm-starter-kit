import { randomUUID } from "node:crypto";

export const VALID_MOCK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMzQ3NTQxLTc2ZjYtNDg4NS05NTJmLWQ0YzcxMGFlZmYxNSJ9.rTsuNKW2zOovJvbQGbaTCRlQX1Eo-BHQP-GE76zNz3I";
export const VALID_MOCK_AUTH_TOKEN = `Bearer ${VALID_MOCK_TOKEN}`;
export const INVALID_MOCK_AUTH_HEADER = `${VALID_MOCK_TOKEN}`;
export const AUTHORIZED_MOCK_USER_ID = "0792c50b-9ba0-4b79-9a8a-df236495ac17";
export const INVALID_ID = "2222d8be-e74c-4b18-9294-13e230da4b10";
export const EMAIL = "test@test.com";
export const FIRSTNAME = "firstname";
export const LASTNAME = "lastname";
export const PASSWORD = "password";
export const PPID = randomUUID();
export const REFRESH_TOKEN_ID = randomUUID();
