
exports.up = function(knex) {
    return knex.schema.table('login_user', table => {
        table.timestamp('logout_time');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('login_user');
};
