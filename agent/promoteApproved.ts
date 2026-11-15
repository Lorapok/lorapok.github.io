// One-shot / on-demand: re-run the quality gate over the draft archive and publish what qualifies.
import { promoteApproved } from './catalogPolicy';

const { promoted, held } = promoteApproved();
console.log(`✅ Promoted ${promoted.length} post(s); ${held} remain held as drafts.`);
promoted.forEach((slug) => console.log(`   • ${slug}`));
