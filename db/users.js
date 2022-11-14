const client= require('./client')

async function createUser( { username, password, name } ) {
    try {
        const {result} = await client.query(`
        INSERT INTO users(username, password, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name]);

        return result
    } catch (error) {
        console.log(error)
    }
};

async function getUser({ username, password }) {
    try {
        if (!password) {
            return null
        }

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username])

        return rows;

    } catch (error) {
        console.error
    }
};

async function getUserById(id) {
    try {
        const { rows } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE id=$1;
        `, [id]);
        
        return rows;
    } catch (error) {
        console.error
    }
};

async function getUserByUsername(username) {
    try {
       const { rows } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE username=$1;
       `, [username]);

       return rows
    } catch (error) {
        console.error
    }
};

module.exports = { createUser, getUser, getUserById, getUserByUsername}