const {client}= require('./client')

async function createUser( { username, password, name } ) {
    try {
        const {rows: [user]} = await client.query(`
        INSERT INTO users(username, password, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `, [username, password, name]);

        return user
    } catch (error) {
        console.log(error)
    }
};

async function getUser({ username, password }) {
    try {
        if (!password) {
            return null
        }

        const { rows: [user] } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;
        `, [username])

        if (password !== user.password) {
            return null
        }
        
        return user;

    } catch (error) {
        console.error
    }
};

async function getUserById(id) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE id=$1;
        `, [id]);
        
        return user;
    } catch (error) {
        console.error
    }
};

async function getUserByUsername(username) {
    try {
       const { rows: [user] } = await client.query(`
            SELECT id, username, name
            FROM users
            WHERE username=$1;
       `, [username]);

       return user
    } catch (error) {
        console.error
    }
};

module.exports = { createUser, getUser, getUserById, getUserByUsername}