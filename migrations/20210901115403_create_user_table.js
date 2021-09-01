
// create a migrtion
exports.up = function(knex) {
  return knex.schema.createTable('login_user' , t => {
    t.increments('id').unsigned().primary();
    t.string('email').notNull();
    t.string('password_digest').notNull();
  });
};

// destroy a migration
exports.down = function(knex) {
  return knex.schema.dropTable('login_user');
};
