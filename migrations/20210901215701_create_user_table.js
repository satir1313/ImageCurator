
exports.up = function(knex) {
    return knex.schema.createTable('user' , t => {
        t.increments('id').unsigned().primary();
        t.string('email').notNull();
        t.string('password_digest').notNull();
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('login_user');
};
