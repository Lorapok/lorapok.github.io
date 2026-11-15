"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// One-shot / on-demand: re-run the quality gate over the draft archive and publish what qualifies.
const catalogPolicy_1 = require("./catalogPolicy");
const { promoted, held } = (0, catalogPolicy_1.promoteApproved)();
console.log(`✅ Promoted ${promoted.length} post(s); ${held} remain held as drafts.`);
promoted.forEach((slug) => console.log(`   • ${slug}`));
