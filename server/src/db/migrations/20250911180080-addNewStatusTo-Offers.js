module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      ALTER TABLE "Offers" ALTER COLUMN "status" DROP DEFAULT;
    `);

        await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Offers_status') THEN
          CREATE TYPE "enum_Offers_status" AS ENUM ('pending', 'approved', 'declined', 'rejected', 'won');
        END IF;
      END $$;
    `);

        await queryInterface.sequelize.query(`
      UPDATE "Offers" SET "status" = 'pending' WHERE "status" IS NULL;
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE "Offers"
      ALTER COLUMN "status"
      TYPE "enum_Offers_status"
      USING "status"::text::"enum_Offers_status";
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE "Offers" ALTER COLUMN "status" SET DEFAULT 'pending';
    `);
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            ALTER TABLE "Offers" ALTER COLUMN "status" DROP DEFAULT;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE "Offers"
            ALTER COLUMN "status"
            TYPE VARCHAR
            USING "status"::text;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE "Offers" ALTER COLUMN "status" SET DEFAULT 'pending';
        `);

        await queryInterface.sequelize.query(`
            DROP TYPE IF EXISTS "enum_Offers_status";
        `);
    },
};
