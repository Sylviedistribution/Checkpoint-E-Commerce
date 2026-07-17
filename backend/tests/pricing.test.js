import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotal } from "../utils/pricing.js";

test("calcule le total d'une commande avec plusieurs articles", () => {
  const items = [
    { price: 1000, quantity: 2 },
    { price: 500, quantity: 3 },
  ];
  assert.equal(calculateOrderTotal(items), 3500);
});

test("retourne 0 pour un panier vide", () => {
  assert.equal(calculateOrderTotal([]), 0);
});
