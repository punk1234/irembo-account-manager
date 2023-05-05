import seedAdmins from "./super-admin.seeder";

/**
 * @function runDbSeeders
 * @async
 * @returns {Promise<void>}
 */
export async function runDbSeeders(): Promise<void> {
  await seedAdmins();
}
