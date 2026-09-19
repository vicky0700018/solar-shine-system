import { MongoClient } from "mongodb";
import readline from "readline";

// Source Database Configuration (Current DB with data)
const SOURCE_URI =
  process.env.SOURCE_MONGODB_URI ||
  "mongodb+srv://kumarianisha32399_db_user:C7jyP5TMIjcEhcsZ@cluster0.e8sc6w4.mongodb.net/solar_shine_db?appName=Cluster0";
const SOURCE_DB_NAME = process.env.SOURCE_DB_NAME || "sartaj_solar";

// Target Database Configuration (Client's DB)
const TARGET_URI = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI || "";
const TARGET_DB_NAME = process.env.TARGET_DB_NAME || "sartaj_solar";

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

export async function migrateData(targetUri, targetDbName = "sartaj_solar") {
  if (!targetUri) {
    throw new Error("Target MongoDB URI is required!");
  }

  console.log("\n==========================================");
  console.log("🚀 STARTING DATABASE MIGRATION TO CLIENT DB");
  console.log("==========================================");
  console.log(`📍 Source DB: ${SOURCE_DB_NAME}`);
  console.log(`📍 Target DB: ${targetDbName}`);
  console.log("------------------------------------------");

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log("🔌 Connecting to Source Database...");
    await sourceClient.connect();
    console.log("✅ Connected to Source Database!");

    console.log("🔌 Connecting to Target Database (Client)...");
    await targetClient.connect();
    console.log("✅ Connected to Target Database!");

    const sourceDb = sourceClient.db(SOURCE_DB_NAME);
    const targetDb = targetClient.db(targetDbName);

    const collections = await sourceDb.listCollections().toArray();
    console.log(`\n📦 Found ${collections.length} collection(s) to migrate:`);
    collections.forEach((c) => console.log(`   • ${c.name}`));
    console.log("------------------------------------------");

    let totalMigratedDocs = 0;

    for (const colInfo of collections) {
      const colName = colInfo.name;
      // Skip system collections if any
      if (colName.startsWith("system.")) continue;

      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const docs = await sourceCol.find({}).toArray();
      const count = docs.length;

      console.log(`\n🔄 Migrating [${colName}]: ${count} document(s)...`);

      if (count > 0) {
        // Clear target collection before copying to prevent duplicates or clean replace
        await targetCol.deleteMany({});
        await targetCol.insertMany(docs);
        console.log(`   ✅ Copied ${count} document(s) to [${colName}] successfully!`);
        totalMigratedDocs += count;
      } else {
        console.log(`   ℹ️ [${colName}] is empty, skipped.`);
      }
    }

    console.log("\n==========================================");
    console.log("🎉 MIGRATION COMPLETED SUCCESSFULLY!");
    console.log(`📊 Total Documents Migrated: ${totalMigratedDocs}`);
    console.log("==========================================");

    console.log("\n🔍 Verification of Target Database:");
    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith("system.")) continue;
      const verifiedCount = await targetDb.collection(colName).countDocuments();
      console.log(`   • ${colName}: ${verifiedCount} document(s) in Client DB`);
    }
    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ Migration Failed:", error);
    throw error;
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

// If run directly from CLI
if (process.argv[1]?.endsWith("migrate-to-client.mjs")) {
  (async () => {
    let target = TARGET_URI;
    if (!target) {
      target = await askQuestion("Enter Client's MONGODB_URI: ");
    }
    if (!target) {
      console.error("❌ Error: No Target MONGODB_URI provided.");
      process.exit(1);
    }
    let targetDb = TARGET_DB_NAME;
    await migrateData(target, targetDb);
  })();
}
